import type { ReactNode } from "react";

type Tone = "neutral" | "corporate" | "navy" | "green" | "amber" | "red";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-soft border-hairline",
  corporate: "bg-glass text-corporate border-glass-200",
  navy: "bg-navy text-white border-navy",
  green: "bg-green-50 text-green-700 border-green-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
