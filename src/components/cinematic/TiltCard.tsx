"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface TiltCardProps {
  children?: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  spotlightColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.02,
  perspective = 600,
  spotlightColor = "rgba(79,143,255,0.06)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
    [maxTilt, scale, perspective, spotlightColor],
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    card.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) scale(1)`;
    spotlight.style.opacity = "0";
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out, border-color 0.3s",
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
          transition: "opacity 0.3s",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
