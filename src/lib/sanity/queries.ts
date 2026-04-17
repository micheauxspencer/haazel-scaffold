import { groq } from "next-sanity";

const postFields = groq`
  _id,
  _type,
  title,
  slug,
  excerpt,
  tldr,
  keyTakeaways,
  body,
  faq,
  mainImage,
  publishedAt,
  readingTime,
  seoTitle,
  seoDescription,
  primaryKeyword,
  secondaryKeywords,
  tags,
  "author": author->{_id, name, slug, bio, credentials, image},
  "categories": categories[]->{_id, title, slug, description}
`;

export const getAllPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const getPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`;

export const getRecentPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [0...$limit] {
    ${postFields}
  }
`;

export const getAllCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    ogImage
  }
`;

export const getServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    body,
    image,
    order
  }
`;

export const getServiceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    body,
    image,
    order
  }
`;
