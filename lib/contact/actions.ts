"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation/schemas";
import type { ActionResult } from "@/types/database";

/**
 * In-memory rate limiter for the contact form. Keyed by IP address with a
 * rolling window. (Best-effort; serverless instances may reset independently,
 * which only makes the limiter more permissive, never less.)
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 3;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

function isDeliveryConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_FORM_TO &&
      process.env.CONTACT_FORM_FROM,
  );
}

async function sendViaResend(input: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY!;
  const to = process.env.CONTACT_FORM_TO!;
  const from = process.env.CONTACT_FORM_FROM!;

  const replyTo = input.email || undefined;
  const text = [
    `New enquiry from the Shams Glass contact form.`,
    ``,
    `Name: ${input.name}`,
    input.email ? `Email: ${input.email}` : null,
    input.phone ? `Phone: ${input.phone}` : null,
    ``,
    `Message:`,
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: `New website enquiry from ${input.name}`,
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitContact(
  raw: unknown,
): Promise<ActionResult> {
  // Identify the requester for rate limiting.
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  // Honeypot: if the hidden "company" field is filled, treat it as spam.
  // We silently drop it (no human ever fills it) without faking success.
  const asAny = (raw ?? {}) as Record<string, unknown>;
  if (typeof asAny.company === "string" && asAny.company.length > 0) {
    return { ok: true, message: "Thanks — your enquiry has been received." };
  }

  if (!rateLimit(ip)) {
    return {
      ok: false,
      message:
        "You've sent several enquiries recently. Please wait a minute and try again.",
    };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Please check the form.";
    return { ok: false, message: firstError };
  }
  const data = parsed.data;

  if (!isDeliveryConfigured()) {
    return {
      ok: false,
      message:
        "Email delivery is not configured yet. Please contact us directly using the phone or email shown on this page, and we'll respond as soon as possible.",
    };
  }

  const sent = await sendViaResend({
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    message: data.message,
  });

  if (!sent) {
    return {
      ok: false,
      message:
        "We couldn't deliver your message right now. Please try again or contact us directly using the details on this page.",
    };
  }

  return { ok: true, message: "Thank you — your enquiry has been sent. We'll be in touch shortly." };
}
