import Image from "next/image";
import Link from "next/link";
import config from "@/config";
import heroImage from "/app/dashboard.png";
import heroImageDark from "/app/dashboard.png";
import trust1 from "/app/trust1.png";
import trust2 from "/app/trust 2.png";
import trust3 from "/app/trust 3.png";
import trust4 from "/app/trust 4.png";
import trust5 from "/app/trust 5.png";
import trust6 from "/app/trust 6.png";
import trust7 from "/app/trust 7.png";

const trustLogos = [trust1, trust2, trust3, trust4, trust5, trust6, trust7];

const Hero = () => {
  return (
    <section className="relative max-w-full overflow-x-hidden">
      {/* Finta-style #4a00ff radial glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(74, 0, 255, 0.30) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-16 text-center">
        {/* Announcement badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <span className="size-2 w-2 h-2 rounded-full bg-primary inline-block" />
              New:
            </span>
            <span className="font-medium opacity-80">
              The fastest way to launch your SaaS
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight lg:text-7xl">
          Ship your startup in{" "}
          <span className="text-primary">days</span>, not weeks
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-xl text-lg opacity-70 leading-relaxed">
          {config.appDescription}. Stop wasting time on boilerplate — focus on
          what makes your product unique.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signin" className="btn btn-primary btn-wide">
            Get started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <a href="/#how-it-works" className="btn btn-ghost btn-wide">
            How it works
          </a>
        </div>

        {/* Social proof avatars */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=96&h=96&fit=crop&auto=format",
            ].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Happy customer ${i + 1}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-base-100 object-cover"
              />
            ))}
          </div>
          <p className="text-sm opacity-60">
            <span className="font-semibold text-primary">500+</span> founders
            already shipped their SaaS
          </p>
          <div className="flex gap-1 text-warning">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-16">
          <div className="rounded-2xl border border-base-content/10 shadow-2xl overflow-hidden">
            <Image
              src={heroImage}
              alt={`${config.appName} product screenshot`}
              className="w-full"
              priority={true}
              placeholder="blur"
            />
          </div>
        </div>

        {/* Trust section with rolling logos */}
        <div className="mt-20">
          <p className="text-center text-sm font-semibold uppercase tracking-widest opacity-70 mb-8">
            Trusted by 1000+ Small Sales Teams and B2B Founders
          </p>

          <div className="marquee-wrapper relative overflow-hidden">
            <div className="animate-scroll flex">
              {[...trustLogos, ...trustLogos].map((src, i) => (
                <div key={i} className="flex items-center mx-10 shrink-0">
                  <Image
                    src={src}
                    alt={`Company ${i + 1}`}
                    width={120}
                    height={32}
                    className="h-8 w-auto transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
