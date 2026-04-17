import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = brand.client.description,
    path = "",
    ogImage,
  } = options;

  const siteUrl = `https://${brand.client.domain}`;
  const url = `${siteUrl}${path}`;
  const fullTitle = title
    ? `${title} | ${brand.client.name}`
    : `${brand.client.name} - ${brand.client.tagline}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: brand.client.name,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
