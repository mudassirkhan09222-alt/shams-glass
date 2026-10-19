import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { getPublishedProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic product pages — only published products are included.
  const productsResult = await getPublishedProducts({ limit: 1000, offset: 0 });
  const productRoutes: MetadataRoute.Sitemap =
    productsResult.status === "ok"
      ? productsResult.products.map((p) => ({
          url: `${base}/products/${p.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        }))
      : [];

  return [...staticRoutes, ...productRoutes];
}
