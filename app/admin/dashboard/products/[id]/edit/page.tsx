import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { adminGetProductById, adminListCategories } from "@/lib/products/queries";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categoriesResult] = await Promise.all([
    adminGetProductById(id),
    adminListCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/dashboard/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-navy transition-colors">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Products
        </Link>
        <span className="text-ink-muted">/</span>
        <h1 className="text-2xl font-semibold text-navy truncate">{product.name}</h1>
      </div>
      <ProductForm product={product} categories={categoriesResult.categories} />
    </div>
  );
}
