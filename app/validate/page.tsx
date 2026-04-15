"use client";

import { useState, useRef } from "react";

type ValidationStatus = "valid" | "invalid" | "risky" | "unknown";

interface ValidationResult {
  email: string;
  status: ValidationStatus;
  score: number;
  checks: {
    format: boolean;
    mxRecord: boolean;
    disposable: boolean;
    roleBased: boolean;
    freeProvider: boolean;
  };
  suggestion?: string;
  error?: string;
}

interface BulkResult {
  summary: { total: number; valid: number; invalid: number; risky: number };
  results: ValidationResult[];
}

const STATUS_CONFIG: Record<ValidationStatus, { label: string; color: string; bg: string; bar: string }> = {
  valid:   { label: "VALID",   color: "#00ff87", bg: "rgba(0,255,135,0.06)", bar: "#00ff87" },
  invalid: { label: "INVALID", color: "#ff3c3c", bg: "rgba(255,60,60,0.06)",  bar: "#ff3c3c" },
  risky:   { label: "RISKY",   color: "#ffb300", bg: "rgba(255,179,0,0.06)",  bar: "#ffb300" },
  unknown: { label: "UNKNOWN", color: "#888",    bg: "rgba(136,136,136,0.06)", bar: "#888" },
};

const CHECK_LABELS: Record<string, string> = {
  format:       "Format",
  mxRecord:     "MX Record",
  disposable:   "Disposable",
  roleBased:    "Role-based",
  freeProvider: "Free Provider",
};

const CHECK_PASS: Record<string, boolean> = {
  format:       true,
  mxRecord:     true,
  disposable:   false, // passing = NOT disposable
  roleBased:    false,
  freeProvider: true,  // neutral — just info
};

function checkPassed(key: string, value: boolean): "pass" | "fail" | "warn" {
  if (key === "disposable") return value ? "fail" : "pass";
  if (key === "roleBased")  return value ? "warn" : "pass";
  if (key === "freeProvider") return value ? "warn" : "pass";
  return value ? "pass" : "fail";
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", letterSpacing: 2 }}>TRUST SCORE</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color, fontWeight: 700 }}>{score}/100</span>
      </div>
      <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: `0 0 10px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

function CheckRow({ label, result }: { label: string; result: "pass" | "fail" | "warn" }) {
  const colors = { pass: "#00ff87", fail: "#ff3c3c", warn: "#ffb300" };
  const icons  = { pass: "✓", fail: "✗", warn: "⚠" };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #111" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", letterSpacing: 1 }}>{label.toUpperCase()}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: colors[result], fontWeight: 700 }}>
        {icons[result]} {result.toUpperCase()}
      </span>
    </div>
  );
}

function ResultCard({ result }: { result: ValidationResult }) {
  const cfg = STATUS_CONFIG[result.status];
  return (
    <div style={{
      background: cfg.bg,
      border: `1px solid ${cfg.color}22`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: 4,
      padding: "20px 24px",
      marginTop: 16,
      animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#aaa", wordBreak: "break-all" }}>{result.email}</span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
          color: cfg.color, background: `${cfg.color}18`,
          padding: "3px 8px", borderRadius: 2, letterSpacing: 2, marginLeft: 12, flexShrink: 0,
        }}>
          {cfg.label}
        </span>
      </div>

      <ScoreBar score={result.score} color={cfg.bar} />

      <div style={{ marginTop: 16 }}>
        {Object.entries(result.checks).map(([key, val]) => (
          <CheckRow key={key} label={CHECK_LABELS[key] ?? key} result={checkPassed(key, val)} />
        ))}
      </div>

      {result.suggestion && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: "#ffb30010", border: "1px solid #ffb30030", borderRadius: 3 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#ffb300" }}>
            ⚠ Did you mean <strong>{result.suggestion}</strong>?
          </span>
        </div>
      )}
    </div>
  );
}

export default function ValidatePage() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [email, setEmail] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<ValidationResult | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSingle() {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSingleResult(null);
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setSingleResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBulk() {
    const emails = bulkText.split("\n").map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return;
    setLoading(true);
    setError(null);
    setBulkResult(null);
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setBulkResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080808;
          color: #e0e0e0;
          min-height: 100vh;
          font-family: 'DM Mono', monospace;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .tab { 
          background: none; border: none; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 3px; padding: 10px 20px;
          transition: color 0.2s, border-color 0.2s;
        }

        .input-field {
          width: 100%; background: #0e0e0e; border: 1px solid #222;
          color: #e0e0e0; font-family: 'DM Mono', monospace; font-size: 14px;
          padding: 14px 16px; border-radius: 4px; outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #333; }
        .input-field::placeholder { color: #333; }

        .btn-primary {
          width: 100%; padding: 14px; border: none; border-radius: 4px;
          background: #e0e0e0; color: #080808;
          font-family: 'DM Mono', monospace; font-size: 12px;
          font-weight: 500; letter-spacing: 3px; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 12px;
        }
        .btn-primary:hover:not(:disabled) { background: #fff; }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .stat-box {
          flex: 1; padding: 16px;
          border: 1px solid #1a1a1a; border-radius: 4px;
          text-align: center;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0e0e0e; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#333", letterSpacing: 4, marginBottom: 10 }}>
            SYSTEM / EMAIL VALIDATOR
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 4, color: "#e0e0e0", lineHeight: 1 }}>
            VALIDATE
          </h1>
          <div style={{ width: 40, height: 2, background: "#e0e0e0", marginTop: 14 }} />
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", marginBottom: 32 }}>
          {(["single", "bulk"] as const).map((m) => (
            <button
              key={m}
              className="tab"
              onClick={() => { setMode(m); setSingleResult(null); setBulkResult(null); setError(null); }}
              style={{ color: mode === m ? "#e0e0e0" : "#333", borderBottom: mode === m ? "2px solid #e0e0e0" : "2px solid transparent" }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Single mode */}
        {mode === "single" && (
          <div style={{ animation: "slideIn 0.2s ease" }}>
            <label style={{ display: "block", fontSize: 10, color: "#444", letterSpacing: 3, marginBottom: 8 }}>
              EMAIL ADDRESS
            </label>
            <input
              ref={inputRef}
              className="input-field"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSingle()}
            />
            <button className="btn-primary" onClick={handleSingle} disabled={loading || !email.trim()}>
              {loading ? "CHECKING..." : "RUN CHECK"}
            </button>
            {singleResult && <ResultCard result={singleResult} />}
          </div>
        )}

        {/* Bulk mode */}
        {mode === "bulk" && (
          <div style={{ animation: "slideIn 0.2s ease" }}>
            <label style={{ display: "block", fontSize: 10, color: "#444", letterSpacing: 3, marginBottom: 8 }}>
              EMAILS — ONE PER LINE (MAX 100)
            </label>
            <textarea
              className="input-field"
              placeholder={"user@example.com\nanother@domain.com\n..."}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={7}
              style={{ resize: "vertical", lineHeight: 1.8 }}
            />
            <div style={{ fontSize: 10, color: "#333", letterSpacing: 1, marginTop: 6, textAlign: "right" }}>
              {bulkText.split("\n").filter((l) => l.trim()).length} emails entered
            </div>
            <button className="btn-primary" onClick={handleBulk} disabled={loading || !bulkText.trim()}>
              {loading ? "VALIDATING..." : "VALIDATE ALL"}
            </button>

            {bulkResult && (
              <div style={{ animation: "slideIn 0.3s ease" }}>
                {/* Summary row */}
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  {[
                    { label: "TOTAL",   val: bulkResult.summary.total,   color: "#e0e0e0" },
                    { label: "VALID",   val: bulkResult.summary.valid,   color: "#00ff87" },
                    { label: "RISKY",   val: bulkResult.summary.risky,   color: "#ffb300" },
                    { label: "INVALID", val: bulkResult.summary.invalid, color: "#ff3c3c" },
                  ].map((s) => (
                    <div key={s.label} className="stat-box">
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Individual results */}
                <div style={{ marginTop: 8, maxHeight: 480, overflowY: "auto" }}>
                  {bulkResult.results.map((r) => (
                    <ResultCard key={r.email} result={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(255,60,60,0.06)", border: "1px solid #ff3c3c22",
            borderLeft: "3px solid #ff3c3c", borderRadius: 4,
            fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#ff3c3c",
          }}>
            ✗ {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#333", letterSpacing: 4, animation: "pulse 1.2s infinite" }}>
              CHECKING...
            </div>
          </div>
        )}

      </div>
    </>
  );
}

