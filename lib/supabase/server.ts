import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseUrl } from "./config-check";

/**
 * Create a Supabase client bound to the current request via cookies.
 *
 * Returns `null` when Supabase is not configured, so callers can render a
 * graceful "setup required" state instead of crashing the request.
 *
 * Usage in Server Components, Server Actions, and Route Handlers:
 *   const supabase = await createClient();
 *   if (!supabase) return notConfiguredState();
 */
export async function createClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl(), anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The Proxy refreshes the session, so it is safe to ignore here.
        }
      },
    },
    auth: {
      // Persist the session in cookies and auto-refresh on the server.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
