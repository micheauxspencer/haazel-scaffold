"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";

interface ScrollRevealOptions {
  /** Override default y offset */
  y?: number;
  /** Override default duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Stagger children elements */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Play once or every time */
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { isReady, preset } = useGSAPContext();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const config = getPreset(preset);
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]>;

    async function animate() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const el = ref.current!;
        const children = el.querySelectorAll("[data-reveal]");
        const targets = children.length > 0 ? children : el;

        gsap.from(targets, {
          y: options.y ?? config.reveal.y,
          opacity: config.reveal.opacity,
          duration: options.duration ?? config.reveal.duration,
          delay: options.delay ?? 0,
          stagger: options.stagger ?? config.reveal.stagger,
          ease: config.reveal.ease,
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 85%",
            toggleActions:
              options.once !== false
                ? "play none none none"
                : "play none none reverse",
          },
        });
      }, ref);
    }

    animate();

    return () => {
      ctx?.revert();
    };
  }, [isReady, preset, options.y, options.duration, options.delay, options.stagger, options.start, options.once]);

  return ref;
}
