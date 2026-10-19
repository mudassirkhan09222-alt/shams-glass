import { Gem, Layers, FileText, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const BENEFITS = [
  {
    Icon: Gem,
    title: "Quality-Focused Products",
    body: "A curated collection of glass and aluminium materials chosen for performance and finish.",
  },
  {
    Icon: Layers,
    title: "Solutions for Different Applications",
    body: "From facades and partitions to enclosures and custom builds, the range adapts to your space.",
  },
  {
    Icon: FileText,
    title: "Clear Product Information",
    body: "Honest specifications and imagery for every product so you can decide with confidence.",
  },
  {
    Icon: MessageSquare,
    title: "Direct Customer Enquiries",
    body: "Speak with the Shams Glass team directly for tailored advice and project quotations.",
  },
];

export function Benefits() {
  return (
    <section className="py-20 md:py-28 bg-canvas">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Shams Glass"
          title="A refined approach to glass & aluminium"
          description="We combine curated materials, clear information and direct support to help you move from idea to finished project."
          className="mb-12"
        />

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="sg-card h-full rounded-2xl border border-hairline bg-white p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-glass text-corporate">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
