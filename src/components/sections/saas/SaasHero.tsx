"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";
import LayeredHeadline from "@/components/primitives/LayeredHeadline";
import DeviceFrame from "@/components/primitives/DeviceFrame";
import { OverlapField, OverlapItem } from "@/components/primitives/OverlapField";

export interface SaasHeroProps {
  /** Small pill above the eyebrow ("Now in public beta"). */
  announcement?: { label: string; href?: string };
  eyebrow?: string;
  headline: { primary: string; overlay?: string; secondary?: string };
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Up to 3 proof stats rendered under the CTAs. */
  stats?: { value: string; label: string }[];
  /** Product screenshot (img/video); framed in DeviceFrame. */
  media: ReactNode;
  /** URL shown in the browser-frame pill. */
  mediaUrl?: string;
  className?: string;
}

/**
 * SaaS hero — asymmetric OverlapField composition: statement type on the
 * left deliberately overlapping a glowing DeviceFrame product shot that
 * bleeds off-balance to the right. No centered hero, no 50/50.
 */
export default function SaasHero({
  announcement,
  eyebrow,
  headline,
  description,
  primaryCta,
  secondaryCta,
  stats,
  media,
  mediaUrl,
  className = "",
}: SaasHeroProps) {
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

  // Settled state renders complete; motion path starts hidden and rises.
  const rise = cn(reduced ? "" : "translate-y-6 opacity-0 will-change-transform");

  return (
    <SectionShell className={cn("overflow-x-clip", className)}>
      <div ref={rootRef}>
        <OverlapField>
          <OverlapItem col="1 / 8" row={1} z={2} className="flex flex-col justify-center">
            {announcement && (
              <div data-hero-rise className={cn(rise, "mb-[var(--element-gap)]")}>
                <a
                  href={announcement.href ?? "#"}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
                    "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
                    "font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground",
                    "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-foreground",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  {announcement.label}
                </a>
              </div>
            )}

            <LayeredHeadline
              eyebrow={eyebrow}
              primary={headline.primary}
              overlay={headline.overlay}
              secondary={headline.secondary}
              size="hero"
              reveal
            />

            <p
              data-hero-rise
              className={cn(rise, "mt-[var(--content-gap)] max-w-[42ch] text-lg leading-relaxed text-muted-foreground")}
            >
              {description}
            </p>

            <div data-hero-rise className={cn(rise, "mt-[var(--content-gap)] flex flex-wrap items-center gap-4")}>
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

            {stats && stats.length > 0 && (
              <dl
                data-hero-rise
                className={cn(
                  rise,
                  // Stacks on narrow screens — an unwrapped divide-x row overflows 375px.
                  "mt-[calc(var(--content-gap)*1.25)] flex max-w-xl flex-col gap-5 sm:flex-row sm:gap-0 sm:divide-x",
                  "[&>div]:sm:px-6 [&>div:first-child]:sm:pl-0",
                  "divide-[color-mix(in_oklab,var(--foreground)_12%,transparent)]",
                )}
              >
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <dt className="order-2 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="font-display text-3xl font-medium tracking-tight">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </OverlapItem>

          <OverlapItem
            col="7 / 13"
            row={1}
            z={1}
            offsetY="6%"
            drift={-0.15}
            className="md:translate-x-[6%]"
          >
            <div data-hero-rise className={rise}>
              <DeviceFrame url={mediaUrl} glow>
                {media}
              </DeviceFrame>
            </div>
          </OverlapItem>
        </OverlapField>
      </div>
    </SectionShell>
  );
}
