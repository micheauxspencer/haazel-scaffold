"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface SpotlightItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface SpotlightBorderCardsProps {
  items: SpotlightItem[];
  columns?: number;
  /**
   * Any CSS color (not an rgb triplet). Defaults to the site's primary
   * token. Alpha layers are derived via `color-mix`.
   */
  accentColor?: string;
  className?: string;
}

export default function SpotlightBorderCards({
  items,
  columns = 3,
  accentColor = "var(--primary)",
  className = "",
}: SpotlightBorderCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const active = pointerFine && !reduced;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>("[data-spotlight-card]");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        card.style.setProperty("--mx", `${mx}px`);
        card.style.setProperty("--my", `${my}px`);
      });
    },
    [],
  );

  return (
    <div
      ref={gridRef}
      onMouseMove={active ? handleMouseMove : undefined}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1px",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          data-spotlight-card
          style={{
            position: "relative",
            padding: "2rem",
            borderRadius: "1rem",
            background: "color-mix(in oklab, var(--foreground) 3%, transparent)",
            border: "1px solid color-mix(in oklab, var(--foreground) 6%, transparent)",
            overflow: "hidden",
            transition: `border-color 0.3s ${EASE_STANDARD_CSS}`,
          }}
        >
          {/* Spotlight pseudo-layer (static, off-canvas fallback when inactive) */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: `radial-gradient(circle 180px at var(--mx, -200px) var(--my, -200px), color-mix(in oklab, ${accentColor} 15%, transparent), transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* Border glow layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "inherit",
              background: `radial-gradient(circle 180px at var(--mx, -200px) var(--my, -200px), color-mix(in oklab, ${accentColor} 40%, transparent), transparent)`,
              pointerEvents: "none",
              zIndex: -1,
              mask: "linear-gradient(var(--foreground) 0 0) content-box, linear-gradient(var(--foreground) 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            {item.icon && (
              <div
                style={{
                  marginBottom: "1rem",
                  color: accentColor,
                }}
              >
                {item.icon}
              </div>
            )}
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "var(--muted-foreground)",
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
