import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <section className="pt-16 md:pt-20 bg-canvas min-h-[60vh] flex items-center">
      <Container className="py-20 text-center">
        <p className="sg-eyebrow">Not found</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-navy tracking-tight">
          We couldn&apos;t find that product
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-ink-soft text-base sm:text-lg leading-relaxed">
          The product may have been removed or is not currently published. Browse
          the full collection to find what you&apos;re looking for.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/products" variant="primary" size="md">
            Browse the collection
          </Button>
        </div>
      </Container>
    </section>
  );
}
