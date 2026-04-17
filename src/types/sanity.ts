import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  bio?: string;
  credentials?: string;
  image?: SanityImage;
  slug: { current: string };
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: { current: string };
  description?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  _id: string;
  _type: "post";
  title: string;
  slug: { current: string };
  excerpt: string;
  tldr: string;
  keyTakeaways: string[];
  body: PortableTextBlock[] | string;
  faq: FAQ[];
  mainImage: SanityImage;
  imageAlt?: string;
  categories: Category[];
  author: Author;
  publishedAt: string;
  readingTime?: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tags?: string[];
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  title: string;
  description: string;
  ogImage?: SanityImage;
}

export interface ServicePage {
  _id: string;
  _type: "service";
  title: string;
  slug: { current: string };
  description: string;
  body: PortableTextBlock[];
  image?: SanityImage;
  order?: number;
}
