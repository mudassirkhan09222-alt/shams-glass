"use client";

import React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Package, Plus, Layers, ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

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

export function AdminTopBar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-white/95 backdrop-blur px-4 h-14">
        <Logo variant="dark" />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-canvas text-navy"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Desktop top area is empty (sidebar handles nav). */}
      <header className="hidden md:block px-8 py-4 bg-white border-b border-hairline text-right text-sm text-ink-muted">
        Signed in as <span className="text-navy font-medium">{userEmail}</span>
      </header>

      {open ? (
        <div className="md:hidden fixed inset-0 z-20 pt-14 sg-navy-gradient" role="dialog" aria-label="Mobile admin navigation">
          <nav className="py-4 px-4" aria-label="Admin navigation">
            <ul className="space-y-1">
              {NAV.map(({ label, href, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        active ? "bg-white/12 text-white" : "text-white/75 hover:text-white hover:bg-white/8",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-4 pt-4 border-t border-white/10 space-y-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white/75 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ExternalLink className="h-5 w-5" aria-hidden />
              View Website
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => signOut())}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white/75 hover:text-white hover:bg-white/8 disabled:opacity-60 transition-colors"
            >
              <LogOut className="h-5 w-5" aria-hidden />
              {pending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
