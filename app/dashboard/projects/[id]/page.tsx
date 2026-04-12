"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Event = {
  id: string;
  type: string;
  name: string | null;
  city: string | null;
  product: string | null;
  created_at: string;
};

type Settings = {
  theme: string;
  position: string;
  delay: number;
  displayDuration: number;
  rotateInterval: number;
  enabled_types: string[];
};

type Project = {
  id: string;
  name: string;
  domain: string | null;
  api_key: string;
  campaigns: { settings: Settings }[];
  events: Event[];
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  purchase: { icon: "🛒", color: "#10b981", bg: "#d1fae5", label: "Purchase" },
  signup:   { icon: "👋", color: "#4f6ef7", bg: "#e0e7ff", label: "Signup" },
  pageview: { icon: "👀", color: "#8b5cf6", bg: "#ede9fe", label: "Pageview" },
  custom:   { icon: "⚡", color: "#f59e0b", bg: "#fef3c7", label: "Custom" },
};

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString();
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"events" | "settings" | "install">("events");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project);
        setSettings(d.project?.campaigns?.[0]?.settings ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function deleteProject() {
    if (!confirm("Delete this project? All events will be lost.")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.push("/dashboard/projects");
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#e0e7ff", borderTopColor: "#4f6ef7" }}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>Project not found.</p>
        <Link
          href="/dashboard/projects"
          className="text-sm font-semibold"
          style={{ color: "#4f6ef7" }}
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const scriptTag = `<script src="${origin}/widget.js" data-api-key="${project.api_key}"></script>`;
  const curlCmd = [
    `curl -X POST ${origin}/api/event \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"apiKey":"${project.api_key}","type":"purchase","name":"Ahmed","city":"Dhaka","product":"Running Shoes"}'`,
  ].join("\n");

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
        Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #e0e7ff, #ede9fe)" }}
          >
            🌐
          </div>
          <div>
            <h1 className="font-bold text-[22px] leading-tight" style={{ color: "#1a1d2e" }}>
              {project.name}
            </h1>
            {project.domain && (
              <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>{project.domain}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#d1fae5", color: "#10b981" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
            Live
          </span>
          <button
            onClick={deleteProject}
            className="text-xs font-medium px-3 py-1.5 rounded-xl border transition-all hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            style={{ borderColor: "#e5e7eb", color: "#9ca3af" }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* API Key card */}
      <div
        className="rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4"
        style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#e0e7ff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f6ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#b0b7c3" }}>
              API Key
            </p>
            <code className="text-sm font-mono font-semibold" style={{ color: "#4f6ef7" }}>
              {project.api_key}
            </code>
          </div>
        </div>
        <button
          onClick={() => copyText(project.api_key, "apikey")}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          style={{
            background: copied === "apikey" ? "#d1fae5" : "#f3f4f6",
            color: copied === "apikey" ? "#10b981" : "#6b7280",
          }}
        >
          {copied === "apikey" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-2xl w-fit"
        style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {(["events", "settings", "install"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all capitalize"
            style={{
              background: tab === t ? "linear-gradient(135deg, #4f6ef7, #7c3aed)" : "transparent",
              color: tab === t ? "#ffffff" : "#9ca3af",
            }}
          >
            {t === "events"
              ? `📊 Events (${project.events.length})`
              : t === "settings"
              ? "⚙️ Settings"
              : "📦 Install"}
          </button>
        ))}
      </div>

      {/* ── EVENTS TAB ── */}
      {tab === "events" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {project.events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p className="font-semibold text-sm mb-1" style={{ color: "#1a1d2e" }}>No events yet</p>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
                Install the widget and send your first event.
              </p>
              <button
                onClick={() => setTab("install")}
                className="text-sm font-semibold transition-colors"
                style={{ color: "#4f6ef7" }}
              >
                View install instructions →
              </button>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div
                className="grid grid-cols-12 gap-2 px-6 py-3"
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                {[
                  { label: "Type", span: "col-span-2" },
                  { label: "Name", span: "col-span-2" },
                  { label: "City", span: "col-span-2" },
                  { label: "Product", span: "col-span-4" },
                  { label: "Time", span: "col-span-2" },
                ].map((h) => (
                  <p
                    key={h.label}
                    className={`text-[10px] font-semibold uppercase tracking-wider ${h.span}`}
                    style={{ color: "#b0b7c3" }}
                  >
                    {h.label}
                  </p>
                ))}
              </div>
              <div className="divide-y" style={{ borderColor: "#f9fafb" }}>
                {project.events.map((event) => {
                  const tc = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.custom;
                  return (
                    <div
                      key={event.id}
                      className="grid grid-cols-12 gap-2 items-center px-6 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: tc.bg, color: tc.color }}
                        >
                          {tc.icon} {tc.label}
                        </span>
                      </div>
                      <p className="col-span-2 text-sm font-medium truncate" style={{ color: "#374151" }}>
                        {event.name ?? <span style={{ color: "#d1d5db" }}>—</span>}
                      </p>
                      <p className="col-span-2 text-sm truncate" style={{ color: "#6b7280" }}>
                        {event.city ?? <span style={{ color: "#d1d5db" }}>—</span>}
                      </p>
                      <p className="col-span-4 text-sm truncate" style={{ color: "#6b7280" }}>
                        {event.product ?? <span style={{ color: "#d1d5db" }}>—</span>}
                      </p>
                      <p className="col-span-2 text-xs whitespace-nowrap" style={{ color: "#9ca3af" }}>
                        {timeAgo(event.created_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {tab === "settings" && settings && (
        <div
          className="rounded-2xl p-6 max-w-lg"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-semibold text-[15px] mb-5" style={{ color: "#1a1d2e" }}>
            Widget Settings
          </h2>

          <div className="space-y-6">
            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Theme", key: "theme", options: ["light", "dark"] },
                { label: "Position", key: "position", options: ["bottom-left", "bottom-right"] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label
                    className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "#b0b7c3" }}
                  >
                    {label}
                  </label>
                  <select
                    value={(settings as any)[key]}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                    style={{
                      background: "#f4f6fb",
                      border: "1px solid #e5e7eb",
                      color: "#374151",
                    }}
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Sliders */}
            {[
              { label: "Initial Delay", key: "delay", unit: "s", min: 0, max: 30 },
              { label: "Display Duration", key: "displayDuration", unit: "s", min: 2, max: 20 },
              { label: "Rotation Interval", key: "rotateInterval", unit: "s", min: 5, max: 60 },
            ].map(({ label, key, unit, min, max }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "#b0b7c3" }}
                  >
                    {label}
                  </label>
                  <span
                    className="text-sm font-bold px-2.5 py-0.5 rounded-lg"
                    style={{ background: "#e0e7ff", color: "#4f6ef7" }}
                  >
                    {(settings as any)[key]}{unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={(settings as any)[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: +e.target.value })}
                  className="w-full accent-[#4f6ef7]"
                />
              </div>
            ))}

            {/* Event types */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#b0b7c3" }}
              >
                Enabled Event Types
              </label>
              <div className="flex flex-wrap gap-2">
                {["purchase", "signup", "pageview", "custom"].map((type) => {
                  const on = settings.enabled_types.includes(type);
                  const tc = TYPE_CONFIG[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        const updated = on
                          ? settings.enabled_types.filter((t) => t !== type)
                          : [...settings.enabled_types, type];
                        setSettings({ ...settings, enabled_types: updated });
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold capitalize transition-all"
                      style={{
                        background: on ? tc.bg : "#f3f4f6",
                        color: on ? tc.color : "#9ca3af",
                        border: `1.5px solid ${on ? tc.color + "40" : "#e5e7eb"}`,
                      }}
                    >
                      {tc?.icon} {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ── INSTALL TAB ── */}
      {tab === "install" && (
        <div className="max-w-2xl space-y-4">
          {[
            {
              step: "1",
              title: "Add the script to your website",
              desc: "Paste before the closing </body> tag on every page.",
              code: scriptTag,
              key: "script",
              color: "#4f6ef7",
              bg: "#e0e7ff",
            },
            {
              step: "2",
              title: "Send events from your server",
              desc: "Call this from your backend whenever a purchase or signup happens.",
              code: `fetch('${origin}/api/event', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    apiKey: '${project.api_key}',\n    type: 'purchase',\n    name: 'Ahmed',\n    city: 'Dhaka',\n    product: 'Running Shoes'\n  })\n})`,
              key: "fetch",
              color: "#10b981",
              bg: "#d1fae5",
            },
            {
              step: "3",
              title: "Test with curl",
              desc: "Run this in your terminal to send a test event.",
              code: curlCmd,
              key: "curl",
              color: "#f59e0b",
              bg: "#fef3c7",
            },
          ].map(({ step, title, desc, code, key, color, bg }) => (
            <div
              key={step}
              className="rounded-2xl p-5"
              style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: bg, color }}
                >
                  {step}
                </div>
                <p className="font-semibold text-sm" style={{ color: "#1a1d2e" }}>{title}</p>
                <button
                  onClick={() => copyText(code, key)}
                  className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                  style={{
                    background: copied === key ? "#d1fae5" : "#f3f4f6",
         
