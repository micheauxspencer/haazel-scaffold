"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { StylePreset } from "@/types/brand";

interface GSAPContextValue {
  isReady: boolean;
  preset: StylePreset;
}

const GSAPContext = createContext<GSAPContextValue>({
  isReady: false,
  preset: "cinematic",
});

export function useGSAPContext() {
  return useContext(GSAPContext);
}

interface GSAPProviderProps {
  children: React.ReactNode;
  preset?: StylePreset;
}

export function GSAPProvider({
  children,
  preset = "cinematic",
}: GSAPProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // Global GSAP defaults based on preset
      const defaults = getPresetDefaults(preset);
      gsap.defaults(defaults);

      setIsReady(true);
    }

    init();
  }, [preset]);

  return (
    <GSAPContext.Provider value={{ isReady, preset }}>
      {children}
    </GSAPContext.Provider>
  );
}

function getPresetDefaults(preset: StylePreset) {
  switch (preset) {
    case "cinematic":
      return { duration: 1.2, ease: "power3.out" };
    case "minimalist":
      return { duration: 0.6, ease: "power2.out" };
    case "brutalist":
      return { duration: 0.3, ease: "power1.out" };
    case "luxury":
      return { duration: 1.5, ease: "power2.inOut" };
    case "corporate":
      return { duration: 0.8, ease: "power2.out" };
    case "creative":
      return { duration: 1.0, ease: "back.out(1.7)" };
    case "ecommerce":
      return { duration: 0.5, ease: "power2.out" };
    default:
      return { duration: 1.0, ease: "power3.out" };
  }
}
