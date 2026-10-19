"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined;
  /** Tailwind classes applied to the fallback block. */
  fallbackClassName?: string;
  /** Optional label shown inside the fallback. */
  fallbackLabel?: string;
};

/**
 * Next.js Image with a graceful on-brand fallback when the remote source fails
 * to load or when `src` is empty. The fallback is a tinted block with the
 * glass mark, so the layout never shows a broken-image icon.
 */
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
