### KineticMarquee
- **What**: Auto-scrolling horizontal ticker of text items whose speed reacts to scroll velocity.
- **Props**: `items: string[]` (required) · `baseSpeed?: number = 1` · `direction?: "left" | "right" = "left"` · `separator?: string = " — "` · `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: renders a single static, non-scrolling row (`items.join(separator)`, no trailing separator); the rAF translate loop and the ScrollTrigger velocity listener never start. Band background/border/text now use `color-mix(in oklab, var(--primary) …%, transparent)` / `var(--primary-foreground)` tokens in place of the former hardcoded black/white rgba literals.

### CircularText
- **What**: Text set along a circular SVG path — spins continuously by default, or rotates from scroll velocity when `scrollReactive`.
- **Props**: `text: string` (required) · `centerContent?: React.ReactNode` · `size?: number = 320` · `fontSize?: number = 14` · `color?: string = "currentColor"` · `speed?: number = 20` · `scrollReactive?: boolean = false` · `reverse?: boolean = false` · `className?: string`
- **Fits**: cinematic, editorial, leadgen
- **Reduced motion**: no CSS `circularSpin` keyframe and no scroll-driven rotation regardless of `scrollReactive`; the SVG sits static at its authored angle (`willChange` also dropped). `color` default left as `currentColor` (judgment call — see summary).

### GlitchEffect
- **What**: Hover-triggered RGB-split glitch distortion on text via layered `::before`/`::after` pseudo-elements.
- **Props**: `text: string` (required) · `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" = "div"` · `accentColor?: string = "var(--destructive)"` · `cyanColor?: string = "var(--accent)"` · `className?: string`
- **Fits**: cinematic, editorial
- **Reduced motion**: the pseudo-elements, hover-trigger rules, and both keyframe blocks are omitted from the injected `<style>` entirely (not just hover-gated) — only the base single-layer text rule ships, so hovering can never trigger a glitch. Text color now `color-mix(in oklab, var(--foreground) 95%, transparent)`.

### GradientStrokeText
- **What**: Large display text with a continuously shifting multi-stop gradient, as either a stroke outline or a filled clip.
- **Props**: `text: string` (required) · `variant?: "stroke" | "filled" = "stroke"` · `colors?: string[] = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)"]` · `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" = "h2"` · `strokeWidth?: number = 2` · `speed?: number = 6` · `className?: string`
- **Fits**: cinematic, editorial, leadgen
- **Reduced motion**: `background-position` animation removed; `backgroundPosition` is explicitly pinned to each variant's keyframe-0% value (`"0% 50%"`) so the gradient renders statically at its first frame instead of drifting to the browser's default position.

### MeshGradient
- **What**: Soft blurred color-blob backdrop that drifts and scales in a continuous ambient loop, with an optional content overlay.
- **Props**: `blobs?: MeshBlob[]` (default 3-blob set) · `blur?: number = 60` · `children?: ReactNode` · `className?: string`
- **Fits**: cinematic, saas, app, editorial
- **Reduced motion**: the `-float` keyframe animation (and its `animationDelay`/`willChange`) is dropped per blob; each blob renders frozen at its authored `position`/`size` (the base `translate(-50%, -50%)` placement, no drift/scale). Default blob colors now `color-mix(in oklab, var(--chart-1|2|3) …%, transparent)`.

### TextScramble
- **What**: Text that resolves from randomized characters into the final string, on mount or on scroll-into-view.
- **Props**: `text: string` (required) · `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p" = "h2"` · `chars?: string` (default A–Z/a–z/0–9/symbols) · `speed?: number = 50` · `stagger?: number = 30` · `triggerOnScroll?: boolean = true` · `className?: string`
- **Fits**: cinematic, editorial, app
- **Reduced motion**: `display` is set to the final `text` immediately; the `runScramble()` setTimeout-recursion loop and its ScrollTrigger (`triggerOnScroll` path) never run. No color props/literals in this component, so no token changes were needed.

### Typewriter
- **What**: Cycles through phrases, typing and deleting each with a blinking caret.
- **Props**: `phrases: string[]` (required) · `as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p" = "span"` · `typingSpeed?: number = 80` · `deletingSpeed?: number = 40` · `pauseTime?: number = 2000` · `cursorColor?: string = "currentColor"` · `loop?: boolean = true` · `className?: string`
- **Fits**: cinematic, saas, leadgen, app
- **Reduced motion**: `display` is set to `phrases[0]` immediately; the type/delete `setTimeout` loop never starts and the caret-blink `setInterval` never starts — the caret renders solid (`opacity: 1`, static). Its `transition` now reads `opacity 0.1s var(--ease-standard, cubic-bezier(.16, 1, .3, 1))`. `cursorColor` default left as `currentColor` (judgment call — see summary).

### VideoBackground
- **What**: Full-bleed autoplaying, looping, muted video background with a color overlay; pauses via IntersectionObserver when off-screen.
- **Props**: `src: string` (required) · `poster?: string` · `overlay?: string = "color-mix(in oklab, var(--foreground) 40%, transparent)"` · `className?: string` · `children?: React.ReactNode` · `minHeight?: string = "100vh"` · `playbackRate?: number = 0.75`
- **Fits**: cinematic, leadgen, editorial, commerce
- **Reduced motion**: `video.play()` is never called (gated alongside the existing visibility check); the video shows `poster` if supplied, otherwise its natural first frame via the existing `preload="auto"`, with no playback. `poster` already existed on this component — no prop was added.

### NoiseOverlay
- **What**: Fixed full-viewport SVG film-grain/noise texture, blended over the page.
- **Props**: `opacity?: number = 0.035` · `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: exempt (static texture) per policy. No code changes made — the source has no CSS `animation`, no JS interval/rAF loop, and no color prop/literal to gate or tokenize; it was already fully static.

### ScrollProgress
- **What**: Fixed top-of-viewport bar that fills left-to-right to reflect vertical scroll progress. New module.
- **Props**: `color?: string = "var(--primary)"` · `height?: number = 2` · `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: still updates on every scroll/resize (rAF-throttled, passive listeners) since it communicates position rather than decorating — but skips the default mode's eased lerp-toward-target smoothing and sets `scaleX` directly to the exact scroll ratio each tick. SSR-safe: all `window`/`document` access is inside `useEffect`; listeners and the rAF handle are cleaned up on unmount.
