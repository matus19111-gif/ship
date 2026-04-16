"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import GrowthConfigForm from "@/components/dashboard/GrowthConfigForm";
import { GrowthConfig } from "@/types/growth";

type Event = { id: string; type: string; name: string | null; city: string | null; product: string | null; created_at: string };
type Project = { id: string; name: string; domain: string | null; api_key: string; events: Event[] };

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

  // Guard: Next.js App Router occasionally routes /projects/new into [id].
  // Redirect immediately so new/page.tsx handles it correctly.
  useEffect(() => {
    if (id === "new") { router.replace("/dashboard/projects/new"); }
  }, [id, router]);

  if (id === "new") return null;
  const [project, setProject] = useState<Project | null>(null);
  const [growthConfigs, setGrowthConfigs] = useState<GrowthConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"events" | "growth" | "install">("events");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project);
        if (d.growthConfigs?.length) setGrowthConfigs(d.growthConfigs);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function deleteProject() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
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
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4f6ef7" }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="mb-4" style={{ color: "#9ca3af" }}>Project not found.</p>
        <Link href="/dashboard/projects" className="text-sm" style={{ color: "#4f6ef7" }}>← Back to projects</Link>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const scriptTag = `<script src="${origin}/widget.js" data-api-key="${project.api_key}"></script>`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Link href="/dashboard/projects" className="text-sm transition-colors mb-6 inline-block" style={{ color: "#9ca3af" }}>
        ← Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a1d2e" }}>{project.name}</h1>
          {project.domain && <p className="text-sm" style={{ color: "#9ca3af" }}>{project.domain}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#d1fae5", color: "#10b981" }}>● Live</span>
          <button
            onClick={deleteProject}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{ color: "#9ca3af", borderColor: "#e5e7eb" }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* API Key bar */}
      <div className="rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4" style={{ background: "#f8f9fa", border: "1px solid #e5e7eb" }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>API Key</p>
          <code className="text-sm font-mono" style={{ color: "#4f6ef7" }}>{project.api_key}</code>
        </div>
        <button
          onClick={() => copyText(project.api_key)}
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={{ color: copied ? "#10b981" : "#6b7280", borderColor: "#e5e7eb" }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "#f3f4f6" }}>
        {(["events", "growth", "install"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
            style={{
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#1a1d2e" : "#9ca3af",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t === "events" ? `📊 Events (${project.events?.length ?? 0})` : t === "growth" ? "📈 Growth" : "📦 Install"}
          </button>
        ))}
      </div>

      {/* ── Events tab ── */}
      {tab === "events" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {!project.events?.length ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p className="font-semibold mb-1" style={{ color: "#1a1d2e" }}>No events yet</p>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>Install the widget and send your first event.</p>
              <button onClick={() => setTab("install")} className="text-sm" style={{ color: "#4f6ef7" }}>View install instructions →</button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Type", "Name", "City", "Product", "Time"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#9ca3af" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.events.map((event, i) => {
                  const tc = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.custom;
                  return (
                    <tr key={event.id} className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < project.events.length - 1 ? "1px solid #f9fafb" : "none" }}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: tc.bg, color: tc.color }}>
                          {tc.icon} {tc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#374151" }}>{event.name ?? <span style={{ color: "#d1d5db" }}>—</span>}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#6b7280" }}>{event.city ?? <span style={{ color: "#d1d5db" }}>—</span>}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#6b7280" }}>{event.product ?? <span style={{ color: "#d1d5db" }}>—</span>}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#9ca3af" }}>{timeAgo(event.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Growth tab ── */}
      {tab === "growth" && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-1" style={{ color: "#1a1d2e" }}>Smart Growth Config</h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Set weekly start → end ranges per metric. Numbers grow smoothly day-by-day and reset each week.
            </p>
          </div>
          <GrowthConfigForm
            projectId={id}
            initialConfigs={growthConfigs}
            onSave={(saved) => setGrowthConfigs(saved)}
          />
        </div>
      )}

      {/* ── Install tab ── */}
      {tab === "install" && (
        <div className="max-w-2xl space-y-5">
          {[
            {
              step: "1",
              title: "Add the script to your website",
              desc: "Paste before the closing </body> tag on every page. The widget fetches today's growth numbers automatically.",
              code: scriptTag,
            },
            {
              step: "2",
              title: "Configure your growth ranges",
              desc: "Go to the Growth tab above and set start/end values for purchases, signups, and visitors. Enable the counters you want to show.",
              code: `// Growth tab → set ranges like:\n// Purchases: 55 → 159 (weekly)\n// Signups:   12 → 45  (weekly)\n// Visitors:  18 → 72  (weekly)\n//\n// The widget fetches:\n// GET ${origin}/api/growth?apiKey=${project.api_key}`,
            },
            {
              step: "3",
              title: "Verify it's working",
              desc: "Run this to preview today's computed growth values for your widget.",
              code: `curl "${origin}/api/growth?apiKey=${project.api_key}"`,
            },
          ].map(({ step, title, desc, code }) => (
            <div key={step} className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}>
                  {step}
                </span>
                <p className="font-semibold text-sm" style={{ color: "#1a1d2e" }}>{title}</p>
              </div>
              <p className="text-xs mb-3 ml-9" style={{ color: "#9ca3af" }}>{desc}</p>
              <div className="relative">
                <pre className="rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre"
                  style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", color: "#4f6ef7" }}>
                  {code}
                </pre>
                <button
                  onClick={() => copyText(code)}
                  className="absolute top-2 right-2 text-xs px-2 py-1 rounded-lg transition-colors"
                  style={{ background: "#e5e7eb", color: copied ? "#10b981" : "#6b7280" }}
                >
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
