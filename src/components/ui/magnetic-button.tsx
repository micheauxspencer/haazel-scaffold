"use client";

import { useRef, useCallback } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  as: Tag = "button",
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const { isReady, preset } = useGSAPContext();
  const config = getPreset(preset);

  const handleMouseMove = useCallback(
    async (e: React.MouseEvent) => {
      if (!isReady || !config.interactive.magneticButtons || !ref.current) return;
      const gsap = (await import("gsap")).default;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(ref.current, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [isReady, config.interactive.magneticButtons, strength]
  );

  const handleMouseLeave = useCallback(async () => {
    if (!isReady || !ref.current) return;
    const gsap = (await import("gsap")).default;

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  }, [isReady]);

  const props = {
    ref: ref as React.Ref<HTMLButtonElement>,
    className: cn("inline-block", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    ...(Tag === "a" && { href }),
  };

  // @ts-expect-error - dynamic tag typing
  return <Tag {...props}>{children}</Tag>;
}
