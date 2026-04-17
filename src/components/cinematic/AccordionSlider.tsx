"use client";

import { useState, useCallback, type CSSProperties } from "react";

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
              onMouseEnter={() => handleActivate(i)}
              style={{
                height: isActive ? "240px" : "60px",
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: "none",
                padding: 0,
                outline: "none",
                transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                background: "#0a0a0a",
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
                  transition: "transform 0.5s ease",
                  willChange: "transform",
                }}
              />
              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(10,10,11,0.8) 0%, rgba(10,10,11,0.3) 50%, transparent 80%)",
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
                  color: "rgba(234,231,226,0.95)",
                  zIndex: 2,
                  opacity: isActive ? 0 : 1,
                  transition: "opacity 0.3s",
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
                  transition:
                    "all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "rgba(234,231,226,0.95)",
                  }}
                >
                  {panel.heading}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(234,231,226,0.7)",
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
            onMouseEnter={() => handleActivate(i)}
            style={{
              flex: isActive ? 5 : 1,
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              border: "none",
              padding: 0,
              outline: "none",
              transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              background: "#0a0a0a",
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
                transition:
                  "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform",
              }}
            />

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.2) 40%, transparent 60%)",
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
                color: "rgba(234,231,226,0.95)",
                opacity: isActive ? 0 : 1,
                transition: "opacity 0.3s",
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
                  transition:
                    "all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
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
                  color: "rgba(234,231,226,0.95)",
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : "translateY(10px)",
                  transition:
                    "all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
                }}
              >
                {panel.heading}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(234,231,226,0.7)",
                  lineHeight: 1.5,
                  maxWidth: "30ch",
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : "translateY(10px)",
                  transition:
                    "all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
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
