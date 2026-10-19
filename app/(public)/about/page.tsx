import type { Metadata } from "next";
import Image from "next/image";
import { Gem, Ruler, Headphones } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About — Shams Glass",
  description:
    "Shams Glass brings clarity, functionality and modern design together through glass and aluminium solutions for a wide range of spaces and projects.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    Icon: Gem,
    title: "Quality",
    body: "We work with carefully selected glass and aluminium materials, chosen for performance, finish and longevity.",
  },
  {
    Icon: Ruler,
    title: "Precision",
    body: "From measurements to finishes, we pay close attention to detail at every stage of the project.",
  },
  {
    Icon: Headphones,
    title: "Customer Service",
    body: "Responsive, straightforward communication from your first enquiry through to delivery.",
  },
];

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80";

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 md:pt-20 bg-canvas">
        <Container className="py-14 md:py-20 border-b border-hairline">
          <p className="sg-eyebrow">About Shams Glass</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl font-semibold text-navy tracking-tight leading-tight">
            Glass &amp; Aluminium Solutions Built Around Your Vision.
          </h1>
          <p className="mt-5 max-w-2xl text-ink-soft text-base sm:text-lg leading-relaxed">
            At Shams Glass, we bring clarity, functionality and modern design
            together through glass and aluminium solutions for a wide range of
            spaces and projects. Explore our collection and contact our team to
            discuss your requirements.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <Container>
          <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-canvas">
                <Image
                  src={ABOUT_IMAGE}
                  alt="Contemporary interior with extensive glazing and aluminium framing"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/25 to-transparent" aria-hidden />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="What we do"
                title="A curated approach to modern materials"
                description="We focus on a refined collection of glass and aluminium products and support you through every stage — from selecting the right solution to planning your project."
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {PILLARS.map(({ Icon, title, body }) => (
                  <Reveal key={title}>
                    <div className="border-l-2 border-glass-200 pl-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-glass text-corporate">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="mt-3 font-semibold text-navy">{title}</p>
                      <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-canvas">
        <Container>
          <div className="relative overflow-hidden rounded-3xl sg-navy-gradient text-white">
            <div className="sg-sheen absolute inset-0 opacity-40" aria-hidden />
            <div className="relative p-8 sm:p-12 lg:p-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Let&apos;s build something clear.
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                Tell us about your space and requirements. We&apos;ll help you find
                the right glass and aluminium solution.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/contact" variant="light" size="lg">
                  Contact Shams Glass
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
