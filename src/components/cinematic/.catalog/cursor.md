# Cursor & Hover — Catalog

Catalog entries for the 9 cursor/hover modules, verified against the code
after the CONVENTIONS.md v0.2 pass (pointer gating, reduced motion, token
colors). See `../CONVENTIONS.md` for the rules and `../TextMaskReveal.tsx`
for the reference conversion pattern.

### CursorGlow
- **What**: A soft radial-gradient halo that trails the cursor with eased lerp motion via `requestAnimationFrame`.
- **Props**:
  - `color: string = "color-mix(in oklab, var(--primary) 12%, transparent)"`
  - `size: number = 500`
  - `className?: string`
  - `children?: ReactNode`
- **Fits**: cinematic, saas, editorial
- **Reduced motion**: Glow layer is not mounted at all and the rAF/mousemove loop never starts; `children` render normally and unaffected. Same gating also applies whenever no fine pointer is present (touch).

### TiltCard
- **What**: Wraps content in a card that tilts in 3D toward the cursor and shows a cursor-following spotlight gradient overlay.
- **Props**:
  - `children?: ReactNode`
  - `className: string = ""`
  - `maxTilt: number = 12`
  - `scale: number = 1.02`
  - `perspective: number = 600`
  - `spotlightColor: string = "color-mix(in oklab, var(--primary) 6%, transparent)"`
- **Fits**: cinematic, saas, app, commerce, leadgen
- **Reduced motion**: `onMouseMove`/`onMouseLeave` handlers early-return without touching the DOM; the card stays flat (no transform) and content renders normally. Same gating also applies whenever no fine pointer is present (touch).

### SpotlightBorderCards
- **What**: A grid of cards whose border glow and interior spotlight track the cursor position per-card via `--mx`/`--my` CSS custom properties. **Breaking API change**: `accentColor` now accepts any CSS color (was an `"r, g, b"` triplet); alpha layers derive via `color-mix`.
- **Props**:
  - `items: { icon?: ReactNode; title: string; description: string }[]`
  - `columns: number = 3`
  - `accentColor: string = "var(--primary)"` — any CSS color, not an rgb triplet
  - `className: string = ""`
- **Fits**: saas, cinematic, leadgen, app
- **Reduced motion**: `onMouseMove` is not attached, so `--mx`/`--my` stay at their off-canvas fallback (`-200px`) and the spotlight/border-glow layers render inert; title/description/icon are always rendered regardless of hover. Same gating also applies whenever no fine pointer is present (touch).

### AccordionSlider
- **What**: A row (horizontal variant) or column (vertical variant) of image panels that expand on hover or click/tap to reveal a heading and description; collapsed panels show a compact index + title label.
- **Props**:
  - `panels: { image: string; title: string; heading: string; description: string }[]`
  - `variant: "horizontal" | "vertical" = "horizontal"`
  - `className: string = ""`
- **Fits**: cinematic, editorial, leadgen, commerce
- **Reduced motion**: Tap/click-to-expand (`onClick`) keeps working — it's an explicit state change — but every transition on the affected styles (height/flex, image scale, opacity, translateY) switches to `"none"` so the state change is instant. The hover-to-preview convenience (`onMouseEnter`) is turned off entirely under reduced motion (it's the animated cursor-reactive layer) and is also gated to fine-pointer devices only; tap always works on touch.
- **Judgment call**: `onMouseEnter` (hover-preview) is gated on `usePointerFine`; `onClick` (tap/click-to-expand) is never gated — it's the component's real interaction path and must work on touch.

### FlipCards
- **What**: Cards that flip 180° in 3D on click, tap, or Enter to reveal a back face rendered in the (per-card or shared) accent color.
- **Props**:
  - `cards: { icon?: ReactNode; frontTitle: string; frontDesc: string; backTitle: string; backDesc: string; backLink?: string; accentColor?: string }[]`
  - `accentColor: string = "var(--primary)"`
  - `className: string = ""`
- **Fits**: saas, leadgen, commerce, editorial, cinematic
- **Reduced motion**: Click/tap/Enter-to-flip keeps working (it's an explicit state change); the `transform` transition is set to `"none"` so the flip is instant rather than an animated 3D rotation.
- **Judgment call**: No `usePointerFine` import — the only interaction is `onClick`/`onKeyDown`, which already behaves identically on touch and mouse, so there's no separate hover-only layer to gate.

### CursorReveal
- **What**: Two before/after reveal patterns in one file. `WipeReveal` (default export): a draggable vertical divider comparing two background images. `SpotlightReveal` (named export): a circular lens that reveals a second background layer under the cursor, resizable with the scroll wheel.
- **Props** — `WipeReveal`:
  - `beforeImage: string`
  - `afterImage: string`
  - `beforeLabel: string = "Before"`
  - `afterLabel: string = "After"`
  - `className: string = ""`
- **Props** — `SpotlightReveal`:
  - `baseBackground: string`
  - `revealBackground: string`
  - `initialRadius: number = 80`
  - `hint: string = "Move your mouse here"`
  - `className: string = ""`
- **Fits**: cinematic, editorial, commerce
- **Reduced motion**: `WipeReveal` is unaffected — it's direct 1:1 Pointer Events drag manipulation (mouse and touch alike) with no ambient animation to remove. `SpotlightReveal`'s hover/wheel listeners are disabled and it renders its settled state: `revealBackground` fully visible (`clipPath: none`), no cursor ring, no hint. Same gating (for `SpotlightReveal` only) also applies whenever no fine pointer is present (touch).
- **Judgment call**: Before this pass, `SpotlightReveal` permanently hid `revealBackground` on touch (mousemove never fires, so `clip-path` stayed at `circle(0px)` forever) and showed an unactionable "Move your mouse here" hint — a real violation of "no content reachable only via hover." Fixed by treating full reveal as the settled/static state, mirroring how `TextMaskReveal` shows its masked content fully visible when animation is unavailable. `WipeReveal` needed no hook imports — it already supports touch via Pointer Events and has no transitions to gate, matching the `DragPanGrid` drag precedent.

### ImageTrail
- **What**: Spawns a trailing pool of rotating, fading colored blocks behind the cursor as it moves past a distance threshold.
- **Props**:
  - `colors: string[]` — defaults to an 8-entry token-derived palette (`var(--primary)`, `var(--accent)`, `var(--secondary)`, `var(--destructive)`, and `color-mix` blends between them)
  - `poolSize: number = 20`
  - `threshold: number = 60`
  - `itemWidth: number = 160`
  - `itemHeight: number = 200`
  - `children?: ReactNode`
  - `className: string = ""`
- **Fits**: cinematic, editorial
- **Reduced motion**: The DOM pool is never created and `onMouseMove` is never attached; only the centered `children` render (unchanged, always visible). Same gating also applies whenever no fine pointer is present (touch).
- **Judgment call**: The `colors` default was a fixed 8-hex rainbow; converted to token/`color-mix` derivations so the trail re-themes with brand color instead of being hardcoded. In today's unbranded neutral scaffold theme (`--primary`/`--accent` are 0-chroma grays) this reads more monochrome than the original, but re-themes correctly once brand OKLCH values are applied via `tokens:apply`.

### MagneticGrid
- **What**: A grid of dots that displace toward the cursor within a magnet radius and switch to a brighter fill near the center.
- **Props**:
  - `rows: number = 8`
  - `cols: number = 12`
  - `dotSize: number = 12`
  - `gap: number = 8`
  - `dotColor: string = "color-mix(in oklab, var(--foreground) 6%, transparent)"`
  - `activeColor: string = "color-mix(in oklab, var(--foreground) 20%, transparent)"`
  - `magnetRadius: number = 120`
  - `magnetStrength: number = 8`
  - `className: string = ""`
- **Fits**: cinematic, saas, editorial
- **Reduced motion**: `onMouseMove`/`onMouseLeave` are not attached, so every dot stays at its initial neutral offset (`{x:0, y:0, active:false}`) — the same state `onMouseLeave` resets to on desktop. Same gating also applies whenever no fine pointer is present (touch).

### DragPanGrid
- **What**: A click/tap-and-drag pannable canvas of absolutely-positioned cards, driven by Pointer Events (`setPointerCapture`).
- **Props**:
  - `items: { x: number; y: number; width: number; height: number; background: string; content?: ReactNode }[]`
  - `height: string = "80vh"`
  - `hint: string = "Click and drag to explore"`
  - `className: string = ""`
- **Fits**: cinematic, editorial, app
- **Reduced motion**: Drag-to-pan itself is left fully interactive on every input type — it's direct 1:1 pointer manipulation the user explicitly initiates, not an ambient/auto-playing effect, and the pan transform already has no transition to begin with. Only the otherwise-inert per-item `border-color`/`box-shadow` transition switches to `"none"`.
- **Judgment call**: No `usePointerFine` import — per the task brief, DragPanGrid's touch-drag is a "meaningful tap path" to keep working everywhere, and there's no separate hover-only decorative layer here to gate.

## Cross-cutting judgment calls

- **Color tokens**: text uses `var(--foreground)` / `var(--muted-foreground)` per CONVENTIONS. Surfaces/borders/scrims follow the existing `--hairline` pattern (`color-mix(in oklab, var(--foreground) N%, transparent)`); scrims meant to stay legible over arbitrary photos pair with `var(--background)` instead (e.g. `AccordionSlider`'s gradient overlays, `CursorReveal`'s handle/divider/label pill) so contrast is guaranteed in both themes rather than assuming a dark site theme. `FlipCards`' back-face text uses `var(--accent-foreground)`, paired with the `accentColor` prop the same way `--primary`/`--primary-foreground` pair.
- **`SpotlightBorderCards`' `mask: linear-gradient(#fff 0 0)...` border trick**: the color inside a `mask-composite` gradient is inert (only alpha matters), but swapped `#fff` → `var(--foreground)` anyway to keep the file clean of literal hex for any grep-based QA gate.
- **CursorGlow bug fixed in passing**: previously, on touch devices the glow `<div>` still mounted but never received a `transform` (the rAF loop never started), so it sat visibly in the fixed top-left corner. Gating its render on `active` removes that stray artifact rather than just leaving it inert.
