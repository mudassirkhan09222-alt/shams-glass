import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import type { ProductCard as ProductCardType } from "@/types/database";
import { formatPrice, truncate } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductCardType }) {
  const href = `/products/${product.slug}`;
  const price =
    product.price_on_request || product.price == null
      ? "Price on Request"
      : formatPrice(product.price);

  const imgUrl = product.image?.public_url ?? null;

  return (
    <article className="sg-card group relative flex flex-col rounded-2xl border border-hairline bg-white overflow-hidden">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-canvas"
        aria-label={`View ${product.name}`}
      >
        {imgUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgUrl}
            alt={product.image?.alt_text || product.name}
            className="sg-zoom-img absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas text-ink-muted opacity-70">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden>
              <rect x="3" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.15" />
              <rect x="11" y="3" width="18" height="26" rx="3" fill="currentColor" opacity="0.28" />
            </svg>
            <span className="mt-2 text-xs">No image</span>
          </div>
        )}

        {product.is_featured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            <Tag className="h-3 w-3" aria-hidden />
            Featured
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.category ? (
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-corporate">
            {product.category.name}
          </span>
        ) : (
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            Glass & Aluminium
          </span>
        )}

        <h3 className="mt-1.5 text-lg font-semibold text-navy leading-snug">
          <Link href={href} className="hover:text-corporate transition-colors">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2">
          {truncate(product.short_description, 110) || "—"}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-hairline">
          <span className="text-sm font-semibold text-navy">{price}</span>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-corporate hover:text-corporate-700 transition-colors"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
