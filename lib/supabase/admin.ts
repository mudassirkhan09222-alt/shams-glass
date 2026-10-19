import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isServiceRoleConfigured, supabaseUrl } from "./config-check";

/**
 * Privileged Supabase client using the service role key.
 *
 * SERVER ONLY — `server-only` guards this module. The service role key bypasses
 * RLS, so this client is used exclusively for admin writes (product create /
 * update / delete, image upload / cleanup) and only after the caller has
 * verified the user is an authorized admin via `requireAdmin()`.
 *
 * Returns `null` when the service role key is not configured; admin mutations
 * then fall back to the per-request `server` client, which respects RLS.
 */
export function createAdminClient(): SupabaseClient | null {
  if (!isServiceRoleConfigured()) return null;

  return createClient(supabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      // The service role client should not manage user sessions.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Pick the privileged client for a write operation.
 *
 * Prefers the service role client when available; otherwise returns the
 * per-request cookie client so writes go through RLS policies (which allow
 * authenticated admins to write).
 */
export async function createWriteClient(): Promise<SupabaseClient | null> {
  const admin = createAdminClient();
  if (admin) return admin;

  // Fall back to the cookie-bound server client (RLS enforces admin access).
  const { createClient } = await import("./server");
  return createClient();
}
