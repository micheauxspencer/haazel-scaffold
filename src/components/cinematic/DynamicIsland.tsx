"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface IslandNotification {
  color: string;
  text: string;
}

interface DynamicIslandProps {
  label?: string;
  /** Any CSS color. Defaults to the site's primary token. */
  dotColor?: string;
  notifications?: IslandNotification[];
  className?: string;
}

export default function DynamicIsland({
  label = "3 notifications",
  dotColor = "var(--primary)",
  notifications = [],
  className = "",
}: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  const toggle = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes islandBreathe{0%,100%{opacity:.6}50%{opacity:1}}
          `,
        }}
      />
      <div
        className={className}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "var(--popover)",
          border: "1px solid var(--border)",
          borderRadius: expanded ? "20px" : "100px",
          padding: expanded ? "20px 24px" : "8px 20px",
          display: "flex",
          flexDirection: expanded ? "column" : "row",
          alignItems: expanded ? "stretch" : "center",
          gap: expanded ? "16px" : "10px",
          cursor: "pointer",
          transition: reduced ? "none" : `all 0.5s ${EASE_STANDARD_CSS}`,
          overflow: "hidden",
          maxHeight: expanded ? "280px" : "44px",
          width: expanded ? "320px" : "auto",
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
            animation: reduced ? undefined : "islandBreathe 2s ease infinite",
            display: expanded ? "none" : "block",
          }}
        />

        {/* Collapsed label */}
        {!expanded && (
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              color: "var(--popover-foreground)",
            }}
          >
            {label}
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "color-mix(in oklab, var(--popover-foreground) 4%, transparent)",
                  fontSize: "14px",
                  color: "var(--popover-foreground)",
                  transition: reduced ? "none" : `background 0.2s ${EASE_STANDARD_CSS}`,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: n.color,
                  }}
                />
                {n.text}
              </div>
            ))}
            <div
              style={{
                fontSize: "12px",
                color: "color-mix(in oklab, var(--popover-foreground) 35%, transparent)",
                textAlign: "center",
                paddingTop: "4px",
              }}
            >
              Tap to collapse
            </div>
          </div>
        )}
      </div>
    </>
  );
}
