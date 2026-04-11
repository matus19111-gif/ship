export default function InstallGuidePage() {
  const steps = [
    {
      icon: "◈",
      title: "Create a Project",
      desc: "Go to Projects → New Project. Give it a name and your website domain. You'll receive a unique API key.",
    },
    {
      icon: "↗",
      title: "Add the Script Tag",
      desc: 'Paste the widget script before the closing </body> tag on every page of your website. Set the data-api-key attribute to your project\'s API key.',
      code: `<script src="https://yourdomain.com/widget.js" data-api-key="pk_YOUR_KEY"></script>`,
    },
    {
      icon: "◎",
      title: "Send Events from Your Backend",
      desc: "When a user purchases or signs up, POST to /api/event from your server. Never call this from the browser — that would expose your API key.",
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
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
          Install Guide
        </h1>
        <p className="text-sm text-gray-500">Get the social proof widget running on your site in 5 minutes.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-[#13151f] border border-[#1e2130] rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e2130] flex items-center justify-center text-indigo-300 text-lg shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-0.5">Step {i + 1}</p>
                <p className="text-white font-semibold text-sm">{step.title}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.desc}</p>
            {step.code && (
              <pre className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4 text-indigo-300 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre">
                {step.code}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Support note */}
      <div className="mt-6 bg-indigo-950/30 border border-indigo-900/30 rounded-2xl p-5">
        <p className="text-indigo-300 font-semibold text-sm mb-1">💡 Need help?</p>
        <p className="text-gray-500 text-sm">
          Check your project&apos;s Install tab for a pre-filled version with your actual API key and curl test command.
        </p>
      </div>
    </div>
  );
}

