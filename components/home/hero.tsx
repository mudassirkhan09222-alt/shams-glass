"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Architectural hero image (properly licensed Unsplash photo of a modern glass
 * facade). The hero also paints a navy gradient as its base so the copy stays
 * legible even while the image loads or if the remote source is unavailable.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a42ad1c2?auto=format&fit=crop&w=2400&q=80";

const TRUST_HIGHLIGHTS = [
  "Quality-Focused Solutions",
  "Precision in Every Detail",
  "Tailored to Your Project",
] as const;

export function Hero() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax + fade as the hero scrolls away. Disabled for reduced motion.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const container = {
    hidden: {},
    show: { transition: { delayChildren: 0.15, staggerChildren: 0.12 } },
  };
  const item = prefersReduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section
      ref={ref}
      aria-label="Shams Glass introduction"
      className="relative min-h-[100svh] w-full overflow-hidden bg-navy-900"
    >
      {/* Background image with parallax. The navy base + gradient keep copy
          legible if the remote image is slow or unavailable. */}
      <motion.div
        style={prefersReduced ? undefined : { y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src={HERO_IMAGE}
          alt="Modern glass and aluminium architectural facade"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={80}
        />
      </motion.div>

      {/* Legibility gradient */}
      <motion.div
        style={prefersReduced ? undefined : { opacity: overlayOpacity }}
        className="absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-transparent to-navy-900/40" />
      </motion.div>

      {/* Soft glass sheen accent */}
      <div className="sg-sheen absolute inset-0 opacity-60" aria-hidden />

      {/* Content */}
      <div className="relative sg-container flex min-h-[100svh] flex-col justify-center pt-28 pb-24 md:pt-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.div variants={item} className="flex items-center gap-2 text-glass">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="sg-eyebrow !text-glass">
              Precision. Clarity. Quality.
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight"
          >
            Transform Your Space with Premium Glass &amp; Aluminium.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed"
          >
            Discover refined glass and aluminium solutions for modern
            architecture, commercial spaces and elegant interiors. Explore our
            collection and connect with Shams Glass to discuss your next
            project.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <Button
              href="/products"
              variant="light"
              size="lg"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
            >
              Explore Our Collection
            </Button>
            <Button
              href="/contact"
              variant="corporate"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 text-white"
            >
              Request a Quote
            </Button>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {TRUST_HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-white/85"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-glass/15">
                  <Check className="h-3 w-3 text-glass" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <Link
          href="#collection"
          aria-label="Scroll to the collection"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-[0.7rem] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <span className="block h-10 w-px bg-gradient-to-b from-white/60 to-transparent" />
        </Link>
      </motion.div>
    </section>
  );
}
