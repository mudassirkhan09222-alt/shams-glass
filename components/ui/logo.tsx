import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/config/site";

/**
 * Official Shams Glass logo — uses the real PNG from /public/Shams_Glass_Logo.png.
 * On the dark (navy) footer/login background we keep the original full-colour logo
 * because it already has white text; on the light navbar the same image works fine
 * since it has a transparent background. Both variants just use the same PNG.
 */
export function Logo({
  className = "",
  variant = "dark",
  href = "/",
  showTagline = false, // tagline is baked into the logo image, no need to duplicate
}: {
  className?: string;
  variant?: "dark" | "light";
  href?: string | null;
  showTagline?: boolean;
}) {
  // Light variant (footer / login) → slightly larger to read well on dark bg
  const height = variant === "light" ? 52 : 44;
  const width  = variant === "light" ? 140 : 120;

  const content = (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/Shams_Glass_Logo.png"
        alt={`${BRAND.name} logo`}
        width={width}
        height={height}
        className="object-contain"
        priority
      />
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
