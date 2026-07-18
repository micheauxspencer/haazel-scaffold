import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import LayeredHeadline from "@/components/primitives/LayeredHeadline";
import { OverlapField, OverlapItem } from "@/components/primitives/OverlapField";

export interface ProductHeroProps {
  id?: string;
  rail?: { label: string; meta?: string };
  /** Small pill above the headline ("Drop 002 — Live now"). */
  badge?: string;
  eyebrow?: string;
  headline: { primary: string; overlay?: string; secondary?: string };
  description?: string;
  price: {
    amount: string;
    /** Defaults to "$". */
    symbol?: string;
    /** Mono unit set beside the amount ("CAD"). */
    currency?: string;
    /** Struck-through prior price. */
    compareAt?: string;
  };
  /** Mono status line, e.g. "Ships in 3 days · 14 left". */
  availability?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Product imagery — framed large, right column. */
  media: ReactNode;
  className?: string;
}

/**
 * Product-drop hero — OverlapField composition: an oversized product shot
 * bleeds across the right two-thirds of the grid while the price block and
 * headline sit on a narrower left column, physically overlapping the image
 * edge (z-2 over z-1). No centered hero, no boxed product photo.
 */
export default function ProductHero({
  id,
  rail,
  badge,
  eyebrow,
  headline,
  description,
  price,
  availability,
  primaryCta,
  secondaryCta,
  media,
  className = "",
}: ProductHeroProps) {
  return (
    <SectionShell id={id} rail={rail} className={cn("overflow-x-clip", className)}>
      <OverlapField>
        <OverlapItem col="1 / 7" row={1} z={2} className="flex flex-col justify-center">
          {badge && (
            <span
              className={cn(
                "mb-[var(--element-gap)] inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5",
                "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
                "font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {badge}
            </span>
          )}

          <LayeredHeadline
            eyebrow={eyebrow}
            primary={headline.primary}
            overlay={headline.overlay}
            secondary={headline.secondary}
            size="hero"
          />

          {description && (
            <p className="mt-[var(--content-gap)] max-w-[38ch] text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          <div className="mt-[calc(var(--content-gap)*1.1)] flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-overline uppercase tracking-[0.16em] text-muted-foreground">
              {price.symbol ?? "$"}
            </span>
            <span className="font-display text-display font-medium tracking-tight">
              {price.amount}
            </span>
            {price.currency && (
              <span className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                {price.currency}
              </span>
            )}
            {price.compareAt && (
              <span className="font-mono text-sm text-muted-foreground line-through decoration-1">
                {price.symbol ?? "$"}
                {price.compareAt}
              </span>
            )}
          </div>

          {availability && (
            <p className="mt-2 flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              {availability}
            </p>
          )}

          <div className="mt-[var(--content-gap)] flex flex-wrap items-center gap-4">
            <a
              href={primaryCta.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-7 py-3",
                "text-[0.9375rem] font-medium text-primary-foreground",
                "transition-transform [transition-timing-function:var(--ease-standard)]",
                "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {primaryCta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 px-2 py-3 text-[0.9375rem] font-medium text-foreground",
                  "underline decoration-[color-mix(in_oklab,var(--foreground)_30%,transparent)] underline-offset-4",
                  "transition-colors [transition-timing-function:var(--ease-standard)] hover:decoration-primary",
                )}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </OverlapItem>

        <OverlapItem
          col="5 / 13"
          row={1}
          z={1}
          offsetY="4%"
          drift={-0.12}
          className="md:translate-x-[4%]"
        >
          {media}
        </OverlapItem>
      </OverlapField>
    </SectionShell>
  );
}
