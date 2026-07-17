"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

interface ParticleButtonProps {
  children: ReactNode;
  /** Any CSS color. Defaults to the site's primary token. */
  color?: string;
  particleCount?: number;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function ParticleButton({
  children,
  color = "var(--primary)",
  particleCount = 12,
  as: Tag = "button",
  href,
  onClick,
  className = "",
}: ParticleButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);
  const reduced = useReducedMotion();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick?.();

      // Reduced motion: click still fires onClick above, just no burst.
      if (reduced) return;

      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const newParticles: Particle[] = Array.from(
        { length: particleCount },
        () => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 40 + Math.random() * 60;
          return {
            id: idCounter.current++,
            x: cx,
            y: cy,
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance,
            color,
          };
        },
      );

      setParticles((prev) => [...prev, ...newParticles]);

      // Clean up after animation
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.includes(p)),
        );
      }, 800);
    },
    [color, particleCount, onClick, reduced],
  );

  const tagProps =
    Tag === "a"
      ? { href, ref: btnRef as React.Ref<HTMLAnchorElement> }
      : { type: "button" as const, ref: btnRef as React.Ref<HTMLButtonElement> };

  return (
    <Tag
      {...(tagProps as Record<string, unknown>)}
      onClick={handleClick}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 36px",
        background: color,
        color: "var(--primary-foreground)",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: 500,
        overflow: "visible",
        outline: "none",
        textDecoration: "none",
        transition: reduced ? "none" : `transform 0.2s ${EASE_STANDARD_CSS}`,
      }}
    >
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>

      {/* Particles — array stays empty under reduced motion, so nothing renders */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "absolute",
              left: p.x,
              top: p.y,
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: p.color,
              pointerEvents: "none",
              zIndex: 1,
              opacity: 0,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              transform: `translate3d(${p.dx}px, ${p.dy}px, 0) scale(0)`,
              animation: "particleBurst 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              willChange: "transform, opacity",
            } as React.CSSProperties
          }
        />
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes particleBurst {
              0% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
              100% { opacity: 0; transform: translate3d(var(--dx, 0), var(--dy, 0), 0) scale(0); }
            }
          `,
        }}
      />
    </Tag>
  );
}
