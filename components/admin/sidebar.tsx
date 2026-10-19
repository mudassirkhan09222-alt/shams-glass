"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Layers,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/dashboard/products", icon: Package },
  { label: "Add Product", href: "/admin/dashboard/products/new", icon: Plus },
  { label: "Categories", href: "/admin/dashboard/categories", icon: Layers },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="hidden md:flex w-64 flex-col sg-navy-gradient border-r border-white/8">
      <div className="px-5 py-6 border-b border-white/8">
        <Logo variant="light" />
      </div>

      <nav className="flex-1 py-4 px-3" aria-label="Admin navigation">
        <ul className="space-y-1">
          {NAV.map(({ label, href, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/70 hover:bg-white/8 hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-white/8 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ExternalLink className="h-4.5 w-4.5 shrink-0" aria-hidden />
          View Website
        </Link>
        <button
          type="button"
          onClick={() => startTransition(() => signOut())}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 disabled:opacity-60 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" aria-hidden />
          {pending ? "Signing out…" : "Sign out"}
        </button>

        <div className="px-3 pt-4">
          <p className="text-[0.65rem] text-white/40 truncate">{userEmail}</p>
        </div>
      </div>
    </aside>
  );
}
