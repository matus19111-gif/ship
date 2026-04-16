'use client'
import React from 'react'  // ← Add this
// rest of your imports
import { GrowthSnapshot, GrowthType } from '@/types/growth'

// ─── Icons ────────────────────────────────────────────────────────────────────
function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 22c4.418 0 8-3.134 8-7 0-2.5-1.5-4.5-3-6-1 2-2 3-4 3-1.5 0-2.5-.75-3-2C8.5 12 7 14.5 7 17c0 2.761 2.239 5 5 5z" />
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx={9} cy={7} r={4} />
      <line x1={19} y1={8} x2={19} y2={14} />
      <line x1={22} y1={11} x2={16} y2={11} />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  )
}

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_META: Record<
  GrowthType,
  {
    icon: React.ReactNode
    lightBg: string
    lightText: string
    darkBg: string
    darkText: string
    pulse: string
  }
> = {
  purchases: {
    icon: <FlameIcon />,
    lightBg: 'bg-orange-50',
    lightText: 'text-orange-500',
    darkBg: 'bg-orange-900/40',
    darkText: 'text-orange-400',
    pulse: 'bg-orange-400',
  },
  signups: {
    icon: <UserPlusIcon />,
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-600',
    darkBg: 'bg-blue-900/40',
    darkText: 'text-blue-400',
    pulse: 'bg-blue-400',
  },
  visitors: {
    icon: <EyeIcon />,
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-600',
    darkBg: 'bg-violet-900/40',
    darkText: 'text-violet-400',
    pulse: 'bg-violet-400',
  },
}

// ─── Week progress bar ────────────────────────────────────────────────────────
function WeekProgress({
  dayIndex,
  isDark,
  pulseColor,
}: {
  dayIndex: number
  isDark: boolean
  pulseColor: string
}) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-1 rounded-full transition-all ${
            i < dayIndex
              ? isDark ? 'bg-gray-600' : 'bg-gray-200'
              : i === dayIndex
              ? pulseColor
              : isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        />
      ))}
      <span
        className={`text-[10px] font-semibold ml-1 tabular-nums ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}
      >
        Day {dayIndex + 1}/7
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface GrowthCardProps {
  snapshot: GrowthSnapshot
  isDark: boolean
}

export function GrowthCard({ snapshot, isDark }: GrowthCardProps) {
  const meta = TYPE_META[snapshot.type] ?? TYPE_META.purchases
  const iconBg = isDark ? meta.darkBg : meta.lightBg
  const iconText = isDark ? meta.darkText : meta.lightText

  return (
    <div className="flex items-start gap-3">
      {/* Icon bubble */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} ${iconText}`}
      >
        {meta.icon}
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        {/* Big number */}
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl font-black tabular-nums leading-none ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {snapshot.value.toLocaleString()}
          </span>
          {/* Live pulse dot */}
          <span className="relative flex h-2 w-2 mb-0.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 ${meta.pulse}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${meta.pulse}`}
            />
          </span>
        </div>

        {/* Message label */}
        <p
          className={`text-sm mt-0.5 leading-tight ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {/* Strip the count from the message since we show it separately */}
          {snapshot.message.replace(/^[\d,]+\s?/, '')}
        </p>

        {/* Week progress */}
        <WeekProgress
          dayIndex={snapshot.day_of_week}
          isDark={isDark}
          pulseColor={meta.pulse}
        />
      </div>
    </div>
  )
}

export default GrowthCard

