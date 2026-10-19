/**
 * Central check for whether Supabase is configured.
 *
 * The site must build and run even when no `.env.local` exists, so every
 * Supabase entry point consults this helper and falls back to a clear
 * "not configured" state instead of throwing.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function supabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
}
