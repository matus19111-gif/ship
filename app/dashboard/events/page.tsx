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

type Project = {
  id: string;
};

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
          Live Events
        </h1>
        <p className="text-sm text-gray-500">All events across your projects, newest first.</p>
      </div>

      {!events?.length ? (
        <div className="text-center py-20 border-2 border-dashed border-[#1e2130] rounded-2xl">
          <p className="text-4xl mb-4">📭</p>
          <h2 className="text-white font-semibold text-lg mb-2">No events yet</h2>
          <p className="text-gray-500 text-sm">Events will appear here once your widget is installed and receiving data.</p>
        </div>
      ) : (
        <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1e2130]">
                {["Type", "Name", "City", "Product", "Project", "Time"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((event: Event, i: number) => {
                const tc = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.custom;
                return (
                  <tr key={event.id} className={`${i < events.length - 1 ? "border-b border-[#1a1d2a]" : ""} hover:bg-[#1a1d2a] transition-colors`}>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: tc.bg + "22", color: tc.color, border: `1px solid ${tc.color}33` }}>
                        {tc.icon} {tc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{event.name ?? <span className="text-gray-700">—</span>}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{event.city ?? <span className="text-gray-700">—</span>}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{event.product ?? <span className="text-gray-700">—</span>}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{event.projects?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{timeAgo(event.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
                    }
