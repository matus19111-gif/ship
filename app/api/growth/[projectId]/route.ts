import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/libs/supabase-admin'
import { calculateDailyValue, getDayIndex, recalcRemainingDays } from '@/lib/growthEngine'
import { SocialProofGrowth, GrowthConfig } from '@/types/growth'

type Params = { params: Promise<{ projectId: string }> }

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getUser() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ─── Verify project ownership ─────────────────────────────────────────────────
async function getOwnedProject(projectId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()
  return data
}

// ─── GET /api/growth/[projectId] ──────────────────────────────────────────────
// Returns all growth configs for this project, enriched with today's value.
export async function GET(req: NextRequest, { params }: Params) {
  const { projectId } = await params
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getOwnedProject(projectId, user.id)
  if (!owned) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const { data: rows, error } = await supabaseAdmin
    .from('social_proof_growth')
    .select('*')
    .eq('project_id', projectId)
    .order('type')

  if (error) {
    console.error('[GET /api/growth/[projectId]]', error)
    return NextResponse.json({ error: 'Failed to fetch growth configs' }, { status: 500 })
  }

  // Enrich with computed today's value and last week's history
  const enriched = await Promise.all(
    (rows as SocialProofGrowth[]).map(async (row) => {
      const dayIndex = getDayIndex(row.reset_day)
      const todayValue = calculateDailyValue(
        row.start_value,
        row.end_value,
        dayIndex,
        row.growth_style,
      )

      // Grab last week's final value for the trend arrow
      const { data: history } = await supabaseAdmin
        .from('social_proof_weekly_history')
        .select('final_value')
        .eq('growth_id', row.id)
        .order('week_start', { ascending: false })
        .limit(1)
        .single()

      return {
        ...row,
        today_value: todayValue,
        day_index: dayIndex,
        last_week_value: history?.final_value ?? null,
      }
    }),
  )

  return NextResponse.json({ configs: enriched })
}

// ─── PUT /api/growth/[projectId] ──────────────────────────────────────────────
// Saves one or more growth configs. Handles smooth mid-week migration.
export async function PUT(req: NextRequest, { params }: Params) {
  const { projectId } = await params
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getOwnedProject(projectId, user.id)
  if (!owned) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const body = await req.json()
  const configs: GrowthConfig[] = body.configs

  if (!Array.isArray(configs) || configs.length === 0) {
    return NextResponse.json({ error: 'configs array is required' }, { status: 400 })
  }

  const results = []

  for (const cfg of configs) {
    // Fetch the existing row so we can do smooth migration
    const { data: existing } = await supabaseAdmin
      .from('social_proof_growth')
      .select('id, current_value, current_day, start_value, end_value')
      .eq('project_id', projectId)
      .eq('type', cfg.type)
      .single()

    let startValue = cfg.start_value
    let endValue = cfg.end_value

    // Mid-week smooth migration: if end_value changed while we're mid-week,
    // re-anchor from today's current value so numbers don't jump.
    if (existing && cfg.end_value !== existing.end_value && existing.current_day > 0) {
      const migrated = recalcRemainingDays(
        existing.current_value,
        cfg.end_value,
        existing.current_day,
      )
      startValue = migrated.start_value
      endValue = migrated.end_value
    }

    const upsertData = {
      project_id: projectId,
      user_id: user.id,
      type: cfg.type,
      start_value: startValue,
      end_value: endValue,
      growth_style: cfg.growth_style,
      reset_day: cfg.reset_day,
      enabled: cfg.enabled,
      allow_overshoot: cfg.allow_overshoot,
      message_template: cfg.message_template,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = existing
      ? await supabaseAdmin
          .from('social_proof_growth')
          .update(upsertData)
          .eq('id', existing.id)
          .select()
          .single()
      : await supabaseAdmin
          .from('social_proof_growth')
          .insert({ ...upsertData, current_value: startValue, current_day: 0 })
          .select()
          .single()

    if (error) {
      console.error(`[PUT /api/growth/${projectId}] type=${cfg.type}`, error)
      results.push({ type: cfg.type, success: false, error: error.message })
    } else {
      results.push({ type: cfg.type, success: true, data })
    }
  }

  // Bust the public cache for this project's API key
  const { data: proj } = await supabaseAdmin
    .from('projects')
    .select('api_key')
    .eq('id', projectId)
    .single()
  if (proj?.api_key) {
    // The GET /api/growth route uses an in-memory cache keyed by apiKey.
    // We can't directly clear it from here (different module), so we rely
    // on the 60s TTL. For instant invalidation, consider Redis in production.
    console.log(`[growth config saved] project=${projectId}, key=${proj.api_key}`)
  }

  const allOk = results.every((r) => r.success)
  return NextResponse.json(
    { results },
    { status: allOk ? 200 : 207 }, // 207 Multi-Status if some failed
  )
        }

