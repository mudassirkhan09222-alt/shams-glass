/**
 * Central site configuration for Shams Glass.
 *
 * Business contact details are read from public environment variables so the
 * owner can change them without touching code. When a value is missing we
 * surface `null` rather than a fabricated placeholder, so the UI can hide the
 * field instead of inventing contact details.
 */

export const BRAND = {
  name: "Shams Glass",
  tagline: "Premium Glass & Aluminium",
  // Short description reused in the footer and metadata.
  description:
    "Refined glass and aluminium solutions for modern architecture, commercial spaces and elegant interiors.",
} as const;

/** Brand colour palette (see globals.css for the matching CSS tokens). */
export const BRAND_COLORS = {
  navy: "#102D50",
  corporateBlue: "#1769AA",
  glassBlue: "#DCEFFC",
  white: "#FFFFFF",
  lightBackground: "#F5F8FC",
  text: "#172B43",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/** Primary public navigation. `section` links scroll to a homepage section. */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Quote CTA target — the dedicated contact page. */
export const QUOTE_LINK = "/contact" as const;

/**
 * Default product categories. These are seeded into Supabase by the SQL
 * migration, but the admin can create, rename, and delete categories
 * afterwards. This list only acts as a fallback reference and a seed list.
 */
export const DEFAULT_CATEGORIES = [
  "Clear Glass",
  "Tempered Glass",
  "Laminated Glass",
  "Frosted Glass",
  "Tinted Glass",
  "Decorative Glass",
  "Mirrors",
  "Aluminium Windows",
  "Aluminium Doors",
  "Aluminium Partitions",
  "Glass Railings",
  "Shower Enclosures",
  "Curtain Wall Systems",
  "Custom Glass Solutions",
] as const;

/** Configurable business contact details (null when not configured). */
export const BUSINESS = {
  whatsapp: envOrNull("NEXT_PUBLIC_WHATSAPP_NUMBER"),
  phone: envOrNull("NEXT_PUBLIC_BUSINESS_PHONE"),
  email: envOrNull("NEXT_PUBLIC_BUSINESS_EMAIL"),
  address: envOrNull("NEXT_PUBLIC_BUSINESS_ADDRESS"),
} as const;

/** Max image upload size in MB (defaults to 6). */
export const MAX_IMAGE_MB = Number(envOrNull("NEXT_PUBLIC_MAX_IMAGE_MB") ?? "6");

/** Accepted image MIME types for admin uploads. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function envOrNull(name: string): string | null {
  const value = process.env[name];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Build a WhatsApp "click to chat" URL. Accepts the number with or without a
 * leading `+`, spaces, or dashes. Returns null when no WhatsApp number is
 * configured so callers can hide the affordance instead of faking it.
 */
export function whatsappLink(message?: string): string | null {
  const raw = BUSINESS.whatsapp;
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Normalize a phone number into a tel: link. */
export function telLink(phone: string | null): string | null {
  if (!phone) return null;
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** Normalize an email into a mailto: link. */
export function mailLink(email: string | null): string | null {
  if (!email) return null;
  return `mailto:${email}`;
}
