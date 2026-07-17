/**
 * Motion design tokens — single source for easing/duration values in JS.
 *
 * The CSS custom properties are authored into globals.css by
 * `npm run tokens:apply` (see scripts/apply-tokens.ts). Components should
 * prefer the CSS-var form so per-site tokens win; the raw values exist for
 * GSAP and other JS-only consumers.
 */

/** CSS transition easing — use in inline styles / CSS. */
export const EASE_STANDARD_CSS = "var(--ease-standard, cubic-bezier(.16, 1, .3, 1))";
export const EASE_EXIT_CSS = "var(--ease-exit, cubic-bezier(.7, 0, .84, 0))";

/** Raw fallbacks (kept in sync with the scaffold token defaults). */
export const EASE_STANDARD_RAW = "cubic-bezier(.16, 1, .3, 1)";

/** Durations in ms. CSS vars: --duration-fast/base/slow/reveal. */
export const DURATION = {
  fast: 150,
  base: 300,
  slow: 600,
  reveal: 1200,
} as const;

/**
 * Read a motion CSS var off :root at runtime (client only), with fallback.
 * Useful when GSAP needs a concrete number/string rather than a var().
 */
export function readMotionVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}
