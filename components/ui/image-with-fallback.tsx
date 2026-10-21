"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined;
  fallbackClassName?: string;
  fallbackLabel?: string;
};

/** Returns true for Supabase Storage URLs — use native <img> to bypass Next.js optimiser domain checks. */
function isSupabaseUrl(src: string): boolean {
  return src.includes(".supabase.co/storage/");
}

export function ImageWithFallback({
  src,
  alt,
  fallbackClassName = "",
  fallbackLabel,
  className = "",
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-canvas text-ink-muted ${fallbackClassName || className}`}
        role="img"
        aria-label={typeof alt === "string" ? alt : "Image unavailable"}
      >
        <div className="flex flex-col items-center gap-2 opacity-70">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.18" />
            <rect x="11" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.3" />
          </svg>
          {fallbackLabel ? (
            <span className="text-xs tracking-wide">{fallbackLabel}</span>
          ) : null}
        </div>
      </div>
    );
  }

  /* Supabase Storage → use native <img> so next/image domain whitelist is bypassed */
  if (isSupabaseUrl(src)) {
    // Extract positional props that only apply to next/image
    const { fill, sizes, quality, priority, placeholder, blurDataURL, ...imgRest } = rest as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={typeof alt === "string" ? alt : ""}
        className={className}
        onError={() => setFailed(true)}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        {...imgRest}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
