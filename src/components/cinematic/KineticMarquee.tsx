"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface KineticMarqueeProps {
  items: string[];
  baseSpeed?: number;
  direction?: "left" | "right";
  separator?: string;
  className?: string;
}

export default function KineticMarquee({
  items,
  baseSpeed = 1,
  direction = "left",
  separator = " \u2014 ",
  className = "",
}: KineticMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const offset = useRef(0);
  const currentSpeed = useRef(baseSpeed);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // static single row rendered below

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: trackRef.current?.parentElement,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity()) / 1000;
            currentSpeed.current = baseSpeed + velocity * 0.3;
          },
        });
      });

      const track = trackRef.current;
      if (!track) return;

      const firstChild = track.children[0] as HTMLElement;
      if (!firstChild) return;

      const tick = () => {
        const singleWidth = firstChild.offsetWidth;
        const dir = direction === "left" ? -1 : 1;

        offset.current += currentSpeed.current * dir;

        if (direction === "left" && offset.current <= -singleWidth) {
          offset.current += singleWidth;
        } else if (direction === "right" && offset.current >= 0) {
          offset.current -= singleWidth;
        }

        // Decay speed back to base
        currentSpeed.current +=
          (baseSpeed - currentSpeed.current) * 0.04;

        track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
        rafId.current = requestAnimationFrame(tick);
      };

      // Start offscreen for right direction
      if (direction === "right") {
        offset.current = -firstChild.offsetWidth;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    init();

    return () => {
      cancelAnimationFrame(rafId.current);
      ctx?.revert();
    };
  }, [reduced, baseSpeed, direction]);

  // Loop copies need a trailing separator for seamless wrap; the static
  // (reduced-motion) row reads better without the dangling separator.
  const loopContent = items.join(separator) + separator;
  const staticContent = items.join(separator);

  const itemStyle: React.CSSProperties = {
    fontSize: "clamp(1rem, 2vw, 1.5rem)",
    fontWeight: 500,
    letterSpacing: "0.02em",
    color: "color-mix(in oklab, var(--primary-foreground) 70%, transparent)",
    textTransform: "uppercase",
    flexShrink: 0,
    paddingRight: 0,
  };

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        background: "color-mix(in oklab, var(--primary) 85%, transparent)",
        padding: "1.25rem 0",
        borderTop:
          "1px solid color-mix(in oklab, var(--primary-foreground) 6%, transparent)",
        borderBottom:
          "1px solid color-mix(in oklab, var(--primary-foreground) 6%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          willChange: reduced ? undefined : "transform",
        }}
      >
        {reduced ? (
          <span style={itemStyle}>{staticContent}</span>
        ) : (
          // Three copies for seamless loop
          [0, 1, 2].map((copy) => (
            <span key={copy} style={itemStyle}>
              {loopContent}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
