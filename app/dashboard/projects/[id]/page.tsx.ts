"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Event = { id: string; type: string; name: string | null; city: string | null; product: string | null; created_at: string };
type Settings = { theme: string; position: string; delay: number; displayDuration: number; rotateInterval: number; enabled_types: string[] };
type Project = { id: string; name: string; domain: string | null; api_key: string; campaigns: { settings: Settings }[]; events: Event[] };

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  purchase: { icon: "🛒", color: "#10b981", bg: "#d1fae5", label: "Purchase" },
  signup:   { icon: "👋", color: "#3b82f6", bg: "#dbeafe", label: "Signup" },
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
  const [copied, setCopied] = useState(false);

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

  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const scriptTag = `<script src="${origin}/widget.js" data-api-key="${project.api_key}"></script>`;
  const curlCmd = `curl -X POST ${origin}/api/event \\\n  -H "Content-Type: application/json" \\\n  -d '{"apiKey":"${project.api_key}","type":"purchase","name":"Ahmed","city":"Dhaka","product":"Running Shoes"}'`;

  return (
    <div>
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 inline-block">← Projects</Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>{project.name}</h1>
          {project.domain && <p className="text-sm text-gray-500">{project.domain}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-900/20 border border-emerald-900/40 px-2.5 py-1 rounded-full">● Live</span>
          <button onClick={deleteProject} className="text-xs text-gray-600 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-[#1e2130] hover:border-red-900/40">Delete</button>
        </div>
      </div>

      <div className="bg-[#13151f] border border-[#1e2130] rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-1">API Key</p>
          <code className="text-indigo-300 text-sm font-mono">{project.api_key}</code>
        </div>
        <button onClick={() => copyText(project.api_key)} className="text-xs px-3 py-1.5 rounded-lg border border-[#1e2130] transition-colors" style={{ color: copied ? "#10b981" : "#6b7280" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-[#0f1117] p-1 rounded-xl w-fit">
        {(["events", "settings", "install"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize"
            style={{ background: tab === t ? "#13151f" : "transparent", color: tab === t ? "#f9fafb" : "#6b7280", border: tab === t ? "1px solid #1e2130" : "1px solid transparent" }}>
            {t === "events" ? `📊 Events (${project.events.length})` : t === "settings" ? "⚙️ Settings" : "📦 Install"}
          </button>
        ))}
      </div>

      {tab === "events" && (
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl overflow-hidden">
          {project.events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-gray-400 font-semibold mb-1">No events yet</p>
              <p className="text-gray-600 text-sm mb-4">Install the widget and send your first event.</p>
              <button onClick={() => setTab("install")} className="text-indigo-400 text-sm hover:text-indigo-300">View install instructions →</button>
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
                    <tr key={event.id} className={`${i < project.events.length - 1 ? "border-b border-[#1a1d2a]" : ""} hover:bg-[#1a1d2a] transition-colors`}>
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

      {tab === "settings" && settings && (
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6 max-w-lg space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Theme", key: "theme", options: ["light", "dark"] },
              { label: "Position", key: "position", options: ["bottom-left", "bottom-right"] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 mb-2">{label}</label>
                <select value={(settings as any)[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors">
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {[
            { label: "Initial Delay", key: "delay", unit: "s", min: 0, max: 30 },
            { label: "Display Duration", key: "displayDuration", unit: "s", min: 2, max: 20 },
            { label: "Rotation Interval", key: "rotateInterval", unit: "s", min: 5, max: 60 },
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
                    const updated = on ? settings.enabled_types.filter((t) => t !== type) : [...settings.enabled_types, type];
                    setSettings({ ...settings, enabled_types: updated });
                  }} className="text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all"
                    style={{ background: on ? "#1e2130" : "transparent", color: on ? "#a5b4fc" : "#4b5563", border: `1px solid ${on ? "#6366f1" : "#1e2130"}` }}>
                    {TYPE_CONFIG[type]?.icon} {type}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={saveSettings} disabled={saving}
            className="text-sm font-semibold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      )}

      {tab === "install" && (
        <div className="max-w-2xl space-y-5">
          {[
            { step: "1", title: "Add the script to your website", desc: "Paste before the closing </body> tag on every page.", code: scriptTag },
            { step: "2", title: "Send events from your server", desc: "Call this from your backend whenever a purchase or signup happens.", code: `fetch('${origin}/api/event', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    apiKey: '${project.api_key}',\n    type: 'purchase',\n    name: 'Jhon',\n    city: 'New york',\n    product: 'watch'\n  })\n})` },
            { step: "3", title: "Test with curl", desc: "Run this in your terminal to send a test event.", code: curlCmd },
          ].map(({ step, title, desc, code }) => (
            <div key={step} className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
                <p className="text-white font-semibold text-sm">{title}</p>
              </div>
              <p className="text-gray-500 text-xs mb-3 ml-9">{desc}</p>
              <div className="relative">
                <pre className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4 text-indigo-300 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
                <button onClick={() => copyText(code)} className="absolute top-2 right-2 text-xs px-2 py-1 rounded-lg bg-[#1e2130] text-gray-500 hover:text-gray-300 transition-colors">
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
          
