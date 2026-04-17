import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/sanity";

interface BlogGridProps {
  posts: BlogPost[];
  columns?: 2 | 3;
  className?: string;
}

export function BlogGrid({ posts, columns = 3, className }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
