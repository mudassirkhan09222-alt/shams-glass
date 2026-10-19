import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ProductCollection } from "@/components/home/product-collection";
import { AboutPreview } from "@/components/home/about-preview";
import { Benefits } from "@/components/home/benefits";
import { Showcase } from "@/components/home/showcase";
import { ContactSection } from "@/components/home/contact-section";

export const metadata: Metadata = {
  title: "Shams Glass — Premium Glass & Aluminium",
  description:
    "Discover refined glass and aluminium solutions for modern architecture, commercial spaces and elegant interiors. Explore the Shams Glass collection and request a quotation.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductCollection />
      <AboutPreview />
      <Benefits />
      <Showcase />
      <ContactSection />
    </>
  );
}
