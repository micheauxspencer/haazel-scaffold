"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";

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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          padding: "8px 12px",
          background: "rgba(26,26,31,0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
        }}
      >
        {items.map((item, i) => {
          const size = sizes[i];
          const Wrapper = item.href ? "a" : "button";
          const wrapperProps = item.href
            ? { href: item.href }
            : { onClick: item.onClick, type: "button" as const };

          return (
            <Wrapper
              key={i}
              {...(wrapperProps as Record<string, unknown>)}
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
                color: "rgba(234,231,226,0.95)",
                textDecoration: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "width, height",
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
                  background: "rgba(26,26,31,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  opacity: size > baseSize + 4 ? 1 : 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s",
                  color: "rgba(234,231,226,0.95)",
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
