"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ColorShiftPanel {
  bg: string;
  text: string;
  children: ReactNode;
}

interface ColorShiftSectionProps {
  panels: ColorShiftPanel[];
  className?: string;
}

export default function ColorShiftSection({
  panels,
  className = "",
}: ColorShiftSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        panelRefs.current.forEach((panel) => {
          if (!panel) return;
          const bg = panel.dataset.bg;
          const text = panel.dataset.text;

          ScrollTrigger.create({
            trigger: panel,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => {
              gsap.to(document.body, {
                backgroundColor: bg,
                color: text,
                duration: 0.8,
                ease: "power2.out",
                overwrite: true,
              });
            },
            onEnterBack: () => {
              gsap.to(document.body, {
                backgroundColor: bg,
                color: text,
                duration: 0.8,
                ease: "power2.out",
                overwrite: true,
              });
            },
          });
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [panels]);

  return (
    <div ref={containerRef} className={className}>
      {panels.map((panel, i) => (
        <section
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          data-bg={panel.bg}
          data-text={panel.text}
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          {panel.children}
        </section>
      ))}
    </div>
  );
}
