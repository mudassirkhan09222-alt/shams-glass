"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, QUOTE_LINK } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        closeBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The homepage hero sits under the navbar, so it can start transparent.
  // Every other route shows a solid bar immediately.
  const solid = scrolled || !isHome;
  const logoVariant = solid ? "dark" : "light";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          solid
            ? "bg-white/85 backdrop-blur-md border-b border-hairline shadow-[0_8px_30px_-20px_rgba(16,45,80,0.25)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="sg-container flex h-16 md:h-20 items-center justify-between gap-4"
        >
          <Logo variant={logoVariant} />

          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      solid
                        ? active
                          ? "text-navy"
                          : "text-ink-soft hover:text-navy"
                        : active
                          ? "text-white"
                          : "text-white/75 hover:text-white",
                    )}
                  >
                    {link.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full",
                          solid ? "bg-corporate" : "bg-glass",
                        )}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Button
              href={QUOTE_LINK}
              variant={solid ? "primary" : "light"}
              size="sm"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
            >
              Request a Quote
            </Button>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className={cn(
              "md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors",
              solid
                ? "text-navy hover:bg-canvas"
                : "text-white hover:bg-white/10",
            )}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </nav>
      </div>

      <MobileMenu
        open={open}
        panelId={panelId}
        pathname={pathname}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}

function MobileMenu({
  open,
  panelId,
  pathname,
  onClose,
}: {
  open: boolean;
  panelId: string;
  pathname: string;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={panelId}
          className="md:hidden fixed inset-x-0 top-16 bottom-0 sg-navy-gradient text-white z-40"
          initial={{ opacity: 0, y: prefersReduced ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReduced ? 0 : -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sg-container flex h-full flex-col py-8">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: prefersReduced ? 0 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/85 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {link.label}
                      <ArrowRight className="h-5 w-5 opacity-60" aria-hidden />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-auto pt-8">
              <Button
                href={QUOTE_LINK}
                variant="light"
                size="lg"
                className="w-full"
                iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
