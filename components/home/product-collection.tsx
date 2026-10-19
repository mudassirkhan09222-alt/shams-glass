import Link from "next/link";
import { ArrowRight, AlertTriangle, Inbox, Settings } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { getHomepageProducts } from "@/lib/products/queries";

export async function ProductCollection() {
  const result = await getHomepageProducts(8);

  return (
    <section id="collection" className="py-20 md:py-28 bg-canvas scroll-mt-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            eyebrow="The Collection"
            title="Our Glass & Aluminium Collection"
            description="Explore premium materials and architectural solutions designed for modern spaces, practical performance and timeless style."
          />
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-corporate hover:text-corporate-700 transition-colors shrink-0"
          >
            View All Products
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12">
          {result.status === "not-configured" ? (
            <NotConfigured />
          ) : result.status === "error" ? (
            <ErrorState message={result.message} />
          ) : result.status === "empty" || result.products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-corporate"
          >
            View All Products
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function NotConfigured() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 flex gap-4">
      <Settings className="h-6 w-6 text-amber-600 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold text-amber-900">
          Connect Supabase to showcase products
        </p>
        <p className="mt-1 text-sm text-amber-800/90">
          The collection is stored in Supabase. Add your project credentials to{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">.env.local</code>{" "}
          and run the SQL in{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">
            supabase/SUPABASE_SETUP.md
          </code>{" "}
          to start publishing products from the admin dashboard.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 flex gap-4">
      <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold text-red-900">Couldn&apos;t load products</p>
        <p className="mt-1 text-sm text-red-800/90">
          {message || "Something went wrong while reading the collection. Please try again shortly."}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-hairline bg-white p-10 sm:p-14 text-center">
      <Inbox className="mx-auto h-10 w-10 text-ink-muted" aria-hidden />
      <p className="mt-4 text-lg font-semibold text-navy">
        No published products yet
      </p>
      <p className="mt-1.5 text-sm text-ink-soft max-w-md mx-auto">
        Once the administrator publishes products from the admin dashboard, they
        will appear here automatically.
      </p>
    </div>
  );
}

/** Skeleton used during streaming / loading of the collection. */
export function ProductCollectionSkeleton() {
  return (
    <section className="py-20 md:py-28 bg-canvas">
      <Container>
        <SectionHeading
          eyebrow="The Collection"
          title="Our Glass & Aluminium Collection"
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
