import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import config from "@/config";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, api_key")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen" style={{ background: "#f4f6fb", fontFamily: "'DM Sans', sans-serif" }}>
      <DashboardSidebar
        projects={projects ?? []}
        userEmail={session.user.email ?? ""}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
