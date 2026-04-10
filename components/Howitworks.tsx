"use client";

import { useState, useEffect } from "react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: "01",
      label: "Step One",
      title: "Sign up in seconds",
      description: "Create your Gojiberry account and you're in. No credit card required.",
      visual: <SignupVisual />,
    },
    {
      number: "02",
      label: "Step Two",
      title: "Pick your signals",
      description:
        "AI Agents track buyers engaging with content, competitors, influencers \u2014 or signals like funding rounds, new roles, events, and groups.",
      visual: <SignalsVisual />,
    },
    {
      number: "03",
      label: "Step Three",
      title: "Launch your outreach",
      description:
        "AI sends smart, personalized LinkedIn messages that convert \u2014 so you can focus on closing, not prospecting.",
      visual: <OutreachVisual />,
    },
  ];

  return (
    <section style={s.section}>
      <style>{css}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.badge}>
          <span style={s.badgeDot} />
          <span style={s.badgeText}>How it works</span>
        </div>
        <h2 style={s.heading}>
          Get started with our{" "}
          <span style={s.headingAccent}>simple 3\u2011step process</span>
        </h2>
        <p style={s.subheading}>From signup to first reply in under 10 minutes.</p>
      </div>

      {/* Steps */}
      <div style={s.stepsWrap}>
        {steps.map((step, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveStep(i)}
            style={{
              ...s.row,
              flexDirection: i % 2 === 1 ? "row-reverse" : "row",
              opacity: activeStep === i ? 1 : 0.52,
              transform: activeStep === i ? "scale(1)" : "scale(0.985)",
              boxShadow:
                activeStep === i
                  ? "0 20px 60px rgba(74,0,255,0.08), 0 4px 16px rgba(0,0,0,0.04)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            {/* Text */}
            <div style={s.textSide}>
              <div style={s.stepNumRow}>
                <span style={s.stepNum}>{step.number}</span>
                <div
                  style={{
                    ...s.stepLine,
                    background:
                      activeStep === i
                        ? "linear-gradient(90deg, #4a00ff, transparent)"
                        : "#ebebeb",
                  }}
                />
              </div>
              <p style={{ ...s.stepLabel, color: activeStep === i ? "#4a00ff" : "#bbb" }}>
                {step.label}
              </p>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.description}</p>
              {activeStep === i && (
                <div style={s.activePill}>
                  <span style={s.activeDot} className="pulse-dot" />
                  <span style={s.activeText}>Currently viewing</span>
                </div>
              )}
            </div>

            {/* Visual */}
            <div style={s.visualSide}>
              <div
                style={{
                  ...s.card,
                  borderColor:
                    activeStep === i ? "rgba(74,0,255,0.14)" : "rgba(0,0,0,0.06)",
                  boxShadow:
                    activeStep === i
                      ? "0 24px 64px rgba(74,0,255,0.1), 0 4px 16px rgba(0,0,0,0.04)"
                      : "none",
                }}
              >
                {step.visual}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={s.dotsRow}>
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            style={{
              ...s.dot,
              background: activeStep === i ? "#4a00ff" : "#e0e0e0",
              width: activeStep === i ? 32 : 8,
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* \u2500\u2500 Signup Mockup \u2500\u2500 */
function SignupVisual() {
  return (
    <div>
      <p style={mv.cardTitle}>Create your account</p>
      {[
        { emoji: "\ud83d\udc64", label: "Full name" },
        { emoji: "\u2709\ufe0f", label: "Email address" },
        { emoji: "\ud83d\udd12", label: "Password" },
      ].map((f) => (
        <div key={f.label} style={mv.field}>
          <span style={{ fontSize: 13 }}>{f.emoji}</span>
          <span style={mv.fieldPlaceholder}>{f.label}</span>
        </div>
      ))}
      <div style={mv.primaryBtn}>Sign up \u2014 it&apos;s free \u2192</div>
      <p style={mv.hint}>No credit card \u00b7 Cancel anytime</p>
    </div>
  );
}

/* \u2500\u2500 Signals Mockup \u2500\u2500 */
function SignalsVisual() {
  const chips = [
    { e: "\ud83d\udcb0", l: "Funding rounds", bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
    { e: "\ud83d\ude80", l: "New roles", bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
    { e: "\ud83d\udcc5", l: "Events", bg: "#faf5ff", border: "#e9d5ff", color: "#7c3aed" },
    { e: "\u2694\ufe0f", l: "Competitors", bg: "#fff7ed", border: "#fed7aa", color: "#c2410c" },
    { e: "\ud83d\udc65", l: "Groups", bg: "#fdf4ff", border: "#f5d0fe", color: "#a21caf" },
    { e: "\ud83d\udce2", l: "Content", bg: "#f0f9ff", border: "#bae6fd", color: "#0369a1" },
  ];
  return (
    <div>
      <div style={mv.signalHeader}>
        <div style={mv.signalIconBox}>\ud83c\udfaf</div>
        <div>
          <p style={mv.cardTitle}>Choose your signals</p>
          <p style={mv.signalSub}>AI tracks these in real-time</p>
        </div>
      </div>
      <div style={mv.chipGrid}>
        {chips.map((c) => (
          <div
            key={c.l}
            style={{
              ...mv.chip,
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.color,
            }}
          >
            <span>{c.e}</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{c.l}</span>
          </div>
        ))}
      </div>
      <div style={mv.signalFooter}>
        <span style={{ ...mv.dot8, background: "#22c55e" }} />
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Tracking 3 signals \u00b7 240 prospects
        </span>
      </div>
    </div>
  );
}

/* \u2500\u2500 Outreach Mockup \u2500\u2500 */
function OutreachVisual() {
  const rows = [
    { icon: "\ud83c\udfe2", name: "Campaign A", rate: 18, trend: "+2%", accent: false },
    { icon: "\u2b50", name: "Campaign B", rate: 27, trend: "+5%", accent: false },
    { icon: "\u26a1", name: "Campaign C", rate: 31, trend: "+8%", accent: true },
  ];
  return (
    <div>
      <div style={mv.outreachHead}>
        <p style={mv.cardTitle}>Live Campaigns</p>
        <span style={mv.liveBadge}>\u25cf Live</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          style={{
            ...mv.campaignRow,
            borderLeft: r.accent ? "3px solid #4a00ff" : "3px solid transparent",
            background: r.accent ? "#faf8ff" : "#f9fafb",
          }}
        >
          <div style={mv.campaignIcon}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <p style={mv.campaignName}>{r.name}</p>
            <div style={mv.barTrack}>
              <div
                style={{
                  ...mv.barFill,
                  width: `${r.rate * 3}%`,
                  background: r.accent
                    ? "linear-gradient(90deg,#4a00ff,#7c3aed)"
                    : "#e5e7eb",
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...mv.rateNum, color: r.accent ? "#4a00ff" : "#374151" }}>
              {r.rate}%
            </p>
            <p style={mv.trendText}>{r.trend}</p>
          </div>
        </div>
      ))}
      <div style={mv.outreachFooter}>
        <span style={mv.aiChip}>\u2726 AI</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          24 messages sent \u00b7 7 replies today
        </span>
      </div>
    </div>
  );
}

/* \u2500\u2500\u2500 Styles \u2500\u2500\u2500 */
const s: { [key: string]: React.CSSProperties } = {
  section: {
    background: "#ffffff",
    padding: "96px 24px 72px",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto 64px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(74,0,255,0.05)",
    border: "1px solid rgba(74,0,255,0.18)",
    borderRadius: 999,
    padding: "5px 14px 5px 10px",
    marginBottom: 20,
  },
  badgeDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4a00ff",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#4a00ff",
    letterSpacing: "0.04em",
  },
  heading: {
    fontSize: "clamp(30px, 5vw, 46px)",
    fontWeight: 800,
    color: "#0f0f0f",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    margin: "0 0 16px",
  },
  headingAccent: { color: "#4a00ff" },
  subheading: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 1.65,
    margin: 0,
  },
  stepsWrap: {
    maxWidth: 1040,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 52,
    padding: "40px 44px",
    background: "#fafafa",
    borderRadius: 22,
    border: "1px solid rgba(0,0,0,0.055)",
    cursor: "default",
    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
  },
  textSide: { flex: "0 0 38%" },
  stepNumRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 800,
    color: "#d1d5db",
    letterSpacing: "0.12em",
  },
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    transition: "background 0.4s ease",
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    margin: "0 0 10px",
    transition: "color 0.3s ease",
  },
  stepTitle: {
    fontSize: "clamp(19px, 2.5vw, 25px)",
    fontWeight: 750,
    color: "#0f0f0f",
    margin: "0 0 10px",
    letterSpacing: "-0.02em",
    lineHeight: 1.25,
  },
  stepDesc: {
    fontSize: 14.5,
    color: "#6b7280",
    lineHeight: 1.7,
    margin: "0 0 14px",
  },
  activePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  activeDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#4a00ff",
  },
  activeText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4a00ff",
  },
  visualSide: { flex: 1 },
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid",
    padding: "24px 22px",
    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
  },
  dotsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 44,
  },
  dot: {
    height: 8,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s ease",
  },
};

const mv: { [key: string]: React.CSSProperties } = {
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#0f0f0f", margin: "0 0 14px" },
  field: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 8,
  },
  fieldPlaceholder: { fontSize: 13, color: "#9ca3af" },
  primaryBtn: {
    background: "#4a00ff",
    color: "#fff",
    borderRadius: 10,
    padding: "13px",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: "0.01em",
  },
  hint: { textAlign: "center", fontSize: 11, color: "#9ca3af", margin: "10px 0 0" },
  signalHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  signalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "linear-gradient(135deg,#6d28d9,#4a00ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  signalSub: { fontSize: 11, color: "#9ca3af", margin: "2px 0 0" },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  },
  signalFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid #f3f4f6",
  },
  dot8: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  outreachHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  liveBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: "#16a34a",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 999,
    padding: "3px 10px",
  },
  campaignRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 8,
    transition: "all 0.3s ease",
  },
  campaignIcon: {
    width: 32,
    height: 32,
    fontSize: 16,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  campaignName: { fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 5px" },
  barTrack: { height: 4, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 999, transition: "width 0.6s ease" },
  rateNum: { fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 },
  trendText: {
    fontSize: 10,
    color: "#16a34a",
    fontWeight: 600,
    margin: "2px 0 0",
    textAlign: "right",
  },
  outreachFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid #f3f4f6",
  },
  aiChip: {
    fontSize: 10,
    fontWeight: 700,
    color: "#4a00ff",
    background: "rgba(74,0,255,0.06
