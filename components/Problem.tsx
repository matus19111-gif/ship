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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 md:w-10 md:h-10">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 md:w-10 md:h-10">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 md:w-10 md:h-10">
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
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      {/* SECTION: Large vertical padding (py-32) creates the purple background frame */}
      <section className="bg-[#4a00ff] text-neutral-content w-full py-20 md:py-32">
        
        {/* WRAPPER: px-0 makes it touch screen edges. mx-auto keeps it centered */}
        <div className="w-full px-6 flex justify-center">
          
          {/* WHITE BOX: w-full and rounded-none on mobile to hit the edges. 
              md:mx-8 adds a small gap on desktop to prevent it being TOO wide. */}
          <div className="bg-[#f9f8f4] w-full md:mx-8 lg:mx-12 rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden">
            
            {/* INNER CONTENT: Reduced py-10 to py-16 to keep the box slim/short */}
            <div className="px-6 py-12 md:px-16 md:py-16 lg:px-24 lg:py-20">
              
              {/* Heading: Centered with max-width to prevent long lines */}
              <h2 className="font-extrabold text-3xl md:text-5xl tracking-tight text-gray-900 mb-12 lg:mb-16 leading-tight text-center max-w-5xl mx-auto">
                Cold outreach{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 text-red-400">won&apos;t help</span>
                  <span
                    className="absolute inset-0 rounded-md"
                    style={{ background: "rgba(252,165,165,0.25)", transform: "skew(-2deg)" }}
                  />
                </span>{" "}
                you quickly acquire customers if you ...
              </h2>

              {/* Grid: Evenly distributed 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                {problems.map((problem, i) => (
                  <div key={i} className="flex flex-row items-center md:items-start gap-5 group">
                    {/* Icon Container */}
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${problem.iconBg}`}>
                      <span style={floatStyle(problem.delay)}>{problem.icon}</span>
                    </div>
                    {/* Text content */}
                    <div className="flex-1">
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {problem.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Problem;
