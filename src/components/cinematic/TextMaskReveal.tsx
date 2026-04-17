"use client";

import { useEffect, useRef } from "react";

interface TextMaskRevealProps {
  text: string;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
}

export default function TextMaskReveal({
  text,
  fillColor = "#8b5cf6",
  strokeColor = "rgba(255,255,255,0.15)",
  className = "",
}: TextMaskRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const filledRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          filledRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 0.6,
            },
          },
        );
      });
    };

    init();
    return () => { ctx?.revert(); };
  }, []);

  const textStyles: React.CSSProperties = {
    fontSize: "clamp(3rem, 10vw, 10rem)",
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: "-0.04em",
    textTransform: "uppercase",
    userSelect: "none",
    textAlign: "center",
    wordBreak: "break-word",
  };

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        padding: "8rem 2rem",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
        {/* Outlined base */}
        <div
          aria-hidden
          style={{
            ...textStyles,
            WebkitTextStroke: `2px ${strokeColor}`,
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {text}
        </div>

        {/* Filled copy revealed by clip-path */}
        <div
          ref={filledRef}
          style={{
            ...textStyles,
            position: "absolute",
            inset: 0,
            color: fillColor,
            WebkitTextFillColor: fillColor,
            clipPath: "inset(100% 0 0 0)",
            willChange: "clip-path",
          }}
        >
          {text}
        </div>
      </div>
    </section>
  );
}
