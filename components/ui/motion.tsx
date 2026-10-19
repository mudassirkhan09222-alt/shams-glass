"use client";

import { type ElementType, type ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Scroll-triggered reveal. Fades + lifts children into view once, then holds.
 * Respects `prefers-reduced-motion` by rendering children statically with no
 * transform so the content is always visible and accessible.
 *
 * Prefer this over inline `whileInView` usages so reduced-motion is handled
 * consistently across the site.
 */
export function Reveal({
  children,
  as,
  className,
  delay = 0,
  y = 18,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  const tag = (as || "div") as string;

  if (prefersReduced) {
    const Tag = tag as ElementType;
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  // framer-motion's `motion` proxy exposes a component for any DOM tag.
  const MotionTag = (motion as unknown as Record<string, ElementType>)[tag];

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Simple fade-in on mount (no scroll dependency). Good for hero copy that is
 * already in the viewport on load.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container + item helpers for lists. */
export function Stagger({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: { delayChildren, staggerChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
