import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config-check";

/**
 * Authorization model for the Shams Glass admin dashboard.
 *
 * Supabase Auth alone is NOT sufficient authorization. A user must be both:
 *   1. Authenticated with Supabase (verified with `auth.getUser()`, which
 *      makes a network call to the Auth server — never trust `getSession`
 *      for authorization because the session token is not re-validated).
 *   2. Present in the server-controlled `ADMIN_EMAILS` allowlist.
 *
 * The allowlist lives in an environment variable, so ordinary users cannot
 * modify it. This keeps admin access off the public database/RLS surface.
 */
export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0 && email.includes("@"));
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/**
 * Returns the currently authenticated user, or null if not signed in or if
 * Supabase is not configured. Uses `getUser()` so identity is verified by the
 * Auth server rather than trusting the (potentially stale) session cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Returns the authenticated admin user, or null if the visitor is not an
 * authorized admin. Use this in pages/components that want to branch on auth
 * without forcing a redirect.
 */
export async function getAdminUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!isAdminEmail(user.email)) return null;
  return user;
}

/**
 * Guard for admin pages and Server Actions. Returns the admin user. If the
 * visitor is not authenticated or not an authorized admin, redirects to the
 * login page (with an optional `next` destination). When Supabase is not
 * configured, also redirects to login, which will show a setup notice.
 */
export async function requireAdmin(next?: string): Promise<User> {
  const admin = await getAdminUser();
  if (!admin) {
    const loginUrl = next
      ? `/admin/login?next=${encodeURIComponent(next)}`
      : "/admin/login";
    redirect(loginUrl);
  }
  return admin;
}

/**
 * Re-throwable authorization check for Server Actions. Unlike `requireAdmin`
 * (which redirects), this returns a result the action can surface to the
 * client. Returns the user when authorized, or null otherwise.
 */
export async function authorizeAction(): Promise<User | null> {
  return getAdminUser();
}
