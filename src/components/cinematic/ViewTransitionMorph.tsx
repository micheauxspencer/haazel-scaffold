"use client";

import { useState, useCallback, type ReactNode } from "react";

interface MorphState {
  id: string;
  label: string;
  content: ReactNode;
  background?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

interface ViewTransitionMorphProps {
  states: MorphState[];
  className?: string;
}

export default function ViewTransitionMorph({
  states,
  className = "",
}: ViewTransitionMorphProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = states[activeIndex];

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % states.length);
  }, [states.length]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        padding: "80px 24px",
        minHeight: "60vh",
      }}
    >
      {/* Morphing container */}
      <button
        onClick={next}
        style={{
          width: active.width || "200px",
          height: active.height || "200px",
          borderRadius: active.borderRadius || "20px",
          background: active.background || "#4f46e5",
          border: "none",
          cursor: "pointer",
          transition:
            "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(234,231,226,0.95)",
          overflow: "hidden",
          willChange: "width, height, border-radius",
          outline: "none",
        }}
      >
        <div
          style={{
            transition: "opacity 0.3s ease",
            textAlign: "center",
          }}
        >
          {active.content}
        </div>
      </button>

      {/* State indicator dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {states.map((state, i) => (
          <button
            key={state.id}
            onClick={() => setActiveIndex(i)}
            aria-label={state.label}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                i === activeIndex
                  ? "rgba(234,231,226,0.8)"
                  : "rgba(234,231,226,0.15)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "background 0.3s",
              outline: "none",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {active.label} — click to morph
      </p>
    </div>
  );
}
