import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/libs/supabase-admin'
import { Notification, SocialProofConfig } from '@/types/social-proof'

const VALID_TYPES = ['purchase', 'signup', 'pageview', 'custom', 'conversion', 'live', 'hotstats', 'cta']

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

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function transformEventToNotification(event: any): Notification {
  const n: Notification = { id: event.id, type: event.type }
  const meta = event.metadata ?? {}

  if (event.name) n.firstName = event.name
  if (event.city) n.city = event.city
  if (event.product) n.product = event.product
  if (event.created_at) {
    n.minutesAgo = Math.floor((Date.now() - new Date(event.created_at).getTime()) / 60000)
  }

  if (event.type === 'live') {
    n.liveCount = meta.liveCount
  } else if (event.type === 'hotstats') {
    n.statLabel  = meta.statLabel
    n.statValue  = meta.statValue
    n.statPeriod = meta.statPeriod
  } else if (event.type === 'cta') {
    n.ctaTitle      = meta.ctaTitle
    n.ctaMessage    = meta.ctaMessage
    n.ctaButtonText = meta.ctaButtonText
    n.ctaButtonUrl  = meta.ctaButtonUrl
  } else {
    n.showVerified = meta.showVerified ?? true
    n.verifiedText = meta.verifiedText ?? 'Verified purchase'
    if (meta.state)   n.state   = meta.state
    if (meta.country) n.country = meta.country
  }

  return n
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, type, name, city, product, metadata } = body

    if (!apiKey || !type) {
      return NextResponse.json({ error: 'apiKey and type are required' }, { status: 400 })
    }
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 })
    }
    if (!checkRateLimit(apiKey, 100, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects').select('id').eq('api_key', apiKey).single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

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

export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get('apiKey')
  const count  = Math.min(parseInt(req.nextUrl.searchParams.get('count') ?? '10', 10), 50)

  if (!apiKey) {
    return NextResponse.json({ error: 'apiKey is required' }, { status: 400 })
  }

  const { data: project } = await supabaseAdmin
    .from('projects').select('id').eq('api_key', apiKey).single()

  if (!project) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const { data: events, error } = await supabaseAdmin
    .from('events')
    .select('id, type, name, city, product, created_at, metadata')
    .eq('project_id', project.id)
    .in('type', ['purchase', 'signup', 'conversion', 'live', 'hotstats', 'cta'])
    .order('created_at', { ascending: false })
    .limit(count)

  if (error) {
    console.error('[GET /api/event]', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }

  const notifications: Notification[] = (events ?? []).map(transformEventToNotification)

  const config: SocialProofConfig = {
    position: 'bottom-left',
    theme: 'light',
    initialDelay: 3,
    interval: 8,
    displayDuration: 5,
    showProgress: true,
    enableSound: false,
    showOnMobile: true,
  }

  return NextResponse.json({ notifications, config }, { headers: corsHeaders() })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}
