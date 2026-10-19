"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, Loader2, ArrowRight, AlertTriangle, Inbox, Settings } from "lucide-react";
import type { Category, ProductCard, SortOption } from "@/types/database";
import { ProductCard as ProductCardView } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { loadMoreProducts } from "@/lib/products/actions";

type Filters = { q: string; category: string | null; sort: SortOption };

export function ProductExplorer({
  initialProducts,
  initialStatus,
  initialMessage,
  total,
  hasMore,
  categories,
  currentFilters,
  pageSize,
}: {
  initialProducts: ProductCard[];
  initialStatus: "ok" | "empty" | "error" | "not-configured";
  initialMessage?: string;
  total: number;
  hasMore: boolean;
  categories: Category[];
  currentFilters: Filters;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchDraft, setSearchDraft] = useState(currentFilters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the search field in sync when filters change externally (e.g. Clear).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchDraft(currentFilters.q);
  }, [currentFilters.q]);

  const updateFilters = (next: Partial<Filters>) => {
    const merged = { ...currentFilters, ...next };
    const params = new URLSearchParams();
    if (merged.q.trim()) params.set("q", merged.q.trim());
    if (merged.category) params.set("category", merged.category);
    if (merged.sort !== "newest") params.set("sort", merged.sort);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const onSearchChange = (value: string) => {
    setSearchDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateFilters({ q: value }), 450);
  };

  const clearFilters = () => {
    setSearchDraft("");
    router.push(pathname);
  };

  const hasFilters = Boolean(currentFilters.q || currentFilters.category);

  // Signature used to reset the list state when filters change.
  const filtersKey = useMemo(
    () => `${currentFilters.q}|${currentFilters.category}|${currentFilters.sort}`,
    [currentFilters.q, currentFilters.category, currentFilters.sort],
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-2xl border border-hairline bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="product-search" className="text-xs font-medium text-ink-muted">
              Search
            </label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
              <input
                id="product-search"
                type="search"
                value={searchDraft}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products by name or description"
                className="w-full h-11 rounded-xl border border-hairline bg-canvas pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-corporate focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="lg:w-56">
            <label htmlFor="category-filter" className="text-xs font-medium text-ink-muted">
              Category
            </label>
            <div className="relative mt-1.5">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
              <select
                id="category-filter"
                value={currentFilters.category ?? ""}
                onChange={(e) => updateFilters({ category: e.target.value || null })}
                className="w-full h-11 appearance-none rounded-xl border border-hairline bg-canvas pl-10 pr-8 text-sm text-ink focus:border-corporate focus:bg-white focus:outline-none transition-colors"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:w-48">
            <label htmlFor="sort-filter" className="text-xs font-medium text-ink-muted">
              Sort
            </label>
            <select
              id="sort-filter"
              value={currentFilters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
              className="mt-1.5 h-11 w-full appearance-none rounded-xl border border-hairline bg-canvas px-3 text-sm text-ink focus:border-corporate focus:bg-white focus:outline-none transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="name-asc">Name (A–Z)</option>
            </select>
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline px-4 text-sm font-medium text-ink-soft hover:border-corporate hover:text-corporate transition-colors"
            >
              <X className="h-4 w-4" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 text-sm text-ink-muted">
        {total > 0 ? `${total} product${total === 1 ? "" : "s"} found` : null}
      </div>

      {/* Results — remounts when filters change so the list resets cleanly */}
      <div className="mt-6">
        <ProductList
          key={filtersKey}
          initialProducts={initialProducts}
          initialStatus={initialStatus}
          initialMessage={initialMessage}
          hasMore={hasMore}
          filters={currentFilters}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}

function ProductList({
  initialProducts,
  initialStatus,
  initialMessage,
  hasMore,
  filters,
  pageSize,
}: {
  initialProducts: ProductCard[];
  initialStatus: "ok" | "empty" | "error" | "not-configured";
  initialMessage?: string;
  hasMore: boolean;
  filters: Filters;
  pageSize: number;
}) {
  const [items, setItems] = useState<ProductCard[]>(initialProducts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(hasMore);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const onLoadMore = async () => {
    setLoadingMore(true);
    setLoadError(null);
    try {
      const res = await loadMoreProducts({
        query: filters.q,
        categorySlug: filters.category,
        sort: filters.sort,
        offset: items.length,
        limit: pageSize,
      });
      setItems((prev) => [...prev, ...res.products]);
      setCanLoadMore(res.hasMore);
    } catch {
      setLoadError("Couldn't load more products. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  if (initialStatus === "not-configured") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 flex gap-4">
        <Settings className="h-6 w-6 text-amber-600 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold text-amber-900">Connect Supabase to view products</p>
          <p className="mt-1 text-sm text-amber-800/90">
            Products are stored in Supabase. Add your project credentials to{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.local</code> and run the
            setup SQL to publish products from the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (initialStatus === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 flex gap-4">
        <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold text-red-900">Couldn&apos;t load products</p>
          <p className="mt-1 text-sm text-red-800/90">
            {initialMessage || "Something went wrong while reading the collection."}
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline bg-white p-10 sm:p-14 text-center">
        <Inbox className="mx-auto h-10 w-10 text-ink-muted" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-navy">No products found</p>
        <p className="mt-1.5 text-sm text-ink-soft max-w-md mx-auto">
          {filters.q || filters.category
            ? "Try adjusting your search or clearing the filters."
            : "Once the administrator publishes products, they will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCardView key={p.id} product={p} />
        ))}
      </div>

      {loadError ? (
        <p className="mt-6 text-sm text-red-600 text-center" role="alert">{loadError}</p>
      ) : null}

      {canLoadMore ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => startTransition(onLoadMore)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 h-12 text-sm font-medium text-navy hover:border-corporate hover:text-corporate disabled:opacity-60 transition-colors"
          >
            {loadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="h-4 w-4" aria-hidden />
            )}
            {loadingMore ? "Loading…" : "Load More"}
          </button>
        </div>
      ) : (
        <p className="mt-10 text-center text-xs text-ink-muted">
          You&apos;ve reached the end of the collection
        </p>
      )}
    </div>
  );
}

/** Standalone grid skeleton for the route loading state. */
export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
