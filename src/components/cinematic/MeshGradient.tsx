"use client";

import { type ReactNode } from "react";

interface MeshBlob {
  color: string;
  size?: string;
  position?: { x: string; y: string };
  animationDelay?: string;
}

interface MeshGradientProps {
  blobs?: MeshBlob[];
  blur?: number;
  children?: ReactNode;
  className?: string;
}

const defaultBlobs: MeshBlob[] = [
  { color: "rgba(200,169,126,0.3)", size: "40%", position: { x: "10%", y: "20%" } },
  { color: "rgba(94,173,181,0.25)", size: "35%", position: { x: "60%", y: "40%" }, animationDelay: "1.5s" },
  { color: "rgba(168,116,142,0.25)", size: "30%", position: { x: "30%", y: "70%" }, animationDelay: "3s" },
];

export default function MeshGradient({
  blobs = defaultBlobs,
  blur = 60,
  children,
  className = "",
}: MeshGradientProps) {
  const uid = `mesh-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${uid}-float {
              0%, 100% { transform: translate(0, 0) scale(1); }
              25% { transform: translate(30px, -20px) scale(1.05); }
              50% { transform: translate(-10px, 25px) scale(0.95); }
              75% { transform: translate(20px, 10px) scale(1.03); }
            }
          `,
        }}
      />
      <div
        className={className}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        {/* Animated blobs */}
        {blobs.map((blob, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: blob.size || "35%",
              aspectRatio: "1",
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${blur}px)`,
              left: blob.position?.x || "50%",
              top: blob.position?.y || "50%",
              transform: "translate(-50%, -50%)",
              animation: `${uid}-float ${6 + i * 1.5}s ease-in-out infinite`,
              animationDelay: blob.animationDelay || "0s",
              willChange: "transform",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Content overlay */}
        {children && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
}
