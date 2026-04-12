"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) { setError("Project name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Breadcrumb */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-70"
        style={{ color: "#9ca3af" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-[22px] leading-tight mb-1" style={{ color: "#1a1d2e" }}>
          New Project
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          A project = one website. You&apos;ll get an API key to install the widget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        {/* Form card */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-semibold text-[15px] mb-5" style={{ color: "#1a1d2e" }}>
            Project Details
          </h2>

          <div className="space-y-5">
            {/* Project name */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#b0b7c3" }}
              >
                Project Name <span style={{ color: "#4f6ef7" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="My Online Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "#f4f6fb",
                  border: "1.5px solid #e5e7eb",
                  color: "#1a1d2e",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4f6ef7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Domain */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#b0b7c3" }}
              >
                Website Domain{" "}
                <span className="normal-case font-normal tracking-normal" style={{ color: "#d1d5db" }}>
                  (optional)
                </span>
              </label>
              <div className="relative">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <input
                  type="text"
                  placeholder="https://mystore.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "#f4f6fb",
                    border: "1.5px solid #e5e7eb",
                    color: "#1a1d2e",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#4f6ef7")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 text-sm px-4 py-3 rounded-xl"
                style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  Create Project
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          {/* What you get */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <p className="font-semibold text-sm mb-4" style={{ color: "#1a1d2e" }}>
              What you&apos;ll get
            </p>
            <div className="space-y-3">
              {[
                { icon: "🔑", title: "Unique API Key", desc: "Auto-generated, tied to this project only" },
                { icon: "📊", title: "Event Tracking", desc: "Collect purchases, signups, and more" },
                { icon: "🎛️", title: "Widget Settings", desc: "Customize theme, position, and timing" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: "#f3f4f6" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "#374151" }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
          >
            <p className="text-white font-semibold text-sm mb-1">💡 One project per site</p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.75)" }}>
              Create a separate project for each website you want to show social proof on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
                  }
          
