"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface HorizontalScrollProps {
  children?: ReactNode;
  className?: string;
}

export default function HorizontalScroll({
  children,
  className = "",
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [totalCards, setTotalCards] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const cards = track.querySelectorAll("[data-hcard]");
        const count = cards.length || 1;
        setTotalCards(count);

        // Set section height to accommodate horizontal scroll — matches source
        section.style.height = `${count * 100}vh`;

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);
            },
            onEnter: () => setVisible(true),
            onLeave: () => setVisible(false),
            onEnterBack: () => setVisible(true),
            onLeaveBack: () => setVisible(false),
          },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, []);

  const currentCard = Math.min(
    Math.ceil(progress * totalCards + 0.5),
    totalCards,
  );

  return (
    <>
      <section
        ref={sectionRef}
        className={className}
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100dvh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: "32px",
              padding: "0 max(48px, 5vw)",
              willChange: "transform",
            }}
          >
            {children}
          </div>
        </div>
      </section>

      {/* Progress bar — matches source design */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "2px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "1px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: "currentColor",
              borderRadius: "1px",
              transition: "width 0.1s",
              opacity: 0.6,
            }}
          />
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.08em",
          }}
        >
          {currentCard} / {totalCards}
        </span>
      </div>
    </>
  );
}
