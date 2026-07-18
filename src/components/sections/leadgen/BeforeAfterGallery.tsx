"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import SectionShell from "@/components/primitives/SectionShell";
import OffsetGrid from "@/components/primitives/OffsetGrid";

export interface BeforeAfterItem {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  label?: string;
}

export interface BeforeAfterGalleryProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  /** First item renders large as the primary slider; the rest form a smaller list. */
  items: BeforeAfterItem[];
  className?: string;
}

function Slider({
  item,
  height,
  reduced,
  pointerFine,
}: {
  item: BeforeAfterItem;
  height: string;
  reduced: boolean;
  pointerFine: boolean;
}) {
  const [value, setValue] = useState(50);

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden rounded-[var(--radius-lg)] border",
        "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
      )}
      style={{ height }}
    >
      {/* Before layer — full image, base. */}
      <img src={item.before.src} alt={item.before.alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />

      {/* After layer — clipped directly from the range value. No transition on
          clip-path: the reveal must track the pointer/keyboard 1:1, no easing. */}
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <img src={item.after.src} alt={item.after.alt} className="h-full w-full object-cover" draggable={false} />
      </div>

      {/* Full-coverage range input drives the reveal; visually transparent but
          hit-testable and keyboard-focusable across the whole frame. */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={item.label ? `Before and after: ${item.label}` : "Before and after comparison"}
        className="peer absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
      />

      {/* Divider + handle render in the theme's own background token, edged
          by a token-mixed shadow so they read against arbitrary photo
          content in either a light or dark theme — no hardcoded white/black. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-background",
          "shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_25%,transparent)]",
        )}
        style={{ left: `${value}%` }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
          "rounded-full border bg-background text-foreground",
          "[border-color:color-mix(in_oklab,var(--foreground)_20%,transparent)]",
          "shadow-[0_2px_20px_color-mix(in_oklab,var(--foreground)_35%,transparent)]",
          !reduced && "transition-transform [transition-timing-function:var(--ease-standard)]",
          !reduced && pointerFine && "peer-hover:scale-110",
          "peer-focus-visible:scale-110 peer-focus-visible:outline-2",
          "peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
        )}
        style={{ left: `${value}%` }}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M7 5l-4 5 4 5M13 5l4 5-4 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Before/after is conveyed by the drag affordance itself plus each
          image's alt text and the caption below — no on-photo text badge
          that would need a hardcoded scrim to stay legible over arbitrary
          images in every theme. */}
    </div>
  );
}

/**
 * Accessible before/after comparison. A native range input spans the full
 * frame (opacity-0, but hit-testable and keyboard-focusable) and drives the
 * "after" layer's clip-path directly from its value — no transition/easing
 * on drag, so the reveal tracks the pointer/keyboard/touch 1:1. The handle's
 * hover scale is a separate, reduced-motion-gated affordance; it never
 * touches the position/clip-path properties themselves.
 */
export default function BeforeAfterGallery({
  id,
  rail,
  heading,
  intro,
  items,
  className = "",
}: BeforeAfterGalleryProps) {
  const reduced = useReducedMotion();
  const pointerFine = usePointerFine();
  const [primary, ...rest] = items;

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      {primary && (
        <div>
          <Slider item={primary} height="clamp(20rem, 60vh, 34rem)" reduced={reduced} pointerFine={pointerFine} />
          {primary.label && (
            <p className="mt-3 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              {primary.label}
            </p>
          )}
        </div>
      )}

      {rest.length > 0 && (
        <OffsetGrid columns={rest.length >= 3 ? 3 : 2} className="mt-[var(--content-gap)]">
          {rest.map((item, i) => (
            <div key={item.label ?? i}>
              <Slider item={item} height="clamp(14rem, 32vh, 20rem)" reduced={reduced} pointerFine={pointerFine} />
              {item.label && (
                <p className="mt-3 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
              )}
            </div>
          ))}
        </OffsetGrid>
      )}
    </SectionShell>
  );
}
