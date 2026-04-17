"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface StickyStackItem {
  visual: ReactNode;
  title: string;
  description: string;
}

interface StickyStackProps {
  items: StickyStackItem[];
  className?: string;
}

export default function StickyStack({
  items,
  className = "",
}: StickyStackProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        const visuals = visualsRef.current;
        if (!section || !visuals) return;

        // Pin the left visual column
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: visuals,
          pinSpacing: false,
        });

        // Transition visuals on each card
        const cards = section.querySelectorAll<HTMLElement>("[data-stack-card]");
        const visualEls = visuals.querySelectorAll<HTMLElement>("[data-visual]");

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => {
              visualEls.forEach((v, vi) => {
                v.style.opacity = vi === i ? "1" : "0";
                v.style.transition =
                  "opacity 0.6s cubic-bezier(.16, 1, .3, 1)";
              });
            },
            onEnterBack: () => {
              visualEls.forEach((v, vi) => {
                v.style.opacity = vi === i ? "1" : "0";
                v.style.transition =
                  "opacity 0.6s cubic-bezier(.16, 1, .3, 1)";
              });
            },
          });
        });
      });
    };

    init();
    return () => { ctx?.revert(); };
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ height: `${items.length * 100}vh`, position: "relative" }}
    >
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Left: pinned visual */}
        <div
          ref={visualsRef}
          style={{
            width: "50%",
            height: "100vh",
            position: "relative",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              data-visual
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                opacity: i === 0 ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(.16, 1, .3, 1)",
              }}
            >
              {item.visual}
            </div>
          ))}
        </div>

        {/* Right: scrolling cards */}
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              data-stack-card
              style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                  color: "inherit",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  opacity: 0.65,
                  maxWidth: "28rem",
                  color: "inherit",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
