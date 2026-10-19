"use server";

import { revalidatePath } from "next/cache";
import {
  getPublishedProducts,
  getPublicCategories,
} from "@/lib/products/queries";
import type { ProductCard, SortOption } from "@/types/database";

/**
 * Server action backing the "Load More" control on the /products page.
 * Resolves the category slug to an id, fetches the next page of published
 * products, and returns plain serializable data to the client.
 */
export async function loadMoreProducts(args: {
  query?: string;
  categorySlug?: string | null;
  sort?: SortOption;
  offset: number;
  limit?: number;
}): Promise<{ products: ProductCard[]; hasMore: boolean; total: number }> {
  const limit = args.limit ?? 9;
  const offset = Math.max(0, Math.floor(args.offset));

  let categoryId: string | null = null;
  if (args.categorySlug) {
    const cats = await getPublicCategories();
    if (cats.status === "ok") {
      const match = cats.categories.find((c) => c.slug === args.categorySlug);
      categoryId = match?.id ?? null;
    }
  }

  const result = await getPublishedProducts({
    limit,
    offset,
    filters: {
      query: args.query,
      categoryId,
      sort: args.sort,
    },
  });

  // Total count (independent of offset) so the client knows when to stop.
  const { countPublishedProducts } = await import("@/lib/products/queries");
  const total = await countPublishedProducts({
    query: args.query,
    categoryId,
    sort: args.sort,
  });

  const products = result.status === "ok" ? result.products : [];
  return {
    products,
    hasMore: offset + products.length < total,
    total,
  };
}

/** Re-exported so admin pages can refresh public listings after a change. */
export async function revalidateProducts(): Promise<void> {
  revalidatePath("/", "page");
  revalidatePath("/products", "page");
  revalidatePath("/products/[id]", "page");
}
