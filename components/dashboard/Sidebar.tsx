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
    {
      href: "/dashboard",
      label: "Overview",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/growth",
      label: "Growth",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
    {
      href: "/dashboard/install",
      label: "Install Guide",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ];

  const initials = userEmail?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <aside
      className="w-[240px] min-h-screen flex flex-col shrink-0"
      style={{
        background: "#ffffff",
        borderRight: "1px solid #f0f1f3",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #f0f1f3" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-[15px] leading-none" style={{ color: "#1a1d2e" }}>ProofPop</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>Social Proof</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: "#b0b7c3" }}>
          Main Menu
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] mb-0.5 transition-all font-medium"
              style={{
                background: active ? "#4f6ef7" : "transparent",
                color: active ? "#ffffff" : "#6b7280",
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Projects sub-list */}
        {projects.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#b0b7c3" }}>
                Projects
              </p>
              <Link
                href="/dashboard/projects/new"
                className="w-5 h-5 flex items-center justify-center rounded-md text-sm font-bold transition-colors"
                style={{ background: "#f3f4f6", color: "#4f6ef7" }}
              >
                +
              </Link>
            </div>
            {projects.map((p) => {
              const active = pathname === `/dashboard/projects/${p.id}`;
              return (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] mb-0.5 transition-all truncate font-medium"
                  style={{
                    background: active ? "#eef0fd" : "transparent",
                    color: active ? "#4f6ef7" : "#9ca3af",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#10b981" }} />
                  <span className="truncate">{p.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Upgrade Banner */}
      <div className="mx-3 mb-4 rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <p className="text-white font-bold text-sm mb-0.5">ProofPop Pro</p>
        <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Unlock all features</p>
        <button
          className="w-full py-1.5 rounded-lg text-[12px] font-bold transition-opacity hover:opacity-90"
          style={{ background: "#fff", color: "#4f6ef7" }}
        >
          Get Pro
        </button>
      </div>

      {/* User */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid #f0f1f3" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #4f6ef7, #ec4899)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#374151" }}>{userEmail}</p>
            <button
              onClick={handleSignOut}
              className="text-[10px] transition-colors hover:underline"
              style={{ color: "#9ca3af" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
            }
