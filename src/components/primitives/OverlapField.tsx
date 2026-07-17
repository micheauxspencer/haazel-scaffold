"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface OverlapFieldProps {
  children: ReactNode;
  className?: string;
}

interface OverlapItemProps {
  children: ReactNode;
  /** CSS grid-column over a 12-col grid, e.g. "1 / 8" or "span 6 / 13". */
  col: string;
  /** Grid row (items sharing a row overlap where their columns intersect). */
  row?: number;
  z?: number;
  /** Vertical nudge at md+, any CSS length (e.g. "12%", "-4rem"). */
  offsetY?: string;
  /** Scroll parallax factor at md+: -1..1 (negative rises). 0 = none. */
  drift?: number;
  className?: string;
}

/**
 * Z-layered composition field: a 12-column grid where items share rows and
 * deliberately overlap. The tool for "image under, type over, card breaking
 * the edge" layouts. Collapses to a clean single column on mobile; parallax
 * drift is desktop-only and disabled under reduced motion.
 */
export function OverlapField({ children, className = "" }: OverlapFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(min-width: 768px)");
    if (!fine.matches) return;

    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const items = rootRef.current?.querySelectorAll<HTMLElement>("[data-overlap-drift]");
        items?.forEach((el) => {
          const factor = parseFloat(el.dataset.overlapDrift ?? "0");
          if (!factor) return;
          gsap.fromTo(
            el,
            { y: factor * 60 },
            {
              y: factor * -60,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={cn("grid grid-cols-1 gap-y-[var(--content-gap)] md:grid-cols-12 md:gap-y-0", className)}
    >
      {children}
    </div>
  );
}

export function OverlapItem({
  children,
  col,
  row = 1,
  z = 1,
  offsetY,
  drift = 0,
  className = "",
}: OverlapItemProps) {
  const style: CSSProperties = {
    ["--of-col" as string]: col,
    ["--of-row" as string]: String(row),
    ["--of-y" as string]: offsetY ?? "0px",
    zIndex: z,
  };
  return (
    <div
      data-overlap-drift={drift || undefined}
      style={style}
      className={cn(
        "relative",
        "md:[grid-column:var(--of-col)] md:[grid-row:var(--of-row)]",
        "md:[translate:0_var(--of-y)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
