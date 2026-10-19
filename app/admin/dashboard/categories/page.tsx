import type { Metadata } from "next";
import { adminListCategories } from "@/lib/products/queries";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const { status, categories } = await adminListCategories();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy">Categories</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage product categories. Changes take effect immediately on the public site.</p>
      </div>
      <CategoriesManager initialCategories={categories} status={status} />
    </div>
  );
}
