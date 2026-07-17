# Click/Tap Modules

### CoverflowCarousel
- **What**: 3D coverflow-style carousel where cards fan out in perspective around a centered active item.
- **Props**:
  - `items: CoverflowItem[]` (required) — `{ title: string; description: string; background: string }[]`
  - `className?: string = ""`
- **Fits**: cinematic, commerce, editorial, saas
- **Reduced motion**: Card `transform`/`opacity`/`filter` and the prev/next arrow styling switch to `transition: "none"`. Clicking a card or an arrow still updates `current` and re-renders the coverflow layout (position/scale/rotation math unchanged) — it just snaps instead of tweening over 0.6s.

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
  - `notifications?: IslandNotification[] = []` — `{ color: string; text: string }[]`
  - `className?: string = ""`
- **Fits**: app, saas, cinematic
- **Reduced motion**: Click still toggles `expanded` and the pill still resizes and reveals notifications; the shape/size `transition` becomes `"none"`. Both the dot's looping `islandBreathe` animation and the one-off `islandPulse` (fired on status change) are disabled (`animation: undefined`), so the dot renders static instead of breathing/pulsing.

### DockNav
- **What**: A fixed bottom dock of nav icons/links that magnify near the cursor, macOS-dock style.
- **Props**:
  - `items: DockItem[]` (required) — `{ icon: ReactNode; label: string; color: string; href?: string; onClick?: () => void }[]`
  - `baseSize?: number = 48`
  - `maxSize?: number = 72`
  - `range?: number = 120`
  - `className?: string = ""`
- **Fits**: app, saas
- **Reduced motion**: Magnification requires both a fine pointer and motion allowed (`canMagnify = pointerFine && !reduced`). When either is false, `onMouseMove`/`onMouseLeave` are never attached and every icon renders at `baseSize` (uniform, static) via a derived `displaySizes` array — click/tap navigation via `href`/`onClick` is unaffected either way.

### ViewTransitionMorph
- **What**: A single button that click-cycles through a list of "states" (dot indicators also jump directly to one), morphing size, corner radius, background and content between them.
- **Props**:
  - `states: MorphState[]` (required) — `{ id: string; label: string; content: ReactNode; background?: string; width?: string; height?: string; borderRadius?: string }[]`
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
