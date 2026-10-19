import { Container } from "@/components/ui/container";
import { ProductGridSkeleton } from "@/components/products/product-explorer";

export default function ProductsLoading() {
  return (
    <>
      <section className="pt-16 md:pt-20 bg-canvas">
        <Container className="py-12 md:py-16 border-b border-hairline">
          <div className="sg-skeleton h-4 w-32 rounded-full" />
          <div className="sg-skeleton h-10 w-72 mt-4 rounded-lg" />
          <div className="sg-skeleton h-5 w-full max-w-xl mt-4 rounded" />
        </Container>
      </section>
      <section className="py-12 md:py-16 bg-canvas">
        <Container>
          <div className="sg-skeleton h-20 w-full rounded-2xl" />
          <ProductGridSkeleton />
        </Container>
      </section>
    </>
  );
}
