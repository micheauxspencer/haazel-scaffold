import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";
import OffsetGrid from "@/components/primitives/OffsetGrid";

export interface TestimonialWallQuote {
  quote: string;
  name: string;
  role: string;
  company?: string;
}

export interface TestimonialWallProps {
  id?: string;
  rail?: { label: string; meta?: string };
  /** The oversized editorial pull-quote. */
  featured: TestimonialWallQuote & { avatar?: ReactNode };
  /** Smaller supporting quotes, laid out in a staggered OffsetGrid. */
  supporting: TestimonialWallQuote[];
  className?: string;
}

const hairline = "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]";

/**
 * One oversized editorial pull-quote (serif-italic, display size) over a
 * staggered OffsetGrid of smaller supporting quotes — never a uniform wall
 * of equal testimonial cards. Attribution set in the CaptionRail mono
 * system throughout.
 */
export default function TestimonialWall({
  id = "testimonials",
  rail,
  featured,
  supporting,
  className = "",
}: TestimonialWallProps) {
  const featuredMeta = [featured.role, featured.company].filter(Boolean).join(", ");

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <figure className="max-w-[48rem]">
        <blockquote className="text-balance font-heading text-display font-medium italic leading-[1.05] tracking-[-0.01em]">
          &ldquo;{featured.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-[var(--content-gap)] flex items-center gap-4">
          {featured.avatar && (
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
              {featured.avatar}
            </div>
          )}
          <CaptionRail label={featured.name} meta={featuredMeta || undefined} rule="top" className="flex-1" />
        </figcaption>
      </figure>

      <div className="mt-[calc(var(--content-gap)*1.5)]">
        <OffsetGrid columns={3}>
          {supporting.map((t) => {
            const meta = [t.role, t.company].filter(Boolean).join(", ");
            return (
              <blockquote
                key={t.name}
                className={cn("flex h-full flex-col justify-between gap-8 border-t pt-6", hairline)}
              >
                <p className="text-lg leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <CaptionRail label={t.name} meta={meta || undefined} rule="none" tone="muted" />
              </blockquote>
            );
          })}
        </OffsetGrid>
      </div>
    </SectionShell>
  );
}
