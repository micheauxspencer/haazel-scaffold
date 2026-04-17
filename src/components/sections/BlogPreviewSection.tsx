import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/sanity";

interface BlogPreviewSectionProps {
  posts: BlogPost[];
  heading?: string;
  className?: string;
}

export function BlogPreviewSection({
  posts,
  heading = "Latest from the blog",
  className,
}: BlogPreviewSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
            {heading}
          </h2>
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:block"
          >
            View all posts &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all posts &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
