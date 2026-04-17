import type { BrandConfig } from "@/types/brand";
import type { BlogPost, FAQ } from "@/types/sanity";

export function generateLocalBusinessSchema(brand: BrandConfig) {
  const { client, seo } = brand;

  return {
    "@context": "https://schema.org",
    "@type": seo.jsonLdType,
    name: client.name,
    description: client.description,
    url: `https://${client.domain}`,
    telephone: client.phone,
    email: client.email,
    ...(client.address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: client.address.city,
        addressRegion: client.address.region,
        postalCode: client.address.postalCode,
        addressCountry: client.address.country,
      },
    }),
    ...(client.logo && { logo: client.logo }),
    ...(client.founded && { foundingDate: client.founded }),
    ...(client.socials &&
      client.socials.length > 0 && {
        sameAs: client.socials.map((s) => s.url),
      }),
  };
}

export function generateArticleSchema(post: BlogPost, brand: BrandConfig) {
  const { client } = brand;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    url: `https://${client.domain}/blog/${post.slug.current}`,
    author: {
      "@type": "Person",
      name: post.author?.name || brand.blog.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: client.name,
      ...(client.logo && {
        logo: {
          "@type": "ImageObject",
          url: client.logo,
        },
      }),
    },
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.join(", "),
      }),
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
