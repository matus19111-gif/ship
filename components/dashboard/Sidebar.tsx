"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Project = { id: string; name: string; api_key: string };

export default function DashboardSidebar({
  projects,
  userEmail,
}: {
  projects: Project[];
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const navItems = [
    { href: "/dashboard", icon: "▦", label: "Overview" },
    { href: "/dashboard/projects", icon: "◈", label: "Projects" },
    { href: "/dashboard/events", icon: "◎", label: "Live Events" },
    { href: "/dashboard/install", icon: "↗", label: "Install Guide" },
  ];

  const initials = userEmail?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <aside className="w-[240px] min-h-screen flex flex-col shrink-0 border-r border-[#1e2130] bg-[#0f1117]">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1e2130]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            📢
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: "Georgia, serif" }}>
              ProofPop
            </p>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">Social Proof</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] text-gray-600 font-semibold tracking-widest uppercase px-2 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all ${
                active
                  ? "bg-[#1e2130] text-indigo-300 font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1d2a]"
              }`}
            >
              <span className="text-sm opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Projects list */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] text-gray-600 font-semibold tracking-widest uppercase">
              Projects
            </p>
            <Link
              href="/dashboard/projects/new"
              className="w-5 h-5 flex items-center justify-center rounded bg-[#1e2130] text-indigo-400 text-base leading-none hover:bg-[#2d3047] transition-colors"
            >
              +
            </Link>
          </div>
          {projects.length === 0 && (
            <p className="text-xs text-gray-600 px-2">No projects yet</p>
          )}
          {projects.map((p) => {
            const active = pathname === `/dashboard/projects/${p.id}`;
            return (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] mb-0.5 transition-all truncate ${
                  active
                    ? "bg-[#1e2130] text-gray-200"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1d2a]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{p.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-[#1e2130]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 text-xs font-semibold truncate">{userEmail}</p>
            <button
              onClick={handleSignOut}
              className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
        }
            
