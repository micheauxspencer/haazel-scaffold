"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface FlipCardData {
  icon?: ReactNode;
  frontTitle: string;
  frontDesc: string;
  backTitle: string;
  backDesc: string;
  backLink?: string;
  accentColor?: string;
}

interface FlipCardsProps {
  cards: FlipCardData[];
  accentColor?: string;
  className?: string;
}

function FlipCard({
  card,
  accentColor = "var(--primary)",
}: {
  card: FlipCardData;
  accentColor: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const color = card.accentColor ?? accentColor;
  const reduced = useReducedMotion();

  // Tap/click to flip works identically on touch and fine pointers — this
  // is an explicit state change, so it stays interactive under reduced
  // motion, just without the animated 3D transition.
  const toggle = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return (
    <div
      onClick={toggle}
      onKeyDown={(e) => e.key === "Enter" && toggle()}
      role="button"
      tabIndex={0}
      style={{
        perspective: "800px",
        height: "320px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: reduced ? "none" : `transform 0.6s ${EASE_STANDARD_CSS}`,
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
          willChange: "transform",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "32px",
            background: "color-mix(in oklab, var(--foreground) 3%, transparent)",
            border: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)",
            boxShadow: "0 8px 30px color-mix(in oklab, var(--foreground) 4%, transparent)",
          }}
        >
          {card.icon && (
            <div
              style={{
                fontSize: "32px",
                marginBottom: "auto",
                paddingTop: "8px",
              }}
            >
              {card.icon}
            </div>
          )}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "4px",
              color: "var(--foreground)",
            }}
          >
            {card.frontTitle}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
            {card.frontDesc}
          </p>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "32px",
            background: color,
            color: "var(--accent-foreground)",
            transform: "rotateY(180deg)",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {card.backTitle}
          </h3>
          <p style={{ fontSize: "14px", opacity: 0.85, lineHeight: 1.5 }}>
            {card.backDesc}
          </p>
          {card.backLink && (
            <span
              style={{
                marginTop: "16px",
                fontSize: "13px",
                opacity: 0.7,
                textDecoration: "underline",
              }}
            >
              {card.backLink}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlipCards({
  cards,
  accentColor = "var(--primary)",
  className = "",
}: FlipCardsProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
      }}
    >
      {cards.map((card, i) => (
        <FlipCard key={i} card={card} accentColor={accentColor} />
      ))}
    </div>
  );
}
