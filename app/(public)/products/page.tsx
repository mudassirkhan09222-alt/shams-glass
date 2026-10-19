import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductExplorer } from "@/components/products/product-explorer";
import {
  getPublishedProducts,
  getPublicCategories,
  countPublishedProducts,
} from "@/lib/products/queries";
import type { SortOption } from "@/types/database";

export const metadata: Metadata = {
  title: "Products — Glass & Aluminium Collection",
  description:
    "Browse the full Shams Glass collection of glass and aluminium products. Search, filter by category, and sort to find the right solution for your project.",
  alternates: { canonical: "/products" },
};

const PAGE_SIZE = 9;

function parseSort(value: string | string[] | undefined): SortOption {
  return value === "name-asc" ? "name-asc" : "newest";
}

function parseString(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = parseString(sp.q);
  const categorySlug = parseString(sp.category) || null;
  const sort = parseSort(sp.sort);

  const categoriesResult = await getPublicCategories();

  // Resolve the selected category id from the slug.
  let categoryId: string | null = null;
  if (categorySlug && categoriesResult.status === "ok") {
    const match = categoriesResult.categories.find((c) => c.slug === categorySlug);
    categoryId = match?.id ?? null;
  }

  const [products, total] = await Promise.all([
    getPublishedProducts({
      limit: PAGE_SIZE,
      offset: 0,
      filters: { query: q, categoryId, sort },
    }),
    countPublishedProducts({ query: q, categoryId, sort }),
  ]);

  return (
    <>
      <section className="pt-16 md:pt-20 bg-canvas">
        <Container className="py-12 md:py-16 border-b border-hairline">
          <p className="sg-eyebrow">The Collection</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-navy tracking-tight">
            Glass &amp; Aluminium Products
          </h1>
          <p className="mt-4 max-w-2xl text-ink-soft text-base sm:text-lg leading-relaxed">
            Search the complete collection and filter by category to find the
            right materials and systems for your project.
          </p>
        </Container>
      </section>

      <section className="py-12 md:py-16 bg-canvas">
        <Container>
          <ProductExplorer
            initialProducts={products.status === "ok" ? products.products : []}
            initialStatus={products.status}
            initialMessage={products.message}
            total={total}
            hasMore={total > PAGE_SIZE}
            categories={categoriesResult.status === "ok" ? categoriesResult.categories : []}
            currentFilters={{ q, category: categorySlug, sort }}
            pageSize={PAGE_SIZE}
          />
        </Container>
      </section>
    </>
  );
}
