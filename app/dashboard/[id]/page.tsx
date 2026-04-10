'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Event = {
  id: string
  type: string
  name: string | null
  city: string | null
  product: string | null
  created_at: string
}

type Settings = {
  theme: 'light' | 'dark'
  position: 'bottom-left' | 'bottom-right'
  delay: number
  displayDuration: number
  rotateInterval: number
  enabled_types: string[]
}

type Project = {
  id: string
  name: string
  domain: string | null
  api_key: string
  created_at: string
  campaigns: { settings: Settings }[]
  events: Event[]
}

const EVENT_TYPE_ICONS: Record<string, string> = {
  purchase: '🛒',
  signup: '👋',
  pageview: '👀',
  custom: '⚡',
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'events' | 'settings' | 'install'>('events')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(d => {
        setProject(d.project)
        setSettings(d.project?.campaigns?.[0]?.settings ?? null)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })
    setSaving(false)
  }

  async function deleteProject() {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    router.push('/dashboard/projects')
  }

  function copyApiKey() {
    navigator.clipboard.writeText(project!.api_key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p>Project not found.</p>
        <Link href="/dashboard/projects" className="btn btn-ghost btn-sm mt-4">
          Back to projects
        </Link>
      </div>
    )
  }

  const scriptTag = `<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/widget.js" data-api-key="${project.api_key}"></script>`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm text-base-content/50 hover:text-base-content mb-2 inline-block"
          >
            ← Projects
          </Link>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.domain && (
            <p className="text-sm text-base-content/50 mt-0.5">{project.domain}</p>
          )}
        </div>
        <button onClick={deleteProject} className="btn btn-ghost btn-sm text-error">
          Delete
        </button>
      </div>

      {/* API Key */}
      <div className="bg-base-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-base-content/50 mb-1 font-medium uppercase tracking-wide">API Key</p>
          <code className="text-sm font-mono">{project.api_key}</code>
        </div>
        <button onClick={copyApiKey} className="btn btn-sm btn-ghost">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        {(['events', 'settings', 'install'] as const).map(t => (
          <button
            key={t}
            className={`tab tab-bordered capitalize ${tab === t ? 'tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'events' ? `📊 Events (${project.events.length})` :
             t === 'settings' ? '⚙️ Widget Settings' :
             '📦 Install'}
          </button>
        ))}
      </div>

      {/* ── Events Tab ── */}
      {tab === 'events' && (
        <div>
          {project.events.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-base-300 rounded-2xl">
              <p className="text-3xl mb-3">📭</p>
              <h3 className="font-semibold mb-1">No events yet</h3>
              <p className="text-sm text-base-content/60">
                Install the widget and send your first event.
              </p>
              <button
                className="btn btn-ghost btn-sm mt-4"
                onClick={() => setTab('install')}
              >
                View install instructions →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Product</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {project.events.map(event => (
                    <tr key={event.id} className="hover">
                      <td>
                        <span className="badge badge-ghost gap-1">
                          {EVENT_TYPE_ICONS[event.type] ?? '⚡'} {event.type}
                        </span>
                      </td>
                      <td>{event.name ?? <span className="text-base-content/30">—</span>}</td>
                      <td>{event.city ?? <span className="text-base-content/30">—</span>}</td>
                      <td>{event.product ?? <span className="text-base-content/30">—</span>}</td>
                      <td className="text-base-content/50 text-xs">{timeAgo(event.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Settings Tab ── */}
      {tab === 'settings' && settings && (
        <div className="space-y-6 max-w-md">
          <div>
            <label className="label"><span className="label-text font-medium">Theme</span></label>
            <select
              className="select select-bordered w-full"
              value={settings.theme}
              onChange={e => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="label"><span className="label-text font-medium">Position</span></label>
            <select
              className="select select-bordered w-full"
              value={settings.position}
              onChange={e => setSettings({ ...settings, position: e.target.value as 'bottom-left' | 'bottom-right' })}
            >
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Initial Delay</span>
              <span className="label-text-alt">{settings.delay}s</span>
            </label>
            <input
              type="range" min={0} max={30} className="range range-primary"
              value={settings.delay}
              onChange={e => setSettings({ ...settings, delay: +e.target.value })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Display Duration</span>
              <span className="label-text-alt">{settings.displayDuration}s</span>
            </label>
            <input
              type="range" min={2} max={20} className="range range-primary"
              value={settings.displayDuration}
              onChange={e => setSettings({ ...settings, displayDuration: +e.target.value })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Rotation Interval</span>
              <span className="label-text-alt">{settings.rotateInterval}s</span>
            </label>
            <input
              type="range" min={5} max={60} className="range range-primary"
              value={settings.rotateInterval}
              onChange={e => setSettings({ ...settings, rotateInterval: +e.target.value })}
            />
          </div>

          <div>
            <label className="label"><span className="label-text font-medium">Enabled Event Types</span></label>
            <div className="flex flex-wrap gap-2">
              {['purchase', 'signup', 'pageview', 'custom'].map(type => (
                <label key={type} className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={settings.enabled_types.includes(type)}
                    onChange={e => {
                      const updated = e.target.checked
                        ? [...settings.enabled_types, type]
                        : settings.enabled_types.filter(t => t !== type)
                      setSettings({ ...settings, enabled_types: updated })
                    }}
                  />
                  <span className="text-sm capitalize">{EVENT_TYPE_ICONS[type]} {type}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Settings'}
          </button>
        </div>
      )}

      {/* ── Install Tab ── */}
      {tab === 'install' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-2">1. Add this to your website</h3>
            <p className="text-sm text-base-content/60 mb-3">
              Paste before the closing <code>&lt;/body&gt;</code> tag on every page.
            </p>
            <div className="relative">
              <pre className="bg-base-200 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed">
                {scriptTag}
              </pre>
              <button
                className="btn btn-xs btn-ghost absolute top-2 right-2"
                onClick={() => { navigator.clipboard.writeText(scriptTag); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Send events from your backend</h3>
            <p className="text-sm text-base-content/60 mb-3">
              Call this from your server whenever something happens (purchase, signup, etc.)
            </p>
            <pre className="bg-base-200 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre">{`fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: '${project.api_key}',
    type: 'purchase',      // purchase | signup | pageview | custom
    name: 'Ahmed',         // customer name (optional)
    city: 'Dhaka',         // city (optional)
    product: 'Running Shoes' // product name (optional)
  })
})`}</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Test it</h3>
            <p className="text-sm text-base-content/60 mb-3">
              Run this in your terminal to send a test event:
            </p>
            <pre className="bg-base-200 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre">{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/event \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey":"${project.api_key}","type":"purchase","name":"Test User","city":"New York","product":"Widget Pro"}'`}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
  
