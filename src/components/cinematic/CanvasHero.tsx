"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { EASE_STANDARD_CSS } from "@/lib/motion/constants";

interface CanvasHeroProps {
  frameCount?: number;
  framePath?: string;
  staticImage?: string;
  children?: ReactNode;
  className?: string;
}

export default function CanvasHero({
  frameCount = 0,
  framePath = "/assets/frames/",
  staticImage,
  children,
  className = "",
}: CanvasHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  const useFrameSequence = frameCount > 0;
  // Reduced motion always falls back to the staticImage (or plain gradient)
  // panel instead of scrubbing the canvas frame sequence.
  const showCanvas = useFrameSequence && !reduced;

  useEffect(() => {
    if (!showCanvas && staticImage) {
      setLoaded(true);
    }
  }, [showCanvas, staticImage]);

  useEffect(() => {
    if (reduced) return; // settled state rendered below (staticImage, no pin)

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!canvas || !section) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      if (useFrameSequence) {
        // Preload all frames
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const padNumber = (n: number, width: number) =>
          String(n).padStart(width, "0");

        const drawFrame = (index: number) => {
          const img = images[index];
          if (!img || !img.complete) return;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };

        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          img.src = `${framePath}${padNumber(i, 4)}.jpg`;
          img.onload = () => {
            loadedCount++;
            setProgress(loadedCount / frameCount);
            if (loadedCount === frameCount) {
              setLoaded(true);
              drawFrame(0);
            }
          };
          img.onerror = () => {
            loadedCount++;
            setProgress(loadedCount / frameCount);
            if (loadedCount === frameCount) setLoaded(true);
          };
          images.push(img);
        }

        const frameIndex = { value: 0 };

        ctx = gsap.context(() => {
          gsap.to(frameIndex, {
            value: frameCount - 1,
            snap: "value",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
            },
            onUpdate: () => {
              drawFrame(Math.round(frameIndex.value));
            },
          });

          // Fade out hero content
          if (content) {
            gsap.to(content, {
              opacity: 0,
              y: -60,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "10% top",
                end: "35% top",
                scrub: true,
              },
            });
          }
        });
      } else {
        // Static mode: just fade content
        ctx = gsap.context(() => {
          if (content) {
            gsap.to(content, {
              opacity: 0,
              y: -60,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "10% top",
                end: "35% top",
                scrub: true,
              },
            });
          }
        });
      }
    };

    init();
    return () => { ctx?.revert(); };
  }, [frameCount, framePath, useFrameSequence, reduced]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        height: showCanvas ? "300vh" : "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Canvas / Image layer */}
        {showCanvas ? (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
        ) : staticImage ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${staticImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />
        )}

        {/* Loading indicator */}
        {showCanvas && !loaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
              background: "var(--background)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "120px",
                  height: "2px",
                  background: "color-mix(in oklab, var(--foreground) 10%, transparent)",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "color-mix(in oklab, var(--primary) 80%, transparent)",
                    transition: `width 0.2s ${EASE_STANDARD_CSS}`,
                  }}
                />
              </div>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                }}
              >
                Loading
              </p>
            </div>
          </div>
        )}

        {/* Hero content overlay */}
        <div
          ref={contentRef}
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
