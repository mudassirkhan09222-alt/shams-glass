import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/public-layout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="pt-16 md:pt-20 bg-canvas min-h-[70vh] flex items-center">
        <Container className="py-24 text-center">
          <p className="sg-eyebrow">Error 404</p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold text-navy tracking-tight">
            Page not found
          </h1>
          <p className="mt-5 max-w-lg mx-auto text-ink-soft text-base sm:text-lg leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
            Let&apos;s get you back to something useful.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/" variant="primary" size="md">
              Return home
            </Button>
            <Button href="/products" variant="outline" size="md">
              Browse products
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
