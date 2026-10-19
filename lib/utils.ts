/** Convert a name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Format a numeric price as a currency string. */
export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Truncate text to a max length with an ellipsis. */
export function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/** Lightweight className combiner (avoids adding clsx + tailwind-merge). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format an ISO date as a readable date string. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Build a Supabase Storage public URL from a storage path. */
export function storagePublicUrl(baseUrl: string, bucket: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}
