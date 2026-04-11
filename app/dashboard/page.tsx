import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch projects for this user (RLS uses auth.uid() which matches user.id)
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, domain, api_key, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  // Count events per project (separate query — avoids join issues)
  const projectIds = projects?.map((p) => p.id) ?? [];
  const { data: eventCounts } = projectIds.length
    ? await supabase
        .from("events")
        .select("project_id")
        .in("project_id", projectIds)
    : { data: [] as { project_id: string }[] };

  // Build a map: projectId → event count
  const countMap: Record<string, number> = {};
  for (const row of eventCounts ?? []) {
    countMap[row.project_id] = (countMap[row.project_id] ?? 0) + 1;
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your social proof widgets
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <strong>Database error:</strong> {error.message}
            <p className="mt-1 text-xs text-red-500">
              Make sure you have run the SQL schema in Supabase. See BUILD_GUIDE.md → Step 1.
            </p>
          </div>
        )}

        {/* Stats row */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Events</p>
              <p className="text-2xl font-bold">
                {Object.values(countMap).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Active Widgets</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        )}

        {/* Projects section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <Link
            href="/dashboard/projects/new"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Project
          </Link>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-4xl mb-4">🚀</p>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your first project to get a widget API key.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between p-5 bg-white rounded-xl border hover:border-blue-300 hover:shadow-sm transition"
              >
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.domain && (
                    <p className="text-sm text-gray-500 mt-0.5">{project.domain}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {project.api_key?.slice(0, 20)}…
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold">
                    {countMap[project.id] ?? 0}
                  </p>
                  <p className="text-xs text-gray-400">events</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
