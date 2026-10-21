"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ProductImage } from "@/types/database";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const count = images.length;

  // Clamp the active index if images change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (active >= count) setActive(0);
  }, [count, active]);

  // Keyboard navigation when the main image is focused.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => (count ? (i + 1) % count : 0));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => (count ? (i - 1 + count) % count : 0));
    }
  };

  if (count === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-hairline bg-canvas flex items-center justify-center text-ink-muted">
        <div className="flex flex-col items-center gap-2 opacity-60">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="11" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.28" />
          </svg>
          <span className="text-xs">No image available</span>
        </div>
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-hairline bg-canvas"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${productName} image gallery`}
        onKeyDown={onKeyDown}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.public_url}
          alt={current.alt_text || productName}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-navy/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          {active + 1} / {count}
        </div>
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + count) % count)}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-navy hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % count)}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-navy hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <ul className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                  i === active
                    ? "border-corporate"
                    : "border-hairline hover:border-glass-200",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.public_url}
                  alt={img.alt_text || `${productName} thumbnail ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
