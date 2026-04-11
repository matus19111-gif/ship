import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Event = {
  id: string;
  type: string;
  name: string | null;
  city: string | null;
  product: string | null;
  created_at: string;
  project_id: string;
  projects: { name: string } | null;
};

type Project = { id: string };

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

export default async function EventsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user?.id) as { data: Project[] | null };

  const projectIds = projects?.map((p) => p.id) ?? [];

  const { data: events } = (projectIds.length
    ? await supabase
        .from("events")
        .select("id, type, name, city, product, created_at, project_id, projects(name)")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [] }) as { data: Event[] | null };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-[22px]" style={{ color: "#1a1d2e" }}>
            Live Events
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            All events across your projects, newest first.
          </p>
        </div>
        {events?.length ? (
          <div
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#d1fae5", color: "#10b981" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
            {events.length} events
          </div>
        ) : null}
      </div>

      {!events?.length ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ border: "2px dashed #e5e7eb", background: "#fff" }}
        >
          <p className="text-4xl mb-4">📭</p>
          <h2 className="font-semibold text-lg mb-2" style={{ color: "#1a1d2e" }}>No events yet</h2>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Events will appear here once your widget is installed and receiving data.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
            {[
              { label: "Type", span: "col-span-2" },
              { label: "Name", span: "col-span-2" },
              { label: "City", span: "col-span-2" },
              { label: "Product", span: "col-span-3" },
              { label: "Project", span: "col-span-2" },
              { label: "Time", span: "col-span-1" },
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
            {events.map((event: Event) => {
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
                  <p className="col-span-3 text-sm truncate" style={{ color: "#6b7280" }}>
                    {event.product ?? <span style={{ color: "#d1d5db" }}>—</span>}
                  </p>
                  <p className="col-span-2 text-xs truncate" style={{ color: "#9ca3af" }}>
                    {event.projects?.name ?? "—"}
                  </p>
                  <p className="col-span-1 text-xs whitespace-nowrap" style={{ color: "#9ca3af" }}>
                    {timeAgo(event.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
                      }
