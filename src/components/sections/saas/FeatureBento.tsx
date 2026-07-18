import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface FeatureBentoItem {
  tag?: string;
  title: string;
  description: string;
  /** Screenshot, icon, chart — rendered in the cell's media slot. */
  media?: ReactNode;
}

export interface FeatureBentoProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  /**
   * Exactly 5 items: items[0] fills the large feature cell, items[1..4]
   * fill the four smaller cells around it.
   */
  items: FeatureBentoItem[];
  className?: string;
}

const hairline = "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]";
const hairlineHover =
  "[@media(hover:hover)_and_(pointer:fine)]:hover:[border-color:color-mix(in_oklab,var(--foreground)_28%,transparent)]";

function Cell({ item, large = false }: { item?: FeatureBentoItem; large?: boolean }) {
  if (!item) return <div className={cn("border", hairline)} aria-hidden />;

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 border p-6 transition-colors duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)] md:p-8",
        hairline,
        hairlineHover,
      )}
    >
      <div className={cn("flex flex-1 flex-col", large ? "gap-6 md:flex-row md:items-center md:gap-10" : "gap-4")}>
        <div className={large ? "md:order-2 md:flex-1" : undefined}>
          {item.media && (
            <div className="overflow-hidden rounded-[var(--radius-md)] [&>img]:block [&>img]:w-full [&>video]:block [&>video]:w-full">
              {item.media}
            </div>
          )}
        </div>
        <div className={large ? "md:order-1 md:max-w-[26ch] md:shrink-0" : undefined}>
          {item.tag && <CaptionRail label={item.tag} rule="none" className="mb-3" />}
          <h3 className={cn("font-heading font-medium", large ? "text-2xl md:text-3xl" : "text-lg")}>
            {item.title}
          </h3>
          <p className={cn("mt-2 text-muted-foreground", large ? "text-base" : "text-sm")}>{item.description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Uneven bento: one large feature cell (media + copy, order flips at md+)
 * beside four smaller cells, placed via CSS grid-template-areas so the
 * block reads as deliberately asymmetric rather than a repeated card
 * module. The area string lives in a CSS custom property (like
 * EditorialSplit's --es-cols) since Tailwind arbitrary values can't hold
 * multi-row quoted strings directly. Collapses to one stacked column below
 * md.
 */
export default function FeatureBento({
  id = "features",
  rail,
  heading,
  intro,
  items,
  className = "",
}: FeatureBentoProps) {
  const [feature, alpha, beta, gamma, delta] = items;

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <div
        style={{
          ["--fb-areas" as string]: '"feature feature alpha beta" "feature feature gamma delta"',
        }}
        className={cn(
          "grid grid-cols-1 gap-4",
          "md:[grid-template-areas:var(--fb-areas)]",
          "md:[grid-template-columns:repeat(4,1fr)]",
          "md:[grid-template-rows:repeat(2,minmax(15rem,1fr))]",
        )}
      >
        <div className="md:[grid-area:feature]">
          <Cell item={feature} large />
        </div>
        <div className="md:[grid-area:alpha]">
          <Cell item={alpha} />
        </div>
        <div className="md:[grid-area:beta]">
          <Cell item={beta} />
        </div>
        <div className="md:[grid-area:gamma]">
          <Cell item={gamma} />
        </div>
        <div className="md:[grid-area:delta]">
          <Cell item={delta} />
        </div>
      </div>
    </SectionShell>
  );
}
