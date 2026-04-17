"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface CursorGlowProps {
  color?: string;
  size?: number;
  className?: string;
  children?: ReactNode;
}

export default function CursorGlow({
  color = "rgba(79, 143, 255, 0.12)",
  size = 500,
  className,
  children,
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const glow = glowRef.current;
    if (!glow) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const tick = () => {
      // Lerp for smooth trailing — matches source ease of 0.12
      glowPosRef.current.x +=
        (mouseRef.current.x - glowPosRef.current.x) * 0.12;
      glowPosRef.current.y +=
        (mouseRef.current.y - glowPosRef.current.y) * 0.12;

      glow.style.transform = `translate3d(${glowPosRef.current.x - size / 2}px, ${glowPosRef.current.y - size / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  return (
    <div className={className} style={{ position: "relative" }}>
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 1,
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </div>
  );
}
