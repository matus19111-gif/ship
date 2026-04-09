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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      iconBg: "bg-amber-100 text-amber-500",
      text: (
        <>
          Have no idea if your list of <strong>email addresses is reliable.</strong>
        </>
      ),
    },
    {
      delay: "1s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M5 22h14" /><path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      ),
      iconBg: "bg-gray-100 text-gray-400",
      text: (
        <>
          <strong>Spend hours manually</strong> personalizing your emails.
        </>
      ),
    },
    {
      delay: "2s",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      <section className="bg-[#4a00ffcc] text-neutral-content">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-40 flex justify-center">

          {/* Card */}
          <div className="bg-[#f9f8f4] rounded-3xl px-12 py-14 md:px-20 md:py-18 w-full max-w-6xl shadow-xl">

            {/* Heading */}
            <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight text-gray-900 mb-12 leading-snug text-center">
              Cold outreach{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-red-400">won&apos;t help</span>
                <span
                  className="absolute inset-0 rounded-md"
                  style={{ background: "rgba(252,165,165,0.3)", transform: "skew(-1deg)" }}
                />
              </span>{" "}
              you quickly acquire customers if you ...
            </h2>

            {/* 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {problems.map((problem, i) => (
                <div key={i} className="flex flex-row items-start gap-5">
                  {/* Icon */}
                  <div className={`shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${problem.iconBg}`}>
                    <span style={floatStyle(problem.delay)}>{problem.icon}</span>
                  </div>
                  {/* Text */}
                  <p className="text-gray-500 text-base leading-relaxed">
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
