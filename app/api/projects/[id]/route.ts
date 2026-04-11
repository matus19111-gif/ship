import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

type Params = { params: { id: string } }

// Helper: verify the project belongs to the logged-in user
async function getOwnedProject(projectId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()
  return data
}

// ─── GET /api/projects/[id] ───────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: project } = await supabaseAdmin
    .from('projects')
    .select(`
      id, name, domain, api_key, created_at,
      campaigns ( settings ),
      events ( id, type, name, city, product, created_at )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false, referencedTable: 'events' })
    .limit(100, { referencedTable: 'events' })
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  return NextResponse.json({ project })
}

// ─── PUT /api/projects/[id] ───────────────────────────────────────────────────
// Updates project name/domain and/or widget settings.
export async function PUT(req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await getOwnedProject(params.id, user.id)
  if (!owned) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const body = await req.json()
  const { name, domain, settings } = body

  if (name || domain !== undefined) {
    await supabaseAdmin
      .from('projects')
      .update({
        ...(name && { name: name.trim() }),
        ...(domain !== undefined && { domain: domain?.trim() || null }),
      })
      .eq('id', params.id)
  }

  if (settings) {
    await supabaseAdmin
      .from('campaigns')
      .update({ settings })
      .eq('project_id', params.id)
  }

  return NextResponse.json({ success: true })
}

// ─── DELETE /api/projects/[id] ────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
            }

