"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface LayeredHeadlineProps {
  /** Mono overline above the headline (e.g. "EST. 2026 — TORONTO"). */
  eyebrow?: string;
  /** Main line, display font. */
  primary: string;
  /** Accent word set in the heading (serif) font, italic, overlapping the primary baseline. */
  overlay?: string;
  /** Second display line, offset for editorial stagger. */
  secondary?: string;
  size?: "hero" | "display";
  align?: "left" | "center";
  /** Any CSS color for the overlay word. */
  overlayColor?: string;
  /** Indent the secondary line (editorial stagger). Default true. */
  indent?: boolean;
  /** Animate lines in on scroll (masked rise). Default true; reduced motion renders settled. */
  reveal?: boolean;
  className?: string;
}

/**
 * The font-pairing collage headline: display face carries the line, a serif
 * italic word overlaps it, a mono eyebrow anchors it. This is the primitive
 * that keeps heroes from reading as template output — pair extremes, overlap
 * on purpose, never center by default.
 */
export default function LayeredHeadline({
  eyebrow,
  primary,
  overlay,
  secondary,
  size = "display",
  align = "left",
  overlayColor = "var(--primary)",
  indent = true,
  reveal = true,
  className = "",
}: LayeredHeadlineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const animate = reveal && !reduced;

  useEffect(() => {
    if (!animate) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to("[data-lh-line]", {
          yPercent: -110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [animate]);

  const sizeClass = size === "hero" ? "text-hero" : "text-display";
  const lineWrap = "overflow-hidden";
  // Lines start shifted one line down inside an overflow-hidden mask; GSAP
  // raises them. Settled state (no JS / reduced motion) renders in place.
  const lineInner = (extra = "") =>
    cn("block will-change-transform", extra, animate && "translate-y-[110%]");

  return (
    <div
      ref={rootRef}
      className={cn(align === "center" ? "text-center" : "text-left", className)}
    >
      {eyebrow && (
        <div className={lineWrap}>
          <span
            data-lh-line
            className={cn(
              lineInner("font-mono text-overline uppercase tracking-[0.25em] text-muted-foreground"),
              "mb-[var(--element-gap)]",
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className={cn(sizeClass, "font-display font-medium tracking-[-0.02em]")}>
        <span className={lineWrap}>
          <span data-lh-line className={lineInner()}>
            {primary}
            {overlay && (
              <span
                aria-hidden={false}
                className="relative z-10 -ml-[0.12em] inline-block font-heading italic font-medium align-baseline"
                style={{
                  color: overlayColor,
                  transform: "translateY(0.08em) rotate(-2deg)",
                  textShadow: "0 0 24px color-mix(in oklab, var(--background) 60%, transparent)",
                }}
              >
                {" "}{overlay}
              </span>
            )}
          </span>
        </span>
        {secondary && (
          <span className={lineWrap}>
            <span
              data-lh-line
              className={cn(
                lineInner(),
                "-mt-[0.06em]",
                indent && align === "left" && "ml-[0.8em]",
              )}
            >
              {secondary}
            </span>
          </span>
        )}
      </h2>
    </div>
  );
}
