"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ZoomParallaxProps {
  text: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  children?: ReactNode;
}

export default function ZoomParallax({
  text,
  backgroundImage,
  backgroundColor = "#0a0a0b",
  textColor = "rgba(234,231,226,0.3)",
  className = "",
  children,
}: ZoomParallaxProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            refreshPriority: 1,
          },
        });

        // Text scales up and fades out — GPU-accelerated
        tl.to(
          textRef.current,
          {
            scale: 2.5,
            opacity: 0,
            ease: "none",
            force3D: true,
          },
          0,
        );

        // Background zooms subtly for depth parallax
        if (bgRef.current) {
          tl.to(
            bgRef.current,
            {
              scale: 1.3,
              ease: "none",
              force3D: true,
            },
            0,
          );
        }
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        background: backgroundColor,
      }}
    >
      {/* Background layer */}
      {backgroundImage && (
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: "-10%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
      )}

      {/* Zoom text */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, opacity",
        }}
      >
        <span
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: textColor,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {text}
        </span>
      </div>

      {/* Optional child content (appears as text zooms away) */}
      {children && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
