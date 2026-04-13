import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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
  // Strip HTML tags and limit length
  return str.replace(/<[^>]*>/g, '').slice(0, 200).trim()
}

// ─── POST /api/event ─────────────────────────────────────────────────────────
// Called by customer websites to ingest an event.
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

    // Rate limit per API key: 100 events/minute
    if (!checkRateLimit(apiKey, 100, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Validate the API key and get project ID
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('api_key', apiKey)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Insert event with sanitized data
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
// Called by widget.js to fetch recent events to display as popups.
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

  const { data: events, error } = await supabaseAdmin
    .from('events')
    .select('id, type, name, city, product, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }

  return NextResponse.json({ events }, { headers: corsHeaders() })
}

// CORS preflight — required so widget.js (on any domain) can call this API
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
