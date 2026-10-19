import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";

/** Section heading block with an eyebrow, title, and optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <Reveal as="span" delay={0.02}>
          <span className="sg-eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}
      <Reveal as="h2" delay={0.08} className="mt-3">
        <span className="block text-3xl sm:text-4xl font-semibold text-navy tracking-tight">
          {title}
        </span>
      </Reveal>
      {description ? (
        <Reveal as="p" delay={0.14} className="mt-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
