import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header with account */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Dashboard</h1>
          <ButtonAccount />
        </div>
        
        {/* Projects Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Link 
              href="/dashboard/projects/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New Project
            </Link>
          </div>
          
          {projects?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Link href="/dashboard/projects/new" className="text-blue-600 hover:underline">
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects?.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-6 bg-white rounded-lg border hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  {project.domain && (
                    <p className="text-gray-600 text-sm mb-2">{project.domain}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    API Key: {project.api_key?.slice(0, 8)}...
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
