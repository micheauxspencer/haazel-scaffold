"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface StickyCard {
  content: ReactNode;
  background?: string;
}

interface StickyCardsProps {
  cards: StickyCard[];
  className?: string;
}

export default function StickyCards({
  cards,
  className = "",
}: StickyCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        cardRefs.current.forEach((card, i) => {
          if (!card || i === cards.length - 1) return;

          ScrollTrigger.create({
            trigger: card,
            start: "top 15%",
            end: "bottom 15%",
            pin: true,
            pinSpacing: false,
            refreshPriority: cards.length - i,
          });

          // Scale down slightly as next card stacks on top
          gsap.to(card, {
            scale: 0.92 + i * 0.01,
            opacity: 0.4,
            force3D: true,
            scrollTrigger: {
              trigger: cardRefs.current[i + 1],
              start: "top 80%",
              end: "top 15%",
              scrub: 0.3,
            },
          });
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [cards.length]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ padding: "40px 24px" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{
              background: card.background || "#111114",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "48px 40px",
              marginBottom: "24px",
              willChange: "transform, opacity",
              transformOrigin: "center top",
            }}
          >
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}
