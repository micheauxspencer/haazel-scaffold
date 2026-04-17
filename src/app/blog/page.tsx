import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { client } from "@/lib/sanity/client";
import { getAllPostsQuery } from "@/lib/sanity/queries";
import type { BlogPost } from "@/types/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description: `Insights on ${brand.blog.niche.toLowerCase()} from the ${brand.client.name} team. Tips, trends, and case studies.`,
  path: "/blog",
});

export default async function BlogPage() {
  const posts: BlogPost[] = await client
    .fetch<BlogPost[]>(getAllPostsQuery)
    .catch(() => []);

  return (
    <>
      <PageHero
        title="Blog"
        subtitle={`Insights, tips, and trends in ${brand.blog.niche.toLowerCase()} from our team.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={posts} columns={3} />
        </div>
      </section>
    </>
  );
}
