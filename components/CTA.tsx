import Link from "next/link";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-base-200 py-24 w-full">
      {/* Glowing blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary opacity-20 blur-3xl" />

      <div className="relative text-center flex flex-col items-center w-full px-8">
        <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-6">
          Stop building, start shipping
        </h2>
        <p className="text-lg opacity-70 mb-10">
          Don&apos;t waste time integrating APIs or designing a pricing
          section. Ship your SaaS in days, not weeks.
        </p>
        <Link href="/signin" className="btn btn-primary btn-wide">
          Get {config.appName}
        </Link>
      </div>
    </section>
  );
};

export default CTA;
