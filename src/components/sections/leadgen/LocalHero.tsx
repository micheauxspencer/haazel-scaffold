"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Phone, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";
import LayeredHeadline from "@/components/primitives/LayeredHeadline";
import EditorialSplit from "@/components/primitives/EditorialSplit";

export interface LocalHeroProps {
  id?: string;
  eyebrow?: string;
  headline: { primary: string; overlay?: string; secondary?: string };
  description: string;
  /** Cities rendered as "Serving City · City · City". */
  serviceAreas: string[];
  serviceAreaLabel?: string;
  /** Always-visible tel: CTA — the number itself is the button label. */
  phone: { display: string; href: string };
  quoteCta: { label: string; href: string };
  trustChips: { label: string; icon?: "shield" | "check" | "star" }[];
  /** Photo/video, framed on the right. */
  media: ReactNode;
  mediaCaption?: string;
  className?: string;
}

function TrustIcon({ variant = "shield" }: { variant?: "shield" | "check" | "star" }) {
  if (variant === "check") {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === "star") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden>
        <path d="M10 1.6l2.47 5.4 5.93.63-4.45 4.02 1.24 5.85L10 14.6l-5.19 2.9 1.24-5.85L1.6 7.63l5.93-.63L10 1.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path
        d="M10 1.8l6.5 2.4v5.1c0 4.2-2.7 7.6-6.5 8.9-3.8-1.3-6.5-4.7-6.5-8.9V4.2L10 1.8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.2 10.1l1.9 1.9 3.9-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Local-business hero — phone-forward, not click-forward. EditorialSplit's
 * `media` slot always carries the larger fr-share of its ratio; passing
 * `flip` keeps the content column physically on the left at 42% while the
 * photo takes the right at 58%, matching the "58/42, content left" spec.
 * The phone CTA renders the literal number, never a generic "Call us" label.
 */
export default function LocalHero({
  id,
  eyebrow,
  headline,
  description,
  serviceAreas,
  serviceAreaLabel = "Serving",
  phone,
  quoteCta,
  trustChips,
  media,
  mediaCaption,
  className = "",
}: LocalHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      ctx = gsap.context(() => {
        gsap.to("[data-hero-rise]", {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.12,
          delay: 0.15,
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [reduced]);

  const rise = cn(reduced ? "" : "translate-y-6 opacity-0 will-change-transform");

  const mediaPanel = (
    <div className="relative">
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-lg)] border",
          "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
          "[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover",
        )}
        style={{ aspectRatio: "4 / 5" }}
      >
        {media}
      </div>
      {mediaCaption && (
        <p className="mt-3 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
          {mediaCaption}
        </p>
      )}
    </div>
  );

  return (
    <SectionShell id={id} className={cn("overflow-x-clip", className)}>
      <div ref={rootRef}>
        <EditorialSplit ratio="58/42" flip media={mediaPanel}>
          <LayeredHeadline
            eyebrow={eyebrow}
            primary={headline.primary}
            overlay={headline.overlay}
            secondary={headline.secondary}
            size="hero"
          />

          <p data-hero-rise className={cn(rise, "mt-[var(--content-gap)] max-w-[46ch] text-lg leading-relaxed text-muted-foreground")}>
            {description}
          </p>

          <p
            data-hero-rise
            className={cn(rise, "mt-[var(--element-gap)] font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground")}
          >
            {serviceAreaLabel} {serviceAreas.join(" · ")}
          </p>

          <div data-hero-rise className={cn(rise, "mt-[var(--content-gap)] flex flex-wrap items-center gap-4")}>
            <a
              href={phone.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-7 py-3",
                "text-[0.9375rem] font-medium text-primary-foreground",
                "transition-transform [transition-timing-function:var(--ease-standard)]",
                "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {phone.display}
            </a>
            <a
              href={quoteCta.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 px-2 py-3 text-[0.9375rem] font-medium text-foreground",
                "underline decoration-[color-mix(in_oklab,var(--foreground)_30%,transparent)] underline-offset-4",
                "transition-colors [transition-timing-function:var(--ease-standard)] hover:decoration-primary",
              )}
            >
              {quoteCta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          {trustChips.length > 0 && (
            <ul data-hero-rise className={cn(rise, "mt-[calc(var(--content-gap)*0.9)] flex flex-wrap gap-2.5")}>
              {trustChips.map((chip) => (
                <li
                  key={chip.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
                    "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
                    "font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground",
                  )}
                >
                  <span className="text-primary">
                    <TrustIcon variant={chip.icon} />
                  </span>
                  {chip.label}
                </li>
              ))}
            </ul>
          )}
        </EditorialSplit>
      </div>
    </SectionShell>
  );
}
