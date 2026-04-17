import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/sanity";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogCard({ post, className }: BlogCardProps) {
  const href = `/blog/${post.slug.current}`;

  return (
    <Link href={href} className={cn("group block", className)}>
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-primary/30">
        {/* Image */}
        {post.mainImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.mainImage.asset._ref}
              alt={post.imageAlt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader>
          {/* Category badge */}
          {post.categories?.[0] && (
            <div className="mb-1">
              <Badge variant="secondary" className="text-xs">
                {post.categories[0].title}
              </Badge>
            </div>
          )}

          <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">
            {post.title}
          </CardTitle>

          <CardDescription className="line-clamp-2">
            {post.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.readingTime && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
