import type { Metadata } from "next";
import Link from "next/link";
import { Plus, AlertTriangle, Settings } from "lucide-react";
import { adminListProducts } from "@/lib/products/queries";
import { AdminProductRow } from "@/components/admin/product-row";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";

  const result = await adminListProducts({ query: q });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Products</h1>
          {result.total != null ? (
            <p className="mt-1 text-sm text-ink-muted">{result.total} product{result.total !== 1 ? "s" : ""}</p>
          ) : null}
        </div>
        <Link
          href="/admin/dashboard/products/new"
          className="inline-flex items-center gap-2 h-10 rounded-xl bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add Product
        </Link>
      </div>

      <div className="mb-5 rounded-xl border border-hairline bg-white p-3">
        <form method="GET" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="flex-1 h-10 rounded-lg border border-hairline bg-canvas px-3 text-sm focus:outline-none focus:border-corporate transition-colors"
          />
          <button type="submit" className="h-10 rounded-lg bg-navy px-4 text-sm font-medium text-white hover:bg-navy-700 transition-colors">
            Search
          </button>
          {q ? (
            <Link href="/admin/dashboard/products" className="h-10 rounded-lg border border-hairline bg-white px-4 text-sm text-ink-soft inline-flex items-center hover:text-navy">
              Clear
            </Link>
          ) : null}
        </form>
      </div>

      {result.status === "not-configured" ? (
        <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <Settings className="h-6 w-6 text-amber-600 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-amber-900">Service role key required</p>
            <p className="mt-1 text-sm text-amber-800">Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to .env.local to manage products.</p>
          </div>
        </div>
      ) : result.status === "error" ? (
        <div className="flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-6">
          <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" aria-hidden />
          <p className="text-sm text-red-800">Could not load products. Check your database configuration.</p>
        </div>
      ) : result.products.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-white p-12 text-center">
          <p className="text-lg font-semibold text-navy">No products yet</p>
          <p className="mt-1.5 text-sm text-ink-soft">Create your first product to get started.</p>
          <Link href="/admin/dashboard/products/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors">
            <Plus className="h-4 w-4" aria-hidden />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-hairline bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-hairline bg-canvas">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-ink-muted w-12" />
                <th className="px-4 py-3 text-left font-medium text-ink-muted">Product</th>
                <th className="px-4 py-3 text-left font-medium text-ink-muted hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-ink-muted hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {result.products.map((p) => (
                <AdminProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
