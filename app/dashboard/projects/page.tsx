import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, domain, api_key, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const projectIds = projects?.map((p) => p.id) ?? [];
  const { data: eventRows } = projectIds.length
    ? await supabase
        .from("events")
        .select("project_id")
        .in("project_id", projectIds)
    : { data: [] as { project_id: string }[] };

  const countMap: Record<string, number> = {};
  for (const row of eventRows ?? []) {
    countMap[row.project_id] = (countMap[row.project_id] ?? 0) + 1;
  }

  const totalEvents = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-[22px]" style={{ color: "#1a1d2e" }}>
            Projects
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            Each project is one website with a widget installed.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </Link>
      </div>

      {!projects?.length ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ border: "2px dashed #e5e7eb", background: "#fff" }}
        >
          <p className="text-4xl mb-4">🚀</p>
          <h2 className="font-semibold text-lg mb-2" style={{ color: "#1a1d2e" }}>No projects yet</h2>
          <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
            Create your first project to get your widget API key.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-4 px-6 py-3 rounded-xl"
            style={{ background: "#fff", borderBottom: "1px solid #f0f1f3" }}
          >
            {[
              { label: "#", span: "col-span-1" },
              { label: "Name", span: "col-span-3" },
              { label: "Domain", span: "col-span-3" },
              { label: "API Key", span: "col-span-3" },
              { label: "Events", span: "col-span-1" },
              { label: "Status", span: "col-span-1" },
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

          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl transition-all hover:shadow-md group"
              style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <span className="col-span-1 text-sm font-bold" style={{ color: "#d1d5db" }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="col-span-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: "#f3f4f6" }}
                >
                  🌐
                </div>
                <p className="text-sm font-semibold truncate" style={{ color: "#1a1d2e" }}>{p.name}</p>
              </div>

              <p className="col-span-3 text-sm truncate" style={{ color: "#6b7280" }}>
                {p.domain ?? "—"}
              </p>

              <div className="col-span-3">
                <code
                  className="text-[11px] font-mono px-2 py-0.5 rounded-lg"
                  style={{ background: "#f3f4f6", color: "#4f6ef7" }}
                >
                  {p.api_key?.slice(0, 20)}…
                </code>
              </div>

              <div className="col-span-1">
                <p className="text-sm font-bold" style={{ color: "#4f6ef7" }}>
                  {(countMap[p.id] ?? 0).toLocaleString()}
                </p>
                <div className="h-1 rounded-full mt-1" style={{ background: "#e0e7ff" }}>
                  <div
                    className="h-1 rounded-full"
                    style={{
                      background: "#4f6ef7",
                      width: totalEvents > 0
                        ? `${Math.min(100, Math.round(((countMap[p.id] ?? 0) / totalEvents) * 100))}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="col-span-1">
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
  );
                }
                  
