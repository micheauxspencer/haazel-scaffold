import type { MetadataRoute } from "next";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { brand } from "@/lib/brand.config";
import { siteRoutes, blogEnabled, servicesEnabled } from "@/lib/site-routes";
import { groq } from "next-sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = `https://${brand.client.domain}`;

  const staticPages: MetadataRoute.Sitemap = siteRoutes.map((route) => ({
    url: route.path === "/" ? siteUrl : `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  if (!isSanityConfigured) {
    return staticPages;
  }

  const blogPages: MetadataRoute.Sitemap = [];
  if (blogEnabled) {
    const postSlugs = await client
      .fetch<{ slug: string; updatedAt: string }[]>(
        groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
      )
      .catch(() => []);
    for (const post of postSlugs) {
      blogPages.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  const servicePages: MetadataRoute.Sitemap = [];
  if (servicesEnabled) {
    const serviceSlugs = await client
      .fetch<{ slug: string; updatedAt: string }[]>(
        groq`*[_type == "service" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
      )
      .catch(() => []);
    for (const service of serviceSlugs) {
      servicePages.push({
        url: `${siteUrl}/services/${service.slug}`,
        lastModified: new Date(service.updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return [...staticPages, ...blogPages, ...servicePages];
}
