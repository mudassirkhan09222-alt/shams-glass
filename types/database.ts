/**
 * Hand-written types describing the Shams Glass database schema.
 *
 * These mirror the SQL migration in `supabase/migrations/0001_init.sql` and
 * keep the application fully typed without requiring the Supabase CLI to
 * generate types. If the schema changes, update both files together.
 */

export type Specification = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  /** Public URL resolved from Supabase Storage. */
  public_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_on_request: boolean;
  /** Free-form technical specifications, stored as JSONB. */
  specifications: Specification[] | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  /** Joined category (optional, populated by queries). */
  category?: Category | null;
  /** Joined images (optional, populated by queries). */
  images?: ProductImage[];
};

/** Shape returned by the public product list/card query. */
export type ProductWithRelations = Product & {
  category: Category | null;
  images: ProductImage[];
};

/** A product with only its first image — used for cards in grids. */
export type ProductCard = Omit<Product, "specifications" | "description"> & {
  category: Category | null;
  image: ProductImage | null;
};

export type SortOption = "newest" | "name-asc";

export type ProductFilters = {
  query?: string;
  categoryId?: string | null;
  sort?: SortOption;
};

/** Result envelope for product queries, used to render graceful states. */
export type ProductsResult = {
  status: "ok" | "empty" | "error" | "not-configured";
  products: ProductCard[];
  total?: number;
  message?: string;
};

export type CategoriesResult = {
  status: "ok" | "empty" | "error" | "not-configured";
  categories: Category[];
  message?: string;
};

/** Admin dashboard metrics, all derived from the database. */
export type AdminMetrics = {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  categories: number;
};

/** Standard action result returned to client components from server actions. */
export type ActionResult<T = undefined> = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
};
