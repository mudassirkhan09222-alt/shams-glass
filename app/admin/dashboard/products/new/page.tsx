import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { adminListCategories } from "@/lib/products/queries";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const { categories } = await adminListCategories();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/dashboard/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-navy transition-colors">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Products
        </Link>
        <span className="text-ink-muted">/</span>
        <h1 className="text-2xl font-semibold text-navy">Add Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
