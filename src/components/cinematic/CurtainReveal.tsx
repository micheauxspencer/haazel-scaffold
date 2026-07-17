"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

interface CurtainRevealProps {
  leftText?: string;
  rightText?: string;
  children?: ReactNode;
  className?: string;
}

export default function CurtainReveal({
  leftText = "DIS",
  rightText = "COVER",
  children,
  className = "",
}: CurtainRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // curtains render already parted below

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Matches source: trigger on section, scrub 0.5, end at 60%
        gsap.to(leftRef.current, {
          xPercent: -100,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: 0.5,
          },
        });

        gsap.to(rightRef.current, {
          xPercent: 100,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: 0.5,
          },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ position: "relative", height: "300vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Revealed content behind curtains */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--background), var(--card))",
            padding: "40px",
          }}
        >
          {children}
        </div>

        {/* Left curtain — settled (reduced) state is fully parted off-screen */}
        <div
          ref={leftRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "50%",
            background: "var(--background)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "40px",
            borderRight: "1px solid color-mix(in oklab, var(--foreground) 6%, transparent)",
            transform: reduced ? "translateX(-100%)" : "none",
            willChange: reduced ? undefined : "transform",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.25rem, 7vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--foreground)",
              userSelect: "none",
            }}
          >
            {leftText}
          </h2>
        </div>

        {/* Right curtain — settled (reduced) state is fully parted off-screen */}
        <div
          ref={rightRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "50%",
            background: "var(--background)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "40px",
            borderLeft: "1px solid color-mix(in oklab, var(--foreground) 6%, transparent)",
            transform: reduced ? "translateX(100%)" : "none",
            willChange: reduced ? undefined : "transform",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.25rem, 7vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--foreground)",
              userSelect: "none",
            }}
          >
            {rightText}
          </h2>
        </div>
      </div>
    </section>
  );
}
