"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe: returns false on the server and first paint, then reflects
 * the user's `prefers-reduced-motion` setting (live-updates on change).
 *
 * Every animated component in this scaffold must consume this hook and
 * render its settled/final state when it returns true.
 * See src/components/cinematic/CONVENTIONS.md.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
