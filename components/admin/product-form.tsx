"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2, AlertCircle, X, Upload } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validation/schemas";
import { createProduct, updateProduct } from "@/lib/products/admin-actions";
import type { Category, ProductWithRelations, ProductImage } from "@/types/database";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { slugify, cn } from "@/lib/utils";

type FilePending = { name: string; base64: string; mimeType: string; preview: string };

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductWithRelations;
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<FilePending[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    product?.specifications ?? [],
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(product?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      category_id: product?.category_id ?? null,
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      price: (product?.price ?? null) as number | null | undefined,
      price_on_request: product?.price_on_request ?? true,
      is_featured: product?.is_featured ?? false,
      is_published: product?.is_published ?? false,
      alt_text: "",
      specifications: product?.specifications ?? [],
    },
  });

  const nameValue = watch("name");
  const priceOnRequest = watch("price_on_request");

  // Auto-generate slug from name only when creating a new product.
  const onNameBlur = () => {
    if (!isEdit && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  };

  const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB || "6");
    const results: FilePending[] = [];
    for (const f of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) continue;
      if (f.size > maxMb * 1024 * 1024) continue;
      const base64 = await toBase64(f);
      results.push({ name: f.name, base64, mimeType: f.type, preview: URL.createObjectURL(f) });
    }
    setNewFiles((prev) => [...prev, ...results]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = handleSubmit((data) => {
    setError(null);
    const fd = new FormData();
    fd.set("name", data.name);
    fd.set("slug", data.slug);
    fd.set("category_id", data.category_id ?? "");
    fd.set("short_description", data.short_description ?? "");
    fd.set("description", data.description ?? "");
    fd.set("price", String(data.price ?? ""));
    fd.set("price_on_request", String(data.price_on_request));
    fd.set("is_featured", String(data.is_featured));
    fd.set("is_published", String(data.is_published));
    fd.set("alt_text", data.alt_text ?? "");
    fd.set("specifications", JSON.stringify(specs));

    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product!.id, fd, newFiles, deleteImageIds)
        : await createProduct(fd, newFiles);

      if (result.ok) {
        if (isEdit) {
          router.push("/admin/dashboard/products");
        } else {
          const data = result.data as { slug: string } | undefined;
          router.push(data ? `/admin/dashboard/products/${data.slug ?? ""}/edit` : "/admin/dashboard/products");
        }
        router.refresh();
      } else {
        setError(result.message ?? "Something went wrong.");
      }
    });
  });

  const existingImages = (product?.images ?? []).filter(
    (img) => !deleteImageIds.includes(img.id),
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <Section title="Basic details">
        <FormRow label="Name" htmlFor="name" error={errors.name?.message} required>
          <input id="name" {...register("name")} onBlur={onNameBlur} className={input(errors.name)} />
        </FormRow>
        <FormRow label="Slug" htmlFor="slug" error={errors.slug?.message} help="URL identifier: lowercase letters, numbers, hyphens." required>
          <input id="slug" {...register("slug")} className={input(errors.slug)} />
        </FormRow>
        <FormRow label="Category" htmlFor="category_id" error={(errors.category_id as { message?: string } | undefined)?.message}>
          <select id="category_id" {...register("category_id")} className={input()}>
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Short description" htmlFor="short_description" help="Shown on product cards. Max 180 characters." error={errors.short_description?.message}>
          <input id="short_description" {...register("short_description")} maxLength={180} className={input(errors.short_description)} />
        </FormRow>
        <FormRow label="Full description" htmlFor="description" error={errors.description?.message}>
          <textarea id="description" rows={5} {...register("description")} className={cn(input(), "min-h-32 resize-y")} />
        </FormRow>
      </Section>

      <Section title="Pricing">
        <div className="flex items-center gap-3">
          <input id="price_on_request" type="checkbox" {...register("price_on_request")} className="h-4 w-4 rounded text-corporate" />
          <label htmlFor="price_on_request" className="text-sm text-navy">Price on request (hides the price on the public site)</label>
        </div>
        {!priceOnRequest ? (
          <FormRow label="Price" htmlFor="price" error={errors.price?.message} help="Numeric value, e.g. 250">
            <input id="price" type="number" min={0} step="0.01" {...register("price")} className={input(errors.price)} />
          </FormRow>
        ) : null}
      </Section>

      <Section title="Images">
        <FormRow label="Image alt text" htmlFor="alt_text" help="Describe the images for screen readers (applies to all newly uploaded images)." error={errors.alt_text?.message}>
          <input id="alt_text" {...register("alt_text")} className={input(errors.alt_text)} />
        </FormRow>

        {existingImages.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-navy mb-3">Current images</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {existingImages.map((img) => (
                <ExistingImageTile key={img.id} img={img} onRemove={() => setDeleteImageIds((p) => [...p, img.id])} />
              ))}
            </div>
          </div>
        ) : null}

        {newFiles.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-navy mb-3">New images (not yet saved)</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {newFiles.map((f, i) => (
                <NewImageTile key={i} file={f} onRemove={() => setNewFiles((p) => p.filter((_, j) => j !== i))} />
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-hairline bg-canvas px-5 py-3 text-sm text-ink-soft hover:border-corporate hover:text-corporate transition-colors"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload images (JPEG, PNG, WebP)
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-hidden
          onChange={onFilePick}
        />
      </Section>

      <Section title="Specifications">
        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={spec.label}
                onChange={(e) => setSpecs((p) => p.map((s, j) => j === i ? { ...s, label: e.target.value } : s))}
                placeholder="Label (e.g. Thickness)"
                className={cn(input(), "flex-1")}
              />
              <input
                value={spec.value}
                onChange={(e) => setSpecs((p) => p.map((s, j) => j === i ? { ...s, value: e.target.value } : s))}
                placeholder="Value (e.g. 12mm)"
                className={cn(input(), "flex-1")}
              />
              <button type="button" onClick={() => setSpecs((p) => p.filter((_, j) => j !== i))} className="text-ink-muted hover:text-red-600 transition-colors" aria-label="Remove spec">
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs((p) => [...p, { label: "", value: "" }])} className="inline-flex items-center gap-1.5 text-sm text-corporate hover:text-corporate-700 transition-colors">
            <Plus className="h-4 w-4" aria-hidden />
            Add specification
          </button>
        </div>
      </Section>

      <Section title="Publishing">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded text-corporate" />
            <span className="text-sm text-navy">Featured product</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register("is_published")} className="h-4 w-4 rounded text-corporate" />
            <span className="text-sm text-navy">Published (visible to public)</span>
          </label>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60 transition-colors"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/dashboard/products")} className="inline-flex h-11 items-center px-5 text-sm font-medium text-ink-soft hover:text-navy transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hairline bg-white p-6 space-y-5">
      <h2 className="text-base font-semibold text-navy border-b border-hairline pb-3">{title}</h2>
      {children}
    </div>
  );
}

function FormRow({ label, htmlFor, error, help, required, children }: {
  label: string; htmlFor: string; error?: string; help?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-navy">
        {label}{required ? " *" : ""}
      </label>
      {help ? <p className="text-xs text-ink-muted mb-1.5">{help}</p> : null}
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function input(error?: { message?: string }) {
  const base = "w-full h-10 rounded-xl border bg-canvas px-3 text-sm text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none transition-colors";
  return error ? `${base} border-red-300 focus:border-red-400` : `${base} border-hairline focus:border-corporate`;
}

function ExistingImageTile({ img, onRemove }: { img: ProductImage; onRemove: () => void }) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-canvas border border-hairline">
      <ImageWithFallback src={img.public_url} alt={img.alt_text || "Product image"} fill sizes="120px" className="object-cover" fallbackClassName="w-full h-full" />
      <button type="button" onClick={onRemove} className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 transition-opacity" aria-label="Remove image">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function NewImageTile({ file, onRemove }: { file: FilePending; onRemove: () => void }) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-canvas border border-corporate">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={file.preview} alt={file.name} className="absolute inset-0 w-full h-full object-cover" />
      <button type="button" onClick={onRemove} className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 transition-opacity" aria-label="Remove image">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
