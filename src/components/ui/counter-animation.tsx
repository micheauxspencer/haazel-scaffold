"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";
import { cn } from "@/lib/utils";

interface CounterAnimationProps {
  end: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CounterAnimation({
  end,
  prefix = "",
  suffix = "",
  className,
  decimals = 0,
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(0);
  const { isReady, preset } = useGSAPContext();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const config = getPreset(preset);
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]>;

    async function animate() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const obj = { value: 0 };

      ctx = gsap.context(() => {
        gsap.to(obj, {
          value: end,
          duration: config.counter.duration,
          ease: config.counter.ease,
          scrollTrigger: {
            trigger: ref.current!,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            setDisplayed(
              decimals > 0
                ? parseFloat(obj.value.toFixed(decimals))
                : Math.round(obj.value)
            );
          },
        });
      }, ref);
    }

    animate();

    return () => {
      ctx?.revert();
    };
  }, [isReady, preset, end, decimals]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
}
