"use client";

import { useEffect, useRef } from "react";

interface CircularTextProps {
  text: string;
  centerContent?: React.ReactNode;
  size?: number;
  fontSize?: number;
  color?: string;
  speed?: number;
  scrollReactive?: boolean;
  reverse?: boolean;
  className?: string;
}

export default function CircularText({
  text,
  centerContent,
  size = 320,
  fontSize = 14,
  color = "currentColor",
  speed = 20,
  scrollReactive = false,
  reverse = false,
  className = "",
}: CircularTextProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    if (!scrollReactive) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          onUpdate: (self) => {
            angleRef.current += self.getVelocity() * 0.02;
            if (svgRef.current) {
              svgRef.current.style.transform = `rotate(${angleRef.current}deg)`;
            }
          },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [scrollReactive]);

  const r = size / 2;
  const pathR = r * 0.75;
  const pathId = `circPath-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: "100%",
          height: "100%",
          animation: scrollReactive
            ? undefined
            : `circularSpin ${speed}s linear infinite${reverse ? " reverse" : ""}`,
          willChange: "transform",
        }}
      >
        <defs>
          <path
            id={pathId}
            d={`M${r},${r} m-${pathR},0 a${pathR},${pathR} 0 1,1 ${pathR * 2},0 a${pathR},${pathR} 0 1,1 -${pathR * 2},0`}
          />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          letterSpacing="0.3em"
          fontWeight={500}
          style={{ textTransform: "uppercase" }}
        >
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>

      {centerContent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          {centerContent}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes circularSpin { to { transform: rotate(360deg); } }`,
        }}
      />
    </div>
  );
}
