import type { MetadataRoute } from "next";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { brand } from "@/lib/brand.config";
import { groq } from "next-sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = `https://${brand.client.domain}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  if (!isSanityConfigured) {
    return staticPages;
  }

  const postSlugs = await client
    .fetch<{ slug: string; updatedAt: string }[]>(
      groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
    )
    .catch(() => []);

  const blogPages: MetadataRoute.Sitemap = postSlugs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const serviceSlugs = await client
    .fetch<{ slug: string; updatedAt: string }[]>(
      groq`*[_type == "service" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
    )
    .catch(() => []);

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...servicePages];
}
