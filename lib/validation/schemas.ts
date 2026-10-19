import { z } from "zod";

/**
 * Validation schemas shared between client forms and server actions.
 * Keeping them in one module guarantees the same rules run on both sides.
 */

/** Contact form: name, email OR phone, message. */
export const contactSchema = z
  .object({
    name: z
      .string()
      .min(2, "Please enter your name.")
      .max(80, "Name is too long.")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email.")
      .max(120, "Email is too long.")
      .trim()
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .max(40, "Phone number is too long.")
      .trim()
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .min(10, "Please share a few details about your enquiry.")
      .max(2000, "Message is too long.")
      .trim(),
    // Honeypot: must stay empty. Humans never fill it.
    company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Please provide an email or a phone number.",
    path: ["email"],
  });

export type ContactInput = z.infer<typeof contactSchema>;

/** Specification row used inside the product form. */
export const specSchema = z.object({
  label: z.string().max(60).trim(),
  value: z.string().max(200).trim(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Enter a product name.").max(120).trim(),
  slug: z
    .string()
    .min(2, "Enter a slug.")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.")
    .trim(),
  category_id: z.string().uuid().nullable(),
  short_description: z.string().max(180, "Keep the short description brief.").trim().optional().or(z.literal("")),
  description: z.string().max(5000).trim().optional().or(z.literal("")),
  price: z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((v) => {
      if (v == null || v === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) && n >= 0 ? n : null;
    }),
  price_on_request: z.boolean(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  alt_text: z.string().max(200).trim().optional().or(z.literal("")),
  specifications: z.array(specSchema).max(30).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Enter a category name.").max(80).trim(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.")
    .trim(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
