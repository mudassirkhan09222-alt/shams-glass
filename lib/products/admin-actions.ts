/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { createWriteClient } from "@/lib/supabase/admin";
import { authorizeAction } from "@/lib/auth/session";
import { productSchema, categorySchema } from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/products/queries";
import type { ActionResult } from "@/types/database";

/* ===========================================================================
   Helpers
   ========================================================================== */
function revalidateAll() {
  revalidatePath("/", "page");
  revalidatePath("/products", "page");
  revalidatePath("/products/[id]", "page");
  revalidatePath("/admin/dashboard", "page");
  revalidatePath("/admin/dashboard/products", "page");
}

/** Generate a slug that doesn't collide with an existing one. */
async function uniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string | null> {
  const admin = await createWriteClient();
  if (!admin) return null;

  const candidate = slugify(base);
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? candidate : `${candidate}-${i}`;
    let q = admin.from("products").select("id", { head: true, count: "exact" }).eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { count } = await q;
    if (!count) return slug;
  }
  return `${candidate}-${Date.now()}`;
}

/* ===========================================================================
   Products
   ========================================================================== */
export async function createProduct(
  formData: FormData,
  files: { name: string; base64: string; mimeType: string }[],
): Promise<ActionResult<{ id: string; slug: string }>> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") || "")),
    category_id: formData.get("category_id") || null,
    short_description: formData.get("short_description") || "",
    description: formData.get("description") || "",
    price: formData.get("price") || null,
    price_on_request: formData.get("price_on_request") === "true",
    is_featured: formData.get("is_featured") === "true",
    is_published: formData.get("is_published") === "true",
    alt_text: formData.get("alt_text") || "",
    specifications: (() => {
      try { return JSON.parse(String(formData.get("specifications") || "[]")); } catch { return []; }
    })(),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Validation failed.";
    return { ok: false, message: firstError };
  }
  const data = parsed.data;

  // Make the slug unique.
  const slug = data.slug || await uniqueSlug(data.name);
  if (!slug) return { ok: false, message: "Could not generate a unique slug." };

  const { data: product, error: productError } = await admin
    .from("products")
    .insert({
      name: data.name,
      slug,
      category_id: data.category_id,
      short_description: data.short_description || null,
      description: data.description || null,
      price: data.price,
      price_on_request: data.price_on_request,
      specifications: data.specifications ?? [],
      is_featured: data.is_featured,
      is_published: data.is_published,
    })
    .select("id, slug")
    .maybeSingle();

  if (productError || !product) {
    return { ok: false, message: productError?.message || "Failed to save product." };
  }

  // Upload images.
  if (files.length > 0) {
    await uploadImages(product.id, files, data.alt_text || "", admin);
  }

  revalidateAll();
  return { ok: true, data: { id: product.id, slug: product.slug } };
}

export async function updateProduct(
  id: string,
  formData: FormData,
  newFiles: { name: string; base64: string; mimeType: string }[],
  deleteImageIds: string[],
): Promise<ActionResult> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    category_id: formData.get("category_id") || null,
    short_description: formData.get("short_description") || "",
    description: formData.get("description") || "",
    price: formData.get("price") || null,
    price_on_request: formData.get("price_on_request") === "true",
    is_featured: formData.get("is_featured") === "true",
    is_published: formData.get("is_published") === "true",
    alt_text: formData.get("alt_text") || "",
    specifications: (() => {
      try { return JSON.parse(String(formData.get("specifications") || "[]")); } catch { return []; }
    })(),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Validation failed." };
  }
  const data = parsed.data;

  // Validate the slug is unique (excluding the current product).
  const slugOk = await uniqueSlug(data.slug, id);
  const finalSlug = slugOk ?? data.slug;

  const { error: updateError } = await admin
    .from("products")
    .update({
      name: data.name,
      slug: finalSlug,
      category_id: data.category_id,
      short_description: data.short_description || null,
      description: data.description || null,
      price: data.price,
      price_on_request: data.price_on_request,
      specifications: data.specifications ?? [],
      is_featured: data.is_featured,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return { ok: false, message: updateError.message };
  }

  // Delete removed images from storage and DB.
  if (deleteImageIds.length > 0) {
    await deleteImages(deleteImageIds, admin);
  }

  // Upload new images.
  if (newFiles.length > 0) {
    await uploadImages(id, newFiles, data.alt_text || "", admin);
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  // Fetch image paths before deletion.
  const { data: images } = await admin
    .from("product_images")
    .select("id, storage_path")
    .eq("product_id", id);

  if (images && images.length > 0) {
    const paths = images.map((i: any) => i.storage_path);
    await admin.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);
  }

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateAll();
  return { ok: true };
}

export async function setPublishedStatus(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  const { error } = await admin
    .from("products")
    .update({ is_published: published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateAll();
  return { ok: true };
}

/* ===========================================================================
   Categories
   ========================================================================== */
export async function createCategory(
  name: string,
  slug: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const parsed = categorySchema.safeParse({ name, slug });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Validation failed." };
  }

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  const { data, error } = await admin
    .from("categories")
    .insert({ name: parsed.data.name, slug: parsed.data.slug })
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, message: error.message };
  revalidateAll();
  return { ok: true, data: { id: data!.id } };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await authorizeAction();
  if (!user) return { ok: false, message: "Unauthorized." };

  const admin = await createWriteClient();
  if (!admin) return { ok: false, message: "Database unavailable." };

  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateAll();
  return { ok: true };
}

/* ===========================================================================
   Image helpers
   ========================================================================== */
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_MB || "6") * 1024 * 1024;

async function uploadImages(
  productId: string,
  files: { name: string; base64: string; mimeType: string }[],
  altText: string,
  admin: Awaited<ReturnType<typeof createWriteClient>>,
) {
  if (!admin) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!ACCEPTED_TYPES.has(file.mimeType)) continue;

    const raw = Buffer.from(file.base64, "base64");
    if (raw.byteLength > MAX_BYTES) continue;

    const ext = file.mimeType.split("/")[1] ?? "jpg";
    // Safe, unique path: no trusting of client-supplied filenames.
    const path = `${productId}/${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(path, raw, {
        contentType: file.mimeType,
        upsert: false,
      });

    if (uploadError) continue;

    await admin.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      alt_text: altText || null,
      sort_order: i,
    });
  }
}

async function deleteImages(
  imageIds: string[],
  admin: Awaited<ReturnType<typeof createWriteClient>>,
) {
  if (!admin) return;

  const { data: images } = await admin
    .from("product_images")
    .select("id, storage_path")
    .in("id", imageIds);

  if (!images || images.length === 0) return;

  const paths = images.map((img: any) => img.storage_path);
  await admin.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);
  await admin.from("product_images").delete().in("id", imageIds);
}
