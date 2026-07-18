import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface Bundle {
  name: string;
  tagline?: string;
  items: string[];
  price: string;
  /** Struck-through prior price. */
  compareAt?: string;
  /** Savings pill text, e.g. "Save $26". */
  savingsLabel?: string;
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface BundleCardsProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  bundles: Bundle[];
  currency?: string;
  footnote?: string;
  className?: string;
}

/**
 * Bundle cards on the PricingTable emphasis pattern: an uneven column grid
 * (2 or 3 up) with the featured bundle physically wider and raised on a
 * primary border, not a same-size card wall with a ribbon stuck on top.
 */
export default function BundleCards({
  id = "bundles",
  rail,
  heading,
  intro,
  bundles,
  currency = "$",
  footnote,
  className = "",
}: BundleCardsProps) {
  const featuredIndex = bundles.findIndex((b) => b.featured);

  const gridTemplate =
    bundles.length === 3
      ? featuredIndex === 0
        ? "md:[grid-template-columns:1.15fr_1fr_1fr]"
        : featuredIndex === 2
          ? "md:[grid-template-columns:1fr_1fr_1.15fr]"
          : "md:[grid-template-columns:1fr_1.15fr_1fr]"
      : "md:grid-cols-2";

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <div className={cn("grid grid-cols-1 gap-6 md:items-start", gridTemplate)}>
        {bundles.map((bundle) => (
          <article
            key={bundle.name}
            className={cn(
              "relative flex flex-col p-8",
              "rounded-[var(--radius-lg)] border",
              bundle.featured
                ? [
                    "border-primary bg-card md:-translate-y-4",
                    "shadow-[0_32px_64px_-32px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
                  ]
                : "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
            )}
          >
            {bundle.featured && (
              <CaptionRail label="Best value" rule="none" className="mb-4 [&_span]:text-primary" />
            )}

            <h3 className="font-heading text-xl font-medium">{bundle.name}</h3>
            {bundle.tagline && (
              <p className="mt-1 text-sm text-muted-foreground">{bundle.tagline}</p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                {currency}
              </span>
              <span className="font-display text-5xl font-medium tracking-tight">
                {bundle.price}
              </span>
              {bundle.compareAt && (
                <span className="font-mono text-sm text-muted-foreground line-through decoration-1">
                  {currency}
                  {bundle.compareAt}
                </span>
              )}
              {bundle.savingsLabel && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1",
                    "border-primary/30 bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
                    "font-mono text-overline uppercase tracking-[0.14em] text-primary",
                  )}
                >
                  {bundle.savingsLabel}
                </span>
              )}
            </div>

            <ul
              className={cn(
                "mt-8 flex-1 space-y-0 divide-y",
                "divide-[color-mix(in_oklab,var(--foreground)_8%,transparent)]",
              )}
            >
              {bundle.items.map((item) => (
                <li key={item} className="flex items-start gap-3 py-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className={bundle.featured ? "" : "text-muted-foreground"}>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={bundle.cta.href}
              className={cn(
                "mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-lg)] px-6 py-3 text-[0.9375rem] font-medium",
                "transition-transform [transition-timing-function:var(--ease-standard)]",
                bundle.featured
                  ? "bg-primary text-primary-foreground hover:-translate-y-0.5"
                  : [
                      "border text-foreground",
                      "[border-color:color-mix(in_oklab,var(--foreground)_18%,transparent)]",
                      "hover:border-primary hover:text-primary",
                    ],
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {bundle.cta.label}
            </a>
          </article>
        ))}
      </div>

      {footnote && (
        <p className="mt-[var(--content-gap)] font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
          {footnote}
        </p>
      )}
    </SectionShell>
  );
}
