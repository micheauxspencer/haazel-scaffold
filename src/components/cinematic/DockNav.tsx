"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface DockItem {
  icon: ReactNode;
  label: string;
  color: string;
  href?: string;
  onClick?: () => void;
}

interface DockNavProps {
  items: DockItem[];
  baseSize?: number;
  maxSize?: number;
  range?: number;
  className?: string;
}

export default function DockNav({
  items,
  baseSize = 48,
  maxSize = 72,
  range = 120,
  className = "",
}: DockNavProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>(items.map(() => baseSize));
  const reduced = useReducedMotion();
  const pointerFine = usePointerFine();
  // Magnification is a hover-only enhancement: needs a fine pointer and motion allowed.
  const canMagnify = pointerFine && !reduced;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const newSizes = items.map((_, i) => {
        const el = dockRef.current?.children[i] as HTMLElement | undefined;
        if (!el) return baseSize;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - cx);
        if (dist > range) return baseSize;
        return Math.max(baseSize, maxSize - (dist / range) * (maxSize - baseSize));
      });
      setSizes(newSizes);
    },
    [items, baseSize, maxSize, range],
  );

  const handleMouseLeave = useCallback(() => {
    setSizes(items.map(() => baseSize));
  }, [items, baseSize]);

  // Touch devices and reduced-motion both render uniform, static icons — the
  // dock still navigates via click/tap either way.
  const displaySizes = canMagnify ? sizes : items.map(() => baseSize);
  const itemTransition = reduced ? "none" : `all 0.2s ${EASE_STANDARD_CSS}`;
  const tooltipTransition = reduced ? "none" : `opacity 0.2s ${EASE_STANDARD_CSS}`;

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
      }}
    >
      <div
        ref={dockRef}
        onMouseMove={canMagnify ? handleMouseMove : undefined}
        onMouseLeave={canMagnify ? handleMouseLeave : undefined}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          padding: "8px 12px",
          background: "color-mix(in oklab, var(--popover) 80%, transparent)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
        }}
      >
        {items.map((item, i) => {
          const size = displaySizes[i];
          const Wrapper = item.href ? "a" : "button";
          const wrapperProps = item.href
            ? { href: item.href }
            : { onClick: item.onClick, type: "button" as const };

          return (
            <Wrapper
              key={i}
              {...(wrapperProps as Record<string, unknown>)}
              aria-label={item.label}
              style={{
                width: size,
                height: size,
                borderRadius: "12px",
                background: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size * 0.45,
                cursor: "pointer",
                position: "relative",
                border: "none",
                color: "var(--popover-foreground)",
                textDecoration: "none",
                transition: itemTransition,
                willChange: canMagnify ? "width, height" : undefined,
                padding: 0,
                outline: "none",
              }}
            >
              {/* Tooltip */}
              <span
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "11px",
                  background: "color-mix(in oklab, var(--popover) 90%, transparent)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  opacity: size > baseSize + 4 ? 1 : 0,
                  pointerEvents: "none",
                  transition: tooltipTransition,
                  color: "var(--popover-foreground)",
                }}
              >
                {item.label}
              </span>
              {item.icon}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
