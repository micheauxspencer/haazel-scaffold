"use client";

import { useState, useCallback } from "react";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface AccordionPanel {
  image: string;
  title: string;
  heading: string;
  description: string;
}

interface AccordionSliderProps {
  panels: AccordionPanel[];
  variant?: "horizontal" | "vertical";
  className?: string;
}

export default function AccordionSlider({
  panels,
  variant = "horizontal",
  className = "",
}: AccordionSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  // Tap-to-expand (onClick) always works, including on touch. Hover-preview
  // (onMouseEnter) is a fine-pointer convenience layered on top of it, and
  // is also an animated cursor-reactive effect, so it's off under reduced
  // motion too.
  const hoverEnabled = pointerFine && !reduced;
  // Explicit click-driven state changes stay interactive under reduced
  // motion; only the animated transition between states is removed.
  const tr = useCallback((css: string) => (reduced ? "none" : css), [reduced]);

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (variant === "vertical") {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {panels.map((panel, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => handleActivate(i)}
              onMouseEnter={hoverEnabled ? () => handleActivate(i) : undefined}
              style={{
                height: isActive ? "240px" : "60px",
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: "none",
                padding: 0,
                outline: "none",
                transition: tr(`height 0.5s ${EASE_STANDARD_CSS}`),
                background: "var(--background)",
                width: "100%",
                textAlign: "left",
              }}
            >
              {/* Background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${panel.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                  transition: tr(`transform 0.5s ${EASE_STANDARD_CSS}`),
                  willChange: "transform",
                }}
              />
              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, color-mix(in oklab, var(--background) 80%, transparent) 0%, color-mix(in oklab, var(--background) 30%, transparent) 50%, transparent 80%)",
                }}
              />
              {/* Collapsed title */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "24px",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "var(--foreground)",
                  zIndex: 2,
                  opacity: isActive ? 0 : 1,
                  transition: tr(`opacity 0.3s ${EASE_STANDARD_CSS}`),
                }}
              >
                {String(i + 1).padStart(2, "0")} — {panel.title}
              </div>
              {/* Expanded content */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  zIndex: 2,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(10px)",
                  transition: tr(`all 0.4s ${EASE_STANDARD_CSS} 0.1s`),
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--foreground)",
                  }}
                >
                  {panel.heading}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.5,
                    maxWidth: "40ch",
                  }}
                >
                  {panel.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: "8px",
        height: "70vh",
        minHeight: "400px",
        maxHeight: "600px",
      }}
    >
      {panels.map((panel, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            key={i}
            onClick={() => handleActivate(i)}
            onMouseEnter={hoverEnabled ? () => handleActivate(i) : undefined}
            style={{
              flex: isActive ? 5 : 1,
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "none",
              padding: 0,
              outline: "none",
              transition: tr(`flex 0.6s ${EASE_STANDARD_CSS}`),
              background: "var(--background)",
              textAlign: "left",
            }}
          >
            {/* Background image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${panel.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                transition: tr(`transform 0.6s ${EASE_STANDARD_CSS}`),
                willChange: "transform",
              }}
            />

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, color-mix(in oklab, var(--background) 85%, transparent) 0%, color-mix(in oklab, var(--background) 20%, transparent) 40%, transparent 60%)",
              }}
            />

            {/* Vertical label (collapsed) */}
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                writingMode: "vertical-rl" as const,
                textOrientation: "mixed" as const,
                position: "absolute",
                bottom: "28px",
                left: "16px",
                color: "var(--foreground)",
                opacity: isActive ? 0 : 1,
                transition: tr(`opacity 0.3s ${EASE_STANDARD_CSS}`),
                zIndex: 2,
              }}
            >
              {panel.title}
            </div>

            {/* Expanded content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "28px 24px",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition: tr(`all 0.4s ${EASE_STANDARD_CSS} 0.1s`),
                  color: "currentColor",
                  marginBottom: "8px",
                  fontWeight: 400,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  marginBottom: "6px",
                  color: "var(--foreground)",
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : "translateY(10px)",
                  transition: tr(`all 0.4s ${EASE_STANDARD_CSS} 0.15s`),
                }}
              >
                {panel.heading}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.5,
                  maxWidth: "30ch",
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : "translateY(10px)",
                  transition: tr(`all 0.4s ${EASE_STANDARD_CSS} 0.2s`),
                }}
              >
                {panel.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
