"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";

interface PanItem {
  x: number;
  y: number;
  width: number;
  height: number;
  background: string;
  content?: ReactNode;
}

interface DragPanGridProps {
  items: PanItem[];
  height?: string;
  hint?: string;
  className?: string;
}

export default function DragPanGrid({
  items,
  height = "80vh",
  hint = "Click and drag to explore",
  className = "",
}: DragPanGridProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [hintVisible, setHintVisible] = useState(true);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    startRef.current = {
      x: e.clientX - currentRef.current.x,
      y: e.clientY - currentRef.current.y,
    };
    setHintVisible(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const x = e.clientX - startRef.current.x;
    const y = e.clientY - startRef.current.y;
    currentRef.current = { x, y };
    setOffset({ x, y });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={areaRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        height,
        position: "relative",
        overflow: "hidden",
        cursor: dragging.current ? "grabbing" : "grab",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        touchAction: "none",
      }}
    >
      {hintVisible && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "rgba(255,255,255,0.4)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {hint}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          willChange: "transform",
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        }}
      >
        {items.map((item, i) => {
          const centerX = (areaRef.current?.offsetWidth ?? 800) / 2;
          const centerY = (areaRef.current?.offsetHeight ?? 600) / 2;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: centerX + item.x,
                top: centerY + item.y,
                width: item.width,
                height: item.height,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
                background: item.background,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "20px",
                transition: "border-color 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
