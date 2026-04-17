"use client";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({
  opacity = 0.035,
  className = "",
}: NoiseOverlayProps) {
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="cinematic-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          pointerEvents: "none",
          opacity,
          mixBlendMode: "overlay",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-200%",
            filter: "url(#cinematic-noise)",
            willChange: "transform",
          }}
        />
      </div>
    </>
  );
}
