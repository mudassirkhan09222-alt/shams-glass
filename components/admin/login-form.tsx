"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "@/lib/auth/actions";

export function AdminLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn(email.trim(), password);
      if (result.ok) {
        router.push(next);
        router.refresh();
      } else {
        setError(result.message ?? "Sign-in failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-lg font-semibold text-white">Sign in</h1>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-3 text-sm text-red-300" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/90">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 block w-full h-11 rounded-xl border border-white/15 bg-white/8 px-3.5 text-sm text-white placeholder:text-white/40 focus:border-glass focus:outline-none transition-colors"
          placeholder="admin@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/90">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full h-11 rounded-xl border border-white/15 bg-white/8 pl-3.5 pr-10 text-sm text-white placeholder:text-white/40 focus:border-glass focus:outline-none transition-colors"
            placeholder="Your password"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-corporate text-sm font-semibold text-white hover:bg-corporate-700 disabled:opacity-60 transition-colors mt-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
