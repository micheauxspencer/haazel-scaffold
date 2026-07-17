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
- **Reduced motion**: Skips the `xPercent` scrub entirely. Both curtain panels render pre-parted via a static `translateX(±100%)` transform, so the revealed content behind them is visible immediately with no pin and no scroll dependency.

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
