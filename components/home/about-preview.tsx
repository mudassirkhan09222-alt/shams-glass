import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80";

const PILLARS = [
  {
    title: "Quality",
    body: "Carefully selected glass and aluminium materials for lasting performance.",
  },
  {
    title: "Precision",
    body: "Attention to detail in measurements, finishes and installation planning.",
  },
  {
    title: "Customer Service",
    body: "Responsive guidance from enquiry through to project delivery.",
  },
];

export function AboutPreview() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <Container>
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <Reveal className="order-1 lg:order-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-canvas">
              <Image
                src={ABOUT_IMAGE}
                alt="Modern interior with floor-to-ceiling glazing and aluminium framing"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/30 to-transparent" aria-hidden />
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal as="span">
              <span className="sg-eyebrow">About Shams Glass</span>
            </Reveal>
            <Reveal as="h2" delay={0.08} className="mt-3">
              <span className="block text-3xl sm:text-4xl font-semibold text-navy tracking-tight leading-tight">
                Glass &amp; Aluminium Solutions Built Around Your Vision.
              </span>
            </Reveal>
            <Reveal as="p" delay={0.14} className="mt-5 text-ink-soft text-base sm:text-lg leading-relaxed">
              At Shams Glass, we bring clarity, functionality and modern design
              together through glass and aluminium solutions for a wide range of
              spaces and projects. Explore our collection and contact our team to
              discuss your requirements.
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={0.18 + i * 0.08}>
                  <div className="border-l-2 border-glass-200 pl-4">
                    <p className="font-semibold text-navy">{p.title}</p>
                    <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4} className="mt-10">
              <Button
                href="/about"
                variant="outline"
                size="md"
                iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                Learn More About Us
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
