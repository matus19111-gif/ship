const Problem = () => {
  const problems = [
    {
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
    <section className="bg-[#4a00ffcc] text-neutral-content">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 flex flex-col items-center">
        {/* Card */}
        <div className="bg-white/95 rounded-3xl px-8 py-12 md:px-16 md:py-14 w-full max-w-5xl text-center shadow-xl">
          {/* Heading */}
          <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900 mb-10 md:mb-12">
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
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-6">
            {problems.map((problem, i) => (
              <div key={i} className="flex flex-row md:flex-col items-start md:items-start gap-4 flex-1 text-left">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${problem.iconBg}`}>
                  {problem.icon}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pt-1 md:pt-0">
                  {problem.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
