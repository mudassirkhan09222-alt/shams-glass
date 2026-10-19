"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/session";
import type { ActionResult } from "@/types/database";

/**
 * Admin login. Authenticates with Supabase Auth, then verifies the signed-in
 * user's email is in the server-controlled ADMIN_EMAILS allowlist. Supabase
 * Auth alone is not sufficient — the allowlist check is enforced here on the
 * server.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<ActionResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Pre-check: reject non-admin emails early to avoid unnecessary auth calls.
  if (!isAdminEmail(cleanEmail)) {
    return { ok: false, message: "Invalid email or password." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Sign-in is unavailable. Supabase is not configured.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error || !data.user) {
    return { ok: false, message: "Invalid email or password." };
  }

  // Defense in depth: confirm the authenticated email is an admin.
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { ok: false, message: "Invalid email or password." };
  }

  return { ok: true };
}

/** End the admin session and return to the login page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
