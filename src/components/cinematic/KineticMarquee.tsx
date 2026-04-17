"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
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
  }, [baseSpeed, direction]);

  const content = items.join(separator) + separator;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        background: "rgba(0,0,0,0.85)",
        padding: "1.25rem 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {/* Three copies for seamless loop */}
        {[0, 1, 2].map((copy) => (
          <span
            key={copy}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              flexShrink: 0,
              paddingRight: 0,
            }}
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  );
}
