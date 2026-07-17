"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/* ─── Horizontal Wipe ───
 * Drag-driven (Pointer Events unify mouse/touch/pen — already works on
 * touch via drag, matching the DragPanGrid pattern) with no ambient
 * animation to gate, so no pointer/reduced-motion branching is needed here.
 */
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
        border: "1px solid color-mix(in oklab, var(--foreground) 6%, transparent)",
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
          background: "var(--background)",
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
          background: "var(--background)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px color-mix(in oklab, var(--foreground) 30%, transparent)",
          pointerEvents: "none",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2">
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
              background: "color-mix(in oklab, var(--background) 60%, transparent)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "100px",
              color: "var(--foreground)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Circular Spotlight ───
 * Purely hover-driven (mousemove + wheel) with no tap equivalent worth
 * inventing, so per convention it gates on pointer-fine: on touch, or with
 * reduced motion, it renders its settled state — revealBackground fully
 * visible, no clip, no hint (a "move your mouse" hint is meaningless
 * without a mouse), same pattern as TextMaskReveal's masked-content-becomes-
 * fully-visible fallback.
 */
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
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const active = pointerFine && !reduced;

  // Reset to the settled (fully revealed) state whenever the effect becomes
  // unavailable, so revealBackground is never stuck hidden behind an
  // unreachable hover gesture.
  useEffect(() => {
    if (!active) {
      setClip("circle(0px at 50% 50%)");
      setCursor((c) => ({ ...c, visible: false }));
      setShowHint(false);
    }
  }, [active]);

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
      onMouseEnter={active ? onMouseEnter : undefined}
      onMouseLeave={active ? onMouseLeave : undefined}
      onMouseMove={active ? onMouseMove : undefined}
      onWheel={active ? onWheel : undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: active ? "none" : "default",
        border: "1px solid color-mix(in oklab, var(--foreground) 6%, transparent)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: baseBackground, zIndex: 1 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: revealBackground,
          zIndex: 2,
          // Settled state (no fine pointer, or reduced motion): fully
          // revealed rather than permanently hidden behind an unreachable
          // hover gesture.
          clipPath: active ? clip : "none",
          willChange: active ? "clip-path" : undefined,
        }}
      />
      {active && cursor.visible && (
        <div
          style={{
            position: "absolute",
            zIndex: 3,
            width: radiusRef.current * 2,
            height: radiusRef.current * 2,
            border: "2px solid color-mix(in oklab, var(--background) 50%, transparent)",
            borderRadius: "50%",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            left: cursor.x,
            top: cursor.y,
          }}
        />
      )}
      {active && showHint && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 4,
            fontSize: "14px",
            color: "color-mix(in oklab, var(--background) 80%, transparent)",
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
