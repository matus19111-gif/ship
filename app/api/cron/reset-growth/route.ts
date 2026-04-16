import { NextRequest, NextResponse } from 'next/server'
import { resetWeeklyGrowth } from '@/libs/weeklyReset'

/**
 * GET /api/cron/reset-growth
 *
 * Protected by CRON_SECRET header. Call this every day at 00:01 UTC.
 *
 * Vercel cron.json example:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/reset-growth",
 *       "schedule": "1 0 * * *"
 *     }
 *   ]
 * }
 *
 * The route checks reset_day on each row, so it's safe to run daily —
 * it only resets rows whose reset_day matches UTC today.
 */
export async function GET(req: NextRequest) {
  // ── Security ──────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-cron-secret') ??
    req.nextUrl.searchParams.get('secret')

  if (!process.env.CRON_SECRET) {
    // If CRON_SECRET is not set at all, reject everything — fail safe.
    return NextResponse.json(
      { error: 'CRON_SECRET env var is not configured' },
      { status: 500 },
    )
  }

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Run reset ─────────────────────────────────────────────────────────────
  const started = Date.now()

  try {
    const { processed, errors } = await resetWeeklyGrowth()

    return NextResponse.json({
      ok: true,
      processed,
      errors,
      durationMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[cron/reset-growth] Unhandled error:', err)
    return NextResponse.json(
      { error: 'Internal error', durationMs: Date.now() - started },
      { status: 500 },
    )
  }
}
