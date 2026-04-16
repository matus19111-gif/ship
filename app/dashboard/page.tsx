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
  const avgEvents = projects?.length ? Math.round(totalEvents / projects.length) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const stats = [
    {
      label: "Total Projects",
      value: projects?.length ?? 0,
      sub: "All active",
      accent: "#10b981",
      bg: "#d1fae5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Growth Widgets",
      value: projects?.length ?? 0,
      sub: "Progressive counters",
      accent: "#4f6ef7",
      bg: "#e0e7ff",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f6ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
    {
      label: "Avg / Project",
      value: avgEvents.toLocaleString(),
      sub: "Events per project",
      accent: "#f59e0b",
      bg: "#fef3c7",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: "Widgets Live",
      value: projects?.length ?? 0,
      sub: "Installed & running",
      accent: "#8b5cf6",
      bg: "#ede9fe",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-[22px] leading-tight" style={{ color: "#1a1d2e" }}>
            {greeting()} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            Here&apos;s what&apos;s happening with your social proof widgets.
          </p>
        </div>

        {/* User avatar — replaces ButtonAccount */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold" style={{ color: "#374151" }}>{user?.email}</p>
            <p className="text-[10px]" style={{ color: "#b0b7c3" }}>Signed in</p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #4f6ef7, #ec4899)" }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                {s.label}
              </p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: "#1a1d2e" }}>
              {s.value}
            </p>
            <p className="text-xs font-medium" style={{ color: s.accent }}>
              ↑ {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Projects table + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Projects Table */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[15px]" style={{ color: "#1a1d2e" }}>Projects</h2>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>All your active projects</p>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: "#f3f4f6", color: "#4f6ef7" }}
            >
              View all →
            </Link>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 mb-2">
            {["#", "Project", "Domain", "Events", "Status"].map((h) => (
              <p
                key={h}
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  h === "#" ? "col-span-1" : h === "Project" ? "col-span-4" : h === "Domain" ? "col-span-3" : h === "Events" ? "col-span-2" : "col-span-2"
                }`}
                style={{ color: "#b0b7c3" }}
              >
                {h}
              </p>
            ))}
          </div>

          {!projects?.length ? (
            <div className="text-center py-14">
              <p className="text-3xl mb-3">🚀</p>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>No projects yet</p>
              <Link
                href="/dashboard/projects/new"
                className="text-sm font-semibold transition-colors"
                style={{ color: "#4f6ef7" }}
              >
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className="grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl transition-all hover:bg-gray-50"
                >
                  <span className="col-span-1 text-xs font-bold" style={{ color: "#b0b7c3" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                      style={{ background: "#f3f4f6" }}
                    >
                      🌐
                    </div>
                    <p className="text-sm font-semibold truncate" style={{ color: "#1a1d2e" }}>{p.name}</p>
                  </div>
                  <p className="col-span-3 text-xs truncate" style={{ color: "#9ca3af" }}>{p.domain ?? "—"}</p>
                  <div className="col-span-2">
                    <p className="text-sm font-bold" style={{ color: "#4f6ef7" }}>
                      {(countMap[p.id] ?? 0).toLocaleString()}
                    </p>
                    <div className="h-1 rounded-full mt-1" style={{ background: "#e0e7ff" }}>
                      <div
                        className="h-1 rounded-full"
                        style={{
                          background: "#4f6ef7",
                          width: totalEvents > 0 ? `${Math.round(((countMap[p.id] ?? 0) / totalEvents) * 100)}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#d1fae5", color: "#10b981" }}
                    >
                      ● Active
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div
            className="rounded-2xl p-5"
            style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", boxShadow: "0 4px 20px rgba(79,110,247,0.3)" }}
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Growth Widgets Active</p>
            <p className="text-white text-4xl font-bold mb-1">{projects?.length ?? 0}</p>
            <p className="text-white/60 text-xs">Progressive social proof running</p>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="flex justify-between">
                <div>
                  <p className="text-white/60 text-[10px]">Projects</p>
                  <p className="text-white font-bold text-lg">{projects?.length ?? 0}</p>
                </div>
                <div>
                  <p className="text-white/60 text-[10px]">Types / Project</p>
                  <p className="text-white font-bold text-lg">3</p>
                </div>
                <div>
                  <p className="text-white/60 text-[10px]">Reset</p>
                  <p className="text-white font-bold text-lg">Weekly</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <p className="font-semibold text-sm mb-4" style={{ color: "#1a1d2e" }}>Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: "New Project", href: "/dashboard/projects/new", icon: "➕", color: "#4f6ef7", bg: "#e0e7ff" },
                { label: "Growth Config", href: "/dashboard/growth", icon: "📈", color: "#10b981", bg: "#d1fae5" },
                { label: "Install Guide", href: "/dashboard/install", icon: "📖", color: "#f59e0b", bg: "#fef3c7" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: action.bg }}
                  >
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#374151" }}>{action.label}</p>
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                        }
          
