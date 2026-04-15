import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/libs/supabase-admin'
import { calculateDailyValue, getDayIndex, interpolateMessage } from '@/lib/growthEngine'
import { SocialProofGrowth, GrowthSnapshot } from '@/types/growth'

// ─── 60-second in-memory cache ────────────────────────────────────────────────
// Key: apiKey  →  { snapshots, expiresAt }
// This ensures 10k concurrent visitors all get the same number.
const cache = new Map<string, { snapshots: GrowthSnapshot[]; expiresAt: number }>()
const CACHE_TTL_MS = 60_000

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

// ─── OPTIONS (CORS preflight) ─────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// ─── GET /api/growth?apiKey=xxx ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get('apiKey')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'apiKey is required' },
      { status: 400, headers: corsHeaders() },
    )
  }

  // ── Cache hit ──────────────────────────────────────────────────────────────
  const cached = cache.get(apiKey)
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(
      { snapshots: cached.snapshots },
      {
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'public, max-age=60',
          'X-Cache': 'HIT',
        },
      },
    )
  }

  // ── Resolve project ────────────────────────────────────────────────────────
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (!project) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401, headers: corsHeaders() },
    )
  }

  // ── Fetch growth configs ───────────────────────────────────────────────────
  const { data: rows, error } = await supabaseAdmin
    .from('social_proof_growth')
    .select('*')
    .eq('project_id', project.id)
    .eq('enabled', true)

  if (error) {
    console.error('[GET /api/growth]', error)
    return NextResponse.json(
      { error: 'Failed to fetch growth data' },
      { status: 500, headers: corsHeaders() },
    )
  }

  // ── Compute today's values ─────────────────────────────────────────────────
  const snapshots: GrowthSnapshot[] = (rows as SocialProofGrowth[]).map((row) => {
    const dayIndex = getDayIndex(row.reset_day)
    const value = calculateDailyValue(
      row.start_value,
      row.end_value,
      dayIndex,
      row.growth_style,
    )
    const message = interpolateMessage(row.message_template, value)

    return {
      type: row.type,
      value,
      message,
      day_of_week: dayIndex,
      start_value: row.start_value,
      end_value: row.end_value,
      enabled: row.enabled,
    }
  })

  // ── Persist today's computed value back to DB (async, fire-and-forget) ─────
  // This keeps current_value fresh for the dashboard's "today's number" display.
  for (const row of rows as SocialProofGrowth[]) {
    const dayIndex = getDayIndex(row.reset_day)
    const value = calculateDailyValue(
      row.start_value,
      row.end_value,
      dayIndex,
      row.growth_style,
    )
    supabaseAdmin
      .from('social_proof_growth')
      .update({ current_value: value, current_day: dayIndex, updated_at: new Date().toISOString() })
      .eq('id', row.id)
      .then(() => {})
      .catch((err: unknown) => console.error('[growth persist]', err))
  }

  // ── Cache and respond ──────────────────────────────────────────────────────
  cache.set(apiKey, { snapshots, expiresAt: Date.now() + CACHE_TTL_MS })

  return NextResponse.json(
    { snapshots },
    {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=60',
        'X-Cache': 'MISS',
      },
    },
  )
      }
      
