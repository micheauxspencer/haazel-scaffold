"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import CaptionRail from "./CaptionRail";

interface BleedImageProps {
  /** The media element (img or video), rendered object-cover. */
  children: ReactNode;
  /** Caption label under the media (mono overline). */
  caption?: string;
  /** Right-aligned meta/credit. */
  credit?: string;
  /** Band height. */
  height?: string;
  /** Subtle vertical parallax on scroll (desktop; off under reduced motion). */
  parallax?: boolean;
  className?: string;
}

/**
 * Full-bleed media band with an inset caption rail. The editorial move for
 * letting one image breathe at full width instead of boxing it in a card.
 * Parallax is restrained by design (±8%) — presence, not a theme-park ride.
 */
export default function BleedImage({
  children,
  caption,
  credit,
  height = "clamp(20rem, 70vh, 44rem)",
  parallax = true,
  className = "",
}: BleedImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const animate = parallax && !reduced;

  useEffect(() => {
    if (!animate) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }, frameRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [animate]);

  return (
    <figure className={cn("w-full", className)}>
      <div ref={frameRef} className="relative overflow-hidden" style={{ height }}>
        <div
          ref={innerRef}
          className="absolute inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
          style={animate ? { top: "-8%", bottom: "-8%", height: "116%" } : undefined}
        >
          {children}
        </div>
      </div>
      {(caption || credit) && (
        <figcaption className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
          <CaptionRail
            label={caption ?? ""}
            meta={credit}
            rule="none"
            className="pt-[var(--tight-gap)]"
          />
        </figcaption>
      )}
    </figure>
  );
}
