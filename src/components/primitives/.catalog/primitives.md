### LayeredHeadline
- **What**: Font-pairing collage headline — display face carries the line, a serif-italic overlay word breaks it, mono eyebrow anchors it; masked-rise reveal on scroll.
- **Props**: `primary: string` (required) · `eyebrow?: string` · `overlay?: string` · `secondary?: string` · `size?: "hero" | "display" = "display"` · `align?: "left" | "center" = "left"` · `overlayColor?: string = "var(--primary)"` · `indent?: boolean = true` · `reveal?: boolean = true` · `className?`
- **Fits**: cinematic, saas, leadgen, commerce, editorial
- **Reduced motion**: lines render in place, no mask/rise.
- **Layout DNA**: the pairing + overlap move itself.

### OverlapField
- **What**: 12-column composition field where items share rows and deliberately overlap; optional per-item scroll drift. Named exports `OverlapField` + `OverlapItem`.
- **Props**: Field: `children`, `className?`. Item: `col: string` (required, e.g. "1 / 8") · `row?: number = 1` · `z?: number = 1` · `offsetY?: string` · `drift?: number = 0` (-1..1) · `className?`
- **Fits**: cinematic, saas, commerce, editorial
- **Reduced motion**: no drift; layout intact. Mobile: single column, offsets neutralized.
- **Layout DNA**: z-layered overlap, broken edges.

### EditorialSplit
- **What**: Asymmetric two-column split (62/38 default — never 50/50) with optional content overhang across the seam and sticky media.
- **Props**: `media: ReactNode` (required) · `children` (required) · `ratio?: "62/38" | "58/42" | "70/30" = "62/38"` · `flip?: boolean` · `overhang?: boolean` · `sticky?: boolean` · `align?: "start" | "center" | "end" = "center"` · `className?`
- **Fits**: all archetypes
- **Reduced motion**: static layout (sticky is position, not animation).
- **Layout DNA**: the sanctioned asymmetry.

### OffsetGrid
- **What**: Broken grid — items share columns but start at staggered vertical offsets, killing the flat-top card wall.
- **Props**: `children` (required) · `columns?: 2 | 3 | 4 = 3` · `offsets?: string[] = ["0px","3.5rem","1.25rem"]` · `gap?: string` · `className?`
- **Fits**: all marketing archetypes (app uses density grids instead)
- **Reduced motion**: offsets persist (layout, not animation); mobile collapses to one column.
- **Layout DNA**: the staggered grid move.

### BleedImage
- **What**: Full-bleed media band with inset caption rail and restrained ±8% parallax.
- **Props**: `children: ReactNode` (required media) · `caption?: string` · `credit?: string` · `height?: string = "clamp(20rem, 70vh, 44rem)"` · `parallax?: boolean = true` · `className?`
- **Fits**: cinematic, leadgen, commerce, editorial
- **Reduced motion**: static image, no parallax.
- **Layout DNA**: the full-bleed breather between contained sections.

### CaptionRail
- **What**: Mono overline + hairline rule system — section numbering, captions, meta. The connective tissue.
- **Props**: `label: string` (required) · `meta?: string` · `rule?: "top" | "bottom" | "none" = "top"` · `tone?: "default" | "muted" = "muted"` · `className?`
- **Fits**: all archetypes
- **Reduced motion**: static by nature.
- **Layout DNA**: the mono+hairline signature.

### ScrollingText
- **What**: Scroll-scrubbed kinetic type band — one or two opposing rows of display type that move with the page (timer-based marquees are KineticMarquee's job).
- **Props**: `rows: {text, direction?: 1 | -1}[]` (required) · `color?: string = "var(--foreground)"` · `alternateOutline?: boolean = true` · `separator?: string = " — "` · `size?: "display" | "hero" = "display"` · `className?`
- **Fits**: cinematic, commerce, editorial
- **Reduced motion**: one static centered line per row.
- **Layout DNA**: language as texture.

### DeviceFrame
- **What**: Product-shot framing — browser chrome, phone shell, or bare panel with ambient primary-tinted glow.
- **Props**: `children: ReactNode` (required) · `variant?: "browser" | "phone" | "bare" = "browser"` · `url?: string` · `glow?: boolean = true` · `glowColor?: string = "var(--primary)"` · `className?`
- **Fits**: saas, app (marketing shots), commerce (app-adjacent products)
- **Reduced motion**: static by nature.
- **Layout DNA**: screenshots as product, not pasted rectangles.

### SectionShell
- **What**: Standard section wrapper — token vertical rhythm, container + gutter, optional numbered caption rail, tone bands (default/card/inverted).
- **Props**: `children` (required) · `id?: string` · `rail?: {label, meta?}` · `bleed?: boolean` · `tone?: "default" | "card" | "inverted" = "default"` · `className?`
- **Fits**: all archetypes
- **Reduced motion**: static by nature.
- **Layout DNA**: the consistent spatial spine variety plays against.
