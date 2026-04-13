import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE ROLE key — it bypasses Row Level Security.
// ONLY use this in API routes (server-side). NEVER expose to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
