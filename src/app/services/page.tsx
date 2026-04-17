import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { client } from "@/lib/sanity/client";
import { getServicesQuery } from "@/lib/sanity/queries";
import type { ServicePage } from "@/types/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Services",
  description: `Explore the digital services offered by ${brand.client.name} — web design, development, brand identity, SEO, and more.`,
  path: "/services",
});

const fallbackServices = [
  {
    icon: "Palette",
    title: "Web Design",
    description:
      "Cinematic, scroll-driven websites that captivate visitors and elevate your brand presence.",
    href: "/services/web-design",
  },
  {
    icon: "Code",
    title: "Web Development",
    description:
      "Fast, accessible, and future-proof builds using Next.js, React, and modern tooling.",
    href: "/services/web-development",
  },
  {
    icon: "Sparkles",
    title: "Brand Identity",
    description:
      "Cohesive visual systems from logo to typography that make your brand unmistakable.",
    href: "/services/brand-identity",
  },
  {
    icon: "Search",
    title: "SEO Optimization",
    description:
      "Technical SEO, structured data, and content strategy that drives organic traffic.",
    href: "/services/seo-optimization",
  },
  {
    icon: "BarChart3",
    title: "Conversion Strategy",
    description:
      "Data-informed layouts and CTA architecture that turn visitors into customers.",
    href: "/services/conversion-strategy",
  },
  {
    icon: "MonitorSmartphone",
    title: "Responsive Design",
    description:
      "Pixel-perfect experiences across every device and screen size, no compromises.",
    href: "/services/responsive-design",
  },
];

const iconByTitle: Record<string, string> = {
  "Web Design": "Palette",
  "Web Development": "Code",
  "Brand Identity": "Sparkles",
  "SEO Optimization": "Search",
  "Conversion Strategy": "BarChart3",
  "Responsive Design": "MonitorSmartphone",
};

export default async function ServicesPage() {
  const sanityServices: ServicePage[] = await client
    .fetch<ServicePage[]>(getServicesQuery)
    .catch(() => []);

  const services =
    sanityServices.length > 0
      ? sanityServices.map((s) => ({
          icon: iconByTitle[s.title] ?? "Sparkles",
          title: s.title,
          description: s.description,
          href: `/services/${s.slug.current}`,
        }))
      : fallbackServices;

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="End-to-end digital services for brands that refuse to blend in."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      <ServicesGrid services={services} columns={3} />

      <CTASection
        heading="Ready to elevate your digital presence?"
        description="Tell us about your project and we'll show you what's possible."
        ctaLabel="Get a Free Consultation"
        ctaHref="/contact"
      />
    </>
  );
}
