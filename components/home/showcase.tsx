import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckCircle2 } from "lucide-react";

const TILES = [
  {
    // Modern glass skyscraper curtain wall — blue glass facade
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85&auto=format&fit=crop",
    alt: "Modern glass curtain-wall facade on a commercial skyscraper",
    label: "Curtain Wall Systems",
    desc: "Full-height glazing for commercial facades",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    // Glass office partition interior — open plan with glass walls
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85&auto=format&fit=crop",
    alt: "Glass partition walls in a modern office interior",
    label: "Glass Partitions",
    desc: "Frameless & framed office dividers",
    span: "",
  },
  {
    // Aluminium window & door system on modern building
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85&auto=format&fit=crop",
    alt: "Modern building with aluminium window and door systems",
    label: "Aluminium Windows & Doors",
    desc: "Slim-profile systems for homes & offices",
    span: "",
  },
  {
    // Contemporary home with large glass panels & aluminium frames
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop",
    alt: "Contemporary home exterior with large glass panels and aluminium framing",
    label: "Glass Railings & Facades",
    desc: "Toughened glass balustrades & railings",
    span: "lg:col-span-2",
  },
  {
    // Frameless glass shower enclosure
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85&auto=format&fit=crop",
    alt: "Frameless glass shower enclosure in a modern bathroom",
    label: "Shower Enclosures",
    desc: "Custom frameless shower cubicles",
    span: "",
  },
];

const FEATURES = [
  { label: "All kinds of glass supply & fitting" },
  { label: "Building glass & façade contractors" },
  { label: "Aluminium shop fronts & windows" },
  { label: "Doors & partition specialists" },
  { label: "Custom glass solutions on request" },
  { label: "Residential & commercial projects" },
];

export function Showcase() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Architectural Showcase"
          title="Glass & Aluminium in Modern Architecture"
          description="From curtain walls and glass partitions to aluminium windows, doors and custom enclosures — Shams Glass covers every application."
          className="mb-12"
        />

        {/* Image grid */}
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] sm:auto-rows-[250px] lg:auto-rows-[270px]">
            {TILES.map((tile) => (
              <figure
                key={tile.label}
                className={`group relative overflow-hidden rounded-2xl bg-canvas ${tile.span}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.src}
                  alt={tile.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"
                  aria-hidden
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="block text-sm font-semibold text-white leading-tight">
                    {tile.label}
                  </span>
                  <span className="block text-xs text-white/75 mt-0.5">
                    {tile.desc}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        {/* Features strip */}
        <Stagger
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          delayChildren={0.1}
          staggerChildren={0.07}
        >
          {FEATURES.map((f) => (
            <StaggerItem key={f.label}>
              <div className="flex items-start gap-2.5 rounded-2xl border border-hairline bg-canvas p-4 h-full">
                <CheckCircle2
                  className="h-4 w-4 text-corporate shrink-0 mt-0.5"
                  aria-hidden
                />
                <span className="text-xs font-medium text-navy leading-snug">
                  {f.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
