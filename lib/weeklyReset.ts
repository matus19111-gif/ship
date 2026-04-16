import { supabaseAdmin } from '@/libs/supabase-admin'
import { SocialProofGrowth } from '@/types/growth'

// ─── Get current UTC week start (Monday 00:00 UTC) ───────────────────────────
function getUTCWeekStart(resetDay: number): string {
  const now = new Date()
  const dayOfWeek = now.getUTCDay() // 0 = Sun
  const daysBack = (dayOfWeek - resetDay + 7) % 7
  const weekStart = new Date(now)
  weekStart.setUTCDate(now.getUTCDate() - daysBack)
  weekStart.setUTCHours(0, 0, 0, 0)
  return weekStart.toISOString().split('T')[0] // "2026-04-13"
}

// ─── Store final week value in history ────────────────────────────────────────
async function archiveWeeklyValue(row: SocialProofGrowth): Promise<void> {
  const weekStart = getUTCWeekStart(row.reset_day)

  // Upsert so we don't duplicate if cron fires twice
  await supabaseAdmin
    .from('social_proof_weekly_history')
    .upsert(
      {
        project_id: row.project_id,
        growth_id: row.id,
        week_start: weekStart,
        final_value: row.current_value,
      },
      { onConflict: 'growth_id,week_start' },
    )
}

// ─── Reset a single growth row ────────────────────────────────────────────────
async function resetGrowthRow(row: SocialProofGrowth): Promise<void> {
  await archiveWeeklyValue(row)

  await supabaseAdmin
    .from('social_proof_growth')
    .update({
      current_value: row.start_value,
      current_day: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', row.id)
}

// ─── Main: reset all rows where reset_day matches today ───────────────────────
/**
 * Called by the cron endpoint. Finds every enabled growth row whose reset_day
 * matches UTC today, archives last week's value, and resets to start_value.
 *
 * Returns counts of how many rows were processed.
 */
export async function resetWeeklyGrowth(): Promise<{
  processed: number
  errors: number
}> {
  const todayUTC = new Date().getUTCDay() // 0 = Sun, 1 = Mon, …

  const { data: rows, error } = await supabaseAdmin
    .from('social_proof_growth')
    .select('*')
    .eq('reset_day', todayUTC)
    .eq('enabled', true)

  if (error || !rows) {
    console.error('[weeklyReset] Failed to fetch rows:', error)
    return { processed: 0, errors: 1 }
  }

  let processed = 0
  let errors = 0

  for (const row of rows as SocialProofGrowth[]) {
    try {
      await resetGrowthRow(row)
      processed++
    } catch (err) {
      console.error(`[weeklyReset] Failed to reset row ${row.id}:`, err)
      errors++
    }
  }

  console.log(`[weeklyReset] Reset complete. Processed: ${processed}, Errors: ${errors}`)
  return { processed, errors }
}

// ─── Fetch last week's value for a specific growth row ────────────────────────
export async function getLastWeekValue(
  growthId: string,
): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from('social_proof_weekly_history')
    .select('final_value, week_start')
    .eq('growth_id', growthId)
    .order('week_start', { ascending: false })
    .limit(1)
    .single()

  return data?.final_value ?? null
}

