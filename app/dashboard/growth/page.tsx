'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GrowthType } from '@/types/growth'

// ─── Types ────────────────────────────────────────────────────────────────────
interface EnrichedGrowth {
  id: string
  project_id: string
  type: GrowthType
  enabled: boolean
  start_value: number
  end_value: number
  today_value: number
  day_index: number
  last_week_value: number | null
  message_template: string
  growth_style: string
}

interface Project {
  id: string
  name: string
  domain: string | null
}

interface ProjectWithGrowth {
  project: Project
  configs: EnrichedGrowth[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_META: Record<GrowthType, { icon: string; color: string; bg: string }> = {
  purchases: { icon: '🔥', color: '#f97316', bg: '#fff7ed' },
  signups:   { icon: '👋', color: '#3b82f6', bg: '#eff6ff' },
  visitors:  { icon: '👀', color: '#8b5cf6', bg: '#f5f3ff' },
}

function trendBadge(today: number, lastWeek: number | null) {
  if (lastWeek === null) return null
  const diff = today - lastWeek
  const pct = Math.abs(Math.round((diff / Math.max(1, lastWeek)) * 100))
  const up = diff >= 0
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: up ? '#d1fae5' : '#fee2e2',
        color: up ? '#059669' : '#dc2626',
      }}
    >
      {up ? '↑' : '↓'} {pct}% vs last week
    </span>
  )
}

// ─── Week mini-bar ─────────────────────────────────────────────────────────────
function WeekMiniBar({ dayIndex, color }: { dayIndex: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{
            background:
              i < dayIndex ? '#e5e7eb' : i === dayIndex ? color : '#f3f4f6',
            opacity: i === dayIndex ? 1 : i < dayIndex ? 0.5 : 0.3,
          }}
        />
      ))}
      <span className="text-[9px] ml-1 shrink-0" style={{ color: '#d1d5db' }}>
        D{dayIndex + 1}
      </span>
    </div>
  )
}

// ─── Growth card ──────────────────────────────────────────────────────────────
function GrowthRowCard({
  cfg,
  projectName,
  projectId,
}: {
  cfg: EnrichedGrowth
  projectName: string
  projectId: string
}) {
  const meta = TYPE_META[cfg.type]
  const progressPct = cfg.end_value > cfg.start_value
    ? Math.round(((cfg.today_value - cfg.start_value) / (cfg.end_value - cfg.start_value)) * 100)
    : 0

  return (
    <Link
      href={`/dashboard/projects/${projectId}`}
      className="block rounded-2xl p-5 transition-all hover:shadow-md group"
      style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon + type */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: meta.bg }}
          >
            {meta.icon}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1a1d2e' }}>
              {cfg.type.charAt(0).toUpperCase() + cfg.type.slice(1)}
            </p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{projectName}</p>
          </div>
        </div>

        {/* Enabled badge */}
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={
            cfg.enabled
              ? { background: '#d1fae5', color: '#10b981' }
              : { background: '#f3f4f6', color: '#9ca3af' }
          }
        >
          {cfg.enabled ? '● Active' : '○ Off'}
        </span>
      </div>

      {/* Today's big number */}
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tabular-nums" style={{ color: '#1a1d2e' }}>
            {cfg.today_value.toLocaleString()}
          </span>
          <span className="text-sm" style={{ color: '#9ca3af' }}>
            / {cfg.end_value.toLocaleString()} goal
          </span>
        </div>
        {trendBadge(cfg.today_value, cfg.last_week_value)}
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-2 rounded-full" style={{ background: '#f3f4f6' }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, progressPct)}%`,
              background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
            }}
          />
        </div>
        <WeekMiniBar dayIndex={cfg.day_index} color={meta.color} />
      </div>

      {/* Message preview */}
      <p className="mt-2 text-xs italic truncate" style={{ color: '#d1d5db' }}>
        &ldquo;{cfg.message_template.replace('{count}', String(cfg.today_value))}&rdquo;
      </p>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GrowthDashboardPage() {
  const [data, setData] = useState<ProjectWithGrowth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Fetch all projects first
      const projRes = await fetch('/api/projects')
      const { projects } = await projRes.json()

      if (!projects?.length) { setLoading(false); return }

      // Then fetch growth configs for each project in parallel
      const results: ProjectWithGrowth[] = await Promise.all(
        projects.map(async (p: Project) => {
          const res = await fetch(`/api/growth/${p.id}`)
          const { configs } = await res.json()
          return { project: p, configs: configs ?? [] }
        }),
      )

      setData(results)
      setLoading(false)
    }
    load()
  }, [])

  const allConfigs = data.flatMap((d) =>
    d.configs.map((c) => ({ ...c, projectName: d.project.name, projectId: d.project.id })),
  )
  const activeCount = allConfigs.filter((c) => c.enabled).length
  const totalTypes = allConfigs.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4f6ef7' }} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-[22px]" style={{ color: '#1a1d2e' }}>
            Growth Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9ca3af' }}>
            Smart progressive social proof — trending up, always believable.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Active Counters',
            value: activeCount,
            icon: '📈',
            color: '#10b981',
            bg: '#d1fae5',
          },
          {
            label: 'Total Configured',
            value: totalTypes,
            icon: '⚙️',
            color: '#4f6ef7',
            bg: '#e0e7ff',
          },
          {
            label: 'Projects',
            value: data.length,
            icon: '🌐',
            color: '#f59e0b',
            bg: '#fef3c7',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                {s.label}
              </p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: s.bg }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1a1d2e' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ border: '2px dashed #e5e7eb' }}>
          <p className="text-4xl mb-4">📈</p>
          <h2 className="font-semibold text-lg mb-2" style={{ color: '#1a1d2e' }}>No growth configs yet</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Open a project and set up your weekly growth ranges.
          </p>
          <Link
            href="/dashboard/projects"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}
          >
            Go to Projects
          </Link>
        </div>
      )}

      {/* Per-project sections */}
      {data.map(({ project, configs }) => (
        <div key={project.id} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: '#f3f4f6' }}>🌐</div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1a1d2e' }}>{project.name}</p>
              {project.domain && (
                <p className="text-xs" style={{ color: '#9ca3af' }}>{project.domain}</p>
              )}
            </div>
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: '#f3f4f6', color: '#4f6ef7' }}
            >
              Edit settings →
            </Link>
          </div>

          {configs.length === 0 ? (
            <p className="text-sm pl-11" style={{ color: '#9ca3af' }}>
              No growth counters configured for this project.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {configs.map((cfg) => (
                <GrowthRowCard
                  key={cfg.id}
                  cfg={cfg}
                  projectName={project.name}
                  projectId={project.id}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
  }

