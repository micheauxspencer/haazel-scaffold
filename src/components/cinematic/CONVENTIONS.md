# Cinematic Module Conventions

Every component in `cinematic/`, `primitives/`, and `sections/` follows these
rules. They are enforced by review and by `npm run check:catalog` +
the QA grep gates. When a rule and old code disagree, the rule wins.

## Baseline (unchanged from v0.1)

- `"use client"` at top; SSR-safe (no `window`/`document` outside effects).
- GSAP imported dynamically inside the effect: `(await import("gsap")).default`;
  register `ScrollTrigger` after import.
- All GSAP work wrapped in `gsap.context(...)` and reverted in the effect
  cleanup: `return () => { ctx?.revert(); }`.
- Expose `className` pass-through. Never cause layout shift — reserve space
  for anything that animates in.

## Reduced motion (mandatory)

Import `useReducedMotion` from `@/lib/motion/useReducedMotion` and branch:

| Category | When `reduced === true` |
|---|---|
| Scroll-scrub (pins, scrubs, frame sequences) | Render the **settled/final state**: no pin, no scrub, content fully visible. CanvasHero renders `staticImage`. |
| Entrance reveals | Content visible immediately (opacity 1, no transforms, no clip). |
| Ambient / auto-playing (marquee, scramble, typewriter, glitch, mesh drift) | Render **static final text/state**; no loops. |
| Cursor-reactive | Effect disabled entirely; children/content render normally. |
| Video | Do not autoplay; show `poster` frame. |

Exempt (static by nature): `NoiseOverlay` (static grain texture).

Pattern (see `TextMaskReveal.tsx`, the reference conversion):

```tsx
const reduced = useReducedMotion();
useEffect(() => {
  if (reduced) return; // JSX below must already render the settled state
  // ...gsap.context work...
}, [reduced]);
```

The settled state must come from the *default* rendering (styles/JSX), with
GSAP applying the animated-from state only when motion is allowed. Never ship
a component that renders blank when JS animation is skipped.

## Pointer capability (mandatory for hover/cursor modules)

Import `usePointerFine` from `@/lib/motion/usePointerFine`. If the device has
no fine pointer: skip cursor listeners entirely and render the complete static
presentation. Anything revealed only on hover must have a touch path (tap) or
must not hide content in the first place. Inline `ontouchstart` checks are
replaced by this hook.

## Colors: tokens only

- Color props accept **any CSS color string** and default to design tokens:
  `var(--primary)`, `var(--accent)`, `var(--foreground)`, etc.
- Alpha/subtle variants derive via `color-mix`:
  `color-mix(in oklab, var(--foreground) 15%, transparent)`.
- No raw hex (`#8b5cf6`), no `rgba(255,255,255,…)` literals, and **no
  rgb-triplet string props** (`"139, 92, 246"` is banned — accept a real CSS
  color and derive alphas with `color-mix`).
- Text colors: `var(--foreground)` / `var(--muted-foreground)`.

## Easing & duration

- CSS transitions: `var(--ease-standard, cubic-bezier(.16, 1, .3, 1))` —
  import `EASE_STANDARD_CSS` from `@/lib/motion/constants`.
- GSAP eases stay GSAP-native (e.g. `"expo.out"`, `"none"` for scrubs) —
  matching the site-wide feel set by `GSAPProvider`.

## Catalog

Every module has an entry in `src/components/COMPONENT_CATALOG.md`
(name, one-liner, props signature verified against the code, archetype fit
tags, reduced-motion behavior). `npm run check:catalog` fails when catalog
and exports drift.
