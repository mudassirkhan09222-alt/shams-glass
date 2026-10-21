"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, whatsappLink, telLink } from "@/lib/config/site";

/* ── Full-screen background — same image user showed ───────────────────── */
const HERO_BG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90&auto=format&fit=crop";

/* ── Bottom strip photos ────────────────────────────────────────────────── */
const STRIP = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
    label: "Aluminium Windows",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
    label: "Glass Partitions",
  },
  {
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80&auto=format&fit=crop",
    label: "Aluminium Doors",
  },
  {
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format&fit=crop",
    label: "Curtain Walls",
  },
];

/* ── Service badges ─────────────────────────────────────────────────────── */
const SERVICES = [
  { icon: "🪟", label: "Aluminium\nWindows" },
  { icon: "🚪", label: "Aluminium\nDoors" },
  { icon: "↔️", label: "Sliding\nSystems" },
  { icon: "🏢", label: "Glass\nPartitions" },
  { icon: "🏗️", label: "Curtain\nWalls" },
  { icon: "⚙️", label: "Custom\nWork" },
];

const fadeUp = (delay: number, reduced: boolean | null) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
      };

export function Hero() {
  const reduced = useReducedMotion();
  const wa  = whatsappLink("Hello Shams Glass, I'd like to enquire about your services.");
  const tel = telLink(BUSINESS.phone?.split(",")[0] ?? null);

  return (
    <section aria-label="Shams Glass — Premium Glass & Aluminium" className="overflow-hidden">

      {/* ════════════════════════════════════════════════════════════════
          FULL-SCREEN HERO
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-[100svh] flex flex-col">

        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_BG}
          alt="Modern villa with glass railings and aluminium windows"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Dark overlay — left heavier so text pops, right lighter to show image */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy/88 via-navy/60 to-navy/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/30"
          aria-hidden
        />

        {/* Content — pushed down past navbar */}
        <div className="relative flex-1 flex flex-col justify-center sg-container pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <motion.p
              {...fadeUp(0.1, reduced)}
              className="text-xs font-bold uppercase tracking-[0.22em] text-glass"
            >
              Karachi&apos;s Trusted Glass &amp; Aluminium Specialists
            </motion.p>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2, reduced)}
              className="mt-4 text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.05] tracking-tight text-white"
            >
              PREMIUM{" "}
              <span className="text-glass">ALUMINIUM</span>
              <br />
              &amp; GLASS SOLUTIONS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              {...fadeUp(0.3, reduced)}
              className="mt-4 text-base sm:text-lg font-semibold uppercase tracking-[0.16em] text-white/80 border-l-4 border-corporate pl-4"
            >
              Strong. Stylish. Built to Last.
            </motion.p>

            {/* Description */}
            <motion.p
              {...fadeUp(0.38, reduced)}
              className="mt-5 text-white/75 text-base leading-relaxed max-w-lg"
            >
              From aluminium windows and doors to glass partitions, curtain
              walls and shower enclosures — Shams Glass delivers quality
              solutions for homes and commercial spaces across Karachi.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.46, reduced)} className="mt-8 flex flex-wrap gap-3">
              <Button
                href="/products"
                variant="light"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                View Our Products
              </Button>
              <Button
                href="/contact"
                variant="corporate"
                size="lg"
              >
                Request a Quote
              </Button>
            </motion.div>

            {/* Quick contacts */}
            <motion.div {...fadeUp(0.54, reduced)} className="mt-6 flex flex-wrap gap-5">
              {tel && (
                <a
                  href={tel}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-glass" aria-hidden />
                  {BUSINESS.phone?.split(",")[0]?.trim()}
                </a>
              )}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4 text-[#4ADE80]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.882l6.196-1.625A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.003-1.371l-.358-.214-3.724.976.996-3.636-.234-.374A9.818 9.818 0 012.182 12c0-5.421 4.397-9.818 9.818-9.818 5.421 0 9.818 4.397 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z"/>
                  </svg>
                  WhatsApp Us
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative pb-8 flex justify-center"
        >
          <a
            href="#collection"
            aria-label="Scroll down"
            className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
          >
            <span className="text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
            <span className="block h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </a>
        </motion.div>
      </div>

      {/* Service strip removed */}

      {/* ════════════════════════════════════════════════════════════════
          BOTTOM PHOTO STRIP
      ════════════════════════════════════════════════════════════════ */}
      <div className="sg-container py-17 pb-19">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STRIP.map((item, i) => (
            <motion.div
              key={item.label}
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.55 }}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-canvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 to-transparent" aria-hidden />
              <span className="absolute bottom-2 left-3 text-xs font-semibold text-white uppercase tracking-wide">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SERVICE ICONS STRIP — each icon slides in from the left, staggered
   ───────────────────────────────────────────────────────────────────────── */
function ServicesStrip({ reduced }: { reduced: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="bg-navy" ref={ref}>
      <div className="sg-container py-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center gap-2 bg-navy hover:bg-navy-700 transition-colors px-3 py-4 cursor-default"
            >
              <span className="text-2xl" aria-hidden>{s.icon}</span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-white/80 text-center whitespace-pre-line leading-tight">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
