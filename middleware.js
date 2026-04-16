import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// Public API routes that don't require a session — called by external widgets
const PUBLIC_API_PREFIXES = ["/api/growth", "/api/cron"];

// The middleware is used to refresh the user's session before loading Server Component routes
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip session refresh for public widget endpoints — they use supabaseAdmin
  // directly and don't need the cookie-based session. Skipping saves ~20ms per
  // widget page load.
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
