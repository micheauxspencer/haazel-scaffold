"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

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
  const reduced = useReducedMotion();

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % states.length);
  }, [states.length]);

  // Reduced motion: the DOM change (new width/height/radius/background) is
  // applied directly with no transition, instead of morphing between states.
  const boxTransition = reduced ? "none" : `all 0.5s ${EASE_STANDARD_CSS}`;
  const contentTransition = reduced ? "none" : `opacity 0.3s ${EASE_STANDARD_CSS}`;
  const dotTransition = reduced ? "none" : `background 0.3s ${EASE_STANDARD_CSS}`;

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
          background: active.background || "var(--primary)",
          border: "none",
          cursor: "pointer",
          transition: boxTransition,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-foreground)",
          overflow: "hidden",
          willChange: "width, height, border-radius",
          outline: "none",
        }}
      >
        <div
          style={{
            transition: contentTransition,
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
                  ? "color-mix(in oklab, var(--foreground) 80%, transparent)"
                  : "color-mix(in oklab, var(--foreground) 15%, transparent)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: dotTransition,
              outline: "none",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: "13px",
          color: "color-mix(in oklab, var(--foreground) 35%, transparent)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {active.label} — click to morph
      </p>
    </div>
  );
}
