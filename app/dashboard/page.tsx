import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, domain, api_key, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const projectIds = projects?.map((p) => p.id) ?? [];

  const { data: eventCounts } = projectIds.length
    ? await supabase
        .from("events")
        .select("project_id")
        .in("project_id", projectIds)
    : { data: [] as { project_id: string }[] };

  const countMap: Record<string, number> = {};
  for (const row of eventCounts ?? []) {
    countMap[row.project_id] = (countMap[row.project_id] ?? 0) + 1;
  }

  const totalEvents = Object.values(countMap).reduce((a, b) => a + b, 0);
  const avgEvents =
    projects?.length ? Math.round(totalEvents / projects.length) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {greeting()} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your social proof widgets.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Projects",
            value: projects?.length ?? 0,
            sub: "All active",
            accent: "#10b981",
          },
          {
            label: "Total Events",
            value: totalEvents.toLocaleString(),
            sub: "All time",
            accent: "#a5b4fc",
          },
          {
            label: "Avg / Project",
            value: avgEvents.toLocaleString(),
            sub: "Events per project",
            accent: "#f59e0b",
          },
          {
            label: "Widgets Live",
            value: projects?.length ?? 0,
            sub: "Installed & running",
            accent: "#10b981",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-5"
          >
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">
              {s.label}
            </p>
            <p
              className="text-3xl font-bold text-white mb-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {s.value}
            </p>
            <p className="text-xs" style={{ color: s.accent }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Projects table */}
      <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-[15px]">Projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors border border-[#1e2130] px-3 py-1.5 rounded-lg"
          >
            View all →
          </Link>
        </div>

        {!projects?.length ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🚀</p>
            <p className="text-gray-400 text-sm mb-4">No projects yet</p>
            <Link
              href="/dashboard/projects/new"
              className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div>
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className={`flex items-center justify-between py-3 ${
                  i < projects.length - 1 ? "border-b border-[#1a1d2a]" : ""
                } hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1e2130] flex items-center justify-center text-base">
                    🌐
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-semibold">
                      {p.name}
                    </p>
                    <p className="text-gray-600 text-xs">{p.domain ?? "—"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-300 text-sm font-bold">
                    {(countMap[p.id] ?? 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-xs">events</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
              }
                                           
