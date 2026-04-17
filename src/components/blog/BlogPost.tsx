import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BlogPost as BlogPostType } from "@/types/sanity";

interface BlogPostProps {
  post: BlogPostType;
  className?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogPost({ post, className }: BlogPostProps) {
  // Article JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name,
    },
    ...(post.mainImage && {
      image: post.mainImage.asset._ref,
    }),
  };

  // FAQ schema if FAQ zone exists
  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <article className={cn("mx-auto max-w-3xl", className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <header className="mb-10 space-y-4">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <Badge key={cat._id} variant="secondary">
                {cat.title}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {post.author && <span>By {post.author.name}</span>}
          <span aria-hidden="true">&middot;</span>
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
      </header>

      {/* Featured image */}
      {post.mainImage && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.mainImage.asset._ref}
            alt={post.imageAlt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* TLDR zone */}
      {post.tldr && (
        <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            TL;DR
          </p>
          <p className="text-sm leading-relaxed text-foreground">{post.tldr}</p>
        </div>
      )}

      {/* Key Takeaways */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <div className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key Takeaways
          </p>
          <ul className="space-y-2">
            {post.keyTakeaways.map((takeaway, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
              >
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Body */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {typeof post.body === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        ) : (
          <PortableTextRenderer value={post.body} />
        )}
      </div>

      {/* FAQ zone */}
      {post.faq && post.faq.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-2xl font-bold text-foreground font-display">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {post.faq.map((item, index) => (
              <div key={index}>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------
 * Portable Text renderer
 * Uses @portabletext/react when body is PortableTextBlock[].
 * Falls back to a simple paragraph if import is unavailable.
 * ------------------------------------------------------------------ */

function PortableTextRenderer({
  value,
}: {
  value: import("@portabletext/react").PortableTextBlock[];
}) {
  try {
    // Dynamic require kept inside a try so the build doesn't break
    // if @portabletext/react hasn't been installed yet.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PortableText } = require("@portabletext/react") as typeof import("@portabletext/react");
    return <PortableText value={value} />;
  } catch {
    // Fallback: render raw text blocks
    return (
      <>
        {value.map((block, i) => {
          if (block._type === "block" && Array.isArray(block.children)) {
            const text = (block.children as { text?: string }[])
              .map((c) => c.text ?? "")
              .join("");
            return <p key={i}>{text}</p>;
          }
          return null;
        })}
      </>
    );
  }
}
