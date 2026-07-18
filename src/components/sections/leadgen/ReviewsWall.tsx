"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";
import OffsetGrid from "@/components/primitives/OffsetGrid";

export interface Review {
  quote: string;
  author: string;
  source: string;
  /** 1–5. */
  rating: number;
  date?: string;
}

export interface ReviewsWallProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  /** First item is promoted to the oversized lead quote; the rest fill the grid. */
  reviews: Review[];
  /** Rendered under the grid — use to flag fixture/demo content clearly. */
  demoNotice?: string;
  className?: string;
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M10 1.6l2.47 5.4 5.93.63-4.45 4.02 1.24 5.85L10 14.6l-5.19 2.9 1.24-5.85L1.6 7.63l5.93-.63L10 1.6z"
            className={cn(
              "stroke-[1.1]",
              i < filled ? "fill-primary stroke-primary" : "fill-transparent stroke-muted-foreground/30",
            )}
          />
        </svg>
      ))}
    </div>
  );
}

/**
 * One review promoted to an oversized pull-quote (font-heading italic), the
 * rest in an OffsetGrid of hairline cards. Ratings render as inline SVG
 * stars filled via the primary token — never emoji, never an icon font.
 */
export default function ReviewsWall({
  id,
  rail,
  heading,
  intro,
  reviews,
  demoNotice,
  className = "",
}: ReviewsWallProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lead, ...rest] = reviews;

  useEffect(() => {
    if (reduced) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to("[data-review-rise]", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [reduced]);

  const rise = cn(reduced ? "" : "translate-y-6 opacity-0 will-change-transform");

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div ref={rootRef}>
        <div className="mb-[var(--content-gap)] max-w-2xl">
          <h2 className="text-heading font-heading font-medium">{heading}</h2>
          {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        </div>

        {lead && (
          <figure data-review-rise className={cn(rise, "mb-[calc(var(--content-gap)*1.2)] max-w-3xl")}>
            <blockquote className="font-heading text-subheading italic leading-snug">
              &ldquo;{lead.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex flex-wrap items-center gap-4">
              <Stars rating={lead.rating} />
              <span className="font-medium">{lead.author}</span>
              <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                {lead.source}
              </span>
              {lead.date && (
                <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                  {lead.date}
                </span>
              )}
            </figcaption>
          </figure>
        )}

        {rest.length > 0 && (
          <OffsetGrid columns={rest.length >= 3 ? 3 : 2}>
            {rest.map((review) => (
              <figure
                key={`${review.author}-${review.source}`}
                data-review-rise
                className={cn(
                  rise,
                  "flex h-full flex-col rounded-[var(--radius-lg)] border p-6",
                  "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
                )}
              >
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption
                  className={cn(
                    "mt-5 flex items-baseline justify-between gap-3 border-t pt-3",
                    "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
                  )}
                >
                  <span className="text-sm font-medium">{review.author}</span>
                  <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                    {review.source}
                  </span>
                </figcaption>
              </figure>
            ))}
          </OffsetGrid>
        )}

        {demoNotice && (
          <p className="mt-[var(--content-gap)] font-mono text-overline uppercase tracking-[0.14em] text-primary">
            {demoNotice}
          </p>
        )}
      </div>
    </SectionShell>
  );
}
