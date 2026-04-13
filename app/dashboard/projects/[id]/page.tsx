"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Event = {
  id: string; type: string; name: string | null;
  city: string | null; product: string | null; created_at: string;
};

type SyntheticData = {
  names: string[];
  cities: string[];
  products: string[];
};

type Settings = {
  theme: string;
  position: string;
  delay: number;
  displayDuration: number;
  rotateInterval: number;
  enabled_types: string[];
  // ── Simulation fields ──────────────────────────────────────────────────────
  synthetic_enabled: boolean;
  synthetic_interval: number;
  synthetic_data: SyntheticData;
  message_template: string;
};

type Project = {
  id: string; name: string; domain: string | null;
  api_key: string;
  campaigns: { settings: Settings }[];
  events: Event[];
};

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  position: "bottom-left",
  delay: 5,
  displayDuration: 5,
  rotateInterval: 15,
  enabled_types: ["purchase", "signup"],
  synthetic_enabled: false,
  synthetic_interval: 15,
  synthetic_data: { names: [], cities: [], products: [] },
  message_template: "{name} from {city} just {action}!",
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  purchase: { icon: "🛒", color: "#10b981", bg: "#d1fae5", label: "Purchase" },
  signup:   { icon: "👋", color: "#3b82f6", bg: "#dbeafe", label: "Signup"   },
  pageview: { icon: "👀", color: "#8b5cf6", bg: "#ede9fe", label: "Pageview" },
  custom:   { icon: "⚡", color: "#f59e0b", bg: "#fef3c7", label: "Custom"   },
};

const GLOBAL_NAMES = [
  "Emma","Liam","Olivia","Noah","Ava","Ethan","Sophia","Mason",
  "Isabella","William","Mia","James","Charlotte","Oliver","Amelia",
];
const GLOBAL_CITIES = [
  "New York","Los Angeles","Chicago","Houston","Phoenix","Seattle",
  "Denver","Boston","Austin","Nashville","Portland","Miami",
];

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPreviewEvent(settings: Settings) {
  const names    = settings.synthetic_data.names.length    ? settings.synthetic_data.names    : GLOBAL_NAMES;
  const cities   = settings.synthetic_data.cities.length   ? settings.synthetic_data.cities   : GLOBAL_CITIES;
  const products = settings.synthetic_data.products.length ? settings.synthetic_data.products : ["Pro Plan", "Starter Plan"];
  const types    = ["purchase", "signup"] as const;
  const type     = pick(types);
  const name     = pick(names);
  const city     = pick(cities);
  const product  = type === "purchase" ? pick(products) : null;
  const minsAgo  = Math.floor(2 + Math.random() * 118);

  let message = settings.message_template || "{name} from {city} just {action}!";
  message = message
    .replace("{name}", name)
    .replace("{city}", city)
    .replace("{action}", type === "purchase" ? `purchased ${product ?? "a product"}` : "signed up");

  return { id: "preview", type, name, city, product, message, minsAgo };
}

// ─── Mini Widget Preview ───────────────────────────────────────────────────────
function PopupPreview({
  event, dark, position,
}: {
  event: ReturnType<typeof buildPreviewEvent>;
  dark: boolean;
  position: string;
}) {
  const isRight = position === "bottom-right";
  const tc = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.custom;

  return (
    <div
      style={{
        background: dark ? "#1f2937" : "#ffffff",
        color: dark ? "#f9fafb" : "#111827",
        border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: 300,
        minWidth: 240,
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, flexShrink: 0,
      }}>
        {tc.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, lineHeight: 1.45, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: event.message }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <p style={{ fontSize: 11, color: dark ? "#9ca3af" : "#6b7280", margin: 0 }}>
            {event.minsAgo}m ago
          </p>
          {/* Verified badge */}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#10b981" />
            <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>Verified</span>
        </div>
      </div>

      {/* Close */}
      <button style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 15, lineHeight: 1, color: "#9ca3af", padding: 2, flexShrink: 0, opacity: 0.6,
      }}>×</button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [project,  setProject]  = useState<Project | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<"events" | "settings" | "simulation" | "install">("events");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [copied,   setCopied]   = useState(false);

  // Simulation tab state
  const [namesRaw,    setNamesRaw]    = useState("");
  const [productsRaw, setProductsRaw] = useState("");
  const [citiesRaw,   setCitiesRaw]   = useState("");
  const [previewEvent, setPreviewEvent] = useState<ReturnType<typeof buildPreviewEvent> | null>(null);
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project);
        const s: Settings = {
          ...DEFAULT_SETTINGS,
          ...(d.project?.campaigns?.[0]?.settings ?? {}),
        };
        setSettings(s);
        setNamesRaw((s.synthetic_data?.names ?? []).join(", "));
        setProductsRaw((s.synthetic_data?.products ?? []).join(", "));
        setCitiesRaw((s.synthetic_data?.cities ?? []).join(", "));
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Live preview: re-roll every 4s when on simulation tab
  useEffect(() => {
    if (tab !== "simulation") {
      if (previewTimer.current) clearInterval(previewTimer.current);
      return;
    }
    const roll = () => setPreviewEvent(buildPreviewEvent(settings));
    roll();
    previewTimer.current = setInterval(roll, 4000);
    return () => { if (previewTimer.current) clearInterval(previewTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, settings.synthetic_data, settings.message_template]);

  // Parse comma-separated inputs into arrays and sync back to settings
  function syncSimFields(
    names = namesRaw,
    products = productsRaw,
    cities = citiesRaw,
  ) {
    const parse = (raw: string) => raw.split(",").map((s) => s.trim()).filter(Boolean);
    setSettings((prev) => ({
      ...prev,
      synthetic_data: {
        names:    parse(names),
        products: parse(products),
        cities:   parse(cities),
      },
    }));
  }

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

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Project not found.</p>
        <Link href="/dashboard/projects" className="text-indigo-400 text-sm hover:text-indigo-300">← Back to projects</Link>
      </div>
    );
  }

  const origin    = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const scriptTag = `<script src="${origin}/widget.js" data-api-key="${project.api_key}"></script>`;
  const curlCmd   = `curl -X POST ${origin}/api/event \\\n  -H "Content-Type: application/json" \\\n  -d '{"apiKey":"${project.api_key}","type":"purchase","name":"Ahmed","city":"Dhaka","product":"Running Shoes"}'`;

  const tabs = ["events", "settings", "simulation", "install"] as const;
  const tabLabels: Record<string, string> = {
    events:     `📊 Events (${project.events.length})`,
    settings:   "⚙️ Settings",
    simulation: "🎭 Simulation",
    install:    "📦 Install",
  };

  return (
    <div>
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 inline-block">
        ← Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
            {project.name}
          </h1>
          {project.domain && <p className="text-sm text-gray-500">{project.domain}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-900/20 border border-emerald-900/40 px-2.5 py-1 rounded-full">
            ● Live
          </span>
          <button onClick={deleteProject} className="text-xs text-gray-600 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-[#1e2130] hover:border-red-900/40">
            Delete
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-[#13151f] border border-[#1e2130] rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1">API Key</p>
          <code className="text-indigo-300 text-sm font-mono">{project.api_key}</code>
        </div>
        <button onClick={() => copyText(project.api_key)}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#1e2130] transition-colors"
          style={{ color: copied ? "#10b981" : "#6b7280" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-[#0f1117] p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t ? "#13151f" : "transparent",
              color: tab === t ? "#f9fafb" : "#6b7280",
              border: tab === t ? "1px solid #1e2130" : "1px solid transparent",
            }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* ── Events Tab ──────────────────────────────────────────────────────── */}
      {tab === "events" && (
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl overflow-hidden">
          {project.events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-gray-400 font-semibold mb-1">No events yet</p>
              <p className="text-gray-600 text-sm mb-4">Install the widget and send your first event.</p>
              <button onClick={() => setTab("install")} className="text-indigo-400 text-sm hover:text-indigo-300">
                View install instructions →
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#1e2130]">
                  {["Type", "Name", "City", "Product", "Time"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.events.map((event, i) => {
                  const tc = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.custom;
                  return (
                    <tr key={event.id}
                      className={`${i < project.events.length - 1 ? "border-b border-[#1a1d2a]" : ""} hover:bg-[#1a1d2a] transition-colors`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: tc.bg + "22", color: tc.color, border: `1px solid ${tc.color}33` }}>
                          {tc.icon} {tc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{event.name ?? <span className="text-gray-700">—</span>}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{event.city ?? <span className="text-gray-700">—</span>}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{event.product ?? <span className="text-gray-700">—</span>}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{timeAgo(event.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Settings Tab ────────────────────────────────────────────────────── */}
      {tab === "settings" && (
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6 max-w-lg space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Theme",    key: "theme",    options: ["light", "dark"] },
              { label: "Position", key: "position", options: ["bottom-left", "bottom-right"] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label>
                <select value={(settings as any)[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors">
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {[
            { label: "Initial Delay",      key: "delay",           unit: "s", min: 0,  max: 30 },
            { label: "Display Duration",   key: "displayDuration", unit: "s", min: 2,  max: 20 },
            { label: "Rotation Interval",  key: "rotateInterval",  unit: "s", min: 5,  max: 60 },
          ].map(({ label, key, unit, min, max }) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-gray-400">{label}</label>
                <span className="text-xs font-bold text-indigo-300">{(settings as any)[key]}{unit}</span>
              </div>
              <input type="range" min={min} max={max} value={(settings as any)[key]}
                onChange={(e) => setSettings({ ...settings, [key]: +e.target.value })}
                className="w-full accent-indigo-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-3">Enabled Event Types</label>
            <div className="flex flex-wrap gap-2">
              {["purchase", "signup", "pageview", "custom"].map((type) => {
                const on = settings.enabled_types.includes(type);
                return (
                  <button key={type} onClick={() => {
                    const updated = on
                      ? settings.enabled_types.filter((t) => t !== type)
                      : [...settings.enabled_types, type];
                    setSettings({ ...settings, enabled_types: updated });
                  }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all"
                    style={{
                      background: on ? "#1e2130" : "transparent",
                      color: on ? "#a5b4fc" : "#4b5563",
                      border: `1px solid ${on ? "#6366f1" : "#1e2130"}`,
                    }}>
                    {TYPE_CONFIG[type]?.icon} {type}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={saveSettings} disabled={saving}
            className="text-sm font-semibold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      )}

      {/* ── Simulation Tab ──────────────────────────────────────────────────── */}
      {tab === "simulation" && (
        <div className="flex gap-6 flex-wrap">
          {/* Left: controls */}
          <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6 flex-1 min-w-[280px] max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-sm mb-0.5">Simulation Mode</h2>
                <p className="text-gray-600 text-xs">Blend synthetic events when real traffic is low.</p>
              </div>
              {/* Toggle */}
              <button onClick={() => setSettings((s) => ({ ...s, synthetic_enabled: !s.synthetic_enabled }))}
                className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ background: settings.synthetic_enabled ? "#6366f1" : "#374151" }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow"
                  style={{ transform: settings.synthetic_enabled ? "translateX(20px)" : "translateX(0)" }} />
              </button>
            </div>

            {settings.synthetic_enabled && (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400">Synthetic Interval</label>
                    <span className="text-xs font-bold text-indigo-300">{settings.synthetic_interval}s</span>
                  </div>
                  <input type="range" min={5} max={60} value={settings.synthetic_interval}
                    onChange={(e) => setSettings((s) => ({ ...s, synthetic_interval: +e.target.value }))}
                    className="w-full accent-indigo-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Names <span className="text-gray-700 font-normal">(comma-separated)</span>
                  </label>
                  <textarea rows={2} placeholder="Emma, Liam, Sofia, Noah…"
                    value={namesRaw}
                    onChange={(e) => { setNamesRaw(e.target.value); syncSimFields(e.target.value, productsRaw, citiesRaw); }}
                    className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-700" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Cities <span className="text-gray-700 font-normal">(comma-separated)</span>
                  </label>
                  <textarea rows={2} placeholder="New York, London, Sydney…"
                    value={citiesRaw}
                    onChange={(e) => { setCitiesRaw(e.target.value); syncSimFields(namesRaw, productsRaw, e.target.value); }}
                    className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-700" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Products <span className="text-gray-700 font-normal">(comma-separated)</span>
                  </label>
                  <textarea rows={2} placeholder="Pro Plan, Annual Bundle, Starter…"
                    value={productsRaw}
                    onChange={(e) => { setProductsRaw(e.target.value); syncSimFields(namesRaw, e.target.value, citiesRaw); }}
                    className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-700" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Message Template
                  </label>
                  <input type="text"
                    value={settings.message_template}
                    onChange={(e) => setSettings((s) => ({ ...s, message_template: e.target.value }))}
                    placeholder="{name} from {city} just {action}!"
                    className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700" />
                  <p className="text-gray-700 text-[11px] mt-1.5">
                    Tokens: <code className="text-gray-600">{"{name}"}</code> <code className="text-gray-600">{"{city}"}</code> <code className="text-gray-600">{"{action}"}</code>
                  </p>
                </div>
              </>
            )}

            <button onClick={saveSettings} disabled={saving}
              className="text-sm font-semibold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2 w-full justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Simulation Settings"}
            </button>
          </div>

          {/* Right: live preview */}
          <div className="flex-1 min-w-[280px]">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">
              Live Preview <span className="text-gray-700 font-normal normal-case">(cycles every 4s)</span>
            </p>
            <div
              className="rounded-2xl p-6 flex items-end justify-start min-h-[140px]"
              style={{ background: settings.theme === "dark" ? "#111827" : "#f3f4f6" }}>
              {previewEvent && (
                <PopupPreview
                  event={previewEvent}
                  dark={settings.theme === "dark"}
                  position={settings.position}
                />
              )}
              {!settings.synthetic_enabled && (
                <p className="text-gray-500 text-xs">Enable Simulation Mode to preview popups.</p>
              )}
            </div>
            <p className="text-gray-700 text-[11px] mt-3">
              Preview uses your custom pools (or global defaults when empty). Timestamps are randomised between 2 min – 2 hrs ago.
            </p>
          </div>
        </div>
      )}

      {/* ── Install Tab ─────────────────────────────────────────────────────── */}
      {tab === "install" && (
        <div className="max-w-2xl space-y-5">
          {[
            {
              step: "1", title: "Add the script to your website",
              desc: "Paste before the closing </body> tag on every page.",
              code: scriptTag,
            },
            {
              step: "2", title: "Send events from your server",
              desc: "Call this from your backend whenever a purchase or signup happens.",
              code: `fetch('${origin}/api/event', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    apiKey: '${project.api_key}',\n    type: 'purchase',\n    name: 'Ahmed',\n    city: 'Dhaka',\n    product: 'Running Shoes'\n  })\n})`,
            },
            {
              step: "3", title: "Test with curl",
              desc: "Run this in your terminal to send a test event.",
              code: curlCmd,
            },
          ].map(({ step, title, desc, code }) => (
            <div key={step} className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
                <p className="text-white font-semibold text-sm">{title}</p>
              </div>
              <p className="text-gray-500 text-xs mb-3 ml-9">{desc}</p>
              <div className="relative">
                <pre className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4 text-indigo-300 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre">
                  {code}
                </pre>
                <button onClick={() => copyText(code)}
                  className="absolute top-2 right-2 text-xs px-2 py-1 rounded-lg bg-[#1e2130] text-gray-500 hover:text-gray-300 transition-colors">
                  {copied ? "✓" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
