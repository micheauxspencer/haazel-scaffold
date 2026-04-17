import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/PageHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "About Us",
  description: `Learn about ${brand.client.name} — ${brand.client.description}`,
  path: "/about",
});

const stats = [
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 4.9, label: "Google rating", decimals: 1 },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 2024, label: "Founded", prefix: "" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle={`The story behind ${brand.client.name} and why we build the way we build.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <AboutSection
        heading="Built for brands that refuse to blend in"
        description={`${brand.client.name} was founded with a simple conviction: websites should do more than exist. They should move people.\n\nWe craft cinematic, scroll-driven digital experiences using bold design systems and conversion-focused architecture. Every project starts with strategy and ends with measurable results.\n\nOur team brings together design, development, and marketing expertise under one roof. No handoffs to offshore teams. No cookie-cutter templates. Just focused, intentional work for ambitious brands.`}
        imageSrc="/images/about-team.jpg"
        imageAlt={`${brand.client.name} team collaborating on a project`}
      />

      <StatsCounter
        heading="By the numbers"
        stats={stats}
      />

      <CTASection
        heading="Let's build something remarkable"
        description="We partner with brands that are ready to stand out. Is that you?"
        ctaLabel="Start a Conversation"
        ctaHref="/contact"
      />
    </>
  );
}
