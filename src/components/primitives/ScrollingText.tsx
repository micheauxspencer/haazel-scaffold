"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface ScrollingTextRow {
  text: string;
  /** 1 = drifts left as you scroll down, -1 = drifts right. */
  direction?: 1 | -1;
}

interface ScrollingTextProps {
  /** One or two rows; two opposing rows is the signature move. */
  rows: ScrollingTextRow[];
  /** Any CSS color; outline rows use it as the stroke. */
  color?: string;
  /** Render odd rows as outlined text (stroke only). */
  alternateOutline?: boolean;
  separator?: string;
  size?: "display" | "hero";
  className?: string;
}

/**
 * Scroll-scrubbed kinetic type band — big typography that moves with the
 * page, not on a timer (that's KineticMarquee's job). Under reduced motion
 * it renders one static centered line per row.
 */
export default function ScrollingText({
  rows,
  color = "var(--foreground)",
  alternateOutline = true,
  separator = " — ",
  size = "display",
  className = "",
}: ScrollingTextProps) {
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
        const rowEls = rootRef.current?.querySelectorAll<HTMLElement>("[data-st-row]");
        rowEls?.forEach((el) => {
          const dir = parseInt(el.dataset.stRow ?? "1", 10);
          gsap.fromTo(
            el,
            { xPercent: dir === 1 ? -6 : -30 },
            {
              xPercent: dir === 1 ? -30 : -6,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
      }, rootRef);
    };

    init();
    return () => { ctx?.revert(); };
  }, [reduced]);

  const sizeClass = size === "hero" ? "text-hero" : "text-display";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("w-full select-none overflow-hidden py-[var(--element-gap)]", className)}
    >
      {rows.map((row, i) => {
        const outlined = alternateOutline && i % 2 === 1;
        const repeated = reduced
          ? row.text
          : Array(4).fill(row.text).join(separator) + separator;
        return (
          <div key={i} className={cn("overflow-hidden", reduced && "text-center")}>
            <div
              data-st-row={row.direction ?? (i % 2 === 0 ? 1 : -1)}
              className={cn(
                sizeClass,
                "font-display font-medium uppercase tracking-[-0.02em]",
                reduced ? "whitespace-normal" : "w-max whitespace-nowrap will-change-transform",
              )}
              style={
                outlined
                  ? {
                      WebkitTextStroke: `1px ${color}`,
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }
                  : { color }
              }
            >
              {repeated}
            </div>
          </div>
        );
      })}
    </div>
  );
}
