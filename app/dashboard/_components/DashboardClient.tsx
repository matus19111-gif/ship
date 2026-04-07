import { useState } from "react";

const NAV = [
  { icon: "▣", label: "Overview", active: true },
  { icon: "◈", label: "Clients" },
  { icon: "⬡", label: "Pipeline" },
  { icon: "◎", label: "Projects" },
  { icon: "◷", label: "Time" },
  { icon: "◻", label: "Invoices" },
];

const STATS = [
  { label: "Active Clients", value: "12", delta: "+2", up: true, sub: "this month" },
  { label: "Revenue (MTD)", value: "$14,820", delta: "+18%", up: true, sub: "vs last month" },
  { label: "Hrs Tracked", value: "186h", delta: "-4h", up: false, sub: "vs last month" },
  { label: "Unpaid Invoices", value: "$3,200", delta: "2 pending", up: null, sub: "overdue: 1" },
];

const PIPELINE = [
  { stage: "Lead", count: 4, color: "#6366f1" },
  { stage: "Proposal", count: 2, color: "#8b5cf6" },
  { stage: "Active", count: 7, color: "#f59e0b" },
  { stage: "Review", count: 3, color: "#10b981" },
  { stage: "Done", count: 18, color: "#374151" },
];

const RECENT = [
  { client: "Arcane Studio", action: "Invoice #041 sent", time: "2h ago", amount: "$1,800", tag: "invoice" },
  { client: "Drift Labs", action: "Project milestone marked done", time: "5h ago", amount: null, tag: "project" },
  { client: "Nova Brand Co.", action: "3.5h logged — Brand strategy", time: "Yesterday", amount: null, tag: "time" },
  { client: "Fenix Media", action: "New project created", time: "Yesterday", amount: "$4,200", tag: "project" },
  { client: "Carver & Sons", action: "Invoice #039 paid", time: "2d ago", amount: "$2,600", tag: "paid" },
];

const TAG_STYLES = {
  invoice: { bg: "#1e1b4b", color: "#818cf8" },
  project: { bg: "#1c1917", color: "#f59e0b" },
  time: { bg: "#042f2e", color: "#34d399" },
  paid: { bg: "#052e16", color: "#4ade80" },
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#09090b",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e4e4e7",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; color: #71717a; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover { color: #e4e4e7; background: #18181b; }
        .nav-item.active { color: #fbbf24; background: #1c1400; }
        .stat-card { background: #111113; border: 1px solid #1f1f23; border-radius: 12px; padding: 20px 22px; flex: 1; min-width: 0; transition: border-color 0.2s; cursor: default; }
        .stat-card:hover { border-color: #2d2d35; }
        .pipeline-bar { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #18181b; cursor: default; }
        .pipeline-bar:last-child { border-bottom: none; }
        .activity-row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid #18181b; }
        .activity-row:last-child { border-bottom: none; }
        .btn-primary { background: #fbbf24; color: #09090b; border: none; padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-primary:hover { background: #f59e0b; }
        .btn-ghost { background: #18181b; color: #a1a1aa; border: 1px solid #27272a; padding: 8px 14px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn-ghost:hover { color: #e4e4e7; border-color: #3f3f46; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, background: "#09090b", borderRight: "1px solid #18181b", padding: "24px 14px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ padding: "4px 14px 20px", marginBottom: 4 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#fbbf24", letterSpacing: "-0.3px" }}>freelance<span style={{ color: "#e4e4e7" }}>os</span></div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>workspace · @matus</div>
        </div>

        {NAV.map(n => (
          <button key={n.label} className={`nav-item${activeNav === n.label ? " active" : ""}`} onClick={() => setActiveNav(n.label)}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center", opacity: 0.7 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#111113", border: "1px solid #1f1f23" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#09090b", flexShrink: 0 }}>M</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Matus</div>
              <div style={{ fontSize: 11, color: "#52525b" }}>Pro plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.5px", lineHeight: 1.1 }}>Good morning, Matus.</div>
            <div style={{ fontSize: 13, color: "#52525b", marginTop: 5, fontFamily: "'DM Mono', monospace" }}>Tuesday, April 7 · 3 tasks due today</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost">+ New Invoice</button>
            <button className="btn-primary">+ New Project</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 11, fontWeight: 500, color: "#52525b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 500, color: "#fafafa", letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: s.up === true ? "#4ade80" : s.up === false ? "#f87171" : "#a1a1aa", fontFamily: "'DM Mono', monospace" }}>{s.delta}</span>
                <span style={{ fontSize: 11, color: "#3f3f46" }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20, marginBottom: 20 }}>
          {/* Pipeline */}
          <div style={{ background: "#111113", border: "1px solid #1f1f23", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>Pipeline</div>
              <span style={{ fontSize: 11, color: "#52525b", fontFamily: "'DM Mono', monospace" }}>34 total</span>
            </div>
            {PIPELINE.map(p => (
              <div key={p.stage} className="pipeline-bar">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 12, color: "#a1a1aa" }}>{p.stage}</div>
                <div style={{ height: 4, width: `${(p.count / 18) * 90}px`, background: p.color, borderRadius: 2, opacity: 0.7, minWidth: 12, transition: "width 0.3s" }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#71717a", width: 20, textAlign: "right" }}>{p.count}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: "#111113", border: "1px solid #1f1f23", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>Recent Activity</div>
              <button style={{ fontSize: 11, color: "#fbbf24", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
            </div>
            {RECENT.map((r, i) => (
              <div key={i} className="activity-row">
                <div style={{ width: 32, height: 32, borderRadius: 8, background: TAG_STYLES[r.tag].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, color: TAG_STYLES[r.tag].color }}>
                    {r.tag === "invoice" ? "◻" : r.tag === "project" ? "⬡" : r.tag === "time" ? "◷" : "✓"}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7", marginBottom: 2 }}>{r.client}</div>
                  <div style={{ fontSize: 11, color: "#52525b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.action}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {r.amount && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#a1a1aa", marginBottom: 2 }}>{r.amount}</div>}
                  <div style={{ fontSize: 11, color: "#3f3f46" }}>{r.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: tasks strip */}
        <div style={{ background: "#111113", border: "1px solid #1f1f23", borderRadius: 12, padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>Due Today</div>
            <button style={{ fontSize: 11, color: "#fbbf24", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all tasks →</button>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { title: "Finalize brand deck", client: "Nova Brand Co.", priority: "high" },
              { title: "Send project proposal", client: "Fenix Media", priority: "med" },
              { title: "Log Monday hours", client: "Drift Labs", priority: "low" },
            ].map((t, i) => (
              <div key={i} style={{ flex: 1, background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.priority === "high" ? "#f87171" : t.priority === "med" ? "#fbbf24" : "#4ade80", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.priority}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "#52525b" }}>{t.client}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
      }
