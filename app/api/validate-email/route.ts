import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateEmail, validateEmailsBulk } from "@/lib/email-validator";
import { BulkValidateEmailRequest, ValidateEmailRequest } from "@/types/email-validation";

// ─── Supabase client (server-side) ────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for server-side writes
);

// ─── Rate limit helper (simple in-memory — swap for Upstash Redis in prod) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ─── POST /api/validate-email ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  let body: ValidateEmailRequest | BulkValidateEmailRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ── Single email ──────────────────────────────────────────────────────────
  if ("email" in body) {
    const { email, userId } = body as ValidateEmailRequest;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required." }, { status: 400 });
    }

    const result = await validateEmail(email);

    // Persist to Supabase (non-blocking)
    supabase
      .from("email_validations")
      .insert({
        email: result.email,
        status: result.status,
        score: result.score,
        checks: result.checks,
        suggestion: result.suggestion ?? null,
        user_id: userId ?? null,
      })
      .then(({ error }) => {
        if (error) console.error("[Supabase insert error]", error.message);
      });

    return NextResponse.json(result, { status: 200 });
  }

  // ── Bulk emails ───────────────────────────────────────────────────────────
  if ("emails" in body) {
    const { emails, userId } = body as BulkValidateEmailRequest;

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "emails array is required." }, { status: 400 });
    }

    if (emails.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 emails per bulk request." },
        { status: 400 }
      );
    }

    const results = await validateEmailsBulk(emails);

    // Persist all results (non-blocking)
    supabase
      .from("email_validations")
      .insert(
        results.map((r) => ({
          email: r.email,
          status: r.status,
          score: r.score,
          checks: r.checks,
          suggestion: r.suggestion ?? null,
          user_id: userId ?? null,
        }))
      )
      .then(({ error }) => {
        if (error) console.error("[Supabase bulk insert error]", error.message);
      });

    const summary = {
      total: results.length,
      valid: results.filter((r) => r.status === "valid").length,
      invalid: results.filter((r) => r.status === "invalid").length,
      risky: results.filter((r) => r.status === "risky").length,
    };

    return NextResponse.json({ summary, results }, { status: 200 });
  }

  return NextResponse.json({ error: "Provide email or emails field." }, { status: 400 });
}

// ─── GET /api/validate-email?email=foo@bar.com ────────────────────────────────
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email query param is required." }, { status: 400 });
  }

  const result = await validateEmail(email);
  return NextResponse.json(result, { status: 200 });
                                }

