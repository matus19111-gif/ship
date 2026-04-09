const Arrow = ({ extraStyle }: { extraStyle: string }) => {
  return (
    <svg
      className={`shrink-0 w-12 fill-neutral-content opacity-70 ${extraStyle}`}
      viewBox="0 0 138 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.330 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"
        />
      </g>
    </svg>
  );
};

const Step = ({ emoji, text }: { emoji: string; text: string }) => {
  return (
    <div className="w-full md:w-48 flex flex-col gap-2 items-center justify-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-bold">{text}</h3>
    </div>
  );
};

interface PainPointProps {
  icon: React.ReactNode;
  iconBg: string;
  text: React.ReactNode;
}

const PainPoint = ({ icon, iconBg, text }: PainPointProps) => {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <p className="text-gray-500 text-sm leading-relaxed pt-1">{text}</p>
    </div>
  );
};

const Problem = () => {
  return (
    <section className="bg-[#4a00ffcc] text-neutral-content">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        {/* Main headline */}
        <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
          80% of startups fail because founders never launch
        </h2>
        <p className="max-w-xl mx-auto text-lg opacity-90 leading-relaxed mb-12 md:mb-20">
          Emails, DNS records, user authentication... There&apos;s so much going
          on.
        </p>

        {/* Steps row */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 mb-16 md:mb-24">
          <Step emoji="🧑‍💻" text="8 hrs to add Stripe" />
          <Arrow extraStyle="max-md:-scale-x-100 md:-rotate-90" />
          <Step emoji="😮‍💨" text="Struggle to find time" />
          <Arrow extraStyle="md:-scale-x-100 md:-rotate-90" />
          <Step emoji="😔" text="Quit project" />
        </div>

        {/* Pain-point card — mirrors the uploaded image */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl px-8 py-10 text-left shadow-2xl">
          <h3 className="text-center text-gray-900 font-extrabold text-2xl md:text-3xl tracking-tight mb-8">
            Cold outreach{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#e06060]">won&apos;t help</span>
              <span
                className="absolute inset-0 rounded-md -z-0"
                style={{ background: "rgba(224,96,96,0.15)" }}
              />
            </span>{" "}
            you quickly acquire customers if you …
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pain point 1 */}
            <PainPoint
              iconBg="bg-amber-50"
              icon={
                <svg
                  className="w-6 h-6 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <circle cx="17" cy="17" r="4" fill="currentColor" stroke="none" className="text-amber-400" />
                  <path d="M17 15v2l1 1" strokeWidth={1.5} />
                </svg>
              }
              text={
                <>
                  Have no idea if your list of{" "}
                  <strong className="text-gray-700">
                    email addresses is reliable.
                  </strong>
                </>
              }
            />

            {/* Pain point 2 */}
            <PainPoint
              iconBg="bg-gray-100"
              icon={
                <svg
                  className="w-6 h-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 2C8 2 5 5.5 5 9c0 5 7 13 7 13s7-8 7-13c0-3.5-3-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              }
              text={
                <>
                  Spend hours{" "}
                  <strong className="text-gray-700">manually</strong>{" "}
                  personalizing your emails.
                </>
              }
            />

            {/* Pain point 3 */}
            <PainPoint
              iconBg="bg-purple-50"
              icon={
                <svg
                  className="w-6 h-6 text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={3} />
                </svg>
              }
              text={
                <>
                  Wonder if your emails are{" "}
                  <strong className="text-gray-700">getting delivered</strong>{" "}
                  at all.
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
