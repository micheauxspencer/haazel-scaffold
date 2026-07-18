import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import LayeredHeadline from "@/components/primitives/LayeredHeadline";

export interface CtaPanelProps {
  id?: string;
  rail?: { label: string; meta?: string };
  tone?: "inverted" | "card";
  headline: { primary: string; overlay?: string; secondary?: string };
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Small mono line under the CTAs, e.g. "No card required — cancel anytime". */
  microcopy?: string;
  className?: string;
}

/**
 * Closing band: LayeredHeadline (display) left-heavy against a CTA cluster
 * that aligns to the end on desktop — an asymmetric two-zone close, not a
 * centered banner. LayeredHeadline owns its own scroll-reveal + reduced-
 * motion handling, so this file needs no client state of its own.
 */
export default function CtaPanel({
  id = "cta",
  rail,
  tone = "inverted",
  headline,
  description,
  primaryCta,
  secondaryCta,
  microcopy,
  className = "",
}: CtaPanelProps) {
  const inverted = tone === "inverted";

  return (
    <SectionShell id={id} rail={rail} tone={tone} className={className}>
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-2xl">
          <LayeredHeadline
            primary={headline.primary}
            overlay={headline.overlay}
            secondary={headline.secondary}
            size="display"
            align="left"
            overlayColor={inverted ? "var(--background)" : "var(--primary)"}
          />
          {description && (
            <p
              className={cn(
                "mt-[var(--content-gap)] max-w-[46ch] text-lg leading-relaxed",
                inverted ? "text-background/70" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={primaryCta.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-lg)] px-7 py-3",
                "text-[0.9375rem] font-medium transition-transform [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                inverted ? "bg-background text-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              {primaryCta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={cn(
                  "inline-flex min-h-11 items-center px-2 py-3 text-[0.9375rem] font-medium underline underline-offset-4",
                  "transition-colors [transition-timing-function:var(--ease-standard)]",
                  inverted
                    ? "text-background decoration-background/40 hover:decoration-background"
                    : "text-foreground decoration-foreground/30 hover:decoration-primary",
                )}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>

          {microcopy && (
            <span
              className={cn(
                "font-mono text-overline uppercase tracking-[0.18em]",
                inverted ? "text-background/60" : "text-muted-foreground",
              )}
            >
              {microcopy}
            </span>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
