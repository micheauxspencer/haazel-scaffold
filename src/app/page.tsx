import { brand } from "@/lib/brand.config";
import { client } from "@/lib/sanity/client";
import { getRecentPostsQuery } from "@/lib/sanity/queries";
import type { BlogPost } from "@/types/sanity";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CTASection } from "@/components/sections/CTASection";
const demoServices = [
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

const demoStats = [
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 4.9, label: "Google rating", decimals: 1 },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 3, suffix: "x", label: "Avg. conversion lift" },
];

const demoTestimonials = [
  {
    quote:
      "They transformed our online presence completely. The cinematic scrolling and bold design tripled our lead generation in three months.",
    name: "Sarah Chen",
    role: "CMO, Apex Ventures",
  },
  {
    quote:
      "Working with this team felt effortless. They nailed our brand voice and delivered a site that actually converts, not just looks pretty.",
    name: "Marcus Rivera",
    role: "Founder, Riviera Health",
  },
  {
    quote:
      "Our new website loads in under a second and ranks on page one for our top keywords. The ROI has been incredible.",
    name: "Emily Nakamura",
    role: "Director of Marketing, Solstice Co.",
  },
];

export default async function HomePage() {
  const posts: BlogPost[] = await client
    .fetch<BlogPost[]>(getRecentPostsQuery, { limit: 3 })
    .catch(() => []);

  return (
    <>
      <HeroSection
        variant="parallax"
        headline={brand.client.tagline}
        subheadline={brand.client.description}
        backgroundImage="/images/hero-bg.jpg"
        ctas={[
          { label: "View Our Work", href: "/services", variant: "default" },
          { label: "Get in Touch", href: "/contact", variant: "outline" },
        ]}
      />

      <AboutSection
        heading={`Why ${brand.client.name}?`}
        description={`We build cinematic, scroll-driven websites for ambitious brands. Every pixel, every interaction, every line of code is crafted to convert visitors into customers.\n\nOur approach blends bold design systems with conversion-focused architecture. No templates. No shortcuts. Just work that moves the needle.`}
        imageSrc="/images/about-preview.jpg"
        imageAlt={`${brand.client.name} team at work`}
        stats={[
          { value: 50, suffix: "+", label: "Projects launched" },
          { value: 98, suffix: "%", label: "Client satisfaction" },
          { value: 3, suffix: "x", label: "Avg. conversion lift" },
        ]}
      />

      <ServicesGrid
        heading="What we do"
        subtitle="End-to-end digital services for brands that refuse to blend in."
        services={demoServices}
        columns={3}
      />

      <StatsCounter
        heading="Results that speak"
        stats={demoStats}
      />

      <TestimonialsSection
        heading="What our clients say"
        subtitle="Real results from real partnerships."
        testimonials={demoTestimonials}
      />

      <BlogPreviewSection posts={posts} heading="Latest from the blog" />

      <CTASection
        heading="Ready to build something cinematic?"
        description="Let's turn your vision into a scroll-stopping digital experience."
        ctaLabel="Start a Project"
        ctaHref="/contact"
      />
    </>
  );
}
