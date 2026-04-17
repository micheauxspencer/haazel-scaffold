"use client";

import { useState, useCallback } from "react";

interface CoverflowItem {
  title: string;
  description: string;
  background: string;
}

interface CoverflowCarouselProps {
  items: CoverflowItem[];
  className?: string;
}

export default function CoverflowCarousel({
  items,
  className = "",
}: CoverflowCarouselProps) {
  const [current, setCurrent] = useState(Math.floor(items.length / 2));

  const move = useCallback(
    (dir: number) => {
      setCurrent((prev) =>
        Math.max(0, Math.min(items.length - 1, prev + dir)),
      );
    },
    [items.length],
  );

  return (
    <div
      className={className}
      style={{ perspective: "1200px", overflow: "hidden" }}
    >
      {/* Track */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, i) => {
          const offset = i - current;
          const absOffset = Math.abs(offset);
          const tx = offset * 220;
          const ry = offset < 0 ? 40 : offset > 0 ? -40 : 0;
          const scale = absOffset === 0 ? 1 : 0.8;
          const zIndex = absOffset === 0 ? 10 : 10 - absOffset;
          const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.2;
          const brightness = absOffset === 0 ? 1 : 0.6;

          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                position: "absolute",
                width: "300px",
                height: "360px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "none",
                padding: "28px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                textAlign: "left",
                color: "rgba(234,231,226,0.95)",
                background: item.background,
                transform: `translateX(${tx}px) rotateY(${ry}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: `brightness(${brightness})`,
                transition:
                  "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity",
                outline: "none",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "13px", opacity: 0.7 }}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "32px",
        }}
      >
        <button
          onClick={() => move(-1)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "rgba(234,231,226,0.95)",
            fontSize: "18px",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
          }}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <button
          onClick={() => move(1)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "rgba(234,231,226,0.95)",
            fontSize: "18px",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
          }}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
