import type { BrandConfig } from "@/types/brand";

/**
 * HAAZEL SCAFFOLD — Brand Configuration
 *
 * This is the SINGLE SOURCE OF TRUTH for your client's brand.
 * Everything derives from this file: CSS theme, metadata, SEO,
 * image generation prompts, auto-blog configuration, and more.
 *
 * To set up a new client:
 * 1. Fill out this config with client brand values
 * 2. Run: npx tsx scripts/setup-brand.ts
 * 3. The setup script generates globals.css theme, layout metadata, etc.
 */
export const brand: BrandConfig = {
  // ─── Identity ──────────────────────────────────────────────
  client: {
    name: "Haazel Studio",
    slug: "haazel-studio",
    domain: "haazelstudio.com",
    tagline: "Cinematic web experiences that convert",
    description:
      "Haazel Studio crafts cinematic, scroll-driven websites with bold design systems and conversion-focused architecture for ambitious brands.",
    phone: "(416) 555-0199",
    email: "hello@haazelstudio.com",
    address: {
      city: "Toronto",
      region: "Ontario",
      postalCode: "M5V 3L9",
      country: "CA",
    },
    socials: [
      { platform: "instagram", url: "https://instagram.com/haazelstudio" },
      { platform: "linkedin", url: "https://linkedin.com/company/haazelstudio" },
    ],
    founded: "2024",
  },

  // ─── Colors ────────────────────────────────────────────────
  // These generate Tailwind theme tokens via setup-brand.ts
  colors: {
    primary: "#6D28D9",        // Deep violet
    primaryDark: "#4C1D95",
    primaryLight: "#8B5CF6",
    secondary: "#0EA5E9",      // Sky blue
    accent: "#F59E0B",         // Amber
    background: "#09090B",     // Near black
    foreground: "#FAFAFA",     // Near white
    muted: "#18181B",
    mutedForeground: "#A1A1AA",
    card: "#1C1C22",
    cardForeground: "#FAFAFA",
    border: "#27272A",
  },

  // ─── Typography ────────────────────────────────────────────
  // Google Font names — loaded in layout.tsx via next/font/google
  typography: {
    display: "Space Grotesk",   // Hero headlines
    heading: "Inter",           // Section headings
    body: "Inter",              // Body text
    accent: "JetBrains Mono",   // Code, stats, accents
    mono: "JetBrains Mono",
  },

  // ─── Style Preset ──────────────────────────────────────────
  // Controls animation intensity, layout patterns, and component variants
  // Options: cinematic | minimalist | brutalist | luxury | corporate | creative | ecommerce
  stylePreset: "cinematic",

  // ─── Voice & Tone ──────────────────────────────────────────
  voice: {
    tone: ["confident", "direct", "modern"],
    adjectives: ["bold", "cinematic", "scroll-driven", "conversion-focused"],
    bannedPhrases: [
      "game-changer",
      "synergy",
      "leverage",
      "circle back",
      "deep dive",
      "at the end of the day",
    ],
    writingStyle:
      "Direct and punchy. Short paragraphs. No fluff. Lead with value. Use active voice.",
  },

  // ─── Sanity CMS ────────────────────────────────────────────
  sanity: {
    projectId: "REPLACE_ME",
    dataset: "production",
  },

  // ─── Auto-Blog Configuration ───────────────────────────────
  blog: {
    authorName: "Haazel Studio",
    authorBio: "We build cinematic web experiences that convert.",
    authorCredentials: "50+ cinematic websites launched, 4.9 Google rating",
    niche: "Web design and development",
    targetAudience: "Business owners and marketing teams",
    region: "Toronto, GTA",
    topicCategories: [
      "Web Design Trends",
      "Conversion Optimization",
      "Brand Identity",
      "SEO & Performance",
      "Animation & Motion",
      "Case Studies",
    ],
    voiceRules:
      "Confident, direct, modern. No hype. No banned phrases. No em dashes. Short paragraphs.",
    internalPages: [
      { slug: "/services", title: "Our Services" },
      { slug: "/about", title: "About Us" },
      { slug: "/contact", title: "Get in Touch" },
    ],
    ctaText: "Ready to build something cinematic?",
    ctaUrl: "/contact",
    schedule: "0 9 * * 2,4", // Tuesdays and Thursdays at 9am
  },

  // ─── Image Generation (FAL.ai) ────────────────────────────
  imagery: {
    style: "photorealistic",
    subjects: [
      "modern office spaces",
      "creative studios",
      "design workstations",
      "team collaboration",
      "website mockups on screens",
    ],
    lighting: ["studio lighting", "natural window light", "golden hour"],
    cameras: ["Canon 5D Mark IV", "Sony A7III"],
    lenses: ["35mm f/1.4", "85mm f/1.8", "24-70mm f/2.8"],
    avoidKeywords: [
      "no text",
      "no watermarks",
      "no logos",
      "no UI overlays",
      "no stock photo feel",
    ],
    colorTemperature: "warm neutral",
  },

  // ─── SEO ───────────────────────────────────────────────────
  seo: {
    primaryKeywords: [
      "cinematic web design",
      "scroll-driven websites",
      "Toronto web design agency",
    ],
    secondaryKeywords: [
      "GSAP animation websites",
      "conversion-focused design",
      "brand identity web design",
    ],
    servicePages: [
      { slug: "web-design", title: "Web Design" },
      { slug: "brand-identity", title: "Brand Identity" },
      { slug: "seo-optimization", title: "SEO Optimization" },
    ],
    jsonLdType: "ProfessionalService",
  },
};
