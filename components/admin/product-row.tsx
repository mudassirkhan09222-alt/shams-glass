"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { ProductCard } from "@/types/database";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { setPublishedStatus, deleteProduct } from "@/lib/products/admin-actions";

export function AdminProductRow({ product }: { product: ProductCard & { description?: string | null; specifications?: unknown; updated_at?: string } }) {
  const [pending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onTogglePublish = () => {
    startTransition(async () => {
      const result = await setPublishedStatus(product.id, !product.is_published);
      if (!result.ok) setError(result.message ?? "Failed.");
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.ok) {
        setError(result.message ?? "Delete failed.");
        setShowConfirm(false);
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-canvas transition-colors">
        <td className="px-4 py-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-canvas border border-hairline shrink-0">
            <ImageWithFallback
              src={product.image?.public_url ?? null}
              alt={product.name}
              fill
              sizes="40px"
              className="object-cover"
              fallbackClassName="w-full h-full"
            />
          </div>
        </td>
        <td className="px-4 py-3">
          <Link href={`/admin/dashboard/products/${product.id}/edit`} className="font-medium text-navy hover:text-corporate transition-colors">
            {product.name}
          </Link>
          <p className="text-xs text-ink-muted mt-0.5">{product.slug}</p>
          {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
        </td>
        <td className="px-4 py-3 hidden sm:table-cell text-ink-soft">
          {product.category?.name ?? "—"}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <Badge tone={product.is_published ? "green" : "amber"}>
            {product.is_published ? "Published" : "Draft"}
          </Badge>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={onTogglePublish}
              disabled={pending}
              title={product.is_published ? "Unpublish" : "Publish"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-white text-ink-soft hover:text-navy disabled:opacity-50 transition-colors"
            >
              {product.is_published ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              <span className="sr-only">{product.is_published ? "Unpublish" : "Publish"}</span>
            </button>
            <Link
              href={`/admin/dashboard/products/${product.id}/edit`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-white text-ink-soft hover:text-navy transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              <span className="sr-only">Edit</span>
            </Link>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={pending}
              title="Delete"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-white text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </td>
      </tr>

      {showConfirm ? (
        <tr>
          <td colSpan={5} className="bg-red-50 px-4 py-3 border-t border-red-200">
            <div className="flex items-center gap-4">
              <p className="text-sm text-red-800 flex-1">
                Permanently delete <strong>{product.name}</strong>? This also removes its images from storage.
              </p>
              <button type="button" onClick={onDelete} disabled={pending} className="inline-flex h-8 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
                Delete
              </button>
              <button type="button" onClick={() => setShowConfirm(false)} className="inline-flex h-8 items-center rounded-lg border border-hairline bg-white px-3 text-sm text-ink-soft hover:text-navy transition-colors">
                Cancel
              </button>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
