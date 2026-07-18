"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { usePointerFine } from "@/lib/motion/usePointerFine";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface ProductGalleryProps {
  images: GalleryImage[];
  /** Scale-on-hover zoom, gated to fine pointers. Default true. */
  zoom?: boolean;
  className?: string;
}

/**
 * Main image + thumb rail (left of the image on md, a horizontal strip
 * below it on mobile). Frames crossfade instead of hard-cutting; arrow keys
 * work on the focused frame so the rail isn't the only way to page through.
 */
export default function ProductGallery({
  images,
  zoom = true,
  className = "",
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const frameRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const goTo = (i: number) => setActive(((i % count) + count) % count);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const zoomEnabled = zoom && fine && !reduced;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const zoomActive = zoomEnabled && cursor !== null;

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row-reverse", className)}>
      <div className="relative flex-1">
        <div
          ref={frameRef}
          role="group"
          aria-label={`Product image ${active + 1} of ${count}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setCursor(null)}
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] border",
            "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            zoomActive && "cursor-zoom-in",
          )}
        >
          {images.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              aria-hidden={i !== active}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                reduced
                  ? "transition-none"
                  : "transition-[opacity,transform] duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
                i === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              style={
                i === active && zoomActive && cursor
                  ? { transform: "scale(1.4)", transformOrigin: `${cursor.x}% ${cursor.y}%` }
                  : undefined
              }
            />
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <span className="font-mono text-overline tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label="Product thumbnails"
        className="flex gap-3 overflow-x-auto md:w-24 md:shrink-0 md:flex-col md:overflow-visible"
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            aria-current={i === active ? "true" : undefined}
            aria-label={`View image ${i + 1} of ${count}`}
            onClick={() => goTo(i)}
            className={cn(
              "relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border md:w-full",
              "transition-colors [transition-timing-function:var(--ease-standard)]",
              i === active
                ? "border-primary"
                : "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)] hover:[border-color:color-mix(in_oklab,var(--foreground)_30%,transparent)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <img src={img.src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
