/* eslint-disable @next/next/no-img-element */
import React from "react";

const problems = [
  {
    title: "Weeks of boilerplate code",
    description: "Auth, payments, emails, database – you've built the same thing 5 times. Each project takes 2-3 weeks just to set up basics.",
    styles: "bg-primary text-primary-content",
    icon: "⏱️",
    demo: (
      <div className="overflow-hidden h-full flex items-stretch">
        <div className="w-full translate-x-12 bg-base-200 rounded-t-box h-full p-6">
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span className="badge badge-primary">Time wasted: ~120 hours</span>
            </div>
            <div className="bg-base-100 p-4 rounded-box border-l-4 border-primary">
              <p className="font-mono text-sm">"Why am I writing JWT refresh logic again?"</p>
            </div>
            <div className="bg-base-100 p-4 rounded-box border-l-4 border-secondary">
              <p className="font-mono text-sm">"Which payment webhook endpoint was that?"</p>
            </div>
            <div className="bg-base-100 p-4 rounded-box border-l-4 border-accent">
              <p className="font-mono text-sm">"I just want to build my idea, not configure NextAuth"</p>
            </div>
            <button className="btn btn-sm btn-primary w-full">ShipFast solves this →</button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Emails landing in spam",
    description: "Your transactional emails go to junk. DNS configuration (DKIM, DMARC, SPF) feels like ancient magic.",
    styles: "md:col-span-2 bg-base-300 text-base-content",
    icon: "📧",
    demo: (
      <div className="px-6 max-w-[600px] flex flex-col gap-4 overflow-hidden">
        {[
          {
            before: "❌ welcome@random-provider.com",
            after: "✅ hello@yourapp.com",
            status: "✓ DKIM verified",
            transition: "group-hover:-mt-24 duration-500",
          },
          {
            before: "📁 Lands in Promotions tab",
            after: "📥 Lands in Primary Inbox",
            status: "✓ SPF + DMARC passed",
          },
          {
            before: "⏳ 3 hours of DNS wrestling",
            after: "⚡ Ready in 5 minutes",
            status: "✓ Pre-configured",
          },
        ].map((item, i) => (
          <div
            className={`p-4 bg-base-100 rounded-box transition-all ${item?.transition || ""}`}
            key={i}
          >
            <p className="font-mono text-sm line-through opacity-60">{item.before}</p>
            <p className="font-semibold text-lg mt-1">{item.after}</p>
            <p className="text-xs text-primary mt-2">{item.status}</p>
          </div>
        ))}
        <div className="text-center text-sm text-base-content/60 mt-2 pt-2 border-t border-base-content/10">
          ⏱️ Time saved: ~3 hours of setup
        </div>
      </div>
    ),
  },
  {
    title: "SEO is an afterthought",
    description: "Metadata, sitemaps, OG images – you'll fix it 'later' but later never comes. Your startup stays invisible.",
    styles: "md:col-span-2 bg-base-100 text-base-content",
    icon: "🔍",
    demo: (
      <div className="flex left-0 w-full h-full pt-0 lg:pt-8 overflow-hidden -mt-4">
        <div className="flex flex-col gap-3 w-full px-6">
          <div className="bg-base-200 p-4 rounded-box">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm">/app/layout.tsx</span>
              <span className="badge badge-primary">SEO ready</span>
            </div>
            <pre className="text-xs overflow-x-auto bg-base-300 p-3 rounded">
              {`export const metadata = {
  title: 'ShipFast - Launch in days',
  description: 'Stop rebuilding auth & payments',
  openGraph: {
    images: ['https://yourapp.com/og.png']
  }
}`}
            </pre>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["✅ Auto-generated sitemap", "✅ Robots.txt", "✅ JSON-LD structured data", "✅ Open Graph tags"].map(feature => (
              <span key={feature} className="badge badge-outline text-xs">{feature}</span>
            ))}
          </div>
          <div className="text-center text-xs text-base-content/50">
            ⚡ No extra work. Ships with every page.
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Pricing pages take forever",
    description: "Stripe integration, webhooks, subscription tiers – days of work just to start charging customers.",
    styles: "bg-neutral text-neutral-content",
    icon: "💳",
    demo: (
      <div className="text-neutral-content px-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Starter", price: "$149", popular: false, features: ["Basic features", "Community support"] },
            { name: "Advanced", price: "$299", popular: true, features: ["Everything +", "24/7 support", "1 year updates"] },
          ].map((plan) => (
            <div key={plan.name} className={`p-4 rounded-box ${plan.popular ? "bg-primary text-primary-content" : "bg-neutral-content text-neutral"}`}>
              <p className="font-bold text-sm">{plan.name}</p>
              <p className="text-2xl font-black">{plan.price}</p>
              <p className="text-xs opacity-80">one-time</p>
              {plan.popular && <span className="badge badge-sm mt-2">🔥 Most popular</span>}
              <ul className="text-xs mt-3 space-y-1">
                {plan.features.map(f => <li key={f}>✓ {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-sm opacity-80 bg-neutral-content/10 p-2 rounded">
          ⚡ Copy-paste into your project. Change colors in 2 minutes.
        </div>
      </div>
    ),
  },
];

const ProblemsGrid = () => {
  return (
    <section className="flex justify-center items-center w-full bg-base-200/50 text-base-content py-20 lg:py-32">
      <div className="flex flex-col max-w-[82rem] gap-16 md:gap-20 px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="badge badge-primary mb-4">Stop Wasting Time</span>
          <h2 className="font-black text-4xl md:text-6xl tracking-[-0.01em] mb-4">
            Building a SaaS shouldn't mean{" "}
            <span className="underline decoration-dashed underline-offset-8 decoration-red-500">
              rebuilding everything
            </span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Every founder wastes weeks on the same boilerplate. Here's what you're really spending time on:
          </p>
        </div>

        {/* Problems grid */}
        <div className="flex flex-col w-full h-fit gap-4 lg:gap-10 text-text-default max-w-[82rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className={`${problem.styles} rounded-3xl flex flex-col gap-6 w-full h-[22rem] lg:h-[25rem] pt-6 overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="px-6 space-y-2">
                  <div className="text-4xl">{problem.icon}</div>
                  <h3 className="font-bold text-xl lg:text-2xl tracking-tight">
                    {problem.title}
                  </h3>
                  <p className="opacity-80 text-sm">{problem.description}</p>
                </div>
                {problem.demo}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="inline-block bg-base-300 rounded-full px-6 py-3">
            <code className="text-primary font-mono text-lg">
              const launch_time = "Today"; // Not "next month"
            </code>
          </div>
          <p className="text-base-content/60 mt-4 text-sm">
            Join 500+ founders who shipped their SaaS in days, not weeks
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemsGrid;
