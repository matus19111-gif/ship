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

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
            Projects
          </h1>
          <p className="text-sm text-gray-500">Each project is one website with a widget installed.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          + New Project
        </Link>
      </div>

      {!projects?.length ? (
        <div className="text-center py-20 border-2 border-dashed border-[#1e2130] rounded-2xl">
          <p className="text-4xl mb-4">🚀</p>
          <h2 className="text-white font-semibold text-lg mb-2">No projects yet</h2>
          <p className="text-gray-500 text-sm mb-6">Create your first project to get your widget API key.</p>
          <Link
            href="/dashboard/projects/new"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="flex items-center justify-between p-5 bg-[#13151f] border border-[#1e2130] rounded-2xl hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1e2130] flex items-center justify-center text-xl">🌐</div>
                <div>
                  <p className="text-gray-100 font-semibold text-[15px] mb-0.5">{p.name}</p>
                  {p.domain && <p className="text-gray-500 text-xs mb-1.5">{p.domain}</p>}
                  <code className="text-[10px] font-mono text-indigo-400 bg-[#0f1117] px-2 py-0.5 rounded">
                    {p.api_key?.slice(0, 22)}…
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-indigo-300 font-bold text-lg">{(countMap[p.id] ?? 0).toLocaleString()}</p>
                  <p className="text-gray-600 text-[10px]">events</p>
                </div>
                <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-900/20 border border-emerald-900/40 px-2.5 py-1 rounded-full">
                  ● Active
                </div>
                <span className="text-gray-600 text-lg group-hover:text-gray-400 transition-colors">›</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
