'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  domain: string | null
  api_key: string
  created_at: string
  events: { count: number }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => setProjects(d.projects ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Each project is one website where the widget is installed.
          </p>
        </div>
        <Link href="/dashboard/projects/new" className="btn btn-primary btn-sm">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-2xl">
          <p className="text-4xl mb-4">🚀</p>
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-base-content/60 text-sm mb-6">
            Create your first project to get your widget API key.
          </p>
          <Link href="/dashboard/projects/new" className="btn btn-primary btn-sm">
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="block p-5 bg-base-100 border border-base-300 rounded-2xl hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-base">{project.name}</h2>
                  {project.domain && (
                    <p className="text-sm text-base-content/50 mt-0.5">{project.domain}</p>
                  )}
                </div>
                <span className="text-xs bg-base-200 text-base-content/60 px-2 py-1 rounded-lg font-mono">
                  {project.api_key.slice(0, 16)}…
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-base-content/60">
                <span>
                  📊 {project.events?.[0]?.count ?? 0} events
                </span>
                <span>
                  📅 {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

