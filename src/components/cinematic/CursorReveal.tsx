"use client";

import { useRef, useCallback, useState, useEffect } from "react";

/* ─── Horizontal Wipe ─── */
interface WipeRevealProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function WipeReveal({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: WipeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0.5);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPct(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      update(e.clientX);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [update],
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging.current) update(e.clientX);
    },
    [update],
  );
  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "ew-resize",
        border: "1px solid rgba(255,255,255,0.06)",
        touchAction: "none",
      }}
    >
      {/* After (bottom layer) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${afterImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Before (clipped) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${beforeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          clipPath: `inset(0 ${(1 - pct) * 100}% 0 0)`,
          willChange: "clip-path",
        }}
      />
      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pct * 100}%`,
          width: "2px",
          background: "white",
          zIndex: 3,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${pct * 100}%`,
          transform: "translate(-50%, -50%)",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "white",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          pointerEvents: "none",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1f" strokeWidth="2">
          <path d="M8 3l-5 9 5 9M16 3l5 9-5 9" />
        </svg>
      </div>
      {/* Labels */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {[beforeLabel, afterLabel].map((label) => (
          <span
            key={label}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "100px",
              color: "rgba(234,231,226,0.95)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Circular Spotlight ─── */
interface SpotlightRevealProps {
  baseBackground: string;
  revealBackground: string;
  initialRadius?: number;
  hint?: string;
  className?: string;
}

export function SpotlightReveal({
  baseBackground,
  revealBackground,
  initialRadius = 80,
  hint = "Move your mouse here",
  className = "",
}: SpotlightRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const radiusRef = useRef(initialRadius);
  const [showHint, setShowHint] = useState(true);
  const [clip, setClip] = useState("circle(0px at 50% 50%)");
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  const onMouseEnter = useCallback(() => {
    setShowHint(false);
    setCursor((c) => ({ ...c, visible: true }));
  }, []);

  const onMouseLeave = useCallback(() => {
    setClip("circle(0px at 50% 50%)");
    setCursor((c) => ({ ...c, visible: false }));
    setShowHint(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClip(`circle(${radiusRef.current}px at ${x}px ${y}px)`);
    setCursor({ x, y, visible: true });
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    radiusRef.current = Math.max(30, Math.min(200, radiusRef.current - e.deltaY * 0.3));
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "none",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: baseBackground, zIndex: 1 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: revealBackground,
          zIndex: 2,
          clipPath: clip,
          willChange: "clip-path",
        }}
      />
      {cursor.visible && (
        <div
          style={{
            position: "absolute",
            zIndex: 3,
            width: radiusRef.current * 2,
            height: radiusRef.current * 2,
            border: "2px solid rgba(255,255,255,0.5)",
            borderRadius: "50%",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            left: cursor.x,
            top: cursor.y,
          }}
        />
      )}
      {showHint && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 4,
            fontSize: "14px",
            color: "rgba(255,255,255,0.8)",
            pointerEvents: "none",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

/* ─── Default export: combined module ─── */
export default WipeReveal;
