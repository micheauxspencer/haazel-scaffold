### ProductHero
- **What**: Product-drop hero — an oversized product shot overlapping a price/headline block on an OverlapField grid.
- **Props**: `headline: { primary: string; overlay?: string; secondary?: string }` (required) / `price: { amount: string; symbol?: string; currency?: string; compareAt?: string }` (required) / `primaryCta: { label: string; href: string }` (required) / `media: ReactNode` (required) / `id?: string` / `rail?: { label: string; meta?: string }` / `badge?: string` / `eyebrow?: string` / `description?: string` / `availability?: string` / `secondaryCta?: { label: string; href: string }` / `className? = ""`
- **Fits**: commerce, editorial
- **Reduced motion**: ProductHero itself ships no component-level JS animation. It composes `LayeredHeadline` (mask-reveal) and `OverlapField` (scroll drift), both of which already settle to a fully visible, non-drifting state under `prefers-reduced-motion` internally — nothing extra to gate here.
- **Layout DNA**: `SectionShell` + `OverlapField`/`OverlapItem` (headline+price col `1 / 7` z-2 over product media col `5 / 13` z-1) + `LayeredHeadline` (size="hero", overlay word).

### StickyBuyBar
- **What**: Bottom-fixed buy bar that appears past a scroll threshold, showing product thumb, name, price, and CTA with a dismiss control.
- **Props**: `product: { name: string; price: string }` (required) / `thumb: ReactNode` (required) / `cta: { label: string; href: string }` (required) / `threshold?: number = 600` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: The rAF-throttled scroll trigger and show/hide logic are identical regardless of motion preference — only the reveal transition changes: a `translate-y` slide under normal motion, an instant opacity swap under reduced motion. The bar's CTA and dismiss button also get `tabIndex={-1}` while hidden so they can't trap keyboard focus off-screen.
- **Layout DNA**: No `SectionShell` — written reason: this is viewport-pinned chrome, not document-flow content, so the container/rail/vertical-rhythm model doesn't apply. Direct flex row + token radius/spacing/hairline only, plus `env(safe-area-inset-bottom)` padding for iOS home-indicator clearance.

### SpecsTable
- **What**: Definition-list spec sheet — mono label/value hairline rows with an optional download-link row.
- **Props**: `specs: { label: string; value: string; detail?: string }[]` (required) / `id?: string = "specs"` / `rail?: { label: string; meta?: string }` / `heading?: string` / `intro?: string` / `download?: { label: string; href: string }` / `className? = ""`
- **Fits**: commerce, editorial
- **Reduced motion**: N/A — fully static server component, no motion to reduce.
- **Layout DNA**: `SectionShell` + `CaptionRail` (spec-count meta line above the list) + a semantic `<dl>` of `divide-y` hairline rows (`dt` mono overline label, `dd` mono `tabular-nums` value right-aligned).

### ProductGallery
- **What**: Main image with a thumbnail rail (left of the image on desktop, a horizontal strip below it on mobile); frames crossfade on click or arrow-key navigation, with optional cursor-gated zoom.
- **Props**: `images: { src: string; alt: string }[]` (required) / `zoom?: boolean = true` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: Crossfade duration collapses to an instant swap (`transition-none`) under reduced motion. Hover-zoom is gated on `usePointerFine` (fine pointer only) AND additionally disabled entirely under reduced motion, so no scale transform ever fires for motion-sensitive users.
- **Layout DNA**: No `SectionShell` — written reason: this is a self-contained media widget meant to sit inside a page's own section/`EditorialSplit`, not a section in its own right. Flex layout only (`md:flex-row-reverse` puts the thumb rail on the left at desktop, stacked below on mobile); zoom gated on `usePointerFine`.

### DropCountdown
- **What**: Digit countdown (days/hrs/min/sec) to an ISO `target`, swapping to a `live` slot once it reaches zero.
- **Props**: `target: string` (required, ISO date-time) / `id?: string = "countdown"` / `rail?: { label: string; meta?: string }` / `live?: ReactNode` / `label?: string = "Drop ends in"` / `className? = ""`
- **Fits**: commerce
- **Reduced motion**: N/A to the ticking itself (a `setInterval` text update, not a transform/opacity animation). The relevant guard is SSR-safety: server render and the first client paint both show an identical zeroed placeholder (`mounted === false`), so the real clock-derived digits — and the decision to swap to the `live` slot — only resolve after mount, avoiding any hydration mismatch.
- **Layout DNA**: `SectionShell` + `CaptionRail` (countdown label). Digits container uses `role="timer"` without `aria-live` so screen readers aren't spammed every second.

### BundleCards
- **What**: 2–3 bundle cards on an uneven grid with a raised, primary-bordered featured card; struck-through compare price and a savings pill.
- **Props**: `heading: string` (required) / `bundles: { name: string; items: string[]; price: string; tagline?: string; compareAt?: string; savingsLabel?: string; cta: { label: string; href: string }; featured?: boolean }[]` (required) / `id?: string = "bundles"` / `rail?: { label: string; meta?: string }` / `intro?: string` / `currency?: string = "$"` / `footnote?: string` / `className? = ""`
- **Fits**: commerce, saas (bundle/plan-style offers generally)
- **Reduced motion**: No entrance or ambient motion. The only movement is a hover lift on CTAs (`hover:-translate-y-0.5`) — a user-initiated micro-interaction, which CONVENTIONS.md's mandatory reduced-motion table does not require gating (unlike entrance/ambient/scroll-scrub/cursor-reactive motion).
- **Layout DNA**: `SectionShell` + `CaptionRail` (featured-card badge) + the `PricingTable` emphasis pattern (uneven `grid-template-columns` keyed to the featured card's index).
