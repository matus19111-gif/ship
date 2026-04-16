'use client'

import { useState, useEffect, useCallback } from 'react'
import { GrowthConfig, GrowthType, GrowthStyle, ResetDay, WeekSchedule } from '@/types/growth'
import React from 'react'  // ← Add this
// rest of your imports
import { buildWeekSchedule, interpolateMessage, getDayIndex } from '@/libs/growthEngine'

// ─── Constants ────────────────────────────────────────────────────────────────
const GROWTH_TYPES: { value: GrowthType; label: string; icon: string; defaultTemplate: string }[] = [
  { value: 'purchases', label: 'Purchases', icon: '🔥', defaultTemplate: '{count} people bought this week' },
  { value: 'signups', label: 'Signups', icon: '👋', defaultTemplate: '{count} people joined this week' },
  { value: 'visitors', label: 'Visitors', icon: '👀', defaultTemplate: '{count} people visited this week' },
]

const GROWTH_STYLES: { value: GrowthStyle; label: string; desc: string }[] = [
  { value: 'gradual', label: 'Gradual', desc: 'Smooth linear progression with tiny variation' },
  { value: 'aggressive', label: 'Aggressive', desc: 'Bigger jumps early, tapers toward end' },
  { value: 'random', label: 'Random', desc: 'Unpredictable daily steps, always trending up' },
]

const RESET_DAYS: { value: ResetDay; label: string }[] = [
  { value: 1, label: 'Monday' },
  { value: 0, label: 'Sunday' },
  { value: 3, label: 'Wednesday' },
]

const DEFAULT_CONFIG: GrowthConfig = {
  type: 'purchases',
  enabled: true,
  message_template: '{count} people bought this week',
  start_value: 55,
  end_value: 159,
  growth_style: 'gradual',
  reset_day: 1,
  allow_overshoot: false,
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
      style={{ color: '#9ca3af' }}>
      {children}
    </label>
  )
}

function Input({
  type = 'text',
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  type?: string
  value: string | number
  onChange: (v: string) => void
  min?: number
  max?: number
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
      style={{
        background: '#f8f9fa',
        border: '1px solid #e5e7eb',
        color: '#1a1d2e',
        fontFamily: "'DM Sans', sans-serif",
      }}
    />
  )
}

// ─── Week preview grid ────────────────────────────────────────────────────────
function WeekPreview({
  schedule,
  endValue,
}: {
  schedule: WeekSchedule[]
  endValue: number
}) {
  const max = Math.max(...schedule.map((d) => d.value))

  return (
    <div className="rounded-2xl p-4" style={{ background: '#f8f9fa', border: '1px solid #e5e7eb' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>
        7-Day Preview
      </p>
      <div className="flex items-end gap-1.5 h-16">
        {schedule.map((day) => {
          const heightPct = max > 0 ? (day.value / max) * 100 : 10
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <span
                className="text-[9px] font-bold tabular-nums"
                style={{ color: day.isToday ? '#4f6ef7' : '#d1d5db' }}
              >
                {day.value}
              </span>
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${Math.max(4, (heightPct / 100) * 40)}px`,
                  background: day.isToday
                    ? 'linear-gradient(135deg, #4f6ef7, #7c3aed)'
                    : '#e5e7eb',
                }}
              />
              <span
                className="text-[9px] font-semibold"
                style={{ color: day.isToday ? '#4f6ef7' : '#d1d5db' }}
              >
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
      {/* Trend arrow summary */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: '#1a1d2e' }}>
            {schedule[0]?.value}
          </span>
          <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
            <path d="M0 4h18M15 1l3 3-3 3" stroke="#4f6ef7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-bold" style={{ color: '#4f6ef7' }}>
            {endValue}
          </span>
        </div>
        <span className="text-[10px]" style={{ color: '#10b981' }}>
          +{Math.round(((endValue - schedule[0]?.value) / Math.max(1, schedule[0]?.value)) * 100)}% growth
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface GrowthConfigFormProps {
  projectId: string
  initialConfigs?: GrowthConfig[]
  onSave?: (configs: GrowthConfig[]) => void
}

export default function GrowthConfigForm({
  projectId,
  initialConfigs,
  onSave,
}: GrowthConfigFormProps) {
  const [activeType, setActiveType] = useState<GrowthType>('purchases')
  const [configs, setConfigs] = useState<Record<GrowthType, GrowthConfig>>(() => {
    const base: Record<GrowthType, GrowthConfig> = {
      purchases: { ...DEFAULT_CONFIG, type: 'purchases', message_template: '{count} people bought this week' },
      signups: { ...DEFAULT_CONFIG, type: 'signups', start_value: 12, end_value: 45, message_template: '{count} people joined this week' },
      visitors: { ...DEFAULT_CONFIG, type: 'visitors', start_value: 18, end_value: 72, message_template: '{count} people visited this week' },
    }
    // Merge in any saved configs from the DB
    if (initialConfigs) {
      for (const c of initialConfigs) {
        base[c.type] = { ...base[c.type], ...c }
      }
    }
    return base
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cfg = configs[activeType]

  // Derived schedule for preview
  const [schedule, setSchedule] = useState<WeekSchedule[]>([])
  useEffect(() => {
    setSchedule(buildWeekSchedule(cfg.start_value, cfg.end_value, cfg.growth_style, cfg.reset_day))
  }, [cfg.start_value, cfg.end_value, cfg.growth_style, cfg.reset_day])

  const updateCfg = useCallback(
    (patch: Partial<GrowthConfig>) => {
      setConfigs((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], ...patch },
      }))
    },
    [activeType],
  )

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/growth/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: Object.values(configs) }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSave?.(Object.values(configs))
    } catch (e) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const previewMessage = interpolateMessage(
    cfg.message_template,
    schedule.find((d) => d.isToday)?.value ?? cfg.start_value,
  )

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Type tabs */}
      <div className="flex gap-2">
        {GROWTH_TYPES.map((t) => {
          const isActive = activeType === t.value
          const thisCfg = configs[t.value]
          return (
            <button
              key={t.value}
              onClick={() => setActiveType(t.value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isActive ? '#4f6ef7' : '#f3f4f6',
                color: isActive ? '#fff' : '#6b7280',
                boxShadow: isActive ? '0 2px 8px rgba(79,110,247,0.3)' : 'none',
              }}
            >
              <span>{t.icon}</span>
              {t.label}
              {thisCfg.enabled && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? 'rgba(255,255,255,0.7)' : '#10b981' }} />
              )}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: config controls */}
        <div className="space-y-5">

          {/* Enable toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a1d2e' }}>
                {GROWTH_TYPES.find(t => t.value === activeType)?.icon} Enable {activeType}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                Show this counter in the popup widget
              </p>
            </div>
            <button
              onClick={() => updateCfg({ enabled: !cfg.enabled })}
              className="relative w-11 h-6 rounded-full transition-all"
              style={{ background: cfg.enabled ? '#4f6ef7' : '#e5e7eb' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{ left: cfg.enabled ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Message template */}
          <div>
            <Label>Message Template</Label>
            <Input
              value={cfg.message_template}
              onChange={(v) => updateCfg({ message_template: v })}
              placeholder="{count} people bought this week"
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#9ca3af' }}>
              Use <code className="px-1 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#4f6ef7' }}>{'{count}'}</code> as a placeholder for the number.
            </p>
          </div>

          {/* Range inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Week Start</Label>
              <Input
                type="number"
                value={cfg.start_value}
                min={0}
                max={cfg.end_value - 1}
                onChange={(v) => updateCfg({ start_value: Math.max(0, parseInt(v) || 0) })}
              />
            </div>
            <div>
              <Label>Week End</Label>
              <Input
                type="number"
                value={cfg.end_value}
                min={cfg.start_value + 1}
                onChange={(v) => updateCfg({ end_value: Math.max(cfg.start_value + 1, parseInt(v) || 0) })}
              />
            </div>
          </div>

          {/* Growth style */}
          <div>
            <Label>Growth Style</Label>
            <div className="space-y-2">
              {GROWTH_STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateCfg({ growth_style: s.value })}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{
                    background: cfg.growth_style === s.value ? '#eef0fd' : '#f8f9fa',
                    border: `1.5px solid ${cfg.growth_style === s.value ? '#4f6ef7' : '#e5e7eb'}`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: cfg.growth_style === s.value ? '#4f6ef7' : '#d1d5db' }}
                  >
                    {cfg.growth_style === s.value && (
                      <div className="w-2 h-2 rounded-full" style={{ background: '#4f6ef7' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1a1d2e' }}>{s.label}</p>
                    <p className="text-[11px]" style={{ color: '#9ca3af' }}>{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reset day + overshoot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Reset Every</Label>
              <select
                value={cfg.reset_day}
                onChange={(e) => updateCfg({ reset_day: parseInt(e.target.value) as ResetDay })}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: '#f8f9fa', border: '1px solid #e5e7eb', color: '#1a1d2e' }}
              >
                {RESET_DAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Allow Overshoot</Label>
              <button
                onClick={() => updateCfg({ allow_overshoot: !cfg.allow_overshoot })}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all"
                style={{ background: '#f8f9fa', border: '1px solid #e5e7eb' }}
              >
                <span className="text-sm" style={{ color: '#6b7280' }}>
                  {cfg.allow_overshoot ? 'Yes' : 'No'}
                </span>
                <div
                  className="relative w-9 h-5 rounded-full transition-all"
                  style={{ background: cfg.allow_overshoot ? '#4f6ef7' : '#e5e7eb' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: cfg.allow_overshoot ? '18px' : '2px' }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="space-y-4">
          <WeekPreview schedule={schedule} endValue={cfg.end_value} />

          {/* Live popup preview */}
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>
              Popup Preview
            </p>
            <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: '#f8f9fa', border: '1px solid #e5e7eb' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: 'linear-gradient(135deg, #eef0fd, #e0e7ff)' }}
              >
                {GROWTH_TYPES.find(t => t.value === activeType)?.icon}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#1a1d2e' }}>
                  {schedule.find(d => d.isToday)?.value?.toLocaleString() ?? cfg.start_value}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  {cfg.message_template.replace(/\{count\}\s?/g, '')}
                </p>
                <div className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full" style={{
                      background: i <= (getDayIndex(cfg.reset_day)) ? '#4f6ef7' : '#e5e7eb'
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full message preview */}
          <div className="rounded-xl px-4 py-3" style={{ background: '#eef0fd', border: '1px solid #c7d2fe' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#6366f1' }}>
              Today&apos;s message
            </p>
            <p className="text-sm font-bold" style={{ color: '#4f6ef7' }}>
              &ldquo;{previewMessage}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}
      >
        {saving && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Growth Settings'}
      </button>
    </div>
  )
    }

