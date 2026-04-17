"use client";

import { useCallback, useState, type ReactNode } from "react";

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
  accentColor = "#4f46e5",
}: {
  card: FlipCardData;
  accentColor: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const color = card.accentColor ?? accentColor;

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
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
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
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
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
              color: "rgba(234,231,226,0.95)",
            }}
          >
            {card.frontTitle}
          </h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
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
            color: "white",
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
  accentColor = "#4f46e5",
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
