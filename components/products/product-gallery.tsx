"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ProductImage } from "@/types/database";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-hairline">
        <ImageWithFallback
          src={null}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          fallbackClassName="w-full h-full"
          fallbackLabel="No image available"
        />
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
        <ImageWithFallback
          src={current.public_url}
          alt={current.alt_text || productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          fallbackClassName="w-full h-full"
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
                <ImageWithFallback
                  src={img.public_url}
                  alt={img.alt_text || `${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  fallbackClassName="w-full h-full"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
