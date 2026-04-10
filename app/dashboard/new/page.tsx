'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Project name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, domain }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/dashboard/projects/${data.project.id}`)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link
        href="/dashboard/projects"
        className="text-sm text-base-content/50 hover:text-base-content mb-6 inline-block"
      >
        ← Back to projects
      </Link>

      <h1 className="text-2xl font-bold mb-2">New Project</h1>
      <p className="text-base-content/60 text-sm mb-8">
        A project = one website. You'll get an API key to install the widget.
      </p>

      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-medium">Project Name *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="My Online Store"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Website Domain</span>
            <span className="label-text-alt text-base-content/40">optional</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="https://mystore.com"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2">
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            'Create Project →'
          )}
        </button>
      </div>
    </div>
  )
          }
          
