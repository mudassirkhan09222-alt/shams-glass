/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config-check";
import type {
  AdminMetrics,
  CategoriesResult,
  ProductCard,
  ProductFilters,
  ProductImage,
  ProductWithRelations,
  ProductsResult,
  SortOption,
} from "@/types/database";
import { storagePublicUrl } from "@/lib/utils";

/** Public Supabase Storage bucket for product imagery. */
export const PRODUCT_IMAGES_BUCKET = "product-images";

/** Helper: resolve a storage path into a public URL. */
function publicUrlFor(storagePath: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  return storagePublicUrl(base, PRODUCT_IMAGES_BUCKET, storagePath);
}

/** Map a raw product_images row into our typed ProductImage. */
function mapImage(row: any): ProductImage {
  return {
    id: row.id,
    product_id: row.product_id,
    storage_path: row.storage_path,
    public_url: publicUrlFor(row.storage_path),
    alt_text: row.alt_text ?? null,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  };
}

/** Sort images by sort_order then created_at, return the first as the cover. */
function pickCover(images: ProductImage[] | undefined): ProductImage | null {
  if (!images || images.length === 0) return null;
  return [...images].sort(
    (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
  )[0];
}

/**
 * Normalize a category join. Without generated DB types, supabase-js types a
 * nested `category:categories(...)` select as an array, but for a many-to-one
 * FK the runtime value is a single object. Handle both shapes safely.
 */
function normalizeCategory(raw: any): import("@/types/database").Category | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as any) ?? null;
  return raw as any;
}

/* ===========================================================================
   Categories (public)
   ========================================================================== */
export async function getPublicCategories(): Promise<CategoriesResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: "not-configured",
      categories: [],
      message: "Supabase is not configured.",
    };
  }
  const supabase = await createClient();
  if (!supabase) {
    return { status: "error", categories: [], message: "Client unavailable." };
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) {
    return {
      status: "error",
      categories: [],
      message: "Could not load categories.",
    };
  }

  return {
    status: (data?.length ?? 0) === 0 ? "empty" : "ok",
    categories: (data ?? []) as any[],
  };
}

/* ===========================================================================
   Public products
   ========================================================================== */

/**
 * Fetch published products with their first image and category. Supports
 * search, category filter, sort, and pagination for the /products page.
 */
export async function getPublishedProducts({
  limit = 9,
  offset = 0,
  filters = {},
}: {
  limit?: number;
  offset?: number;
  filters?: ProductFilters;
} = {}): Promise<ProductsResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: "not-configured",
      products: [],
      message: "Supabase is not configured.",
    };
  }
  const supabase = await createClient();
  if (!supabase) {
    return { status: "error", products: [], message: "Client unavailable." };
  }

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, category_id, short_description, price, price_on_request, is_featured, is_published, created_at, updated_at, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, alt_text, sort_order, created_at)",
    )
    .eq("is_published", true);

  if (filters.query) {
    const q = filters.query.trim();
    if (q.length) {
      const ilike = `%${q}%`;
      query = query.or(`name.ilike.${ilike},short_description.ilike.${ilike},description.ilike.${ilike}`);
    }
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  const sort: SortOption = filters.sort || "newest";
  query = query.order(
    sort === "name-asc" ? "name" : "created_at",
    { ascending: sort === "name-asc" },
  );

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    return { status: "error", products: [], message: "Could not load products." };
  }

  const products: ProductCard[] = (data ?? []).map((row: any) => {
    const images = (row.images ?? []).map(mapImage);
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      category_id: row.category_id ?? null,
      short_description: row.short_description ?? null,
      price: row.price ?? null,
      price_on_request: row.price_on_request ?? true,
      is_featured: row.is_featured ?? false,
      is_published: true,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: normalizeCategory(row.category),
      image: pickCover(images),
    };
  });

  return {
    status: products.length === 0 ? "empty" : "ok",
    products,
  };
}

/** Count of published products matching filters (for pagination UI). */
export async function countPublishedProducts(filters: ProductFilters = {}): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = await createClient();
  if (!supabase) return 0;

  let query = supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  if (filters.query) {
    const q = filters.query.trim();
    if (q.length) {
      const ilike = `%${q}%`;
      query = query.or(`name.ilike.${ilike},short_description.ilike.${ilike},description.ilike.${ilike}`);
    }
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  const { count } = await query;
  return count ?? 0;
}

/**
 * Homepage collection: a limited selection of published products, preferring
 * featured ones first, then newest. Returns a graceful envelope.
 */
export async function getHomepageProducts(limit = 8): Promise<ProductsResult> {
  // Reuse the published query ordered newest-first, then reorder to surface
  // featured products first on the homepage.
  const result = await getPublishedProducts({
    limit: Math.max(limit, 12),
    offset: 0,
    filters: { sort: "newest" },
  });
  if (result.status !== "ok") return result;

  const reordered = [...result.products].sort(
    (a, b) => Number(b.is_featured) - Number(a.is_featured),
  );
  return { ...result, products: reordered.slice(0, limit) };
}

/** Full product detail by slug, only if published. Returns null otherwise. */
export async function getPublishedProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, category_id, short_description, description, price, price_on_request, specifications, is_featured, is_published, created_at, updated_at, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, alt_text, sort_order, created_at)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category_id: data.category_id ?? null,
    short_description: data.short_description ?? null,
    description: data.description ?? null,
    price: data.price ?? null,
    price_on_request: data.price_on_request ?? true,
    specifications: (data.specifications as any) ?? null,
    is_featured: data.is_featured ?? false,
    is_published: true,
    created_at: data.created_at,
    updated_at: data.updated_at,
    category: normalizeCategory(data.category),
    images: (data.images ?? []).map(mapImage).sort(
      (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
    ),
  };
}

/** Related products from the same category (excluding the current one). */
export async function getRelatedProducts(
  product: ProductWithRelations,
  limit = 3,
): Promise<ProductCard[]> {
  if (!product.category_id) return [];
  const result = await getPublishedProducts({
    limit: limit + 1,
    offset: 0,
    filters: { categoryId: product.category_id, sort: "newest" },
  });
  if (result.status !== "ok") return [];
  return result.products.filter((p) => p.id !== product.id).slice(0, limit);
}

/* ===========================================================================
   Admin queries (service role — bypasses RLS, gated by authorizeAction)
   ========================================================================== */

type AdminProductRow = ProductCard & {
  description: string | null;
  specifications: any;
  updated_at: string;
};

export async function adminListProducts({
  query,
  limit = 50,
  offset = 0,
}: {
  query?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ status: "ok" | "error" | "not-configured"; products: AdminProductRow[]; total?: number }> {
  const admin = createAdminClient();
  if (!admin) {
    return { status: "not-configured", products: [] };
  }

  let q = admin
    .from("products")
    .select(
      "id, name, slug, category_id, short_description, description, price, price_on_request, specifications, is_featured, is_published, created_at, updated_at, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, alt_text, sort_order, created_at)",
      { count: "exact" },
    );

  if (query && query.trim()) {
    const ilike = `%${query.trim()}%`;
    q = q.or(`name.ilike.${ilike},slug.ilike.${ilike},short_description.ilike.${ilike}`);
  }

  q = q.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await q;
  if (error) return { status: "error", products: [] };

  const products: AdminProductRow[] = (data ?? []).map((row: any) => {
    const images = (row.images ?? []).map(mapImage);
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      category_id: row.category_id ?? null,
      short_description: row.short_description ?? null,
      description: row.description ?? null,
      price: row.price ?? null,
      price_on_request: row.price_on_request ?? true,
      specifications: row.specifications ?? null,
      is_featured: row.is_featured ?? false,
      is_published: row.is_published ?? false,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: normalizeCategory(row.category),
      image: pickCover(images),
    };
  });

  return { status: "ok", products, total: count ?? products.length };
}

export async function adminGetProductById(
  id: string,
): Promise<ProductWithRelations | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("products")
    .select(
      "id, name, slug, category_id, short_description, description, price, price_on_request, specifications, is_featured, is_published, created_at, updated_at, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, alt_text, sort_order, created_at)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category_id: data.category_id ?? null,
    short_description: data.short_description ?? null,
    description: data.description ?? null,
    price: data.price ?? null,
    price_on_request: data.price_on_request ?? true,
    specifications: (data.specifications as any) ?? null,
    is_featured: data.is_featured ?? false,
    is_published: data.is_published ?? false,
    created_at: data.created_at,
    updated_at: data.updated_at,
    category: normalizeCategory(data.category),
    images: (data.images ?? []).map(mapImage).sort(
      (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
    ),
  };
}

export async function adminListCategories() {
  const admin = createAdminClient();
  if (!admin) return { status: "not-configured" as const, categories: [] };

  const { data, error } = await admin
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) return { status: "error" as const, categories: [] };
  return { status: "ok" as const, categories: (data ?? []) as any[] };
}

export async function getAdminMetrics(): Promise<AdminMetrics | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const [all, published, draft, categories] = await Promise.all([
    admin.from("products").select("id", { count: "exact", head: true }),
    admin.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    admin.from("products").select("id", { count: "exact", head: true }).eq("is_published", false),
    admin.from("categories").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalProducts: all.count ?? 0,
    publishedProducts: published.count ?? 0,
    draftProducts: draft.count ?? 0,
    categories: categories.count ?? 0,
  };
}
