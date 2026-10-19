import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft, ArrowRight, Phone, Mail, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/motion";
import {
  getPublishedProductBySlug,
  getRelatedProducts,
} from "@/lib/products/queries";
import { BUSINESS, mailLink, telLink } from "@/lib/config/site";
import { formatPrice } from "@/lib/utils";

// Memoize so generateMetadata and the page share one fetch per request.
const getProduct = cache((slug: string) => getPublishedProductBySlug(slug));

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: true },
    };
  }
  const ogImage = product.images?.[0]?.public_url;
  return {
    title: product.name,
    description:
      product.short_description ||
      product.description ||
      `${product.name} — premium glass and aluminium solution by Shams Glass.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
      type: "article",
      url: `/products/${product.slug}`,
      images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 3);
  const price = product.price_on_request || product.price == null
    ? "Price on Request"
    : formatPrice(product.price);
  const phone = telLink(BUSINESS.phone);
  const email = mailLink(BUSINESS.email);

  return (
    <>
      <section className="pt-16 md:pt-20 bg-canvas">
        <Container className="py-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-corporate transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to products
          </Link>
        </Container>
      </section>

      <section className="pb-16 md:pb-20 bg-canvas">
        <Container>
          <div className="grid gap-10 lg:gap-14 lg:grid-cols-2">
            <Reveal>
              <ProductGallery images={product.images} productName={product.name} />
            </Reveal>

            <div>
              <Reveal as="span">
                {product.category ? (
                  <Badge tone="corporate">
                    <Tag className="h-3 w-3" aria-hidden />
                    {product.category.name}
                  </Badge>
                ) : (
                  <Badge tone="neutral">Glass & Aluminium</Badge>
                )}
              </Reveal>

              <Reveal as="h1" delay={0.06} className="mt-4">
                <span className="block text-3xl sm:text-4xl font-semibold text-navy tracking-tight leading-tight">
                  {product.name}
                </span>
              </Reveal>

              <Reveal delay={0.12} className="mt-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-corporate">{price}</span>
                  {product.price_on_request || product.price == null ? (
                    <span className="text-sm text-ink-muted">
                      Contact us for a tailored quotation
                    </span>
                  ) : null}
                </div>
              </Reveal>

              {product.short_description ? (
                <Reveal as="p" delay={0.16} className="mt-5 text-ink-soft text-base sm:text-lg leading-relaxed">
                  {product.short_description}
                </Reveal>
              ) : null}

              <Reveal delay={0.2} className="mt-7 flex flex-wrap gap-3">
                <WhatsAppButton
                  productName={product.name}
                  label="Enquire on WhatsApp"
                  size="md"
                />
                <Button
                  href="/contact"
                  variant="primary"
                  size="md"
                  iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
                >
                  Request a Quote
                </Button>
              </Reveal>

              {(phone || email) ? (
                <Reveal delay={0.24} className="mt-5 flex flex-wrap gap-5 text-sm text-ink-soft">
                  {phone ? (
                    <a href={phone} className="inline-flex items-center gap-2 hover:text-corporate transition-colors">
                      <Phone className="h-4 w-4 text-corporate" aria-hidden />
                      {BUSINESS.phone}
                    </a>
                  ) : null}
                  {email ? (
                    <a href={email} className="inline-flex items-center gap-2 hover:text-corporate transition-colors">
                      <Mail className="h-4 w-4 text-corporate" aria-hidden />
                      {BUSINESS.email}
                    </a>
                  ) : null}
                </Reveal>
              ) : null}

              {product.description ? (
                <Reveal delay={0.28} className="mt-10">
                  <h2 className="text-lg font-semibold text-navy">Overview</h2>
                  <div className="mt-4 text-ink-soft leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </Reveal>
              ) : null}

              {product.specifications && product.specifications.length > 0 ? (
                <Reveal delay={0.3} className="mt-10">
                  <h2 className="text-lg font-semibold text-navy">Technical specifications</h2>
                  <dl className="mt-4 divide-y divide-hairline rounded-2xl border border-hairline overflow-hidden">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="grid grid-cols-3 px-5 py-3.5 bg-white">
                        <dt className="col-span-1 text-sm font-medium text-ink-muted">
                          {spec.label}
                        </dt>
                        <dd className="col-span-2 text-sm text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}
            </div>
          </div>

          {related.length > 0 ? (
            <div className="mt-20">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold text-navy tracking-tight">
                  Related products
                </h2>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-corporate hover:text-corporate-700 transition-colors"
                >
                  View all
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
