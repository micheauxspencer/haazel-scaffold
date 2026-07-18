"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export interface StickyBuyBarProps {
  product: {
    name: string;
    /** Pre-formatted display price, e.g. "CAD $148". */
    price: string;
  };
  /** Small square product image. */
  thumb: ReactNode;
  cta: { label: string; href: string };
  /** Scroll distance (px) past which the bar appears. */
  threshold?: number;
  className?: string;
}

/**
 * Bottom-fixed buy bar. A rAF-throttled scroll listener toggles visibility
 * past `threshold`; the reveal itself is a slide-up transform, but the
 * showing/hiding LOGIC never depends on motion — reduced-motion users get
 * the same bar, same triggers, just an instant opacity swap instead of a
 * slide. Safe-area aware for iOS home-indicator overlap.
 */
export default function StickyBuyBar({
  product,
  thumb,
  cta,
  threshold = 600,
  className = "",
}: StickyBuyBarProps) {
  const [past, setPast] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reduced = useReducedMotion();
  const tickingRef = useRef(false);

  useEffect(() => {
    const evaluate = () => setPast(window.scrollY > threshold);
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        evaluate();
        tickingRef.current = false;
      });
    };

    evaluate(); // in case the page is already scrolled on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const visible = past && !dismissed;

  return (
    <div
      role="region"
      aria-label={`Buy ${product.name}`}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur",
        "[border-color:color-mix(in_oklab,var(--foreground)_15%,transparent)]",
        reduced
          ? visible
            ? "opacity-100"
            : "pointer-events-none opacity-0"
          : cn(
              "transition-transform duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)] will-change-transform",
              visible ? "translate-y-0" : "pointer-events-none translate-y-full",
            ),
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-4 px-[var(--gutter)] py-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-md)] [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
          {thumb}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
          <p className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
            {product.price}
          </p>
        </div>

        <a
          href={cta.href}
          tabIndex={visible ? 0 : -1}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-lg)] bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground",
            "transition-transform [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          {cta.label}
        </a>

        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground",
            "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
