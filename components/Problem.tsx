const Problem = () => {
  return (
    <section className="bg-[#4a00ff] text-neutral-content">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
          80% of startups fail because founders never launch
        </h2>
        <p className="max-w-xl mx-auto text-lg opacity-90 leading-relaxed mb-12 md:mb-20">
          Emails, DNS records, user authentication... There&apos;s so much going
          on.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          <Step emoji="🧑‍💻" text="8 hrs to add Stripe" />

          <Arrow extraStyle="max-md:-scale-x-100 md:-rotate-90" />

          <Step emoji="😮‍💨" text="Struggle to find time" />

          <Arrow extraStyle="md:-scale-x-100 md:-rotate-90" />

          <Step emoji="😔" text="Quit project" />
        </div>
      </div>
    </section>
  );
};
