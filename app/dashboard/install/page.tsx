export default function InstallGuidePage() {
  const steps = [
    {
      icon: "◈",
      title: "Create a Project",
      desc: "Go to Projects → New Project. Give it a name and your website domain. You'll receive a unique API key.",
      color: "#4f6ef7",
      bg: "#e0e7ff",
    },
    {
      icon: "↗",
      title: "Add the Script Tag",
      desc: 'Paste the widget script before the closing </body> tag on every page of your website. Set the data-api-key attribute to your project\'s API key.',
      color: "#10b981",
      bg: "#d1fae5",
      code: `<script src="https://yourdomain.com/widget.js" data-api-key="pk_YOUR_KEY"></script>`,
    },
    {
      icon: "◎",
      title: "Send Events from Your Backend",
      desc: "When a user purchases or signs up, POST to /api/event from your server. Never call this from the browser — that would expose your API key.",
      color: "#f59e0b",
      bg: "#fef3c7",
      code: `fetch('https://yourdomain.com/api/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'pk_YOUR_KEY',
    type: 'purchase',      // purchase | signup | pageview | custom
    name: 'Ahmed',         // optional
    city: 'Dhaka',         // optional
    product: 'Pro Plan'    // optional
  })
})`,
    },
    {
      icon: "▦",
      title: "Customize the Widget",
      desc: "Go to your project → Settings tab. Adjust theme (light/dark), position (bottom-left/right), delays, and which event types to display.",
      color: "#8b5cf6",
      bg: "#ede9fe",
    },
  ];

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-[22px]" style={{ color: "#1a1d2e" }}>
          Install Guide
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Get the social proof widget running on your site in 5 minutes.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold"
                style={{ background: step.bg, color: step.color }}
              >
                {step.icon}
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: "#b0b7c3" }}
                >
                  Step {i + 1}
                </p>
                <p className="font-semibold text-sm" style={{ color: "#1a1d2e" }}>{step.title}</p>
              </div>
              <div
                className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: step.bg, color: step.color }}
              >
                {i + 1}
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#6b7280" }}>{step.desc}</p>
            {step.code && (
              <pre
                className="rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre"
                style={{ background: "#f8f9fc", color: "#4f6ef7", border: "1px solid #e5e7eb" }}
              >
                {step.code}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Help note */}
      <div
        className="mt-6 rounded-2xl p-5"
        style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#4f6ef7" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: "#1d4ed8" }}>💡 Need help?</p>
            <p className="text-sm" style={{ color: "#3b82f6" }}>
              Check your project&apos;s Install tab for a pre-filled version with your actual API key and curl test command.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
