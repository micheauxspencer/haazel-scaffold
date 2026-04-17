"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

interface ImageTrailProps {
  colors?: string[];
  poolSize?: number;
  threshold?: number;
  itemWidth?: number;
  itemHeight?: number;
  children?: ReactNode;
  className?: string;
}

export default function ImageTrail({
  colors = [
    "#a8748e",
    "#748ea8",
    "#8ea874",
    "#a8a074",
    "#74a8a0",
    "#a07448",
    "#7448a0",
    "#48a074",
  ],
  poolSize = 20,
  threshold = 60,
  itemWidth = 160,
  itemHeight = 200,
  children,
  className = "",
}: ImageTrailProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement[]>([]);
  const idxRef = useRef(0);
  const lastRef = useRef({ x: 0, y: 0 });

  // Create pool on mount
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    // Clean up existing pool elements
    poolRef.current.forEach((el) => el.remove());
    poolRef.current = [];

    for (let i = 0; i < poolSize; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        width: ${itemWidth}px;
        height: ${itemHeight}px;
        border-radius: 10px;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        will-change: transform, opacity;
        background: ${colors[i % colors.length]};
      `;
      document.body.appendChild(el);
      poolRef.current.push(el);
    }

    return () => {
      poolRef.current.forEach((el) => el.remove());
      poolRef.current = [];
    };
  }, [poolSize, colors, itemWidth, itemHeight]);

  const spawn = useCallback(
    (x: number, y: number) => {
      const el = poolRef.current[idxRef.current % poolSize];
      if (!el) return;
      idxRef.current++;

      const rotation = Math.random() * 20 - 10;
      el.style.left = `${x - itemWidth / 2}px`;
      el.style.top = `${y - itemHeight / 2}px`;
      el.style.opacity = "0.85";
      el.style.transform = `scale(0.8) rotate(${rotation}deg)`;
      el.style.transition = "none";

      // Force reflow then animate out
      el.offsetHeight;
      el.style.transition = "opacity 0.8s ease 0.3s, transform 0.8s ease";
      el.style.opacity = "0";
      el.style.transform = `scale(0.6) rotate(${Math.random() * 30 - 15}deg)`;
    },
    [poolSize, itemWidth, itemHeight],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > threshold) {
        lastRef.current = { x: e.clientX, y: e.clientY };
        spawn(e.clientX, e.clientY);
      }
    },
    [threshold, spawn],
  );

  return (
    <div
      ref={areaRef}
      className={className}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "none",
      }}
    >
      <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
        {children}
      </div>
    </div>
  );
}
