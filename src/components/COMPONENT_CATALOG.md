# Haazel Component Catalog

The single source of truth for every component in this scaffold. Verified
against the code by `npm run check:catalog` (drift fails the build gate).
Conventions: cinematic/CONVENTIONS.md · Section contract: sections/SECTION_SPEC.md
Selection guidance (when to use what): the haazel plugin's references/module-selection.md.

Counts: 9 layout primitives · 35 cinematic modules · 38 section components.

Notable ui/ extras (not enforced by check:catalog): MagneticButton
(ui/magnetic-button.tsx — magnetic hover wrapper), plus the stock shadcn
primitives (Base UI) in ui/.

## Layout primitives (src/components/primitives)

### LayeredHeadline
- **What**: Font-pairing collage headline â€” display face carries the line, a serif-italic overlay word breaks it, mono eyebrow anchors it; masked-rise reveal on scroll.
- **Props**: `primary: string` (required) Â· `eyebrow?: string` Â· `overlay?: string` Â· `secondary?: string` Â· `size?: "hero" | "display" = "display"` Â· `align?: "left" | "center" = "left"` Â· `overlayColor?: string = "var(--primary)"` Â· `indent?: boolean = true` Â· `reveal?: boolean = true` Â· `className?`
- **Fits**: cinematic, saas, leadgen, commerce, editorial
- **Reduced motion**: lines render in place, no mask/rise.
- **Layout DNA**: the pairing + overlap move itself.

### OverlapField
- **What**: 12-column composition field where items share rows and deliberately overlap; optional per-item scroll drift. Named exports `OverlapField` + `OverlapItem`.
- **Props**: Field: `children`, `className?`. Item: `col: string` (required, e.g. "1 / 8") Â· `row?: number = 1` Â· `z?: number = 1` Â· `offsetY?: string` Â· `drift?: number = 0` (-1..1) Â· `className?`
- **Fits**: cinematic, saas, commerce, editorial
- **Reduced motion**: no drift; layout intact. Mobile: single column, offsets neutralized.
- **Layout DNA**: z-layered overlap, broken edges.

### EditorialSplit
- **What**: Asymmetric two-column split (62/38 default â€” never 50/50) with optional content overhang across the seam and sticky media.
- **Props**: `media: ReactNode` (required) Â· `children` (required) Â· `ratio?: "62/38" | "58/42" | "70/30" = "62/38"` Â· `flip?: boolean` Â· `overhang?: boolean` Â· `sticky?: boolean` Â· `align?: "start" | "center" | "end" = "center"` Â· `className?`
- **Fits**: all archetypes
- **Reduced motion**: static layout (sticky is position, not animation).
- **Layout DNA**: the sanctioned asymmetry.

### OffsetGrid
- **What**: Broken grid â€” items share columns but start at staggered vertical offsets, killing the flat-top card wall.
- **Props**: `children` (required) Â· `columns?: 2 | 3 | 4 = 3` Â· `offsets?: string[] = ["0px","3.5rem","1.25rem"]` Â· `gap?: string` Â· `className?`
- **Fits**: all marketing archetypes (app uses density grids instead)
- **Reduced motion**: offsets persist (layout, not animation); mobile collapses to one column.
- **Layout DNA**: the staggered grid move.

### BleedImage
- **What**: Full-bleed media band with inset caption rail and restrained Â±8% parallax.
- **Props**: `children: ReactNode` (required media) Â· `caption?: string` Â· `credit?: string` Â· `height?: string = "clamp(20rem, 70vh, 44rem)"` Â· `parallax?: boolean = true` Â· `className?`
- **Fits**: cinematic, leadgen, commerce, editorial
- **Reduced motion**: static image, no parallax.
- **Layout DNA**: the full-bleed breather between contained sections.

### CaptionRail
- **What**: Mono overline + hairline rule system â€” section numbering, captions, meta. The connective tissue.
- **Props**: `label: string` (required) Â· `meta?: string` Â· `rule?: "top" | "bottom" | "none" = "top"` Â· `tone?: "default" | "muted" = "muted"` Â· `className?`
- **Fits**: all archetypes
- **Reduced motion**: static by nature.
- **Layout DNA**: the mono+hairline signature.

### ScrollingText
- **What**: Scroll-scrubbed kinetic type band â€” one or two opposing rows of display type that move with the page (timer-based marquees are KineticMarquee's job).
- **Props**: `rows: {text, direction?: 1 | -1}[]` (required) Â· `color?: string = "var(--foreground)"` Â· `alternateOutline?: boolean = true` Â· `separator?: string = " â€” "` Â· `size?: "display" | "hero" = "display"` Â· `className?`
- **Fits**: cinematic, commerce, editorial
- **Reduced motion**: one static centered line per row.
- **Layout DNA**: language as texture.

### DeviceFrame
- **What**: Product-shot framing â€” browser chrome, phone shell, or bare panel with ambient primary-tinted glow.
- **Props**: `children: ReactNode` (required) Â· `variant?: "browser" | "phone" | "bare" = "browser"` Â· `url?: string` Â· `glow?: boolean = true` Â· `glowColor?: string = "var(--primary)"` Â· `className?`
- **Fits**: saas, app (marketing shots), commerce (app-adjacent products)
- **Reduced motion**: static by nature.
- **Layout DNA**: screenshots as product, not pasted rectangles.

### SectionShell
- **What**: Standard section wrapper â€” token vertical rhythm, container + gutter, optional numbered caption rail, tone bands (default/card/inverted).
- **Props**: `children` (required) Â· `id?: string` Â· `rail?: {label, meta?}` Â· `bleed?: boolean` Â· `tone?: "default" | "card" | "inverted" = "default"` Â· `className?`
- **Fits**: all archetypes
- **Reduced motion**: static by nature.
- **Layout DNA**: the consistent spatial spine variety plays against.


## Cinematic modules (src/components/cinematic)


### — SCROLL —

### TextMaskReveal
- **What**: Giant outlined headline that fills solid with color via a scroll-scrubbed clip-path reveal.
- **Props**: `text: string`, `fillColor?: string = "var(--primary)"`, `strokeColor?: string = "color-mix(in oklab, var(--foreground) 15%, transparent)"`, `className?: string = ""`
- **Fits**: cinematic, editorial, leadgen, commerce
- **Reduced motion**: Skips the GSAP clip-path scrub entirely (early return before the dynamic import). The filled layer renders with `clipPath: "none"` instead of `inset(100% 0 0 0)`, so the outline and the filled copy are both fully visible immediately, with no scroll dependency.

### CanvasHero
- **What**: Pinned 300vh hero that scrubs a preloaded JPEG frame sequence on a `<canvas>` as the user scrolls.
- **Props**: `frameCount?: number = 0`, `framePath?: string = "/assets/frames/"`, `staticImage?: string`, `children?: ReactNode`, `className?: string = ""`
- **Fits**: cinematic, commerce, editorial, leadgen
- **Reduced motion**: Skips frame preloading and the ScrollTrigger frame-scrub entirely. Renders the `staticImage` fallback (or the plain gradient panel if none is given) instead of the canvas, at a fixed 100vh with no extra sticky scroll-room and no content fade-out-on-scroll.

### CurtainReveal
- **What**: Two sticky panels slide apart like theater curtains on scroll to reveal content behind them.
- **Props**: `leftText?: string = "DIS"`, `rightText?: string = "COVER"`, `children?: ReactNode`, `className?: string = ""`
- **Fits**: cinematic, editorial, leadgen, commerce
- **Reduced motion**: Skips the `xPercent` scrub entirely. Both curtain panels render pre-parted via a static `translateX(Â±100%)` transform, so the revealed content behind them is visible immediately with no pin and no scroll dependency.

### HorizontalScroll
- **What**: Vertical scroll hijacked into a horizontal pan across a track of cards, with a bottom scroll-progress indicator.
- **Props**: `children?: ReactNode`, `className?: string = ""`
- **Fits**: cinematic, editorial, commerce, leadgen
- **Reduced motion**: Skips the scroll-hijack scrub entirely. The track switches to a normal vertical flex column (cards stack top-to-bottom, `overflow: visible`, no sticky/clip container) and the scroll-progress bar is omitted since there is no scrub position to report.

### ColorShiftSection
- **What**: Stacked full-height panels that tween `document.body`'s background and text color as each one enters the viewport.
- **Props**: `panels: ColorShiftPanel[]` (each `{ bg: string, text: string, children: ReactNode }`), `className?: string = ""`
- **Fits**: cinematic, editorial, leadgen, commerce
- **Reduced motion**: Skips the ScrollTrigger `document.body` color tween entirely. Each panel instead applies its own `bg`/`text` directly as its own section background/color, so every panel shows its correct colors statically with no page-wide tween.

### StickyStack
- **What**: Pinned visual column on the left cross-fades between images while matching text cards scroll past on the right.
- **Props**: `items: StickyStackItem[]` (each `{ visual: ReactNode, title: string, description: string }`), `className?: string = ""`
- **Fits**: cinematic, saas, editorial, leadgen, commerce
- **Reduced motion**: Skips the pin and the opacity-swap ScrollTrigger callbacks entirely. The visual column un-pins and un-stacks (`position: relative`, one 100vh block per item instead of absolutely-stacked layers) so every visual sits inline next to its own card at opacity 1, in normal document flow.

### StickyCards
- **What**: Cards pin in place and scale/fade down as the next card scrolls over and stacks on top of them.
- **Props**: `cards: StickyCard[]` (each `{ content: ReactNode, background?: string = "var(--card)" }`), `className?: string = ""`
- **Fits**: cinematic, saas, editorial, leadgen, commerce
- **Reduced motion**: Skips the pin and the scale/opacity scrub entirely (both are purely additive GSAP tweens with no baked-in JSX state). Cards render at their natural scale and opacity 1, stacked in normal document flow.

### SplitScreen
- **What**: Two columns drift in opposite vertical directions (parallax) as the section scrolls through the viewport.
- **Props**: `leftItems: ReactNode[]`, `rightItems: ReactNode[]`, `travelDistance?: number = 300`, `className?: string = ""`
- **Fits**: cinematic, editorial, commerce, leadgen
- **Reduced motion**: Skips the opposite-direction `y` scrub entirely (purely additive GSAP tween, no baked transform in JSX). Both columns render at rest (`y: 0`), in their natural document position.

### ZoomParallax
- **What**: Pinned section where giant text scales up and fades out while the background image zooms for depth parallax.
- **Props**: `text: string`, `backgroundImage?: string`, `backgroundColor?: string = "var(--background)"`, `textColor?: string = "color-mix(in oklab, var(--foreground) 30%, transparent)"`, `className?: string = ""`, `children?: ReactNode`
- **Fits**: cinematic, editorial, leadgen, commerce
- **Reduced motion**: Skips the pin and the scale/fade/zoom timeline entirely. Renders the pre-zoom rest frame (text at scale 1 / opacity 1, background at scale 1) rather than the animation's faded-out end state, since the zoom-to-invisible is itself the effect (see judgment call in handoff notes).

### SVGDraw
- **What**: An SVG path draws itself on scroll via a `stroke-dasharray` / `stroke-dashoffset` scrub.
- **Props**: `path: string`, `viewBox?: string = "0 0 400 200"`, `width?: string | number = "100%"`, `height?: string | number = "auto"`, `strokeColor?: string = "currentColor"`, `strokeWidth?: number = 2`, `className?: string = ""`
- **Fits**: cinematic, saas, editorial, leadgen, commerce
- **Reduced motion**: Skips measuring path length and the `gsap.set`/scrub entirely (early return before the dynamic import). The path never receives a `strokeDasharray`/`strokeDashoffset`, so it renders fully drawn by default.


### — CURSOR —

# Cursor & Hover â€” Catalog

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
  - `accentColor: string = "var(--primary)"` â€” any CSS color, not an rgb triplet
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
- **Reduced motion**: Tap/click-to-expand (`onClick`) keeps working â€” it's an explicit state change â€” but every transition on the affected styles (height/flex, image scale, opacity, translateY) switches to `"none"` so the state change is instant. The hover-to-preview convenience (`onMouseEnter`) is turned off entirely under reduced motion (it's the animated cursor-reactive layer) and is also gated to fine-pointer devices only; tap always works on touch.
- **Judgment call**: `onMouseEnter` (hover-preview) is gated on `usePointerFine`; `onClick` (tap/click-to-expand) is never gated â€” it's the component's real interaction path and must work on touch.

### FlipCards
- **What**: Cards that flip 180Â° in 3D on click, tap, or Enter to reveal a back face rendered in the (per-card or shared) accent color.
- **Props**:
  - `cards: { icon?: ReactNode; frontTitle: string; frontDesc: string; backTitle: string; backDesc: string; backLink?: string; accentColor?: string }[]`
  - `accentColor: string = "var(--primary)"`
  - `className: string = ""`
- **Fits**: saas, leadgen, commerce, editorial, cinematic
- **Reduced motion**: Click/tap/Enter-to-flip keeps working (it's an explicit state change); the `transform` transition is set to `"none"` so the flip is instant rather than an animated 3D rotation.
- **Judgment call**: No `usePointerFine` import â€” the only interaction is `onClick`/`onKeyDown`, which already behaves identically on touch and mouse, so there's no separate hover-only layer to gate.

### CursorReveal
- **What**: Two before/after reveal patterns in one file. `WipeReveal` (default export): a draggable vertical divider comparing two background images. `SpotlightReveal` (named export): a circular lens that reveals a second background layer under the cursor, resizable with the scroll wheel.
- **Props** â€” `WipeReveal`:
  - `beforeImage: string`
  - `afterImage: string`
  - `beforeLabel: string = "Before"`
  - `afterLabel: string = "After"`
  - `className: string = ""`
- **Props** â€” `SpotlightReveal`:
  - `baseBackground: string`
  - `revealBackground: string`
  - `initialRadius: number = 80`
  - `hint: string = "Move your mouse here"`
  - `className: string = ""`
- **Fits**: cinematic, editorial, commerce
- **Reduced motion**: `WipeReveal` is unaffected â€” it's direct 1:1 Pointer Events drag manipulation (mouse and touch alike) with no ambient animation to remove. `SpotlightReveal`'s hover/wheel listeners are disabled and it renders its settled state: `revealBackground` fully visible (`clipPath: none`), no cursor ring, no hint. Same gating (for `SpotlightReveal` only) also applies whenever no fine pointer is present (touch).
- **Judgment call**: Before this pass, `SpotlightReveal` permanently hid `revealBackground` on touch (mousemove never fires, so `clip-path` stayed at `circle(0px)` forever) and showed an unactionable "Move your mouse here" hint â€” a real violation of "no content reachable only via hover." Fixed by treating full reveal as the settled/static state, mirroring how `TextMaskReveal` shows its masked content fully visible when animation is unavailable. `WipeReveal` needed no hook imports â€” it already supports touch via Pointer Events and has no transitions to gate, matching the `DragPanGrid` drag precedent.

### ImageTrail
- **What**: Spawns a trailing pool of rotating, fading colored blocks behind the cursor as it moves past a distance threshold.
- **Props**:
  - `colors: string[]` â€” defaults to an 8-entry token-derived palette (`var(--primary)`, `var(--accent)`, `var(--secondary)`, `var(--destructive)`, and `color-mix` blends between them)
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
- **Reduced motion**: `onMouseMove`/`onMouseLeave` are not attached, so every dot stays at its initial neutral offset (`{x:0, y:0, active:false}`) â€” the same state `onMouseLeave` resets to on desktop. Same gating also applies whenever no fine pointer is present (touch).

### DragPanGrid
- **What**: A click/tap-and-drag pannable canvas of absolutely-positioned cards, driven by Pointer Events (`setPointerCapture`).
- **Props**:
  - `items: { x: number; y: number; width: number; height: number; background: string; content?: ReactNode }[]`
  - `height: string = "80vh"`
  - `hint: string = "Click and drag to explore"`
  - `className: string = ""`
- **Fits**: cinematic, editorial, app
- **Reduced motion**: Drag-to-pan itself is left fully interactive on every input type â€” it's direct 1:1 pointer manipulation the user explicitly initiates, not an ambient/auto-playing effect, and the pan transform already has no transition to begin with. Only the otherwise-inert per-item `border-color`/`box-shadow` transition switches to `"none"`.
- **Judgment call**: No `usePointerFine` import â€” per the task brief, DragPanGrid's touch-drag is a "meaningful tap path" to keep working everywhere, and there's no separate hover-only decorative layer here to gate.

## Cross-cutting judgment calls

- **Color tokens**: text uses `var(--foreground)` / `var(--muted-foreground)` per CONVENTIONS. Surfaces/borders/scrims follow the existing `--hairline` pattern (`color-mix(in oklab, var(--foreground) N%, transparent)`); scrims meant to stay legible over arbitrary photos pair with `var(--background)` instead (e.g. `AccordionSlider`'s gradient overlays, `CursorReveal`'s handle/divider/label pill) so contrast is guaranteed in both themes rather than assuming a dark site theme. `FlipCards`' back-face text uses `var(--accent-foreground)`, paired with the `accentColor` prop the same way `--primary`/`--primary-foreground` pair.
- **`SpotlightBorderCards`' `mask: linear-gradient(#fff 0 0)...` border trick**: the color inside a `mask-composite` gradient is inert (only alpha matters), but swapped `#fff` â†’ `var(--foreground)` anyway to keep the file clean of literal hex for any grep-based QA gate.
- **CursorGlow bug fixed in passing**: previously, on touch devices the glow `<div>` still mounted but never received a `transform` (the rAF loop never started), so it sat visibly in the fixed top-left corner. Gating its render on `active` removes that stray artifact rather than just leaving it inert.


### — CLICK —

# Click/Tap Modules

### CoverflowCarousel
- **What**: 3D coverflow-style carousel where cards fan out in perspective around a centered active item.
- **Props**:
  - `items: CoverflowItem[]` (required) â€” `{ title: string; description: string; background: string }[]`
  - `className?: string = ""`
- **Fits**: cinematic, commerce, editorial, saas
- **Reduced motion**: Card `transform`/`opacity`/`filter` and the prev/next arrow styling switch to `transition: "none"`. Clicking a card or an arrow still updates `current` and re-renders the coverflow layout (position/scale/rotation math unchanged) â€” it just snaps instead of tweening over 0.6s.

### ParticleButton
- **What**: A button that bursts small colored particles outward from its center on click.
- **Props**:
  - `children: ReactNode` (required)
  - `color?: string = "var(--primary)"`
  - `particleCount?: number = 12`
  - `as?: "button" | "a" = "button"`
  - `href?: string`
  - `onClick?: () => void`
  - `className?: string = ""`
- **Fits**: cinematic, saas, app, leadgen, commerce
- **Reduced motion**: `handleClick` still calls `onClick` first, then returns before generating particles (`if (reduced) return`). The button remains fully clickable; no particle spans are ever created, so no burst renders and no cleanup timer runs.

### DynamicIsland
- **What**: A fixed pill (macOS "Dynamic Island"-style) that expands on click/tap to reveal a notification list.
- **Props**:
  - `label?: string = "3 notifications"`
  - `dotColor?: string = "var(--primary)"`
  - `notifications?: IslandNotification[] = []` â€” `{ color: string; text: string }[]`
  - `className?: string = ""`
- **Fits**: app, saas, cinematic
- **Reduced motion**: Click still toggles `expanded` and the pill still resizes and reveals notifications; the shape/size `transition` becomes `"none"`. Both the dot's looping `islandBreathe` animation and the one-off `islandPulse` (fired on status change) are disabled (`animation: undefined`), so the dot renders static instead of breathing/pulsing.

### DockNav
- **What**: A fixed bottom dock of nav icons/links that magnify near the cursor, macOS-dock style.
- **Props**:
  - `items: DockItem[]` (required) â€” `{ icon: ReactNode; label: string; color: string; href?: string; onClick?: () => void }[]`
  - `baseSize?: number = 48`
  - `maxSize?: number = 72`
  - `range?: number = 120`
  - `className?: string = ""`
- **Fits**: app, saas
- **Reduced motion**: Magnification requires both a fine pointer and motion allowed (`canMagnify = pointerFine && !reduced`). When either is false, `onMouseMove`/`onMouseLeave` are never attached and every icon renders at `baseSize` (uniform, static) via a derived `displaySizes` array â€” click/tap navigation via `href`/`onClick` is unaffected either way.

### ViewTransitionMorph
- **What**: A single button that click-cycles through a list of "states" (dot indicators also jump directly to one), morphing size, corner radius, background and content between them.
- **Props**:
  - `states: MorphState[]` (required) â€” `{ id: string; label: string; content: ReactNode; background?: string; width?: string; height?: string; borderRadius?: string }[]`
  - `className?: string = ""`
- **Fits**: cinematic, app
- **Reduced motion**: Click still advances `activeIndex` (both the main button and the indicator dots work); the box/content/dot `transition`s all become `"none"`, so the new width/height/radius/background/content apply directly with no morph animation.

### OdometerCounter
- **What**: A scroll-triggered digit counter that rolls each digit into place like a mechanical odometer.
- **Props**:
  - `value: number` (required)
  - `label?: string`
  - `prefix?: string`
  - `suffix?: string`
  - `className?: string = ""`
- **Fits**: saas, app, leadgen
- **Reduced motion**: The effect skips the dynamic GSAP/ScrollTrigger import entirely and calls `setActive(true)` immediately instead of waiting to scroll into view. Digit-roll transforms and the prefix/suffix/label opacity fades all resolve to `transition: "none"`, so the final number and label render immediately with no roll and no fade-in.


### — AMBIENT —

### KineticMarquee
- **What**: Auto-scrolling horizontal ticker of text items whose speed reacts to scroll velocity.
- **Props**: `items: string[]` (required) Â· `baseSpeed?: number = 1` Â· `direction?: "left" | "right" = "left"` Â· `separator?: string = " â€” "` Â· `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: renders a single static, non-scrolling row (`items.join(separator)`, no trailing separator); the rAF translate loop and the ScrollTrigger velocity listener never start. Band background/border/text now use `color-mix(in oklab, var(--primary) â€¦%, transparent)` / `var(--primary-foreground)` tokens in place of the former hardcoded black/white rgba literals.

### CircularText
- **What**: Text set along a circular SVG path â€” spins continuously by default, or rotates from scroll velocity when `scrollReactive`.
- **Props**: `text: string` (required) Â· `centerContent?: React.ReactNode` Â· `size?: number = 320` Â· `fontSize?: number = 14` Â· `color?: string = "currentColor"` Â· `speed?: number = 20` Â· `scrollReactive?: boolean = false` Â· `reverse?: boolean = false` Â· `className?: string`
- **Fits**: cinematic, editorial, leadgen
- **Reduced motion**: no CSS `circularSpin` keyframe and no scroll-driven rotation regardless of `scrollReactive`; the SVG sits static at its authored angle (`willChange` also dropped). `color` default left as `currentColor` (judgment call â€” see summary).

### GlitchEffect
- **What**: Hover-triggered RGB-split glitch distortion on text via layered `::before`/`::after` pseudo-elements.
- **Props**: `text: string` (required) Â· `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" = "div"` Â· `accentColor?: string = "var(--destructive)"` Â· `cyanColor?: string = "var(--accent)"` Â· `className?: string`
- **Fits**: cinematic, editorial
- **Reduced motion**: the pseudo-elements, hover-trigger rules, and both keyframe blocks are omitted from the injected `<style>` entirely (not just hover-gated) â€” only the base single-layer text rule ships, so hovering can never trigger a glitch. Text color now `color-mix(in oklab, var(--foreground) 95%, transparent)`.

### GradientStrokeText
- **What**: Large display text with a continuously shifting multi-stop gradient, as either a stroke outline or a filled clip.
- **Props**: `text: string` (required) Â· `variant?: "stroke" | "filled" = "stroke"` Â· `colors?: string[] = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)"]` Â· `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" = "h2"` Â· `strokeWidth?: number = 2` Â· `speed?: number = 6` Â· `className?: string`
- **Fits**: cinematic, editorial, leadgen
- **Reduced motion**: `background-position` animation removed; `backgroundPosition` is explicitly pinned to each variant's keyframe-0% value (`"0% 50%"`) so the gradient renders statically at its first frame instead of drifting to the browser's default position.

### MeshGradient
- **What**: Soft blurred color-blob backdrop that drifts and scales in a continuous ambient loop, with an optional content overlay.
- **Props**: `blobs?: MeshBlob[]` (default 3-blob set) Â· `blur?: number = 60` Â· `children?: ReactNode` Â· `className?: string`
- **Fits**: cinematic, saas, app, editorial
- **Reduced motion**: the `-float` keyframe animation (and its `animationDelay`/`willChange`) is dropped per blob; each blob renders frozen at its authored `position`/`size` (the base `translate(-50%, -50%)` placement, no drift/scale). Default blob colors now `color-mix(in oklab, var(--chart-1|2|3) â€¦%, transparent)`.

### TextScramble
- **What**: Text that resolves from randomized characters into the final string, on mount or on scroll-into-view.
- **Props**: `text: string` (required) Â· `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p" = "h2"` Â· `chars?: string` (default Aâ€“Z/aâ€“z/0â€“9/symbols) Â· `speed?: number = 50` Â· `stagger?: number = 30` Â· `triggerOnScroll?: boolean = true` Â· `className?: string`
- **Fits**: cinematic, editorial, app
- **Reduced motion**: `display` is set to the final `text` immediately; the `runScramble()` setTimeout-recursion loop and its ScrollTrigger (`triggerOnScroll` path) never run. No color props/literals in this component, so no token changes were needed.

### Typewriter
- **What**: Cycles through phrases, typing and deleting each with a blinking caret.
- **Props**: `phrases: string[]` (required) Â· `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p" = "span"` Â· `typingSpeed?: number = 80` Â· `deletingSpeed?: number = 40` Â· `pauseTime?: number = 2000` Â· `cursorColor?: string = "currentColor"` Â· `loop?: boolean = true` Â· `className?: string`
- **Fits**: cinematic, saas, leadgen, app
- **Reduced motion**: `display` is set to `phrases[0]` immediately; the type/delete `setTimeout` loop never starts and the caret-blink `setInterval` never starts â€” the caret renders solid (`opacity: 1`, static). Its `transition` now reads `opacity 0.1s var(--ease-standard, cubic-bezier(.16, 1, .3, 1))`. `cursorColor` default left as `currentColor` (judgment call â€” see summary).

### VideoBackground
- **What**: Full-bleed autoplaying, looping, muted video background with a color overlay; pauses via IntersectionObserver when off-screen.
- **Props**: `src: string` (required) Â· `poster?: string` Â· `overlay?: string = "color-mix(in oklab, var(--foreground) 40%, transparent)"` Â· `className?: string` Â· `children?: React.ReactNode` Â· `minHeight?: string = "100vh"` Â· `playbackRate?: number = 0.75`
- **Fits**: cinematic, leadgen, editorial, commerce
- **Reduced motion**: `video.play()` is never called (gated alongside the existing visibility check); the video shows `poster` if supplied, otherwise its natural first frame via the existing `preload="auto"`, with no playback. `poster` already existed on this component â€” no prop was added.

### NoiseOverlay
- **What**: Fixed full-viewport SVG film-grain/noise texture, blended over the page.
- **Props**: `opacity?: number = 0.035` Â· `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: exempt (static texture) per policy. No code changes made â€” the source has no CSS `animation`, no JS interval/rAF loop, and no color prop/literal to gate or tokenize; it was already fully static.

### ScrollProgress
- **What**: Fixed top-of-viewport bar that fills left-to-right to reflect vertical scroll progress. New module.
- **Props**: `color?: string = "var(--primary)"` Â· `height?: number = 2` Â· `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: still updates on every scroll/resize (rAF-throttled, passive listeners) since it communicates position rather than decorating â€” but skips the default mode's eased lerp-toward-target smoothing and sets `scaleX` directly to the exact scroll ratio each tick. SSR-safe: all `window`/`document` access is inside `useEffect`; listeners and the rAF handle are cleaned up on unmount.


## Sections — saas (src/components/sections/saas)

## saas

### SaasHero
- **What**: Asymmetric hero â€” statement type overlapping a glowing DeviceFrame product shot via OverlapField, deliberately off-balance instead of centered.
- **Props**: `headline: {primary, overlay?, secondary?}` (required) / `description: string` (required) / `primaryCta: {label, href}` (required) / `media: ReactNode` (required) / `announcement?: {label, href?}` / `eyebrow?: string` / `secondaryCta?: {label, href}` / `stats?: {value, label}[]` / `mediaUrl?: string` / `className = ""`
- **Fits**: saas
- **Reduced motion**: `useReducedMotion` gates a GSAP rise-stagger on the announcement/CTA/stats blocks and LayeredHeadline's own mask reveal; settled state renders complete without JS (the `translate-y-6 opacity-0` classes only apply when motion is active).
- **Layout DNA**: OverlapField/OverlapItem (12-col overlap, headline block over the drifting media block), LayeredHeadline (size="hero", reveal), DeviceFrame (glow).

### PricingTable
- **What**: Asymmetric pricing grid â€” the featured plan is physically wider and raised via an uneven `grid-template-columns`, not one of three identical cards.
- **Props**: `heading: string` (required) / `plans: PricingPlan[]` (required) / `id = "pricing"` / `rail?: {label, meta?}` / `intro?: string` / `currency = "$"` / `annualNote?: string` / `footnote?: string` / `className = ""`
- **Fits**: saas
- **Reduced motion**: `useReducedMotion` swaps the billing-toggle and card CSS transitions to `transition-none`; there is no scroll-triggered motion to begin with.
- **Layout DNA**: CaptionRail ("Most popular" tag), hand-tuned uneven `grid-template-columns` (featured column ~15% wider, raised with `md:-translate-y-4`) â€” intentionally not OffsetGrid, since the asymmetry here is column-width and elevation, not a staggered start.

### LogoCloud
- **What**: "Trusted by" band â€” a CaptionRail label sits beside a single hairline-bound row of logo marks that wraps naturally; never a boxed logo grid.
- **Props**: `label: string` (required) / `logos: {name: string, src?: string, svg?: ReactNode}[]` (required) / `id = "trusted-by"` / `rail?: {label, meta?}` / `className = ""`
- **Fits**: saas, leadgen
- **Reduced motion**: N/A â€” no JS motion. The grayscaleâ†’full hover resolves via a `@media (hover:hover) and (pointer:fine)` CSS variant rather than `usePointerFine`, so the component stays a server component with no client boundary.
- **Layout DNA**: CaptionRail (the trusted-by label, `rule="none"` since the outer flex row already carries the top/bottom hairline), a hairline-framed flex row that wraps (deliberately not a grid â€” the spec calls for one wrapping row, not tiles).

### FeatureBento
- **What**: Uneven bento â€” one large feature cell (media + copy, order flips at md+) beside four smaller cells, placed via CSS `grid-template-areas` so the block reads as deliberately asymmetric rather than a repeated card module.
- **Props**: `heading: string` (required) / `items: FeatureBentoItem[]` (required â€” exactly 5: `items[0]` is the large cell, `items[1..4]` the small ones) / `id = "features"` / `rail?: {label, meta?}` / `intro?: string` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A â€” static layout, no JS motion; the hairlineâ†’stronger-hairline hover is CSS-only and pointer-fine gated the same way as LogoCloud.
- **Layout DNA**: CaptionRail (per-cell tag/kicker), hand-rolled `grid-template-areas` via a CSS custom property (`--fb-areas`, same technique as EditorialSplit's `--es-cols`, since Tailwind arbitrary values can't hold multi-row quoted strings) â€” no primitive in the catalog covers named-area bento placement, so this is the file's bespoke, spec-requested move.

### FeatureTabs
- **What**: Vertical tab rail (38%) driving a DeviceFrame-framed media panel (62%), composed via `EditorialSplit(flip)`.
- **Props**: `heading: string` (required) / `items: FeatureTabsItem[]` (required, each `{label, description?, media: ReactNode}`) / `id = "feature-tabs"` / `rail?: {label, meta?}` / `intro?: string` / `mediaUrl?: string` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A â€” no JS motion in this file; tab switching is Base UI's own instant mount/unmount, not an animated reveal.
- **Layout DNA**: EditorialSplit (`ratio="62/38"`, `flip` â€” content/38% holds the tab rail, media/62% holds the DeviceFrame), DeviceFrame (glow, wraps the active `TabsContent`), `ui/tabs` (real Base UI `Tabs.Root`/`List`/`Tab`/`Panel` â€” `orientation="vertical"`, uncontrolled `defaultValue`, roving-tabindex keyboard nav from the library). No local state needed, so the file stays a server component.

### ComparisonTable
- **What**: Us-vs-them comparison table â€” first column features, one column per product, "ours" carrying a continuous primary border + card fill down its full height, mono check/x marks.
- **Props**: `heading: string` (required) / `columns: ComparisonColumn[]` (required, `{name, highlight?}`) / `rows: ComparisonRow[]` (required, `{feature, values: (boolean|string)[]}`) / `id = "compare"` / `rail?: {label, meta?}` / `intro?: string` / `footnote?: string` / `className = ""`
- **Fits**: saas, commerce
- **Reduced motion**: N/A â€” static table, no JS motion.
- **Layout DNA**: CaptionRail (table caption, defaults to a static "Feature availability by plan" line if no `footnote` given so the primitive is always present), hand-rolled `<table>` (`border-separate`, not `ui/table`, so the highlighted column's corner radius actually renders instead of being dropped by collapsed borders); `overflow-x-auto` + `min-w-[640px]` degrades to horizontal scroll on mobile.

### TestimonialWall
- **What**: One oversized editorial pull-quote (serif-italic, display size) over a staggered OffsetGrid of smaller supporting quotes â€” never a uniform wall of equal cards.
- **Props**: `featured: TestimonialWallQuote & {avatar?: ReactNode}` (required) / `supporting: TestimonialWallQuote[]` (required) / `id = "testimonials"` / `rail?: {label, meta?}` / `className = ""`
- **Fits**: saas, leadgen, editorial
- **Reduced motion**: N/A â€” static, no JS motion.
- **Layout DNA**: CaptionRail (attribution for both the featured quote and each supporting quote, mono+hairline throughout), OffsetGrid (`columns={3}`, staggered supporting quotes).

### IntegrationsGrid
- **What**: Integration tiles (logo slot + name + one-liner) in a staggered OffsetGrid; hairline borders resolve to primary on hover.
- **Props**: `heading: string` (required) / `integrations: IntegrationTile[]` (required, `{name, description, logo?}`) / `id = "integrations"` / `rail?: {label, meta?}` / `intro?: string` / `columns = 4` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A â€” hairlineâ†’primary border hover is CSS-only, pointer-fine gated.
- **Layout DNA**: OffsetGrid (`columns={3|4}`, staggered tile starts instead of a flat wall).

### MetricsBand
- **What**: Full-bleed inverted stat band â€” OdometerCounter drives 3-4 big figures set in mono, divided by hairline rules.
- **Props**: `stats: MetricsBandStat[]` (required, `{value: number, prefix?, suffix?, label}`) / `id = "metrics"` / `rail?: {label, meta?}` / `heading?: string` / `className = ""`
- **Fits**: saas, commerce
- **Reduced motion**: Delegated to `OdometerCounter` (`@/components/cinematic/OdometerCounter`) â€” under reduced motion each stat renders its final value immediately with no scroll wait and no digit roll.
- **Layout DNA**: `SectionShell tone="inverted"`, OdometerCounter (cinematic module) per stat wrapped in `font-mono` (numerals are "table figures" per spec Â§3, not body-face). Divider hairlines are color-mixed against `--background`, not `--foreground` â€” a foreground-mixed hairline would render dark-on-dark once the band is inverted, so this band always computes its own dividers off `--background` since `tone="inverted"` is fixed, not conditional.

### FaqCompact
- **What**: EditorialSplit 38/62 â€” sticky heading+intro left, `ui/accordion` answers right with hairline dividers between items.
- **Props**: `heading: string` (required) / `items: FaqItem[]` (required, `{q, a}`) / `id = "faq"` / `rail?: {label, meta?}` / `intro?: string` / `className = ""`
- **Fits**: saas, leadgen, app
- **Reduced motion**: N/A â€” accordion open/close is Base UI's own height transition; no scroll-triggered motion in this file.
- **Layout DNA**: EditorialSplit (`ratio="62/38"`, `flip` â€” the accordion sits in the `media` slot at 62%, the heading sits in `children` at 38%; EditorialSplit's own `sticky` prop only targets `media`, so stickiness is applied by hand to the `children` wrapper instead), `ui/accordion` (real Base UI `Accordion.Root`/`Item`/`Trigger`/`Panel`, uncontrolled `defaultValue`). No local state needed, so the file stays a server component.

### CtaPanel
- **What**: Closing band â€” LayeredHeadline set left-heavy against a CTA cluster that aligns to the end on desktop; an asymmetric two-zone close, not a centered banner.
- **Props**: `headline: {primary, overlay?, secondary?}` (required) / `primaryCta: {label, href}` (required) / `id = "cta"` / `rail?: {label, meta?}` / `tone: "inverted" | "card" = "inverted"` / `description?: string` / `secondaryCta?: {label, href}` / `microcopy?: string` / `className = ""`
- **Fits**: saas, leadgen, commerce
- **Reduced motion**: Delegated to LayeredHeadline's own scroll-reveal (masked rise, internally gated by `useReducedMotion`); no additional motion in this file.
- **Layout DNA**: LayeredHeadline (`size="display"`), tone-aware CTA/microcopy styling (`inverted` swaps ink to `--background`-derived tones so nothing goes invisible on the dark band).


## Sections — app (src/components/sections/app)

### AppShell
- **What**: Collapsible sidebar + topbar shell that frames the other seven app/ components inside a dashboard's main content area.
- **Props**: `navSections: AppShellNavSection[]` (required) / `brand: {name, logo?}` (required) / `user: {name, email?, avatarSrc?}` (required) / `children: ReactNode` (required) / `breadcrumb?: AppShellBreadcrumbItem[]` / `onSearchClick?: () => void` / `className?: string`
- **Fits**: app
- **Reduced motion**: sidebar-collapse width transition and the collapse-button chevron rotation both drop to `transition-none` under `useReducedMotion`; expanded/collapsed states render correctly with no JS either way.
- **Layout DNA**: `CaptionRail` for mono nav-section labels, `ui/sheet` for the mobile drawer (shares one `Sheet` root with the topbar's trigger so context connects correctly), `ui/avatar` for the identity slot. Styled on `--sidebar-*` tokens, not `--card`/`--popover`, so the rail reads as its own surface.

### DataTablePro
- **What**: Generic sortable, paginated data table on `ui/table` with an optional statusâ†’badge column mapping and a sticky header inside a scroll region.
- **Props**: `columns: DataTableColumn[]` (required) / `rows: Record<string, unknown>[]` (required) / `caption?: string` / `statusBadge?: DataTableStatusBadge` / `pageSize = 8` / `emptyState?: ReactNode` / `className?: string`
- **Fits**: app
- **Reduced motion**: no JS-driven motion; the sort-chevron rotation and row-hover state are plain CSS transitions (non-vestibular colour/rotate feedback), unaffected by `prefers-reduced-motion`.
- **Layout DNA**: `ui/table` + `ui/card` (header/content/footer frame the sticky-header scroll region and the pagination footer), `ui/badge` for status. Density exception: a uniform row stack is correct here â€” the "uniform grid" ban is a marketing-section rule, not a data-table rule.

### KpiCards
- **What**: Stat-card grid with display-face tabular values, directional delta pills, and an optional dependency-free SVG sparkline per card.
- **Props**: `items: KpiCardItem[]` (required) / `columns?: 2 | 4 = 4` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component (no `"use client"`, no animation to gate).
- **Layout DNA**: `ui/card`. Density exception used deliberately: a uniform 2/4-column grid of equal-weight cards is the correct pattern for a KPI row (the app pack's explicit density exception to the "uniform grid" ban), not `OffsetGrid`.

### ChartPanel
- **What**: Dependency-free inline-SVG chart card (line/bar/area) with 4 hairline gridlines, mono axis labels and native `<title>` hover tooltips.
- **Props**: `title: string` (required) / `data: ChartPanelDatum[]` (required) / `variant?: "line" | "bar" | "area" = "line"` / `meta?: string` / `valueFormatter?: (value: number) => string` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component; geometry is a pure function of `data` computed once per render, nothing to gate.
- **Layout DNA**: `ui/card` frame around a hand-rolled normalized-viewBox SVG (no chart library); gridlines at `color-mix(in oklab, var(--foreground) 10%, transparent)`, deterministic output for identical `data`.

### ActivityFeed
- **What**: Vertical timeline with a hairline left spine, avatar/icon nodes, and right-aligned mono timestamps; entries can be grouped into day sections.
- **Props**: `entries: ActivityFeedEntry[]` (required) / `groupByDay?: boolean = false` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component, no animation to gate.
- **Layout DNA**: `CaptionRail` for day-group headings, `ui/avatar` for actor nodes. Hairline spine at `color-mix(in oklab, var(--foreground) 12%, transparent)`; nodes sit on `bg-background` to visually interrupt the line, the same layered-edge move `OverlapField` uses elsewhere, at dashboard density.

### SettingsForm
- **What**: Config-driven settings form (`ui/input` + `ui/select` + textarea) with per-field labels/errors and a sticky save bar that only appears once the form is dirty.
- **Props**: `sections: SettingsSection[]` (required) / `errors?: Record<string, string>` / `onSubmit?: (values: Record<string, string>) => void` / `submitLabel = "Save changes"` / `className?: string`
- **Fits**: app
- **Reduced motion**: the save bar's show/hide transition (translate + opacity) drops to `transition-none` under `useReducedMotion`; it stays correctly shown/hidden via `aria-hidden` + `tabIndex` regardless of the JS motion path.
- **Layout DNA**: asymmetric `18rem / 1fr` section header split (never 50/50), hairline `divide-y` between sections, label/description/error stack per field.

### EmptyState
- **What**: Zero-state panel â€” a hand-authored geometric inline-SVG mark (layered, offset, rotated squares), heading, description, and a primary/secondary action pair.
- **Props**: `heading: string` (required) / `description?: string` / `primaryAction?: {label, href}` / `secondaryAction?: {label, href}` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component; the primary CTA's hover-lift is a plain CSS transition (non-essential micro-feedback), no reduced-motion gate needed.
- **Layout DNA**: mirrors the CTA pair from `SaasHero`/`PricingTable` (solid primary button + underlined secondary link) for cross-pack consistency; the mark is offset/rotated rects, not a centered blob â€” no emoji, no illustration library.

### CommandPalette
- **What**: âŒ˜K/Ctrl+K command palette wrapping `ui/command`'s cmdk-based `CommandDialog`, with grouped, iconable, shortcut-labeled actions.
- **Props**: `open: boolean` (required) / `onOpenChange: (open: boolean) => void` (required) / `groups: CommandPaletteGroup[]` (required) / `placeholder?: string` / `emptyMessage?: string` / `className?: string`
- **Fits**: app
- **Reduced motion**: open/close animation is owned by the shared `ui/dialog` primitive, not reimplemented here; the global keydown listener is motion-inert and is removed on unmount.
- **Layout DNA**: `ui/command` (`CommandDialog`, `CommandInput`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`) â€” cmdk-based, no custom list/filter logic.


## Sections — leadgen (src/components/sections/leadgen)

<!-- leadgen pack â€” merge into ../COMPONENT_CATALOG.md per SECTION_SPEC.md Â§6 -->

### LocalHero
- **What**: Phone-forward local-business hero â€” layered headline, service-area mono line, tel:/quote CTAs, trust chips, media panel.
- **Props**: `headline: {primary, overlay?, secondary?}` / `description: string` / `serviceAreas: string[]` / `phone: {display, href}` / `quoteCta: {label, href}` / `trustChips: {label, icon?}[]` / `media: ReactNode` (required) â€” `id?` / `eyebrow?` / `serviceAreaLabel? = "Serving"` / `mediaCaption?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: GSAP entrance rise (announcement/description/CTA row/trust chips) is skipped; content renders in its final position with no opacity/translate offset, matching the SaasHero pattern.
- **Layout DNA**: `EditorialSplit` (ratio `58/42`, `flip` so content stays left even though the primitive always gives `media` the larger fr-share), `LayeredHeadline` (`size="hero"`), inline SVG shield/check/star trust icons.

### ServiceCards
- **What**: Services as hairline cards â€” title, "from $X" in mono, arrow link. Not the banned icon-top-center 3-card wall.
- **Props**: `heading: string` / `services: {title, description, href, media?, priceFrom?}[]` (required) â€” `id?` / `rail?` / `intro?` / `currency? = "$"` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: no JS motion; static cards, CSS hover/focus transitions only (arrow translate, border color).
- **Layout DNA**: `OffsetGrid` (staggered card grid, 2 or 3 columns depending on list length).

### ProcessSteps
- **What**: Numbered process spine â€” giant display-face numerals held against one continuous hairline rule, alternating md: content indent for editorial stagger.
- **Props**: `heading: string` / `steps: {title, description, meta?}[]` (required) â€” `id?` / `rail?` / `intro?` / `className?` (optional)
- **Fits**: leadgen, saas, commerce
- **Reduced motion**: GSAP scroll-entrance stagger is skipped; steps render fully visible with no y/opacity offset.
- **Layout DNA**: no primitive beyond SectionShell â€” written reason: a fixed-width CSS-grid numeral column + one absolutely-positioned spine keeps every numeral right-aligned against the same hairline across rows; OffsetGrid's per-item offsets don't guarantee that shared alignment.

### ReviewsWall
- **What**: One review promoted to an oversized italic pull-quote, the rest in a card wall with inline-SVG star ratings.
- **Props**: `heading: string` / `reviews: {quote, author, source, rating, date?}[]` (required) â€” `id?` / `rail?` / `intro?` / `demoNotice?` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: GSAP scroll-entrance stagger is skipped; lead quote and cards render fully visible.
- **Layout DNA**: `OffsetGrid` for the review-card wall; lead review (`reviews[0]`) rendered as a standalone `font-heading italic` pull-quote above it. `demoNotice` surfaces fixture/demo labelling in the UI itself.

### QuoteForm
- **What**: Lead-capture form â€” name/phone/email/service/message with client-side validation, honeypot, POSTs JSON to `/api/quote`, swaps to a confirmation panel on success.
- **Props**: `heading: string` / `services: string[]` (required) â€” `id? = "quote"` / `rail?` / `intro?` / `phone?` / `address?` / `trustPoints?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: no GSAP; the shared CSS-transition token (`ease`) falls back to `transition-none` when reduced, gating the success-panel "send another" hover and the submit button's lift. Field validation/errors and the drag-free form fields carry no motion to reduce.
- **Layout DNA**: `EditorialSplit` (ratio `58/42`, `flip` â€” the form is the primary action so it takes the primitive's larger `media` slot at 58%, the trust/contact panel takes `children` at 42% and stays left); `ui/input`, `ui/textarea`, `ui/select`, `ui/label`.
- **Note**: pairs with `POST /api/quote` at `src/app/api/quote/route.ts` â€” validates the same required fields server-side, honors the `website` honeypot, and sends via the Resend REST API when `RESEND_API_KEY` is set (otherwise logs and returns `delivered: false`).

### BeforeAfterGallery
- **What**: Accessible before/after comparison slider â€” a full-frame range input drives the "after" layer's clip-path directly (no easing); primary item large, remaining items in a smaller grid.
- **Props**: `heading: string` / `items: {before: {src, alt}, after: {src, alt}, label?}[]` (required) â€” `id?` / `rail?` / `intro?` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: no scroll-entrance (matches the PricingTable precedent â€” a functional block renders complete rather than animating in). The handle's hover-scale affordance is gated on `useReducedMotion` + `usePointerFine`; the drag-driven clip-path and handle position are always direct-set 1:1 regardless of the setting, since that's user-driven manipulation, not an autoplaying animation.
- **Layout DNA**: `OffsetGrid` for the secondary items list. The slider frame itself uses no primitive â€” written reason: it needs two precisely layered `<img>` elements under a live clip-path, which a generic media primitive doesn't expose.

### ServiceAreaList
- **What**: Programmatic-SEO city directory â€” a CSS multi-column list of mono-typography links with hairline rules per row.
- **Props**: `heading: string` / `areas: {city, href, count?}[]` (required) â€” `id?` / `rail?` / `intro?` / `countLabel?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: no JS motion; CSS color transition on link hover only.
- **Layout DNA**: `CaptionRail` (area count, e.g. "10 service areas") + native CSS `columns` list â€” written reason: a dense directory of city links reads as a reference index in flowing magazine columns; OffsetGrid's staggered vertical offsets are built for cards, not single-line text rows.

### TrustBadges
- **What**: Horizontal band of credential pills; inline-SVG shield/check/star icons cycle as defaults when the caller doesn't supply one.
- **Props**: `badges: {label, sublabel?, icon?}[]` (required) â€” `id?` / `rail?` / `heading?` / `tone? = "default"` / `className?` (optional)
- **Fits**: leadgen, saas, commerce, app
- **Reduced motion**: no JS motion; static pills, no transitions.
- **Layout DNA**: no primitive beyond SectionShell â€” written reason: a wrapping inline pill list is its own layout move; none of EditorialSplit/OffsetGrid/CaptionRail fit a horizontal credential band's shape. `tone="card"` optionally wraps the band in a bordered surface for use as a standalone strip.


## Sections — commerce (src/components/sections/commerce)

### ProductHero
- **What**: Product-drop hero â€” an oversized product shot overlapping a price/headline block on an OverlapField grid.
- **Props**: `headline: { primary: string; overlay?: string; secondary?: string }` (required) / `price: { amount: string; symbol?: string; currency?: string; compareAt?: string }` (required) / `primaryCta: { label: string; href: string }` (required) / `media: ReactNode` (required) / `id?: string` / `rail?: { label: string; meta?: string }` / `badge?: string` / `eyebrow?: string` / `description?: string` / `availability?: string` / `secondaryCta?: { label: string; href: string }` / `className? = ""`
- **Fits**: commerce, editorial
- **Reduced motion**: ProductHero itself ships no component-level JS animation. It composes `LayeredHeadline` (mask-reveal) and `OverlapField` (scroll drift), both of which already settle to a fully visible, non-drifting state under `prefers-reduced-motion` internally â€” nothing extra to gate here.
- **Layout DNA**: `SectionShell` + `OverlapField`/`OverlapItem` (headline+price col `1 / 7` z-2 over product media col `5 / 13` z-1) + `LayeredHeadline` (size="hero", overlay word).

### StickyBuyBar
- **What**: Bottom-fixed buy bar that appears past a scroll threshold, showing product thumb, name, price, and CTA with a dismiss control.
- **Props**: `product: { name: string; price: string }` (required) / `thumb: ReactNode` (required) / `cta: { label: string; href: string }` (required) / `threshold?: number = 600` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: The rAF-throttled scroll trigger and show/hide logic are identical regardless of motion preference â€” only the reveal transition changes: a `translate-y` slide under normal motion, an instant opacity swap under reduced motion. The bar's CTA and dismiss button also get `tabIndex={-1}` while hidden so they can't trap keyboard focus off-screen.
- **Layout DNA**: No `SectionShell` â€” written reason: this is viewport-pinned chrome, not document-flow content, so the container/rail/vertical-rhythm model doesn't apply. Direct flex row + token radius/spacing/hairline only, plus `env(safe-area-inset-bottom)` padding for iOS home-indicator clearance.

### SpecsTable
- **What**: Definition-list spec sheet â€” mono label/value hairline rows with an optional download-link row.
- **Props**: `specs: { label: string; value: string; detail?: string }[]` (required) / `id?: string = "specs"` / `rail?: { label: string; meta?: string }` / `heading?: string` / `intro?: string` / `download?: { label: string; href: string }` / `className? = ""`
- **Fits**: commerce, editorial
- **Reduced motion**: N/A â€” fully static server component, no motion to reduce.
- **Layout DNA**: `SectionShell` + `CaptionRail` (spec-count meta line above the list) + a semantic `<dl>` of `divide-y` hairline rows (`dt` mono overline label, `dd` mono `tabular-nums` value right-aligned).

### ProductGallery
- **What**: Main image with a thumbnail rail (left of the image on desktop, a horizontal strip below it on mobile); frames crossfade on click or arrow-key navigation, with optional cursor-gated zoom.
- **Props**: `images: { src: string; alt: string }[]` (required) / `zoom?: boolean = true` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: Crossfade duration collapses to an instant swap (`transition-none`) under reduced motion. Hover-zoom is gated on `usePointerFine` (fine pointer only) AND additionally disabled entirely under reduced motion, so no scale transform ever fires for motion-sensitive users.
- **Layout DNA**: No `SectionShell` â€” written reason: this is a self-contained media widget meant to sit inside a page's own section/`EditorialSplit`, not a section in its own right. Flex layout only (`md:flex-row-reverse` puts the thumb rail on the left at desktop, stacked below on mobile); zoom gated on `usePointerFine`.

### DropCountdown
- **What**: Digit countdown (days/hrs/min/sec) to an ISO `target`, swapping to a `live` slot once it reaches zero.
- **Props**: `target: string` (required, ISO date-time) / `id?: string = "countdown"` / `rail?: { label: string; meta?: string }` / `live?: ReactNode` / `label?: string = "Drop ends in"` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: N/A to the ticking itself (a `setInterval` text update, not a transform/opacity animation). The relevant guard is SSR-safety: server render and the first client paint both show an identical zeroed placeholder (`mounted === false`), so the real clock-derived digits â€” and the decision to swap to the `live` slot â€” only resolve after mount, avoiding any hydration mismatch.
- **Layout DNA**: `SectionShell` + `CaptionRail` (countdown label). Digits container uses `role="timer"` without `aria-live` so screen readers aren't spammed every second.

### BundleCards
- **What**: 2â€“3 bundle cards on an uneven grid with a raised, primary-bordered featured card; struck-through compare price and a savings pill.
- **Props**: `heading: string` (required) / `bundles: { name: string; items: string[]; price: string; tagline?: string; compareAt?: string; savingsLabel?: string; cta: { label: string; href: string }; featured?: boolean }[]` (required) / `id?: string = "bundles"` / `rail?: { label: string; meta?: string }` / `intro?: string` / `currency?: string = "$"` / `footnote?: string` / `className? = ""`
- **Fits**: commerce, saas (bundle/plan-style offers generally)
- **Reduced motion**: No entrance or ambient motion. The only movement is a hover lift on CTAs (`hover:-translate-y-0.5`) â€” a user-initiated micro-interaction, which CONVENTIONS.md's mandatory reduced-motion table does not require gating (unlike entrance/ambient/scroll-scrub/cursor-reactive motion).
- **Layout DNA**: `SectionShell` + `CaptionRail` (featured-card badge) + the `PricingTable` emphasis pattern (uneven `grid-template-columns` keyed to the featured card's index).


## Sections — shared (src/components/sections/shared)

## shared

Fit constraint for this pack: every entry must work, unstyled-per-archetype,
across cinematic / saas / app / leadgen / commerce / editorial. Nothing here
reads as archetype-specific â€” tokens only.

### MegaFooter
- **What**: Statement footer â€” full-bleed font-display wordmark, an asymmetric EditorialSplit pairing newsletter capture against link columns, and a CaptionRail bottom bar for copyright/credit/socials.
- **Props**: `brandName: string` (required) / `columns: MegaFooterColumn[]` (required) / `wordmarkOutline?: boolean = false` / `newsletter?: MegaFooterNewsletterConfig` / `copyright?: string` (defaults to `Â© {year} {brandName}. All rights reserved.`) / `builtWith?: string` / `socials?: MegaFooterSocial[]` / `tone?: "default" | "inverted" = "inverted"` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No JS-driven motion â€” server component, nothing scroll- or entrance-animated. Hover states (link color, newsletter button lift) are plain token-eased CSS transitions, not gated behind `useReducedMotion`.
- **Layout DNA**: `SectionShell` (tone) + `EditorialSplit` (`62/38`, flipped â€” newsletter narrow-left, link columns wide-right; falls back to a plain responsive grid when `newsletter` is omitted) + `CaptionRail` (bottom bar). The giant outline-capable wordmark is the deliberate typographic statement. Catalog note: **replaces `layout/Footer` when a page composes its own section stack.**

### MegaFooterNewsletterForm
- **What**: The client-only newsletter capture form `MegaFooter` composes into its `EditorialSplit` content slot â€” split into its own file because `"use client"` is a module-level directive and can't be scoped to one function inside the otherwise-server `MegaFooter.tsx`. Not intended to be dropped into a page on its own.
- **Props**: `heading?: string = "Stay in the loop"` / `description?: string` / `placeholder?: string = "you@email.com"` / `buttonLabel?: string = "Subscribe"` / `onSubmit?: (email: string) => void` / `tone?: "default" | "inverted" = "default"` (matches the parent's tone) / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial (inherits `MegaFooter`'s fit â€” it only ever renders inside that component's newsletter slot)
- **Reduced motion**: No JS motion; the post-submit confirmation line is a plain CSS opacity fade.
- **Layout DNA**: No primitives â€” a labeled input + button pair, hand-styled with explicit tone-aware color branches rather than `ui/Input` (`ui/Input`'s fixed theme tokens don't adapt to a locally-`inverted` section the way this needs to).

### AnnouncementBar
- **What**: Dismissible â‰¤40px top utility bar with localStorage-persisted dismissal and three tone variants.
- **Props**: `message: ReactNode` (required) / `href?: string` / `dismissible?: boolean = true` / `storageKey?: string = "announcement-bar"` / `tone?: "default" | "inverted" | "primary" = "default"` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No motion to gate â€” mount/dismiss is a hard show/hide (renders nothing until mounted-and-not-dismissed to keep SSR and client markup in agreement), not an animated transition. `useReducedMotion` is intentionally not imported.
- **Layout DNA**: Deliberately bypasses `SectionShell` â€” a persistent utility bar sits outside normal section vertical rhythm (`--section-gap` would blow the height budget). Borrows `CaptionRail`'s mono/overline type language without its hairline rule. The 24px dismiss control is a documented, spec-driven exception to the library's usual `min-h-11` (WCAG 2.5.8 AA's 24px minimum, chosen because a 44px control cannot fit inside a â‰¤40px bar).

### StatBand
- **What**: Full-width animated stat strip â€” `OdometerCounter` figures in the display face over mono `CaptionRail` labels, hairline-divided columns.
- **Props**: `stats: StatBandStat[]` (required, each `{ value: number; prefix?: string; suffix?: string; label: string }`) / `rail?: { label: string; meta?: string }` / `tone?: "default" | "card" | "inverted" = "default"` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: Delegates entirely to `OdometerCounter`'s own `useReducedMotion` handling â€” final values render immediately with no digit-roll when reduced motion is on; StatBand adds no motion of its own.
- **Layout DNA**: `SectionShell` (tone) + `CaptionRail` (`rule="none"`, one per stat, for the mono label) + hairline `divide-x` verticals (`color-mix` hairline, tone-aware). Composes the cinematic `OdometerCounter` module for the animated figures rather than reimplementing counting â€” number gets `font-display` via ancestor inheritance since OdometerCounter sets no font-family of its own.

### ContactSplit
- **What**: Asymmetric contact section â€” heading, contact rows, optional hours and socials beside a validated message form with an `onSubmit` prop or a `mailto:` fallback.
- **Props**: `heading: string` (required) / `info: ContactSplitInfo` (required, `{ email?, phone?, address? }`) / `hours?: ContactSplitHour[]` (`{ label, value }`) / `socials?: ContactSplitSocial[]` (`{ platform, href }`) / `onSubmit?: (data: { name, email, message }) => void` (omit for the `mailto:` fallback, addressed to `info.email`) / `rail?: { label: string; meta?: string }` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No JS-driven motion. The post-submit confirmation line is a plain CSS opacity fade (non-vestibular), not gated behind `useReducedMotion`.
- **Layout DNA**: `SectionShell` + `EditorialSplit` + per-row `CaptionRail` (mono label + hairline for each contact/hours/socials block). The spec called for a 42/58 split; `EditorialSplit`'s ratio enum only ships `62/38` / `58/42` / `70/30`, so `ratio="58/42"` with `flip` is used â€” flip swaps both the render order and the fr split together, landing the content slot (info) at 42% on the left and the media slot (form) at 58% on the right. Form fields use `ui/input`, `ui/textarea`, `ui/label` with `aria-invalid` + `aria-describedby` wired to inline error text.

