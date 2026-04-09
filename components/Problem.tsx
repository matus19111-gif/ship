import React from "react";

const floatStyle = (delay: string): React.CSSProperties => ({
  animation: `floatIcon 3s ease-in-out infinite`,
  animationDelay: delay,
  display: "inline-flex",
});

const Problem = () => {
  const problems = [
    {
      delay: "0s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <circle cx="18" cy="17" r="3" fill="currentColor" stroke="none" className="text-amber-500" />
          <path d="M18 15.5v1" stroke="white" strokeWidth="1.5" />
          <circle cx="18" cy="17.8" r="0.3" fill="white" stroke="none" />
        </svg>
      ),
      iconBg: "bg-amber-100 text-amber-500",
      label: "Unreliable list",
      text: (
        <>
          Have no idea if your list of{" "}
          <strong>email addresses is reliable.</strong>
        </>
      ),
    },
    {
      delay: "1s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" className="text-gray-400" />
          <path d="M16 14.5v1" stroke="white" strokeWidth="1.5" />
          <circle cx="16" cy="16.8" r="0.3" fill="white" stroke="none" />
        </svg>
      ),
      iconBg: "bg-gray-100 text-gray-400",
      label: "Manual work",
      text: (
        <>
          Spend hours <strong>manually</strong> personalizing your emails.
        </>
      ),
    },
    {
      delay: "2s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 8v4" />
          <circle cx="12" cy="14" r="0.5" fill="currentColor" />
        </svg>
      ),
      iconBg: "bg-purple-100 text-purple-500",
      label: "Delivery doubts",
      text: (
        <>
          Wonder if your emails are <strong>getting delivered</strong> at all.
        </>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

      <section className="bg-[#4a00ffcc] text-neutral-content">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
          {/* Card — full width, no max-w cap so it stretches */}
          <div className="bg-white/95 rounded-3xl px-10 py-16 md:px-20 md:py-20 w-full shadow-2xl">

            {/* Heading */}
            <h2 className="font-extrabold text-4xl md:text-6xl tracking-tight text-gray-900 mb-16 md:mb-20 leading-tight text-center">
              Cold outreach{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-red-400">won&apos;t help</span>
                <span
                  className="absolute inset-0 rounded-md"
                  style={{ background: "rgba(252,165,165,0.25)", transform: "skew(-2deg)" }}
                />
              </span>{" "}
              you quickly acquire customers if you&nbsp;...
            </h2>

            {/* Problem rows — icon left, text right */}
            <div className="flex flex-col gap-10 md:gap-8">
              {problems.map((problem, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center gap-8 md:gap-12 p-6 md:p-8 rounded-2xl bg-gray-50"
                >
                  {/* Icon box */}
                  <div className={`shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center ${problem.iconBg}`}>
                    <span style={floatStyle(problem.delay)}>{problem.icon}</span>
                  </div>

                  {/* Text */}
                  <p className="text-gray-700 text-xl md:text-2xl leading-relaxed font-medium">
                    {problem.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Problem;
