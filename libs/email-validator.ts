import dns from "dns/promises";
import { EmailValidationResult, ValidationStatus } from "@/types/email-validation";

// ─── Disposable domain blocklist (extend as needed) ───────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com",
  "10minutemail.com", "yopmail.com", "trashmail.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "guerrillamail.info", "spam4.me",
  "dispostable.com", "maildrop.cc", "nada.email", "mailnull.com",
  "spamgourmet.com", "trashmail.at", "trashmail.io", "temp-mail.org",
]);

// ─── Role-based prefixes ───────────────────────────────────────────────────────
const ROLE_BASED_PREFIXES = new Set([
  "admin", "info", "support", "sales", "contact", "hello", "mail",
  "help", "team", "noreply", "no-reply", "webmaster", "postmaster",
  "abuse", "billing", "marketing", "newsletter", "office", "hr",
]);

// ─── Free providers ────────────────────────────────────────────────────────────
const FREE_PROVIDERS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "aol.com", "live.com", "msn.com", "protonmail.com", "proton.me",
  "zoho.com", "mail.com", "yandex.com", "gmx.com",
]);

// ─── Common typo corrections ───────────────────────────────────────────────────
const COMMON_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloook.com": "outlook.com",
};

// ─── Format validation ─────────────────────────────────────────────────────────
function validateFormat(email: string): boolean {
  // RFC 5322 simplified — covers 99.9% of real emails
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return regex.test(email) && email.length <= 254;
}

// ─── MX record lookup ──────────────────────────────────────────────────────────
async function checkMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

// ─── Typo suggestion ──────────────────────────────────────────────────────────
function getSuggestion(email: string): string | undefined {
  const [local, domain] = email.split("@");
  if (!domain) return undefined;
  const corrected = COMMON_TYPOS[domain.toLowerCase()];
  return corrected ? `${local}@${corrected}` : undefined;
}

// ─── Score calculator ─────────────────────────────────────────────────────────
function calculateScore(checks: EmailValidationResult["checks"]): number {
  let score = 100;
  if (!checks.format) return 0;
  if (!checks.mxRecord) score -= 50;
  if (checks.disposable) score -= 40;
  if (checks.roleBased) score -= 15;
  if (checks.freeProvider) score -= 5;
  return Math.max(0, score);
}

// ─── Status from score ────────────────────────────────────────────────────────
function scoreToStatus(score: number, checks: EmailValidationResult["checks"]): ValidationStatus {
  if (!checks.format || !checks.mxRecord || checks.disposable) return "invalid";
  if (score >= 75) return "valid";
  if (score >= 40) return "risky";
  return "invalid";
}

// ─── Main validation function ─────────────────────────────────────────────────
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const normalized = email.trim().toLowerCase();

  const formatValid = validateFormat(normalized);
  if (!formatValid) {
    return {
      email: normalized,
      status: "invalid",
      score: 0,
      checks: {
        format: false,
        mxRecord: false,
        disposable: false,
        roleBased: false,
        freeProvider: false,
      },
      suggestion: getSuggestion(normalized),
    };
  }

  const [local, domain] = normalized.split("@");

  const [mxRecord] = await Promise.all([checkMxRecord(domain)]);

  const checks: EmailValidationResult["checks"] = {
    format: true,
    mxRecord,
    disposable: DISPOSABLE_DOMAINS.has(domain),
    roleBased: ROLE_BASED_PREFIXES.has(local),
    freeProvider: FREE_PROVIDERS.has(domain),
  };

  const score = calculateScore(checks);
  const status = scoreToStatus(score, checks);
  const suggestion = getSuggestion(normalized);

  return {
    email: normalized,
    status,
    score,
    checks,
    suggestion,
  };
}

// ─── Bulk validation (parallel with concurrency cap) ─────────────────────────
export async function validateEmailsBulk(
  emails: string[],
  concurrency = 5
): Promise<EmailValidationResult[]> {
  const results: EmailValidationResult[] = [];

  for (let i = 0; i < emails.length; i += concurrency) {
    const batch = emails.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(validateEmail));
    results.push(...batchResults);
  }

  return results;
      }

