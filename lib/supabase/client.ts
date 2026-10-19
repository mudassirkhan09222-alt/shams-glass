import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseUrl } from "./config-check";

/**
 * Browser Supabase client for Client Components (e.g. realtime subscriptions).
 *
 * Returns `null` when Supabase is not configured so client code can degrade
 * gracefully. The public site mostly reads data through Server Components,
 * so this client is only used where browser-side Supabase access is needed.
 */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  return createBrowserClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
