"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface ScrollProgressProps {
  /** Any CSS color. Defaults to the site's primary token. */
  color?: string;
  /** Bar thickness in pixels. */
  height?: number;
  className?: string;
}

/**
 * Fixed top-of-viewport bar that fills left-to-right as the page scrolls.
 * Driven by a passive, rAF-throttled scroll listener (no ScrollTrigger
 * needed for a plain 0-1 progress read) — sets `transform: scaleX()` on an
 * inner bar so there is no layout shift and no width/reflow cost.
 *
 * Reduced motion: the bar itself is informational, not decorative, so it
 * keeps updating — it just skips the eased lerp used for the default
 * "silky trailing" feel and jumps straight to the exact scroll ratio.
 */
export default function ScrollProgress({
  color = "var(--primary)",
  height = 2,
  className = "",
}: ScrollProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const current = useRef(0);
  const target = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const getProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const raw = scrollable > 0 ? (window.scrollY || doc.scrollTop) / scrollable : 0;
      return Math.min(1, Math.max(0, raw));
    };

    const apply = (value: number) => {
      bar.style.transform = `scaleX(${value})`;
    };

    let ticking = false;
    let looping = false;

    // Reduced motion: direct set, rAF-throttled to at most once per frame —
    // no smoothing/lerp toward the target.
    const renderDirect = () => {
      ticking = false;
      current.current = target.current;
      apply(current.current);
    };

    // Default: continuously ease the displayed value toward the scroll
    // target for a smooth trailing feel; stops once converged.
    const renderSmoothed = () => {
      current.current += (target.current - current.current) * 0.2;
      const settled = Math.abs(target.current - current.current) < 0.001;
      if (settled) current.current = target.current;
      apply(current.current);

      if (!settled) {
        rafId.current = requestAnimationFrame(renderSmoothed);
      } else {
        looping = false;
      }
    };

    const onScroll = () => {
      target.current = getProgress();

      if (reduced) {
        if (ticking) return;
        ticking = true;
        rafId.current = requestAnimationFrame(renderDirect);
        return;
      }

      if (looping) return;
      looping = true;
      rafId.current = requestAnimationFrame(renderSmoothed);
    };

    // Initial paint reflects current scroll position immediately — never
    // animates in from zero.
    target.current = getProgress();
    current.current = target.current;
    apply(current.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          background: color,
          transformOrigin: "left",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
