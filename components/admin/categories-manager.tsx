"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import type { Category } from "@/types/database";
import { createCategory, deleteCategory } from "@/lib/products/admin-actions";
import { slugify } from "@/lib/utils";

export function CategoriesManager({
  initialCategories,
  status,
}: {
  initialCategories: Category[];
  status: "ok" | "error" | "not-configured";
}) {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const onNameChange = (v: string) => {
    setName(v);
    setSlug(slugify(v));
  };

  const onCreate = () => {
    if (!name.trim()) { setError("Enter a category name."); return; }
    setError(null);
    startTransition(async () => {
      const result = await createCategory(name.trim(), slug || slugify(name.trim()));
      if (result.ok && result.data) {
        setCats((p) => [
          ...p,
          {
            id: result.data!.id,
            name: name.trim(),
            slug: slug || slugify(name.trim()),
            created_at: new Date().toISOString(),
          },
        ].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
        setSlug("");
      } else {
        setError(result.message ?? "Could not create category.");
      }
    });
  };

  const onDelete = (id: string) => {
    setDeleting(id);
    setConfirmId(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.ok) {
        setCats((p) => p.filter((c) => c.id !== id));
      } else {
        setError(result.message ?? "Could not delete category.");
      }
      setDeleting(null);
    });
  };

  if (status === "not-configured") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Service role key not configured — category management requires <code>SUPABASE_SERVICE_ROLE_KEY</code>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Create */}
      <div className="rounded-2xl border border-hairline bg-white p-5 space-y-4">
        <h2 className="font-semibold text-navy">Add a category</h2>
        {error ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800" role="alert">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
            {error}
          </div>
        ) : null}
        <div className="space-y-3">
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-navy">Name</label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-hairline bg-canvas px-3 text-sm focus:border-corporate focus:bg-white focus:outline-none transition-colors"
              placeholder="e.g. Tempered Glass"
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className="block text-sm font-medium text-navy">Slug</label>
            <input
              id="cat-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-hairline bg-canvas px-3 text-sm font-mono focus:border-corporate focus:bg-white focus:outline-none transition-colors"
              placeholder="tempered-glass"
            />
          </div>
          <button
            type="button"
            onClick={onCreate}
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition-colors"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add category
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-hairline bg-white overflow-hidden">
        <div className="p-4 border-b border-hairline">
          <h2 className="font-semibold text-navy">Categories ({cats.length})</h2>
        </div>
        {cats.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">No categories yet. Create one to organise your products.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {cats.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-canvas transition-colors">
                <div>
                  <p className="text-sm font-medium text-navy">{cat.name}</p>
                  <p className="text-xs text-ink-muted font-mono">{cat.slug}</p>
                </div>
                {confirmId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onDelete(cat.id)} disabled={deleting === cat.id} className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-60">Confirm delete</button>
                    <button type="button" onClick={() => setConfirmId(null)} className="text-xs text-ink-muted hover:text-navy">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmId(cat.id)} className="text-ink-muted hover:text-red-600 transition-colors" aria-label={`Delete ${cat.name}`}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
