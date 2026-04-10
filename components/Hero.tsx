"use client";

import Image from "next/image";
import Link from "next/link";
import config from "@/config";
import heroImage from "/app/dashboard.png";
import trust1 from "/app/trust1.png";
import trust2 from "/app/trust 2.png";
import trust3 from "/app/trust 3.png";
import trust4 from "/app/trust 4.png";
import trust5 from "/app/trust 5.png";
import trust6 from "/app/trust 6.png";
import trust7 from "/app/trust 7.png";
import { motion } from "framer-motion";

const trustLogos = [trust1, trust2, trust3, trust4, trust5, trust6, trust7];

// Reusable fade-up variant
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const Hero = () => {
  return (
    <section className="relative max-w-full overflow-x-hidden">
      {/* Animated radial glow */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[600px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(74, 0, 255, 0.30) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-16 text-center">

        {/* Announcement badge */}
        <motion.div
          className="mb-6 flex justify-center"
          variants={fadeUp(0.1)}
          initial="hidden"
          animate="visible"
        >
          <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1 text-sm overflow-hidden">
            {/* shimmer sweep */}
            <motion.span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ translateX: ["−100%", "200%"] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              {/* pulsing dot */}
              <motion.span
                className="size-2 w-2 h-2 rounded-full bg-primary inline-block"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              New:
            </span>
            <span className="font-medium opacity-80">
              The fastest way to launch your SaaS
            </span>
          </div>
        </motion.div>

        {/* Headline — word-by-word stagger */}
        <motion.h1
          className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight lg:text-7xl"
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
        >
          Ship your startup in{" "}
          <motion.span
            className="text-primary relative inline-block"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            days
            {/* underline draw */}
            <motion.span
              className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-primary"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            />
          </motion.span>
          , not weeks
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg opacity-70 leading-relaxed"
          variants={fadeUp(0.35)}
          initial="hidden"
          animate="visible"
        >
          {config.appDescription}. Stop wasting time on boilerplate — focus on
          what makes your product unique.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={fadeUp(0.45)}
          initial="hidden"
          animate="visible"
        >
          {/* Primary button with shimmer + scale */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signin"
              className="btn btn-primary btn-wide relative overflow-hidden"
            >
              {/* shimmer on hover — handled via CSS below, but motion handles scale */}
              <motion.span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                whileHover={{ translateX: "200%" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
              Get started
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              >
                <path
                  fillRule="evenodd"
                  d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </Link>
          </motion.div>

          {/* Ghost button with underline draw on hover */}
          <motion.a
            href="/#how-it-works"
            className="btn btn-ghost btn-wide relative group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            How it works
            <motion.span
              className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-current opacity-50"
              initial={{ width: 0 }}
              whileHover={{ width: "60%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </motion.a>
        </motion.div>

        {/* Social proof avatars — staggered pop-in */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          variants={fadeUp(0.55)}
          initial="hidden"
          animate="visible"
        >
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format",
              "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=96&h=96&fit=crop&auto=format",
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={src}
                  alt={`Happy customer ${i + 1}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-base-100 object-cover"
                />
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-sm opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <span className="font-semibold text-primary">500+</span> founders
            already shipped their SaaS
          </motion.p>
          <motion.div
            className="flex gap-1 text-warning"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.1 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </motion.svg>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero image — fade up + gentle float loop */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="rounded-2xl border border-base-content/10 shadow-2xl overflow-hidden"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={heroImage}
              alt={`${config.appName} product screenshot`}
              className="w-full"
              priority={true}
              placeholder="blur"
            />
          </motion.div>
        </motion.div>

        {/* Trust logos marquee */}
        <motion.div
          className="mt-20"
          variants={fadeUp(0.8)}
          initial="hidden"
          animate="visible"
        >
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
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
