"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface TextMaskRevealProps {
  text: string;
  /** Any CSS color. Defaults to the site's primary token. */
  fillColor?: string;
  /** Any CSS color. Defaults to a subtle foreground mix. */
  strokeColor?: string;
  className?: string;
}

export default function TextMaskReveal({
  text,
  fillColor = "var(--primary)",
  strokeColor = "color-mix(in oklab, var(--foreground) 15%, transparent)",
  className = "",
}: TextMaskRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const filledRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // settled state rendered below

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
  }, [reduced]);

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

        {/* Filled copy revealed by clip-path (fully visible when reduced motion) */}
        <div
          ref={filledRef}
          style={{
            ...textStyles,
            position: "absolute",
            inset: 0,
            color: fillColor,
            WebkitTextFillColor: fillColor,
            clipPath: reduced ? "none" : "inset(100% 0 0 0)",
            willChange: reduced ? undefined : "clip-path",
          }}
        >
          {text}
        </div>
      </div>
    </section>
  );
}
