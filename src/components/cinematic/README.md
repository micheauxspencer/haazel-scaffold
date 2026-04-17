# Cinematic Components Library

34 production-grade GSAP animation components for Next.js. Each is a `"use client"` component with dynamic GSAP imports, proper cleanup via `gsap.context()`, and TypeScript props.

All components follow these conventions:
- `"use client"` directive (browser-only)
- Dynamic import: `const gsap = (await import("gsap")).default`
- Cleanup: `gsap.context()` reverted in `useEffect` return
- Standard easing: `cubic-bezier(.16, 1, .3, 1)` for interactive transitions
- TypeScript props interface
- `className` prop on every component for composition
- SSR safe (all browser APIs in `useEffect`)

---

## Scroll-Driven (10)

### CanvasHero
Scroll-driven JPEG frame sequence drawn on `<canvas>`. Section uses 300vh with sticky canvas; scroll position scrubs through frames via GSAP ScrollTrigger. Falls back to `staticImage` mode when no frames provided.
```tsx
<CanvasHero frameCount={121} framePath="/assets/frames/frame-" staticImage="/hero.jpg">
  <h1>Hero content overlay</h1>
</CanvasHero>
```
Props: `frameCount`, `framePath`, `staticImage`, `children`, `className`

### TextMaskReveal
Giant outlined text fills with color on scroll via `clipPath: inset()` animation.
```tsx
<TextMaskReveal text="BRAND" fillColor="#D72626" />
```
Props: `text`, `fillColor`, `className`

### CurtainReveal
Two sticky panels part like curtains as user scrolls, revealing content behind. 300vh section with `xPercent: ±100` GSAP scrub.
```tsx
<CurtainReveal leftText="よい" rightText="時間を">
  <div>Revealed CTA content</div>
</CurtainReveal>
```
Props: `leftText`, `rightText`, `children`

### HorizontalScroll
Vertical scroll hijacked into horizontal pan. Section height = cards × 100vh. Progress bar at bottom.
```tsx
<HorizontalScroll>
  <div>Panel 1</div>
  <div>Panel 2</div>
</HorizontalScroll>
```
Props: `children`, `className`

### ColorShiftSection
Background + text color shifts when section enters viewport. 0.8s CSS transition at `top 60%`.
```tsx
<ColorShiftSection panels={[
  { bg: "#060416", text: "#FAF5EF", children: <div>Story 1</div> },
  { bg: "#FAF5EF", text: "#060416", children: <div>Story 2</div> },
]} />
```
Props: `panels` (array of `{ bg, text, children }`)

### StickyStack
Pinned visual on left + scrolling content cards on right. Visual swaps opacity as each card enters viewport. Height = items × 100vh.
```tsx
<StickyStack items={[
  { visual: <img />, title: "Step 1", description: "..." },
]} />
```
Props: `items`

### StickyCards
Stacking cards effect where each card pins and the next slides over it. Good for step-by-step processes.
```tsx
<StickyCards cards={[
  { title: "Step 1", description: "...", color: "#D72626" },
]} />
```
Props: `cards` (array of `{ title, description, color }`)

### SplitScreen
Two-column scroll where left stays static, right scrolls independently (or vice versa).
```tsx
<SplitScreen leftContent={<img />} rightContent={<article />} />
```
Props: `leftContent`, `rightContent`, `reverse`

### ZoomParallax
3 depth layers zoom at different speeds on scroll. Background (scale 1→1.15), mid (scale 1→1.6, y -100), foreground (scale 1→6, opacity→0). Product card fades in at 40-60%, fades out at 75-90%.
```tsx
<ZoomParallax bgImage="/bg.jpg" midImage="/mid.jpg" fgImage="/fg.jpg">
  <ProductCard />
</ZoomParallax>
```
Props: `bgImage`, `midImage`, `fgImage`, `children`

### SVGDraw
SVG paths draw themselves on scroll using `stroke-dasharray` + `stroke-dashoffset` GSAP animation. Good for logo reveals and architectural line art.
```tsx
<SVGDraw viewBox="0 0 100 100" paths={["M10 10 L90 90"]} strokeColor="#D72626" />
```
Props: `viewBox`, `paths`, `strokeColor`, `strokeWidth`

---

## Cursor & Hover (9)

### CursorGlow
Fixed-position radial gradient that follows the cursor with eased trailing (0.12 factor). Uses `requestAnimationFrame` for 60fps tracking. Desktop only (touch detection).
```tsx
<CursorGlow color="rgba(215, 38, 38, 0.12)" size={500} />
```
Props: `color`, `size`, `className`

### TiltCard
3D perspective tilt card. On mousemove: `perspective(600px) rotateY(x*12deg) rotateX(-y*12deg) scale(1.02)`. Includes cursor-tracking spotlight gradient overlay.
```tsx
<TiltCard className="p-8 bg-card rounded-xl">
  <h3>Tilts toward cursor</h3>
</TiltCard>
```
Props: `children`, `className`, `maxRotation`

### SpotlightBorderCards
Grid of cards where each card has a cursor-tracking border glow. Parent grid tracks mousemove, sets `--mx`/`--my` CSS variables per card. `::before` pseudo-element with `radial-gradient(circle 180px at var(--mx) var(--my), ...)`.
```tsx
<SpotlightBorderCards accentColor="215, 38, 38" items={[
  { icon: <svg>...</svg>, title: "Feature", description: "..." },
]} />
```
Props: `items`, `accentColor` (R,G,B string), `columns`, `className`

### AccordionSlider
Expandable image panels. `flex: 1` baseline → `flex: 5` on hover/click. Background zooms on expand. Content (number, title, description) fades in with staggered 0.1s / 0.15s / 0.2s delays.
```tsx
<AccordionSlider variant="horizontal" panels={[
  { image: "/photo.jpg", title: "Panel", description: "..." },
]} />
```
Props: `panels`, `variant` ("horizontal" | "vertical")

### FlipCards
3D flip card on hover. `rotateY 180deg` via CSS, backface-visibility hidden. No GSAP needed.
```tsx
<FlipCards cards={[
  { front: <div>Front</div>, back: <div>Back</div> },
]} />
```
Props: `cards`

### CursorReveal
Before/after image comparison with 4 modes: horizontal drag, vertical drag, circular spotlight (scrollable radius), and hover grid.
```tsx
<CursorReveal before="/before.jpg" after="/after.jpg" mode="horizontal" />
```
Props: `before`, `after`, `mode` ("horizontal" | "vertical" | "spotlight" | "grid")

### ImageTrail
Cursor leaves a rotating, fading trail of colored elements. Spawns at 60px distance threshold. Pool of 20 reusable elements.
```tsx
<ImageTrail colors={["#D72626", "#EED8C3"]} />
```
Props: `colors`, `poolSize`, `threshold`

### MagneticGrid
Dot grid that reacts to cursor proximity. Each dot scales up as cursor approaches.
```tsx
<MagneticGrid rows={12} cols={20} dotColor="#D72626" />
```
Props: `rows`, `cols`, `dotColor`, `hoverRadius`

### DragPanGrid
Click-and-drag to pan an infinite canvas of scattered cards. Good for mood boards and portfolio exploration.
```tsx
<DragPanGrid items={[
  { x: -200, y: -100, w: 300, h: 200, title: "...", desc: "...", bg: "..." },
]} />
```
Props: `items`

---

## Click & Tap (6)

### CoverflowCarousel
3D perspective carousel. Center item at full scale, flanking items at 0.8 scale with `rotateY ±40°`. Z-index decreases per distance, opacity fades.
```tsx
<CoverflowCarousel items={[
  { bg: "...", title: "Album 1", description: "..." },
]} />
```
Props: `items`, `className`

### ParticleButton
Button that emits canvas-drawn particles on click. Particles have physics (velocity, gravity, fade).
```tsx
<ParticleButton onClick={...} particleColor="#D72626">
  Click me
</ParticleButton>
```
Props: `children`, `onClick`, `particleColor`, `className`

### DynamicIsland
macOS Dynamic Island-style expanding pill at top of screen. Compact (44px) → expanded (320px, 20px radius). 0.5s cubic-bezier transition.
```tsx
<DynamicIsland label="3 notifications" dotColor="#D72626">
  <div>Expanded content</div>
</DynamicIsland>
```
Props: `label`, `dotColor`, `children`

### DockNav
macOS-style dock with distance-based magnification. Items scale from 48px to 72px within 120px cursor range.
```tsx
<DockNav items={[
  { icon: <svg>...</svg>, label: "Home", href: "/" },
]} />
```
Props: `items`

### ViewTransitionMorph
Card-to-detail morphing transition using View Transitions API with fallback. Click a thumbnail, it expands into full view.
```tsx
<ViewTransitionMorph thumbnails={[
  { id: "a", thumb: "/thumb.jpg", full: <article>...</article> },
]} />
```
Props: `thumbnails`

### OdometerCounter
Mechanical rolling digit counter. Each digit is a 0-9 vertical strip that translates to the target. Staggered 0.12s transition delays per digit. Triggers on scroll via ScrollTrigger `once: true`.
```tsx
<OdometerCounter value={2023} suffix="" label="Year" className="text-6xl" />
```
Props: `value`, `prefix`, `suffix`, `label`, `decimals`, `className`

---

## Ambient & Auto (9)

### KineticMarquee
Infinite scrolling text strip that reacts to scroll velocity. Uses `ScrollTrigger.getVelocity()` to accelerate marquee on fast scrolling. Triple-cloned content for seamless loop.
```tsx
<KineticMarquee items={["FOO", "BAR", "日本語"]} baseSpeed={1.5} direction="left" />
```
Props: `items`, `baseSpeed`, `direction` ("left" | "right"), `separator`, `className`

### CircularText
SVG text rotates along a circular path. Continuous animation + optional scroll-velocity reactivity.
```tsx
<CircularText text="SCROLL • CINEMATIC • STUDIO • 2024 •" radius={120} speed={20} />
```
Props: `text`, `radius`, `speed` (seconds per rotation), `scrollReactive`

### GlitchEffect
RGB channel split on hover. Top half cyan, bottom half red, with `steps()` keyframe animation creating digital glitch aesthetic.
```tsx
<GlitchEffect text="ERROR 404" />
```
Props: `text`, `as` (tag), `className`

### GradientStrokeText
Large outlined text with animated gradient fill. Uses `-webkit-text-stroke` and animated `background-clip: text` with `background-size: 300%`.
```tsx
<GradientStrokeText text="RESERVE" colors={["#c8a97e", "#e85d3a", "#5eadb5"]} />
```
Props: `text`, `colors`, `as`, `className`

### MeshGradient
Animated gradient blobs that drift smoothly. Creates ambient atmospheric background.
```tsx
<MeshGradient blobs={[
  { color: "#D72626", x: 20, y: 30, size: 400 },
]} />
```
Props: `blobs`, `className`

### TextScramble
Text that decodes character-by-character like Matrix. Cycles random chars, resolves left-to-right with staggered timing.
```tsx
<TextScramble text="ACCESS GRANTED" duration={1.5} />
```
Props: `text`, `duration`, `onComplete`, `className`

### Typewriter
Sequential text reveal with blinking cursor. Optional typing sound.
```tsx
<Typewriter text="Welcome to the future." speed={80} />
```
Props: `text`, `speed` (ms per char), `cursor`, `className`

### VideoBackground
Fullscreen autoplay looping video as section background. Optional overlay and content layer.
```tsx
<VideoBackground src="/bg.mp4" overlay="rgba(0,0,0,0.5)">
  <h1>Hero over video</h1>
</VideoBackground>
```
Props: `src`, `poster`, `overlay`, `children`, `className`

### NoiseOverlay
Fixed full-page SVG film grain overlay using `feTurbulence` filter. 2-4% opacity typical.
```tsx
<NoiseOverlay opacity={0.035} />
```
Props: `opacity`, `blendMode`

---

## Component Conventions

```tsx
"use client";

import { useEffect, useRef } from "react";

interface MyModuleProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
}

export default function MyModule({
  children,
  className = "",
  speed = 1,
}: MyModuleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let ctx: { revert: () => void } | null = null;

    async function init() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Animation logic
      }, ref);
    }

    init();
    return () => ctx?.revert();
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}
```

## Key Constants (from source library)

- **Standard easing**: `cubic-bezier(.16, 1, .3, 1)` — all interactive transitions
- **Cursor glow**: 500px size, 0.12 easing factor
- **Tilt card**: perspective 600px, ±12° rotation, 1.02 scale
- **Magnetic button**: 0.3 pull multiplier
- **Accordion flex**: 1 → 5 ratio, 0.6s transition
- **Stagger delays**: 0.1s, 0.15s, 0.2s for content reveals
- **Curtain scrub**: 0.5, ends at 60% scroll
- **Horizontal scroll**: scrub 0.5, section height = cards × 100vh
- **Image trail**: 60px spawn threshold, pool of 20
- **Dock magnification**: 48px → 72px within 120px range
- **Flip card**: perspective 800px, 0.6s rotateY 180°
- **Glitch**: steps(2) top, steps(3) bottom, ±3px translate
- **Color shift**: trigger at top 60%, 0.8s CSS transition

## How to Add a New Component

### From an HTML source
1. Read the source HTML, extract effect-specific CSS and animation JS
2. Ask Claude: "Port this HTML module to a React cinematic component"
3. Claude creates the component following conventions above
4. Uses GSAP Master MCP (`optimize_for_performance`) for 60fps optimization
5. Adds entry to this README

### From scratch
1. Describe the effect to GSAP Master MCP via `understand_and_create_animation`
2. Get production pattern via `create_production_pattern`
3. Optimize via `optimize_for_performance` for mobile fallback
4. Wrap in React component following conventions
5. Document here
