// HowItWorks.jsx
// Drop this component into your ShipFast/Next.js project.
// Matches your site's dark bg, lime accent, and font style.

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      label: "Step One",
      title: "Sign up in seconds",
      description: "Create your Gojiberry account and you're in.",
      mockup: <SignupMockup />,
    },
    {
      number: "02",
      label: "Step Two",
      title: "Pick your signals",
      description:
        "AI Agents track buyers engaging with content, competitors, influencers — or signals like funding rounds, new roles, events, and groups.",
      mockup: <SignalsMockup />,
    },
    {
      number: "03",
      label: "Step Three",
      title: "Launch your outreach",
      description: "AI sends smart LinkedIn messages that convert.",
      mockup: <OutreachMockup />,
    },
  ];

  return (
    <section className="how-it-works">
      <style>{`
        .how-it-works {
          background: #0d0d0d;
          padding: 96px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .hiw-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .hiw-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 0, 255, 0.10);
          border: 1px solid rgba(74, 0, 255, 0.30);
          border-radius: 999px;
          padding: 5px 14px 5px 8px;
          margin-bottom: 24px;
        }

        .hiw-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4a00ff;
        }

        .hiw-badge span {
          font-size: 13px;
          color: #4a00ff;
        }

        .hiw-heading {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #f5f5f0;
          line-height: 1.1;
          margin: 0 0 64px;
          letter-spacing: -0.03em;
        }

        .hiw-heading em {
          font-style: normal;
          color: #4a00ff;
        }

        .hiw-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .hiw-step {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 56px 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative;
        }

        .hiw-step:last-child {
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .hiw-step:nth-child(even) .hiw-step-content {
          order: 2;
        }

        .hiw-step:nth-child(even) .hiw-step-visual {
          order: 1;
        }

        .hiw-step-num {
          font-size: 80px;
          font-weight: 900;
          color: rgba(74, 0, 255, 0.12);
          line-height: 1;
          letter-spacing: -0.05em;
          margin-bottom: -8px;
          font-variant-numeric: tabular-nums;
        }

        .hiw-step-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a00ff;
          margin-bottom: 12px;
        }

        .hiw-step-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: #f5f5f0;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .hiw-step-desc {
          font-size: 16px;
          color: #888;
          line-height: 1.65;
          margin: 0;
          max-width: 380px;
        }

        .hiw-step-visual {
          display: flex;
          justify-content: center;
        }

        .hiw-card {
          background: #161616;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        /* Signup mockup */
        .mock-input {
          background: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 10px;
          font-size: 13px;
          color: #555;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mock-icon {
          width: 14px;
          height: 14px;
          opacity: 0.4;
        }

        .mock-btn {
          background: #4a00ff;
          color: #fff;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
          margin-top: 4px;
          letter-spacing: 0.01em;
        }

        /* Signals mockup */
        .mock-logo-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 20px 0 24px;
        }

        .mock-logo-chip {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #222;
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .mock-tag-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .mock-tag {
          background: rgba(74,0,255,0.08);
          border: 1px solid rgba(74,0,255,0.2);
          color: #4a00ff;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
        }

        /* Outreach mockup */
        .mock-campaign {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .mock-campaign-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #252525;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .mock-campaign-name {
          font-size: 13px;
          font-weight: 600;
          color: #e0e0e0;
        }

        .mock-campaign-rate {
          font-size: 11px;
          color: #555;
          margin-top: 2px;
        }

        .mock-campaign-rate span {
          color: #4a00ff;
          font-weight: 600;
        }

        @media (max-width: 720px) {
          .hiw-step {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .hiw-step:nth-child(even) .hiw-step-content,
          .hiw-step:nth-child(even) .hiw-step-visual {
            order: unset;
          }
          .hiw-step-num {
            font-size: 56px;
          }
        }
      `}</style>

      <div className="hiw-inner">
        <div className="hiw-badge">
          <div className="hiw-badge-dot" />
          <span>How it works</span>
        </div>

        <h2 className="hiw-heading">
          Get started with our <em>simple<br />3 step process</em>
        </h2>

        <div className="hiw-steps">
          {steps.map((step) => (
            <div className="hiw-step" key={step.number}>
              <div className="hiw-step-content">
                <div className="hiw-step-num">{step.number}</div>
                <div className="hiw-step-label">{step.label}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>
              <div className="hiw-step-visual">
                <div className="hiw-card">{step.mockup}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignupMockup() {
  return (
    <div>
      {["👤 Your name", "✉️ Email address", "🔒 Password", "🔒 Retype password"].map(
        (field) => (
          <div className="mock-input" key={field}>
            <span style={{ fontSize: 13, color: "#444" }}>{field}</span>
          </div>
        )
      )}
      <div className="mock-btn">Sign In</div>
    </div>
  );
}

function SignalsMockup() {
  const icons = ["🔗", "🪟", "👤", "💼", "📈", "in"];
  return (
    <div>
      <div
        style={{
          width: 56,
          height: 56,
          background: "linear-gradient(135deg, #7c3aed, #4a00ff)",
          borderRadius: 14,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        🎯
      </div>
      <div className="mock-logo-grid">
        {icons.map((ic) => (
          <div className="mock-logo-chip" key={ic}>
            <span style={{ fontSize: 15 }}>{ic}</span>
          </div>
        ))}
      </div>
      <div className="mock-tag-row">
        {["Funding rounds", "New roles", "Events", "Competitors"].map((t) => (
          <span className="mock-tag" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function OutreachMockup() {
  const campaigns = [
    { icon: "🏢", name: "Campaign A", rate: "18%" },
    { icon: "⭐", name: "Campaign B", rate: "27%" },
    { icon: "⚡", name: "Campaign C", rate: "31%" },
  ];
  return (
    <div>
      {campaigns.map((c) => (
        <div className="mock-campaign" key={c.name}>
          <div className="mock-campaign-icon">{c.icon}</div>
          <div>
            <div className="mock-campaign-name">{c.name}</div>
            <div className="mock-campaign-rate">
              Reply Rate · <span>{c.rate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

