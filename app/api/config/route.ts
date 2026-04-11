import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const DEFAULT_SETTINGS = {
  theme: 'light',
  position: 'bottom-left',
  delay: 5,
  displayDuration: 5,
  rotateInterval: 15,
  enabled_types: ['purchase', 'signup'],
}

// ─── GET /api/config?apiKey=xxx ───────────────────────────────────────────────
// Called by widget.js on page load to get display settings.
export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get('apiKey')

  if (!apiKey) {
    return NextResponse.json({ error: 'apiKey is required' }, { status: 400 })
  }

  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const { data: campaign } = await supabaseAdmin
    .from('campaigns')
    .select('settings')
    .eq('project_id', project.id)
    .single()

  const config = campaign?.settings ?? DEFAULT_SETTINGS

  return NextResponse.json({ config }, { headers: corsHeaders() })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
