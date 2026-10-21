import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import {
  BRAND,
  BUSINESS,
  NAV_LINKS,
  mailLink,
  whatsappLink,
} from "@/lib/config/site";
import { getPublicCategories } from "@/lib/products/queries";
import { DEFAULT_CATEGORIES } from "@/lib/config/site";

export async function Footer() {
  const { status, categories } = await getPublicCategories();
  // Fall back to default categories only for navigation affordance; these link
  // to the collection page (not fake category pages).
  const categoryLinks =
    status === "ok" && categories.length > 0
      ? categories
      : DEFAULT_CATEGORIES.map((name, i) => ({
          id: `default-${i}`,
          name,
          slug: null as string | null,
        }));

  const whatsapp = whatsappLink();
  const email = mailLink(BUSINESS.email);
  const year = new Date().getFullYear();

  return (
    <footer className="sg-navy-gradient text-white mt-auto">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand + description */}
          <div className="md:col-span-4">
            <Logo variant="light" href={null} />
            <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-xs">
              {BRAND.description}
            </p>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Chat on WhatsApp
              </a>
            ) : null}
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-glass">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-glass">
              Collection
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
              {categoryLinks.slice(0, 10).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-glass">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm">
              {BUSINESS.phone ? (
                /* Support comma-separated numbers e.g. "0333-2317102, 0312-8551171" */
                BUSINESS.phone.split(",").map((num) => {
                  const clean = num.trim();
                  const digits = clean.replace(/[^\d+]/g, "");
                  return (
                    <li key={clean}>
                      <a
                        href={`tel:${digits}`}
                        className="flex items-start gap-3 text-white/75 hover:text-white transition-colors"
                      >
                        <Phone className="h-4 w-4 mt-0.5 text-glass shrink-0" aria-hidden />
                        <span>{clean}</span>
                      </a>
                    </li>
                  );
                })
              ) : null}
              {email ? (
                <li>
                  <a
                    href={email}
                    className="flex items-start gap-3 text-white/75 hover:text-white transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 mt-0.5 text-glass shrink-0" aria-hidden />
                    <span>{BUSINESS.email}</span>
                  </a>
                </li>
              ) : null}
              {BUSINESS.address ? (
                <li>
                  <span className="flex items-start gap-3 text-white/75">
                    <MapPin className="h-4 w-4 mt-0.5 text-glass shrink-0" aria-hidden />
                    <span>{BUSINESS.address}</span>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/55">
            <span>Crafted for modern glass & aluminium architecture.</span>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              View collection
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
