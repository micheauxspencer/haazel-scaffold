# Cinematic Components Library

## Current Modules

Each component is ported from a battle-tested HTML source in the Cinematic Modules library.

| Component | Source | Category | Effect |
|-----------|--------|----------|--------|
| AccordionSlider | accordion-slider.html | Cursor/Hover | Flex panels expand on hover, staggered content reveal |
| CircularText | circular-text.html | Ambient | SVG text rotates on path, scroll-velocity reactive |
| ColorShiftSection | color-shift.html | Scroll-Driven | Background/text color transitions between sections |
| Coverflow | coverflow.html | Click/Tap | 3D perspective carousel with rotateY ±40° |
| CursorGlow | cursor-reactive.html | Cursor/Hover | Fixed radial gradient follows cursor with 0.12 easing |
| TiltCard | cursor-reactive.html | Cursor/Hover | 3D perspective tilt ±12° with spotlight gradient |
| MagneticButton | cursor-reactive.html | Cursor/Hover | Button pulls toward cursor at 0.3 multiplier |
| ClickRipples | cursor-reactive.html | Click/Tap | Canvas-drawn expanding circle ripples on click |
| CursorReveal | cursor-reveal.html | Cursor/Hover | Before/after with clip-path wipe, spotlight, or grid |
| CurtainReveal | curtain-reveal.html | Scroll-Driven | Two panels part like curtains via ScrollTrigger scrub |
| DockNav | dock-nav.html | Cursor/Hover | macOS dock with distance-based magnification |
| DragPan | drag-pan.html | Click/Tap | Click-drag to pan infinite card canvas |
| DynamicIsland | dynamic-island.html | Click/Tap | Expanding pill notification bar |
| FlipCards | flip-cards.html | Cursor/Hover | 3D rotateY 180° on hover, backface-hidden |
| GlitchEffect | glitch-effect.html | Ambient | RGB channel split + scanlines on hover |
| GradientStrokeText | gradient-stroke.html | Ambient | Animated gradient on outlined text |
| HorizontalScroll | horizontal-scroll.html | Scroll-Driven | Vertical scroll → horizontal pan via ScrollTrigger |
| ImageTrail | image-trail.html | Cursor/Hover | Cursor leaves rotating, fading trail of elements |
| CanvasHero | (custom) | Scroll-Driven | Frame sequence canvas with scroll scrub |
| TextMaskReveal | (custom) | Scroll-Driven | Outlined text fills via clipPath on scroll |
| KineticMarquee | (custom) | Ambient | Scroll-velocity-reactive infinite text strip |
| SpotlightBorderCards | (custom) | Cursor/Hover | Grid with cursor-tracking border glow |
| OdometerCounter | (custom) | Scroll-Driven | Mechanical rolling digit counter |
| StickyStack | (custom) | Scroll-Driven | Pinned visual + scrolling content cards |
| NoiseOverlay | (custom) | Ambient | SVG turbulence film grain |

## How to Add a New Module

### From an HTML source file

1. Drop the HTML file into the reference library:
   `C:\Users\miche\Downloads\cinematic-sites-kit\cinematic-sites-agent-kit-master\cinematic-site-components\`

2. Ask Claude: "Port {module-name}.html to a React cinematic component"

3. The process:
   - Read the HTML source file
   - Extract core CSS (effect-specific, not boilerplate)
   - Extract core JavaScript (animation logic)
   - Note key constants (easing, timing, multipliers)
   - Create a React component in `src/components/cinematic/`
   - Use GSAP Master MCP `optimize_for_performance` on the animation code
   - Add to this README

### From scratch (new effect idea)

1. Describe the effect to GSAP Master MCP:
   `understand_and_create_animation` → "parallax depth layers with 3 speeds"

2. Get production pattern:
   `create_production_pattern` → "hero scroll sequence"

3. Optimize:
   `optimize_for_performance` → 60fps + mobile variant

4. Wrap in a React component following these conventions:
   - "use client" directive
   - Dynamic GSAP import: `const gsap = (await import("gsap")).default`
   - `gsap.context()` for cleanup in useEffect return
   - Accept `className` prop
   - TypeScript interface for all props
   - One easing: `cubic-bezier(.16, 1, .3, 1)` for interactive transitions
   - useRef for DOM elements and continuous values (not useState)
   - SSR guard: wrap browser APIs in useEffect

### From a website you like

1. Screenshot the effect or describe it
2. Use `haazel-brand-analyzer` to extract the implementation
3. Port using the "from scratch" process above

## Component Conventions

```tsx
"use client";

import { useEffect, useRef } from "react";

interface MyModuleProps {
  // Required props
  children?: React.ReactNode;
  // Optional styling
  className?: string;
  // Effect-specific config with sensible defaults
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

    let ctx: ReturnType<typeof import("gsap")["default"]["context"]>;

    async function init() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Animation logic here
      }, ref);
    }

    init();
    return () => { ctx?.revert(); };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

## Key Constants (from source library)

- **Standard easing:** `cubic-bezier(.16, 1, .3, 1)` — all interactive transitions
- **Cursor glow size:** 500px, easing factor 0.12
- **Tilt card:** perspective 600px, ±12° rotation, 1.02 scale
- **Magnetic button:** 0.3 pull multiplier
- **Accordion flex:** 1 → 5 ratio, 0.6s transition
- **Stagger delays:** 0.1s, 0.15s, 0.2s (content reveal)
- **Curtain scrub:** 0.5, end at 60% scroll
- **Horizontal scroll scrub:** 0.5, section height = cards × 100vh
- **Image trail:** 60px spawn threshold, pool of 20
- **Dock magnification:** 48px base, 72px max, 120px range
- **Flip card:** perspective 800px, 0.6s rotateY 180°
- **Glitch:** steps(2) top, steps(3) bottom, ±3px translate
- **Color shift trigger:** top 60%, 0.8s CSS transition
