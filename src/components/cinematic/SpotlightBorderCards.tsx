"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface SpotlightItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface SpotlightBorderCardsProps {
  items: SpotlightItem[];
  columns?: number;
  accentColor?: string;
  className?: string;
}

export default function SpotlightBorderCards({
  items,
  columns = 3,
  accentColor = "139, 92, 246",
  className = "",
}: SpotlightBorderCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

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
      onMouseMove={handleMouseMove}
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
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            transition: "border-color 0.3s cubic-bezier(.16, 1, .3, 1)",
          }}
        >
          {/* Spotlight pseudo-layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: `radial-gradient(circle 180px at var(--mx, -200px) var(--my, -200px), rgba(${accentColor}, 0.15), transparent)`,
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
              background: `radial-gradient(circle 180px at var(--mx, -200px) var(--my, -200px), rgba(${accentColor}, 0.4), transparent)`,
              pointerEvents: "none",
              zIndex: -1,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
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
                  color: `rgba(${accentColor}, 1)`,
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
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
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
