import ButtonAccount from "@/components/ButtonAccount";
import { useState } from "react";

export const dynamic = "force-dynamic";

const NICHES = ["E-commerce", "SaaS", "Fitness", "Finance", "Real Estate", "Beauty", "Food & Beverage", "Education"];
const PLATFORMS = ["Facebook", "Google", "TikTok", "Instagram", "LinkedIn"];

const SAVED_ADS = [
  {
    id: 1,
    headline: "Stop Losing Customers to Competitors",
    body: "While you're reading this, your rivals are running ads that convert at 4x your rate. AdSpy Pro reveals exactly what's working—hooks, angles, and offers—so you can launch winning ads in under 60 minutes.",
    cta: "Steal Their Strategy →",
    platform: "Facebook",
    niche: "SaaS",
    score: 94,
    status: "live",
    created: "2d ago",
  },
  {
    id: 2,
    headline: "The Fat Loss Shortcut Your Gym Doesn't Want You To Know",
    body: "Thousands of people are burning fat 3x faster using this 12-minute protocol. No starving. No 2-hour cardio sessions. Just science-backed results that actually stick.",
    cta: "Get The Protocol Free",
    platform: "TikTok",
    niche: "Fitness",
    score: 88,
    status: "draft",
    created: "5d ago",
  },
  {
    id: 3,
    headline: "Your Mortgage Is Costing You $400/Month Too Much",
    body: "Most homeowners don't realize they're overpaying. In 3 minutes, our free calculator shows your real rate—and how to fix it before your next payment.",
    cta: "Calculate My Savings",
    platform: "Google",
    niche: "Finance",
    score: 91,
    status: "live",
    created: "1w ago",
  },
];

const COMPETITOR_ADS = [
  {
    brand: "AdGenius AI",
    hook: "We analyzed 2M ads so you don't have to",
    engagement: "47K",
    running: "34 days",
    platform: "Facebook",
  },
  {
    brand: "CopyFlow",
    hook: "Your first 10 winning ads are FREE",
    engagement: "29K",
    running: "21 days",
    platform: "Instagram",
  },
  {
    brand: "ConvertPro",
    hook: "10x your ROAS or we'll write your ads for free",
    engagement: "61K",
    running: "52 days",
    platform: "TikTok",
  },
];

const STATS = [
  { label: "Ads Generated", value: "1,247", delta: "+18%", up: true },
  { label: "Avg. ROAS Score", value: "91.4", delta: "+6pts", up: true },
  { label: "Competitors Tracked", value: "38", delta: "+4", up: true },
  { label: "Credits Left", value: "680", delta: "320 used", up: null },
];

// Type definitions
interface Ad {
  id?: number;
  headline: string;
  body: string;
  cta: string;
  platform: string;
  niche: string;
  score: number;
  status?: string;
  created?: string;
  insights?: string;
}

interface NotificationType {
  msg: string;
  type: string;
}

// Components
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "#00e5a0" : score >= 75 ? "#f5c518" : "#ff6b6b";
  return (
    <span style={{
      background: color + "22",
      color: color,
      border: `1px solid ${color}44`,
      borderRadius: 6,
      padding: "2px 10px",
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: 1,
    }}>{score}</span>
  );
}

function PlatformTag({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    Facebook: "#1877f2",
    Google: "#ea4335",
    TikTok: "#ff0050",
    Instagram: "#c13584",
    LinkedIn: "#0077b5",
  };
  return (
    <span style={{
      background: (colors[platform] || "#888") + "22",
      color: colors[platform] || "#888",
      border: `1px solid ${(colors[platform] || "#888")}44`,
      borderRadius: 5,
      padding: "2px 9px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    }}>{platform}</span>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: status === "live" ? "#00e5a0" : "#888" }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: status === "live" ? "#00e5a0" : "#555",
        boxShadow: status === "live" ? "0 0 6px #00e5a0" : "none",
        display: "inline-block",
      }} />
      {status === "live" ? "Live" : "Draft"}
    </span>
  );
}

function GeneratorPanel({ onGenerate, loading }: { onGenerate: (params: any) => void; loading: boolean }) {
  const [niche, setNiche] = useState("SaaS");
  const [platform, setPlatform] = useState("Facebook");
  const [angle, setAngle] = useState("pain-point");
  const [competitor, setCompetitor] = useState("");

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
      border: "1px solid #1e2a3a",
      borderRadius: 16,
      padding: 28,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #00e5a0, #00bfff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>⚡</div>
        <div>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>Ad Generator</div>
          <div style={{ fontSize: 12, color: "#4a6080" }}>Beat competitors with their own winning angles</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: "#4a6080", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Niche</label>
          <select value={niche} onChange={e => setNiche(e.target.value)} style={{
            width: "100%", background: "#0a0f1a", border: "1px solid #1e2a3a",
            borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13,
            outline: "none", cursor: "pointer",
          }}>
            {NICHES.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#4a6080", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{
            width: "100%", background: "#0a0f1a", border: "1px solid #1e2a3a",
            borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13,
            outline: "none", cursor: "pointer",
          }}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, color: "#4a6080", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Angle</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["pain-point", "curiosity", "social-proof", "urgency", "contrast"].map(a => (
            <button key={a} onClick={() => setAngle(a)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              border: angle === a ? "1px solid #00e5a0" : "1px solid #1e2a3a",
              background: angle === a ? "#00e5a022" : "transparent",
              color: angle === a ? "#00e5a0" : "#4a6080",
              fontWeight: 600, textTransform: "capitalize", transition: "all 0.2s",
            }}>{a.replace("-", " ")}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, color: "#4a6080", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>
          Competitor URL <span style={{ color: "#2a3a50", fontStyle: "normal" }}>(optional)</span>
        </label>
        <input
          value={competitor}
          onChange={e => setCompetitor(e.target.value)}
          placeholder="https://competitor.com/landing-page"
          style={{
            width: "100%", background: "#0a0f1a", border: "1px solid #1e2a3a",
            borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13,
            outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <button
        onClick={() => onGenerate({ niche, platform, angle, competitor })}
        disabled={loading}
        style={{
          width: "100%", padding: "13px 0", borderRadius: 10,
          background: loading ? "#1a2535" : "linear-gradient(90deg, #00e5a0, #00bfff)",
          color: loading ? "#4a6080" : "#0a0f1a",
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 800, fontSize: 15, border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.5, transition: "all 0.3s",
          boxShadow: loading ? "none" : "0 4px 24px #00e5a044",
        }}
      >
        {loading ? "⚙ Analyzing competitors & generating..." : "⚡ Generate Winning Ad Copy"}
      </button>
    </div>
  );
}

function GeneratedResult({ result, onSave }: { result: Ad | null; onSave: (ad: Ad) => void }) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;
  
  const copy = () => {
    navigator.clipboard.writeText(`${result.headline}\n\n${result.body}\n\n${result.cta}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div style={{
      background: "#0a0f1a",
      border: "1px solid #00e5a033",
      borderRadius: 16,
      padding: 24,
      marginTop: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, #00e5a0, #00bfff)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ScoreBadge score={result.score} />
          <PlatformTag platform={result.platform} />
          <span style={{ fontSize: 11, color: "#00e5a0", background: "#00e5a011", padding: "2px 8px", borderRadius: 4 }}>
            ✦ AI Generated
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={copy} style={{
            padding: "5px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
            border: "1px solid #1e2a3a", background: "transparent", color: "#7a9ab8",
          }}>{copied ? "✓ Copied" : "Copy"}</button>
          <button onClick={() => onSave(result)} style={{
            padding: "5px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
            border: "1px solid #00e5a055", background: "#00e5a011", color: "#00e5a0", fontWeight: 700,
          }}>Save Ad</button>
        </div>
      </div>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
        {result.headline}
      </div>
      <div style={{ color: "#7a9ab8", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
        {result.body}
      </div>
      <div style={{
        display: "inline-block",
        background: "linear-gradient(90deg, #00e5a022, #00bfff22)",
        border: "1px solid #00e5a044",
        borderRadius: 8, padding: "7px 16px",
        color: "#00e5a0", fontWeight: 700, fontSize: 13,
      }}>{result.cta}</div>

      {result.insights && (
        <div style={{ marginTop: 16, padding: "12px 14px", background: "#0d1117", borderRadius: 10, border: "1px solid #1e2a3a" }}>
          <div style={{ fontSize: 11, color: "#4a6080", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Why this wins</div>
          <div style={{ fontSize: 13, color: "#7a9ab8", lineHeight: 1.6 }}>{result.insights}</div>
        </div>
      )}
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<Ad | null>(null);
  const [savedAds, setSavedAds] = useState(SAVED_ADS);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const notify = (msg: string, type: string = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerate = async ({ niche, platform, angle, competitor }: any) => {
    setLoading(true);
    setGeneratedAd(null);

    // This is a mock response since Claude API requires an API key
    // Replace with your actual API call
    setTimeout(() => {
      const mockAd: Ad = {
        id: Date.now(),
        headline: `Stop Losing ${niche} Customers to Competitors`,
        body: `While you're reading this, your rivals are running ${platform} ads that convert at 4x your rate. Our AI reveals exactly what's working—hooks, angles, and offers—so you can launch winning ads in under 60 minutes.`,
        cta: "Steal Their Strategy →",
        platform: platform,
        niche: niche,
        score: Math.floor(Math.random() * 30) + 70,
        status: "draft",
        created: "just now",
        insights: `This ${angle} angle combined with ${platform}'s algorithm creates urgency and social proof simultaneously. Top performers in ${niche} see 2-3x CTR improvement.`,
      };
      setGeneratedAd(mockAd);
      setLoading(false);
    }, 1500);
  };

  const handleSave = (ad: Ad) => {
    setSavedAds(prev => [{ ...ad, status: "draft", created: "just now" }, ...prev]);
    notify("Ad saved to your library!");
    setActiveTab("library");
  };

  const tabs = [
    { id: "generate", label: "Generate", icon: "⚡" },
    { id: "library", label: "Library", icon: "📁", count: savedAds.length },
    { id: "competitors", label: "Spy", icon: "🔍" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060b14",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700,800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 4px; }
        select option { background: #0a0f1a; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ad-card:hover { border-color: #00e5a033 !important; transform: translateY(-1px); transition: all 0.2s; }
        .tab-btn:hover { color: #e2e8f0 !important; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: notification.type === "error" ? "#ff6b6b22" : "#00e5a022",
          border: `1px solid ${notification.type === "error" ? "#ff6b6b55" : "#00e5a055"}`,
          color: notification.type === "error" ? "#ff6b6b" : "#00e5a0",
          padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          animation: "fadeSlideIn 0.3s ease",
          boxShadow: "0 8px 32px #00000044",
        }}>{notification.msg}</div>
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: "#08111e",
        borderRight: "1px solid #0f1e2f",
        display: "flex", flexDirection: "column",
        padding: "24px 0",
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #00e5a0, #00bfff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, fontWeight: 900, color: "#060b14",
            }}>A</div>
            <div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1 }}>AdSpy AI</div>
              <div style={{ fontSize: 10, color: "#2a4060", letterSpacing: 1, textTransform: "uppercase" }}>Copy Killer</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {tabs.map(tab => (
            <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
              background: activeTab === tab.id ? "#00e5a011" : "transparent",
              color: activeTab === tab.id ? "#00e5a0" : "#4a6080",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              marginBottom: 4, textAlign: "left", transition: "color 0.2s",
              borderLeft: activeTab === tab.id ? "2px solid #00e5a0" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
              {tab.count && (
                <span style={{
                  marginLeft: "auto", background: "#0a1525", color: "#4a6080",
                  borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700,
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Credits */}
        <div style={{ padding: "16px 20px 0", borderTop: "1px solid #0f1e2f", marginTop: 12 }}>
          <div style={{ fontSize: 11, color: "#2a4060", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Credits</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#4a6080" }}>680 left</span>
            <span style={{ fontSize: 12, color: "#00e5a0", fontWeight: 700 }}>68%</span>
          </div>
          <div style={{ background: "#0f1e2f", borderRadius: 4, height: 4, overflow: "hidden" }}>
            <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg, #00e5a0, #00bfff)", borderRadius: 4 }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#2a4060" }}>Pro Plan · <span style={{ color: "#00bfff" }}>Upgrade</span></div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 220, padding: "28px 32px", maxWidth: "calc(100vw - 220px)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", margin: 0, lineHeight: 1 }}>
              {activeTab === "generate" && "Generate Ad Copy"}
              {activeTab === "library" && "Ad Library"}
              {activeTab === "competitors" && "Competitor Spy"}
              {activeTab === "analytics" && "Performance Analytics"}
            </h1>
            <p style={{ color: "#2a4060", fontSize: 13, margin: "6px 0 0" }}>
              {activeTab === "generate" && "Analyze competitors & generate winning ad copy"}
              {activeTab === "library" && "Your saved ad library"}
              {activeTab === "competitors" && "See what your competitors are running"}
              {activeTab === "analytics" && "Track your performance"}
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* Tab Content */}
  /div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
