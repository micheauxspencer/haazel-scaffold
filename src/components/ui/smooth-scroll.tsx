"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const { isReady, preset } = useGSAPContext();
  const lenisRef = useRef<import("lenis").default | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const config = getPreset(preset);
    // Only enable smooth scroll for presets that use scrub/parallax
    if (!config.section.parallaxImages && !config.section.pinEnabled) {
      return;
    }

    async function init() {
      const Lenis = (await import("lenis")).default;
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    init();

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isReady, preset]);

  return <>{children}</>;
}
