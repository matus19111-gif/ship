import { GrowthStyle, WeekSchedule } from '@/types/growth'

// ─── Day labels ───────────────────────────────────────────────────────────────
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ─── UTC day of week (avoids timezone drift bugs) ─────────────────────────────
export function getUTCDayOfWeek(): number {
  return new Date().getUTCDay() // 0 = Sunday
}

/**
 * How many days into the "week window" are we?
 * If reset_day = 1 (Monday), and today is Wednesday, result = 2.
 */
export function getDayIndex(resetDay: number): number {
  const today = getUTCDayOfWeek()
  return (today - resetDay + 7) % 7
}

// ─── Gradual Growth ───────────────────────────────────────────────────────────
// Linear interpolation with ±5% jitter. Never dips below the previous day.
// Uses a seeded-ish approach (dayIndex as seed) so the same day always returns
// the same number — critical for the 1-minute cache to be coherent.
function gradualValue(start: number, end: number, dayIndex: number): number {
  const range = end - start
  const base = start + Math.round((range / 6) * dayIndex)
  // Deterministic jitter: sin of dayIndex gives a stable offset per day
  const jitterPct = Math.sin(dayIndex * 2.3) * 0.05
  const jitter = Math.round(range * jitterPct)
  return Math.max(start, Math.min(end, base + jitter))
}

// ─── Aggressive Growth ────────────────────────────────────────────────────────
// Front-loaded: bigger jumps in the first half, tapers toward the end.
// Uses a quadratic curve: value = start + range * (dayIndex/6)^0.65
function aggressiveValue(start: number, end: number, dayIndex: number): number {
  const range = end - start
  const t = dayIndex / 6
  const curved = Math.pow(t, 0.65)
  const base = start + Math.round(range * curved)
  const jitterPct = Math.sin(dayIndex * 3.7) * 0.03
  const jitter = Math.round(range * jitterPct)
  return Math.max(start, Math.min(end, base + jitter))
}

// ─── Random Growth (ratchet) ──────────────────────────────────────────────────
// Random value each day, but never lower than the previous day.
// Must be generated sequentially so day N is always >= day N-1.
function randomValues(start: number, end: number): number[] {
  const values: number[] = [start]
  for (let i = 1; i <= 6; i++) {
    const prev = values[i - 1]
    // Remaining range available divided by remaining days
    const remaining = end - prev
    const daysLeft = 6 - i + 1
    const maxStep = Math.floor(remaining / daysLeft * 2.2)
    // Deterministic random using a hash of i
    const pseudo = Math.abs(Math.sin(i * 127.1 + start * 0.01)) // 0..1
    const step = Math.round(pseudo * maxStep)
    values.push(Math.min(end, prev + step))
  }
  // Force last day to exactly hit end_value
  values[6] = end
  return values
}

// ─── Master function ──────────────────────────────────────────────────────────
/**
 * Calculate today's display value.
 *
 * @param start      Week start count
 * @param end        Week end target count
 * @param dayIndex   0 = first day of week window, 6 = last
 * @param style      Growth style
 * @returns          The integer count to display today
 */
export function calculateDailyValue(
  start: number,
  end: number,
  dayIndex: number,
  style: GrowthStyle,
): number {
  // Guard: day 0 always returns start, day 6 always returns end
  if (dayIndex <= 0) return start
  if (dayIndex >= 6) return end

  switch (style) {
    case 'gradual':    return gradualValue(start, end, dayIndex)
    case 'aggressive': return aggressiveValue(start, end, dayIndex)
    case 'random':     return randomValues(start, end)[dayIndex]
    default:           return gradualValue(start, end, dayIndex)
  }
}

// ─── Full week schedule (for dashboard preview) ───────────────────────────────
/**
 * Returns the projected values for all 7 days of the week window.
 * Used by GrowthConfigForm to render the preview grid.
 */
export function buildWeekSchedule(
  start: number,
  end: number,
  style: GrowthStyle,
  resetDay: number,
): WeekSchedule[] {
  const todayIndex = getDayIndex(resetDay)
  const allValues =
    style === 'random'
      ? randomValues(start, end)
      : Array.from({ length: 7 }, (_, i) =>
          calculateDailyValue(start, end, i, style),
        )

  return allValues.map((value, i) => {
    const absoluteDay = (resetDay + i) % 7
    return {
      day: i,
      label: DAY_LABELS[absoluteDay],
      value,
      isToday: i === todayIndex,
    }
  })
}

// ─── Mid-week smooth migration ─────────────────────────────────────────────────
/**
 * When the user edits end_value on e.g. Wednesday, we don't jump.
 * Instead we re-anchor: treat today's CURRENT value as the new start,
 * and distribute the remaining days from today to end_value.
 *
 * Returns a new { start_value, end_value } that the API should persist,
 * which will produce smooth numbers for the rest of the week.
 */
export function recalcRemainingDays(
  currentValue: number,
  newEndValue: number,
  dayIndex: number,
): { start_value: number; end_value: number } {
  // If we're on day 0 or past day 6, just update normally
  if (dayIndex <= 0 || dayIndex >= 6) {
    return { start_value: currentValue, end_value: newEndValue }
  }

  // Re-anchor: stretch from currentValue → newEndValue over the remaining days
  // The stored start_value is reverse-projected so the formula still lands correctly
  const daysRemaining = 6 - dayIndex
  const dailyStep = (newEndValue - currentValue) / daysRemaining
  const impliedStart = currentValue - dailyStep * dayIndex

  return {
    start_value: Math.round(impliedStart),
    end_value: newEndValue,
  }
}

// ─── Interpolate message template ─────────────────────────────────────────────
/**
 * "{count} people bought this week" + value 72  →  "72 people bought this week"
 */
export function interpolateMessage(template: string, value: number): string {
  return template.replace(/\{count\}/g, value.toLocaleString())
  }
                                           
