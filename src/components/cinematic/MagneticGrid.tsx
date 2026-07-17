"use client";

import { useRef, useCallback, useState } from "react";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface MagneticGridProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  gap?: number;
  /** Any CSS color. Defaults to a subtle foreground-token mix. */
  dotColor?: string;
  /** Any CSS color. Defaults to a stronger foreground-token mix. */
  activeColor?: string;
  magnetRadius?: number;
  magnetStrength?: number;
  className?: string;
}

export default function MagneticGrid({
  rows = 8,
  cols = 12,
  dotSize = 12,
  gap = 8,
  dotColor = "color-mix(in oklab, var(--foreground) 6%, transparent)",
  activeColor = "color-mix(in oklab, var(--foreground) 20%, transparent)",
  magnetRadius = 120,
  magnetStrength = 8,
  className = "",
}: MagneticGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const active = pointerFine && !reduced;
  const [offsets, setOffsets] = useState<{ x: number; y: number; active: boolean }[]>(
    Array.from({ length: rows * cols }, () => ({ x: 0, y: 0, active: false })),
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = gridRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      setOffsets(
        Array.from({ length: rows * cols }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cellW = dotSize + gap;
          const cx = col * cellW + dotSize / 2;
          const cy = row * cellW + dotSize / 2;

          const dx = mx - cx;
          const dy = my - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > magnetRadius) {
            return { x: 0, y: 0, active: false };
          }

          const force = (1 - dist / magnetRadius) * magnetStrength;
          const angle = Math.atan2(dy, dx);
          return {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            active: dist < magnetRadius * 0.6,
          };
        }),
      );
    },
    [rows, cols, dotSize, gap, magnetRadius, magnetStrength],
  );

  const handleMouseLeave = useCallback(() => {
    setOffsets(Array.from({ length: rows * cols }, () => ({ x: 0, y: 0, active: false })));
  }, [rows, cols]);

  const gridW = cols * (dotSize + gap) - gap;
  const gridH = rows * (dotSize + gap) - gap;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
      }}
    >
      <div
        ref={gridRef}
        onMouseMove={active ? handleMouseMove : undefined}
        onMouseLeave={active ? handleMouseLeave : undefined}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
          width: gridW,
          height: gridH,
          cursor: "default",
        }}
      >
        {offsets.map((off, i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize * 0.25,
              background: off.active ? activeColor : dotColor,
              transform: `translate3d(${off.x}px, ${off.y}px, 0)`,
              transition: `background 0.2s ${EASE_STANDARD_CSS}, transform 0.15s ${EASE_STANDARD_CSS}`,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </div>
  );
}
