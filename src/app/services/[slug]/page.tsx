import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { client } from "@/lib/sanity/client";
import { getServiceBySlugQuery, getServicesQuery } from "@/lib/sanity/queries";
import type { ServicePage } from "@/types/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/sections/CTASection";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/* Fallback service data when Sanity is not configured */
const fallbackServices: Record<string, { title: string; description: string; body: string }> = {
  "web-design": {
    title: "Web Design",
    description: "Cinematic, scroll-driven websites that captivate visitors and elevate your brand.",
    body: "<p>We design websites that tell your brand story through motion, layout, and intentional interaction. Every scroll, every transition, every element is placed with purpose.</p><p>Our design process starts with deep brand discovery and competitive analysis, then moves through wireframes, high-fidelity mockups, and interactive prototypes before a single line of code is written.</p><p>The result: websites that don't just look beautiful — they convert.</p>",
  },
  "web-development": {
    title: "Web Development",
    description: "Fast, accessible, and future-proof builds using Next.js, React, and modern tooling.",
    body: "<p>We build on Next.js, React, and TypeScript — the same stack powering the world's fastest sites. Every build ships with perfect Lighthouse scores, semantic HTML, and fully accessible markup.</p><p>Our development workflow includes automated testing, CI/CD pipelines, and edge deployment for global performance. No WordPress. No page builders. Just clean, maintainable code.</p>",
  },
  "brand-identity": {
    title: "Brand Identity",
    description: "Cohesive visual systems that make your brand unmistakable.",
    body: "<p>Your brand is more than a logo. We craft complete visual identity systems — from color palettes and typography to iconography and motion language — that work seamlessly across every touchpoint.</p><p>Every brand system we deliver includes comprehensive guidelines, asset libraries, and implementation documentation so your team can maintain consistency at scale.</p>",
  },
  "seo-optimization": {
    title: "SEO Optimization",
    description: "Technical SEO, structured data, and content strategy that drives organic traffic.",
    body: "<p>We engineer websites for search visibility from the ground up. Technical SEO is baked into every build — structured data, semantic markup, Core Web Vitals optimization, and crawl-friendly architecture.</p><p>Beyond the technical foundation, we develop content strategies aligned with search intent, build authority through targeted blog content, and track performance with transparent reporting.</p>",
  },
  "conversion-strategy": {
    title: "Conversion Strategy",
    description: "Data-informed layouts and CTA architecture that turn visitors into customers.",
    body: "<p>Beautiful design means nothing if it doesn't convert. We approach every layout with conversion architecture in mind — strategic CTA placement, trust signals, social proof, and friction-free user flows.</p><p>Our process includes heatmap analysis, A/B testing recommendations, and ongoing optimization support to continuously improve your conversion metrics.</p>",
  },
  "responsive-design": {
    title: "Responsive Design",
    description: "Pixel-perfect experiences across every device and screen size.",
    body: "<p>Over 60% of web traffic is mobile. We design mobile-first, then scale up — ensuring every interaction feels native on phones, tablets, laptops, and ultrawide displays.</p><p>Our responsive approach goes beyond breakpoints. We optimize touch targets, loading strategies, and interaction patterns for each device class to deliver the best possible experience everywhere.</p>",
  },
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  const service: ServicePage | null = await client
    .fetch<ServicePage | null>(getServiceBySlugQuery, { slug })
    .catch(() => null);

  const fallback = fallbackServices[slug];
  const title = service?.title ?? fallback?.title ?? "Service";
  const description = service?.description ?? fallback?.description ?? brand.client.description;

  return generatePageMetadata({
    title,
    description,
    path: `/services/${slug}`,
  });
}

export async function generateStaticParams() {
  const services: ServicePage[] = await client
    .fetch<ServicePage[]>(getServicesQuery)
    .catch(() => []);

  if (services.length > 0) {
    return services.map((s) => ({ slug: s.slug.current }));
  }

  return Object.keys(fallbackServices).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  const service: ServicePage | null = await client
    .fetch<ServicePage | null>(getServiceBySlugQuery, { slug })
    .catch(() => null);

  const fallback = fallbackServices[slug];

  if (!service && !fallback) {
    notFound();
  }

  const title = service?.title ?? fallback?.title ?? "Service";
  const description = service?.description ?? fallback?.description ?? "";
  const bodyHtml = fallback?.body ?? "";

  return (
    <>
      <PageHero
        title={title}
        subtitle={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: title },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {service?.body ? (
            <ServiceBody body={service.body} />
          ) : (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          )}
        </div>
      </section>

      <CTASection
        heading={`Ready to get started with ${title.toLowerCase()}?`}
        description="Let's discuss how we can help your brand stand out."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </>
  );
}

/* Portable Text renderer for Sanity body content */
function ServiceBody({
  body,
}: {
  body: import("@portabletext/react").PortableTextBlock[];
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PortableText } = require("@portabletext/react") as typeof import("@portabletext/react");
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <PortableText value={body} />
      </div>
    );
  } catch {
    return (
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {body.map((block, i) => {
          if (block._type === "block" && Array.isArray(block.children)) {
            const text = (block.children as { text?: string }[])
              .map((c) => c.text ?? "")
              .join("");
            return <p key={i}>{text}</p>;
          }
          return null;
        })}
      </div>
    );
  }
}
