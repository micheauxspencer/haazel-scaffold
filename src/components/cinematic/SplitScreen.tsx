"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface SplitScreenProps {
  leftItems: ReactNode[];
  rightItems: ReactNode[];
  travelDistance?: number;
  className?: string;
}

export default function SplitScreen({
  leftItems,
  rightItems,
  travelDistance = 300,
  className = "",
}: SplitScreenProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;

        const trigger = {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        };

        // Left column scrolls down
        gsap.to(leftRef.current, {
          y: -travelDistance,
          ease: "none",
          force3D: true,
          scrollTrigger: trigger,
        });

        // Right column scrolls up (opposite direction)
        gsap.to(rightRef.current, {
          y: travelDistance,
          ease: "none",
          force3D: true,
          scrollTrigger: { ...trigger },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [travelDistance]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        overflow: "hidden",
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          maxWidth: "1000px",
          margin: "0 auto",
          minHeight: "60vh",
          alignItems: "center",
        }}
      >
        {/* Left column — moves up */}
        <div
          ref={leftRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            willChange: "transform",
          }}
        >
          {leftItems.map((item, i) => (
            <div
              key={i}
              style={{
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Right column — moves down */}
        <div
          ref={rightRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            willChange: "transform",
          }}
        >
          {rightItems.map((item, i) => (
            <div
              key={i}
              style={{
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
