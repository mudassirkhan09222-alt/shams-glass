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
  // navbar (dark) → small; footer/login (light) → slightly larger
  const height = variant === "light" ? 46 : 28;
  const width  = variant === "light" ? 124 : 76;

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
