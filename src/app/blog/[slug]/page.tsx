import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { client } from "@/lib/sanity/client";
import {
  getPostBySlugQuery,
  getAllPostsQuery,
  getRecentPostsQuery,
} from "@/lib/sanity/queries";
import type { BlogPost as BlogPostType } from "@/types/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPost } from "@/components/blog/BlogPost";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post: BlogPostType | null = await client
    .fetch<BlogPostType | null>(getPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) {
    return generatePageMetadata({
      title: "Post Not Found",
      path: `/blog/${slug}`,
    });
  }

  return generatePageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
  });
}

export async function generateStaticParams() {
  const posts: BlogPostType[] = await client
    .fetch<BlogPostType[]>(getAllPostsQuery)
    .catch(() => []);

  return posts.map((post) => ({ slug: post.slug.current }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post: BlogPostType | null = await client
    .fetch<BlogPostType | null>(getPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) {
    notFound();
  }

  /* Fetch recent posts for "related" section, excluding current */
  const recentPosts: BlogPostType[] = await client
    .fetch<BlogPostType[]>(getRecentPostsQuery, { limit: 4 })
    .catch(() => []);

  const relatedPosts = recentPosts
    .filter((p) => p._id !== post._id)
    .slice(0, 3);

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogPost post={post} />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
              More from the blog
            </h2>
            <BlogGrid posts={relatedPosts} columns={3} />
          </div>
        </section>
      )}
    </>
  );
}
