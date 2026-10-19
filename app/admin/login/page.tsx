import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";
import { getAdminUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config-check";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin/dashboard";

  // Already authenticated → skip the login form.
  const admin = await getAdminUser();
  if (admin) redirect(next);

  return (
    <div className="min-h-screen sg-navy-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo variant="light" href={null} showTagline={false} />
          </div>
          <p className="mt-4 text-sm text-white/70 uppercase tracking-[0.18em]">
            Admin Dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/8 backdrop-blur-md p-7 sm:p-8 shadow-xl">
          {!isSupabaseConfigured() ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
              <strong className="block font-semibold">Supabase not configured</strong>
              <p className="mt-1 leading-relaxed">
                Add your Supabase credentials to{" "}
                <code className="rounded bg-amber-400/20 px-1.5 py-0.5">.env.local</code>{" "}
                to enable admin login. See{" "}
                <code className="rounded bg-amber-400/20 px-1.5 py-0.5">supabase/SUPABASE_SETUP.md</code>.
              </p>
            </div>
          ) : (
            <AdminLoginForm next={next} />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          No public registration. Only authorized accounts may sign in.
        </p>
      </div>
    </div>
  );
}
