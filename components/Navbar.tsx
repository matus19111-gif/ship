"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav
      className="px-6 py-3 flex items-center justify-between"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #f0f1f3",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "#6b7280" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="relative">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search here..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all focus:ring-2"
            style={{
              background: "#f4f6fb",
              color: "#374151",
              border: "1px solid #e5e7eb",
              width: "220px",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: "#9ca3af" }}>{user?.email}</span>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
          style={{ color: "#6b7280" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#4f6ef7" }}
          />
        </button>

        <button
          onClick={handleLogout}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
          style={{ background: "#fee2e2", color: "#ef4444" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
