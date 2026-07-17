"use client";

import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * SSR-safe: true only when a hover-capable fine pointer (mouse/trackpad)
 * is present. Cursor-reactive components must gate on this and render a
 * static (but complete) presentation on touch devices.
 * See src/components/cinematic/CONVENTIONS.md.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}
