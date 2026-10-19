import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Architectural showcase grid. Imagery is illustrative of modern glass and
 * aluminium applications (the admin can later manage real project images
 * through Supabase). Each tile uses a subtle zoom on hover.
 */
const TILES = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a42ad1c2?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern glass curtain-wall facade on a commercial tower",
    label: "Curtain Wall Systems",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    alt: "Glass partition in a contemporary office interior",
    label: "Glass Partitions",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1545324424-1b6400c43a0c?auto=format&fit=crop&w=900&q=80",
    alt: "Aluminium window system with slim profiles",
    label: "Aluminium Windows",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1518780664697-55e3ad307909?auto=format&fit=crop&w=1200&q=80",
    alt: "Frameless glass balustrade on a staircase",
    label: "Glass Railings",
    span: "lg:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1505691938895-1758d852ea16?auto=format&fit=crop&w=900&q=80",
    alt: "Decorative glass detail with light transmission",
    label: "Decorative Glass",
    span: "",
  },
];

export function Showcase() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Architectural Showcase"
          title="Glass & aluminium in modern architecture"
          description="A look at how premium materials shape contemporary buildings, interiors and details. Imagery shown is illustrative."
          className="mb-12"
        />

        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[260px]">
            {TILES.map((tile) => (
              <figure
                key={tile.label}
                className={`group relative overflow-hidden rounded-2xl bg-canvas ${tile.span}`}
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" aria-hidden />
                <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {tile.label}
                  </span>
                  <span className="hidden sm:block h-px w-8 bg-white/60" aria-hidden />
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
