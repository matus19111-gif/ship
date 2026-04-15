// ─── Growth Style ─────────────────────────────────────────────────────────────
// gradual:    smooth linear progression with tiny jitter (~5%)
// aggressive: front-loaded — bigger jumps early, tapers at the end
// random:     random each day but NEVER goes down (ratchet effect)
export type GrowthStyle = 'gradual' | 'aggressive' | 'random'

// ─── Growth Type ──────────────────────────────────────────────────────────────
// What kind of social proof count this row represents
export type GrowthType = 'purchases' | 'signups' | 'visitors'

// ─── Reset Day ────────────────────────────────────────────────────────────────
// 0 = Sunday, 1 = Monday (most common business choice)
export type ResetDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

// ─── DB Row: social_proof_growth ──────────────────────────────────────────────
export interface SocialProofGrowth {
  id: string
  user_id: string
  project_id: string
  type: GrowthType
  start_value: number          // the count at the start of the week
  end_value: number            // the target count by end of week
  current_value: number        // today's computed (and cached) value
  current_day: number          // 0–6, day within the current week window
  reset_day: ResetDay          // which weekday triggers the weekly reset
  growth_style: GrowthStyle
  enabled: boolean
  allow_overshoot: boolean     // if true, real traffic can push value beyond end_value
  message_template: string     // e.g. "{count} people bought this week"
  created_at: string
  updated_at: string
}

// ─── DB Row: social_proof_weekly_history ──────────────────────────────────────
// Stored before each weekly reset so you can show "last week: 142 → this week: 159"
export interface WeeklyHistory {
  id: string
  project_id: string
  growth_id: string
  week_start: string           // ISO date of Monday that week started
  final_value: number          // the value on the last day of that week
  created_at: string
}

// ─── API shape returned by /api/growth ────────────────────────────────────────
export interface GrowthSnapshot {
  type: GrowthType
  value: number
  message: string              // fully interpolated e.g. "72 people bought this week"
  day_of_week: number          // 0–6, for the progress bar
  start_value: number
  end_value: number
  enabled: boolean
}

// ─── Dashboard config form shape ──────────────────────────────────────────────
export interface GrowthConfig {
  type: GrowthType
  enabled: boolean
  message_template: string
  start_value: number
  end_value: number
  growth_style: GrowthStyle
  reset_day: ResetDay
  allow_overshoot: boolean
}

// ─── Computed day-by-day schedule (for the live preview) ─────────────────────
export interface WeekSchedule {
  day: number           // 0–6
  label: string         // "Mon", "Tue", …
  value: number
  isToday: boolean
}

