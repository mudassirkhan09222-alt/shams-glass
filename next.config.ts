import type { NextConfig } from "next";

/**
 * Derive the Supabase project hostname (if configured) so that product
 * images stored in Supabase Storage can be optimized by next/image.
 * `process.env` is available here because next.config runs in Node.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname: string | null = null;
if (supabaseUrl) {
  try {
    supabaseHostname = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHostname = null;
  }
}

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  /**
   * Cache Components is disabled intentionally. This site is database-driven
   * (products from Supabase) and admin-gated with cookie-based auth sessions.
   * Per-request rendering keeps published products fresh instantly and avoids
   * the session-caching security risks documented in the Supabase SSR guide.
   * Admin mutations call `revalidatePath` to refresh any prerendered shells.
   */
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    // Next.js 16 defaults the allowed `qualities` to [75]. We declare the
    // values we actually use so quality props are not silently coerced.
    qualities: [50, 75, 90],
    remotePatterns: [
      // Architectural imagery for the hero / showcase / fallbacks.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Public product imagery stored in Supabase Storage (when configured).
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
