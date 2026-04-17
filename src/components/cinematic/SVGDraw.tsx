"use client";

import { useEffect, useRef } from "react";

interface SVGDrawProps {
  path: string;
  viewBox?: string;
  width?: string | number;
  height?: string | number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

export default function SVGDraw({
  path,
  viewBox = "0 0 400 200",
  width = "100%",
  height = "auto",
  strokeColor = "currentColor",
  strokeWidth = 2,
  className = "",
}: SVGDrawProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const pathEl = pathRef.current;
      if (!pathEl) return;

      // Measure the total path length
      const totalLength = pathEl.getTotalLength();

      // Set initial state — fully hidden
      gsap.set(pathEl, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      });

      ctx = gsap.context(() => {
        // Animate dashoffset from totalLength to 0 on scroll
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
            refreshPriority: -1,
          },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [path]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
      }}
    >
      <svg
        viewBox={viewBox}
        style={{ width, height, maxWidth: "100%", overflow: "visible" }}
        fill="none"
      >
        <path
          ref={pathRef}
          d={path}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
