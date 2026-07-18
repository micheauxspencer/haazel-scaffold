"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";

export interface ProcessStep {
  title: string;
  description: string;
  meta?: string;
}

export interface ProcessStepsProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  steps: ProcessStep[];
  className?: string;
}

/**
 * Numbered process spine: a fixed-width numeral column (grid, not absolute
 * positioning) keeps giant display numerals right-aligned against one
 * continuous hairline spine across every row; alternating md: indent on the
 * content column (not the numeral) gives the editorial stagger without
 * breaking spine alignment.
 */
export default function ProcessSteps({
  id,
  rail,
  heading,
  intro,
  steps,
  className = "",
}: ProcessStepsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to("[data-step]", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [reduced]);

  const rise = cn(reduced ? "" : "translate-y-8 opacity-0 will-change-transform");

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <div ref={rootRef} className="relative">
        {/* Sibling of the <ol>, not a child — <ol> content model is li-only. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-[3.5rem] w-px md:left-[7rem]",
            "bg-[color-mix(in_oklab,var(--foreground)_14%,transparent)]",
          )}
        />
        <ol className="list-none space-y-16 md:space-y-20">
          {steps.map((step, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li
                key={step.title}
                data-step
                className={cn(
                  rise,
                  "grid grid-cols-[3.5rem_1fr] gap-6 md:grid-cols-[7rem_1fr] md:gap-10",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "select-none text-right font-display text-4xl leading-[0.9] font-medium tracking-tight tabular-nums md:text-6xl",
                    "text-[color-mix(in_oklab,var(--foreground)_18%,transparent)]",
                  )}
                >
                  {n}
                </span>
                <div className={cn("pt-1", i % 2 === 1 && "md:pl-10")}>
                  <h3 className="font-heading text-xl font-medium md:text-2xl">{step.title}</h3>
                  <p className="mt-3 max-w-[52ch] text-muted-foreground">{step.description}</p>
                  {step.meta && (
                    <p className="mt-4 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                      {step.meta}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
}
