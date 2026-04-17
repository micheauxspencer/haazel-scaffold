"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";

interface ParallaxOptions {
  /** Speed multiplier (default from preset) */
  speed?: number;
  /** Direction of parallax */
  direction?: "vertical" | "horizontal";
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
) {
  const ref = useRef<T>(null);
  const { isReady, preset } = useGSAPContext();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const config = getPreset(preset);
    if (!config.section.parallaxImages) return;

    let ctx: ReturnType<typeof import("gsap")["default"]["context"]>;

    async function animate() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const speed = options.speed ?? config.hero.parallaxStrength;
      const distance = speed * 100;

      ctx = gsap.context(() => {
        gsap.to(ref.current!, {
          y: options.direction === "horizontal" ? 0 : distance,
          x: options.direction === "horizontal" ? distance : 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current!,
            start: "top bottom",
            end: "bottom top",
            scrub: config.section.scrubSpeed,
          },
        });
      }, ref);
    }

    animate();

    return () => {
      ctx?.revert();
    };
  }, [isReady, preset, options.speed, options.direction]);

  return ref;
}
