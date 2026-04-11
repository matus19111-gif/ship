"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) { setError("Project name is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 inline-block">
        ← Back to projects
      </Link>
      <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>New Project</h1>
      <p className="text-sm text-gray-500 mb-8">A project = one website. You'll get an API key to install the widget.</p>

      <div className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">Project Name <span className="text-indigo-400">*</span></label>
          <input type="text" placeholder="My Online Store" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">Website Domain <span className="text-gray-600">(optional)</span></label>
          <input type="text" placeholder="https://mystore.com" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="w-full bg-[#0f1117] border border-[#1e2130] text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600" />
        </div>
        {error && (
          <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}
        <button onClick={handleCreate} disabled={loading}
          className="w-full text-sm font-semibold text-white py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</>) : "Create Project →"}
        </button>
      </div>
    </div>
  );
}
