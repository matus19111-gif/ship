import React from "react";

const floatStyle = (delay: string): React.CSSProperties => ({
  animation: `floatIcon 3s ease-in-out infinite`,
  animationDelay: delay,
});

const Problem = () => {
  const problems = [
    {
      delay: "0s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <circle cx="18" cy="17" r="3" fill="currentColor" stroke="none" className="text-amber-500" />
          <path d="M18 15.5v1" stroke="white" strokeWidth="1.5" />
          <circle cx="18" cy="17.8" r="0.3" fill="white" stroke="none" />
        </svg>
      ),
      iconBg: "bg-amber-100 text-amber-500",
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
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
      text: (
        <>
          Spend hours <strong>manually</strong> personalizing your emails.
        </>
      ),
    },
    {
      delay: "2s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 8v4" />
          <circle cx="12" cy="14" r="0.5" fill="currentColor" />
        </svg>
      ),
      iconBg: "bg-purple-100 text-purple-500",
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
          0%, 100% { transform: translateY(0px) scale(1.5); }
          50%       { transform: translateY(-8px) scale(1.5); }
        }
      `}</style>

      <section className="bg-[#4a00ffcc] text-neutral-content">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-40 flex flex-col items-center">
          {/* Card */}
          <div className="bg-white/95 rounded-3xl px-10 py-14 md:px-24 md:py-20 w-full max-w-5xl text-center shadow-xl">
            {/* Heading */}
            <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight text-gray-900 mb-14 md:mb-16 leading-tight">
              Cold outreach{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-red-400">won&apos;t help</span>
                <span
                  className="absolute inset-0 rounded-md -z-0"
                  style={{ background: "rgba(252, 165, 165, 0.25)", transform: "skew(-2deg)" }}
                />
              </span>{" "}
              you quickly acquire customers if you ...
            </h2>

            {/* Problem items */}
            <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-10">
              {problems.map((problem, i) => (
                <div key={i} className="flex flex-row md:flex-col items-start gap-5 flex-1 text-left">
                  <div className={`shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center ${problem.iconBg}`}>
                    <span style={floatStyle(problem.delay)}>{problem.icon}</span>
                  </div>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed pt-1 md:pt-2">
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
