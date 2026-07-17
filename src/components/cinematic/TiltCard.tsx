"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface TiltCardProps {
  children?: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  /** Any CSS color. Defaults to a subtle primary-token mix. */
  spotlightColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.02,
  perspective = 600,
  spotlightColor = "color-mix(in oklab, var(--primary) 6%, transparent)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const active = pointerFine && !reduced;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) return;
      const card = cardRef.current;
      const spotlight = spotlightRef.current;
      if (!card || !spotlight) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // GPU-accelerated 3D transform — matches source exactly
      card.style.transform = `perspective(${perspective}px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(${scale})`;

      // Spotlight follows cursor position within card
      const spotX = e.clientX - rect.left;
      const spotY = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(circle at ${spotX}px ${spotY}px, ${spotlightColor} 0%, transparent 60%)`;
      spotlight.style.opacity = "1";
    },
    [active, maxTilt, scale, perspective, spotlightColor],
  );

  const handleMouseLeave = useCallback(() => {
    if (!active) return;
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    card.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) scale(1)`;
    spotlight.style.opacity = "0";
  }, [active, perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: `transform 0.15s ${EASE_STANDARD_CSS}, border-color 0.3s ${EASE_STANDARD_CSS}`,
        willChange: "transform",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        ref={spotlightRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          borderRadius: "inherit",
          opacity: 0,
          transition: `opacity 0.3s ${EASE_STANDARD_CSS}`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
