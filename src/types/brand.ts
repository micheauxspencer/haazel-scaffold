export type StylePreset =
  | "cinematic"
  | "minimalist"
  | "brutalist"
  | "luxury"
  | "corporate"
  | "creative"
  | "ecommerce";

export type JsonLdType =
  | "LocalBusiness"
  | "Organization"
  | "ProfessionalService";

export type ImageryStyle =
  | "photorealistic"
  | "illustration"
  | "abstract"
  | "editorial";

export interface BrandConfig {
  client: {
    name: string;
    slug: string;
    domain: string;
    tagline: string;
    description: string;
    phone?: string;
    email?: string;
    address?: {
      street?: string;
      city: string;
      region: string;
      postalCode?: string;
      country: string;
    };
    socials?: { platform: string; url: string }[];
    logo?: string;
    founded?: string;
  };

  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    border: string;
  };

  typography: {
    display: string;
    heading: string;
    body: string;
    accent?: string;
    mono?: string;
  };

  stylePreset: StylePreset;

  voice: {
    tone: string[];
    adjectives: string[];
    bannedPhrases: string[];
    writingStyle: string;
  };

  sanity: {
    projectId: string;
    dataset: string;
  };

  blog: {
    authorName: string;
    authorBio: string;
    authorCredentials: string;
    authorId?: string;
    niche: string;
    targetAudience: string;
    region: string;
    topicCategories: string[];
    voiceRules: string;
    internalPages: { slug: string; title: string }[];
    ctaText: string;
    ctaUrl: string;
    schedule: string;
  };

  imagery: {
    style: ImageryStyle;
    subjects: string[];
    lighting: string[];
    cameras: string[];
    lenses: string[];
    avoidKeywords: string[];
    colorTemperature?: string;
  };

  seo: {
    primaryKeywords: string[];
    secondaryKeywords?: string[];
    areaPages?: string[];
    servicePages?: { slug: string; title: string }[];
    jsonLdType: JsonLdType;
  };
}
