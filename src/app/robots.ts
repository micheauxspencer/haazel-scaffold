import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand.config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `https://${brand.client.domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
