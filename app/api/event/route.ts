import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, GLOBAL_NAMES, GLOBAL_CITIES, CITY_STATE_MAP } from '@/lib/supabase-admin'

const VALID_TYPES = ['purchase', 'signup', 'pageview', 'custom']

// Simple in-memory rate limiter (replace with Redis for production scale)
const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(key: string, limit = 100, windowMs = 60_000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  if (!record || now > record.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (record.count >= limit) return false
  record.count++
  return true
}

function sanitize(str?: string): string | null {
  if (!str) return null
  return str.replace(/<[^>]*>/g, '').slice(0, 200).trim()
}

// ─── Synthetic Event Types ────────────────────────────────────────────────────
interface SyntheticSettings {
  synthetic_enabled?: boolean
  synthetic_interval?: number
  synthetic_data?: {
    names?: string[]
    cities?: string[]
    products?: string[]
  }
}

interface FakeEvent {
  id: string
  type: string
  name: string
  city: string
  product: string | null
  created_at: string
  synthetic: true
}

// ─── Geographic Mirroring ─────────────────────────────────────────────────────
// Detect the visitor's approximate region from their IP and boost local cities.
function getVisitorState(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  const cfState   = req.headers.get('cf-ipcountry') // Cloudflare header (bonus)
  const cfRegion  = req.headers.get('cf-region')    // e.g. "California"

  // Cloudflare provides the region directly — use it when available.
  if (cfRegion) return cfRegion

  // Vercel injects x-vercel-ip-country-region for Pro/Enterprise plans.
  const vercelRegion = req.headers.get('x-vercel-ip-country-region')
  if (vercelRegion) return vercelRegion

  // Fallback: no reliable region detection without a geo-IP service.
  return null
}

// Pick a city, boosting local cities 3× when the visitor's state matches.
function pickCity(pool: string[], visitorState: string | null): string {
  if (!visitorState) return pool[Math.floor(Math.random() * pool.length)]

  const localCities  = pool.filter((c) => CITY_STATE_MAP[c] === visitorState)
  const remoteCities = pool.filter((c) => CITY_STATE_MAP[c] !== visitorState)

  // Build a weighted pool: local cities appear 3× as often.
  const weighted = [...localCities, ...localCities, ...localCities, ...remoteCities]
  return weighted[Math.floor(Math.random() * weighted.length)]
}

// ─── Fake Event Generator ─────────────────────────────────────────────────────
// Generates `count` realistic-looking events with jittered timestamps.
// All events are marked { synthetic: true } so the dashboard can distinguish
// them, but the widget receives them identically to real events.
function generateFakeEvents(
  count: number,
  settings: SyntheticSettings,
  visitorState: string | null,
  existingTypes: string[],           // avoid repeating exact type+name combos
): FakeEvent[] {
  const names    = settings.synthetic_data?.names?.length
    ? settings.synthetic_data.names
    : GLOBAL_NAMES

  const cities   = settings.synthetic_data?.cities?.length
    ? settings.synthetic_data.cities
    : GLOBAL_CITIES

  const products = settings.synthetic_data?.products?.length
    ? settings.synthetic_data.products
    : ['Pro Plan', 'Starter Plan', 'Annual Plan', 'Premium Bundle', 'Basic Plan']

  const eventTypes = ['purchase', 'signup', 'signup', 'purchase'] // weighted toward conversions

  const seenKeys = new Set<string>()
  const results: FakeEvent[] = []

  let attempts = 0
  while (results.length < count && attempts < count * 5) {
    attempts++

    const name    = names[Math.floor(Math.random() * names.length)]
    const city    = pickCity(cities, visitorState)
    const type    = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const product = type === 'purchase'
      ? products[Math.floor(Math.random() * products.length)]
      : null

    // Deduplicate within the generated batch (avoid "Emma just signed up" × 3)
    const key = `${type}:${name}`
    if (seenKeys.has(key)) continue
    seenKeys.add(key)

    // Timestamp jitter: randomly between 2 minutes and 2 hours ago.
    const minAgo = 2 * 60 * 1000
    const maxAgo = 2 * 60 * 60 * 1000
    const msAgo  = minAgo + Math.random() * (maxAgo - minAgo)
    const created_at = new Date(Date.now() - msAgo).toISOString()

    results.push({
      id: `synthetic_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      name,
      city,
      product,
      created_at,
      synthetic: true,
    })
  }

  // Sort descending by timestamp so newest fake events appear first.
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return results
}

// ─── POST /api/event ──────────────────────────────────────────────────────────
// Called by customer websites to ingest a real event.
// Body: { apiKey, type, name?, city?, product?, metadata? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, type, name, city, product, metadata } = body

    if (!apiKey || !type) {
      return NextResponse.json(
        { error: 'apiKey and type are required' },
        { status: 400 }
      )
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (!checkRateLimit(apiKey, 100, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('api_key', apiKey)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // user_id is intentionally omitted — constraint must be nullable in DB.
    const { error } = await supabaseAdmin.from('events').insert({
      project_id: project.id,
      type,
      name: sanitize(name),
      city: sanitize(city),
      product: sanitize(product),
      metadata: metadata ?? null,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201, headers: corsHeaders() })
  } catch (err) {
    console.error('[POST /api/event]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── GET /api/event?apiKey=xxx ────────────────────────────────────────────────
// Called by widget.js to fetch events. Blends real + synthetic ("Hybrid mode"):
//   • Fetch up to 50 real events.
//   • If realEvents.length < 10 AND synthetic_enabled, pad with fake events
//     until we have at least 10 total (capped so we never return > 50).
export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get('apiKey')

  if (!apiKey) {
    return NextResponse.json({ error: 'apiKey is required' }, { status: 400 })
  }

  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // Fetch real events.
  const { data: realEvents, error } = await supabaseAdmin
    .from('events')
    .select('id, type, name, city, product, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }

  // Fetch campaign settings to check synthetic config.
  const { data: campaign } = await supabaseAdmin
    .from('campaigns')
    .select('settings')
    .eq('project_id', project.id)
    .single()

  const syntheticSettings: SyntheticSettings = campaign?.settings ?? {}
  const events = realEvents ?? []

  // ── Hybrid mixing ──────────────────────────────────────────────────────────
  let finalEvents: Array<typeof events[number] | FakeEvent> = [...events]

  if (syntheticSettings.synthetic_enabled && events.length < 10) {
    const needed       = Math.min(10 - events.length, 50 - events.length)
    const visitorState = getVisitorState(req)
    const fakeEvents   = generateFakeEvents(needed, syntheticSettings, visitorState, [])
    finalEvents        = [...events, ...fakeEvents]
  }

  return NextResponse.json({ events: finalEvents }, { headers: corsHeaders() })
}

// CORS preflight — widget.js can call this from any domain.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
       }
      
