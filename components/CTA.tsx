const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-base-200 py-24">
      {/* Glowing blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary opacity-20 rounded-full blur-3xl" />

      <div className="relative text-center flex flex-col items-center max-w-xl mx-auto px-8">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
          Boost your app, launch, earn
        </h2>
        <p className="text-lg opacity-70 mb-12 md:mb-16">
          Don&apos;t waste time integrating APIs or designing a pricing section...
        </p>
        <button className="btn btn-primary btn-wide">
          Get {config.appName}
        </button>
      </div>
    </section>
  );
