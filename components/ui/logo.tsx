import Link from "next/link";
import { BRAND } from "@/lib/config/site";

/**
 * Shams Glass wordmark with a glass-inspired mark.
 *
 * The mark is an inline SVG (overlapping translucent panes) so it scales
 * crisply and inherits the current color. Replace the SVG with the company's
 * official logo by swapping this component — the `name` and `tagline` come
 * from the central site config.
 */
export function Logo({
  className = "",
  variant = "dark",
  href = "/",
  showTagline = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  href?: string | null;
  showTagline?: boolean;
}) {
  const isLight = variant === "light";
  const wordColor = isLight ? "text-white" : "text-navy";
  const accentColor = isLight ? "text-glass" : "text-corporate";
  const taglineColor = isLight ? "text-white/55" : "text-ink-muted";

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <GlassMark className={isLight ? "text-white" : "text-corporate"} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.05rem] font-semibold tracking-tight ${wordColor}`}>
          {BRAND.name}
        </span>
        {showTagline ? (
          <span
            className={`text-[0.62rem] font-medium uppercase tracking-[0.18em] ${accentColor} ${taglineColor} mt-0.5`}
          >
            {BRAND.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${BRAND.name} home`}
      className="inline-flex items-center rounded-lg transition-transform duration-300 hover:-translate-y-0.5"
    >
      {content}
    </Link>
  );
}

/** Glass-inspired mark: two translucent overlapping panes. */
function GlassMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="26"
        rx="3"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="11"
        y="3"
        width="18"
        height="26"
        rx="3"
        fill="currentColor"
        opacity="0.32"
      />
      <rect
        x="11"
        y="3"
        width="18"
        height="26"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      <rect
        x="3"
        y="3"
        width="18"
        height="26"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      <line
        x1="14.5"
        y1="6"
        x2="14.5"
        y2="26"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}
