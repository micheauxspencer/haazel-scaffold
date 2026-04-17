"use client";

import { useState, useCallback, type ReactNode } from "react";

interface IslandNotification {
  color: string;
  text: string;
}

interface DynamicIslandProps {
  label?: string;
  dotColor?: string;
  notifications?: IslandNotification[];
  className?: string;
}

export default function DynamicIsland({
  label = "3 notifications",
  dotColor = "#4f46e5",
  notifications = [],
  className = "",
}: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const [currentDotColor, setCurrentDotColor] = useState(dotColor);
  const [pulseKey, setPulseKey] = useState(0);

  const toggle = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  const setStatus = useCallback((text: string, color: string) => {
    setExpanded(false);
    setCurrentDotColor(color);
    setCurrentLabel(text);
    setPulseKey((k) => k + 1);
  }, []);

  const reset = useCallback(() => {
    setCurrentDotColor(dotColor);
    setCurrentLabel(label);
  }, [dotColor, label]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes islandBreathe{0%,100%{opacity:.6}50%{opacity:1}}
            @keyframes islandPulse{0%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.05)}100%{transform:translateX(-50%) scale(1)}}
          `,
        }}
      />
      <div
        key={pulseKey}
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
          background: "#1a1a1f",
          border: "1px solid #2a2a30",
          borderRadius: expanded ? "20px" : "100px",
          padding: expanded ? "20px 24px" : "8px 20px",
          display: "flex",
          flexDirection: expanded ? "column" : "row",
          alignItems: expanded ? "stretch" : "center",
          gap: expanded ? "16px" : "10px",
          cursor: "pointer",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
          maxHeight: expanded ? "280px" : "44px",
          width: expanded ? "320px" : "auto",
          animation: pulseKey > 0 ? "islandPulse 0.3s ease" : undefined,
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: currentDotColor,
            flexShrink: 0,
            animation: "islandBreathe 2s ease infinite",
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
              color: "rgba(234,231,226,0.95)",
            }}
          >
            {currentLabel}
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
                  background: "rgba(255,255,255,0.04)",
                  fontSize: "14px",
                  color: "rgba(234,231,226,0.95)",
                  transition: "background 0.2s",
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
                color: "rgba(255,255,255,0.35)",
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
