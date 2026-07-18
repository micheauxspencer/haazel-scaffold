## saas

### SaasHero
- **What**: Asymmetric hero — statement type overlapping a glowing DeviceFrame product shot via OverlapField, deliberately off-balance instead of centered.
- **Props**: `headline: {primary, overlay?, secondary?}` (required) / `description: string` (required) / `primaryCta: {label, href}` (required) / `media: ReactNode` (required) / `announcement?: {label, href?}` / `eyebrow?: string` / `secondaryCta?: {label, href}` / `stats?: {value, label}[]` / `mediaUrl?: string` / `className = ""`
- **Fits**: saas
- **Reduced motion**: `useReducedMotion` gates a GSAP rise-stagger on the announcement/CTA/stats blocks and LayeredHeadline's own mask reveal; settled state renders complete without JS (the `translate-y-6 opacity-0` classes only apply when motion is active).
- **Layout DNA**: OverlapField/OverlapItem (12-col overlap, headline block over the drifting media block), LayeredHeadline (size="hero", reveal), DeviceFrame (glow).

### PricingTable
- **What**: Asymmetric pricing grid — the featured plan is physically wider and raised via an uneven `grid-template-columns`, not one of three identical cards.
- **Props**: `heading: string` (required) / `plans: PricingPlan[]` (required) / `id = "pricing"` / `rail?: {label, meta?}` / `intro?: string` / `currency = "$"` / `annualNote?: string` / `footnote?: string` / `className = ""`
- **Fits**: saas
- **Reduced motion**: `useReducedMotion` swaps the billing-toggle and card CSS transitions to `transition-none`; there is no scroll-triggered motion to begin with.
- **Layout DNA**: CaptionRail ("Most popular" tag), hand-tuned uneven `grid-template-columns` (featured column ~15% wider, raised with `md:-translate-y-4`) — intentionally not OffsetGrid, since the asymmetry here is column-width and elevation, not a staggered start.

### LogoCloud
- **What**: "Trusted by" band — a CaptionRail label sits beside a single hairline-bound row of logo marks that wraps naturally; never a boxed logo grid.
- **Props**: `label: string` (required) / `logos: {name: string, src?: string, svg?: ReactNode}[]` (required) / `id = "trusted-by"` / `rail?: {label, meta?}` / `className = ""`
- **Fits**: saas, leadgen
- **Reduced motion**: N/A — no JS motion. The grayscale→full hover resolves via a `@media (hover:hover) and (pointer:fine)` CSS variant rather than `usePointerFine`, so the component stays a server component with no client boundary.
- **Layout DNA**: CaptionRail (the trusted-by label, `rule="none"` since the outer flex row already carries the top/bottom hairline), a hairline-framed flex row that wraps (deliberately not a grid — the spec calls for one wrapping row, not tiles).

### FeatureBento
- **What**: Uneven bento — one large feature cell (media + copy, order flips at md+) beside four smaller cells, placed via CSS `grid-template-areas` so the block reads as deliberately asymmetric rather than a repeated card module.
- **Props**: `heading: string` (required) / `items: FeatureBentoItem[]` (required — exactly 5: `items[0]` is the large cell, `items[1..4]` the small ones) / `id = "features"` / `rail?: {label, meta?}` / `intro?: string` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A — static layout, no JS motion; the hairline→stronger-hairline hover is CSS-only and pointer-fine gated the same way as LogoCloud.
- **Layout DNA**: CaptionRail (per-cell tag/kicker), hand-rolled `grid-template-areas` via a CSS custom property (`--fb-areas`, same technique as EditorialSplit's `--es-cols`, since Tailwind arbitrary values can't hold multi-row quoted strings) — no primitive in the catalog covers named-area bento placement, so this is the file's bespoke, spec-requested move.

### FeatureTabs
- **What**: Vertical tab rail (38%) driving a DeviceFrame-framed media panel (62%), composed via `EditorialSplit(flip)`.
- **Props**: `heading: string` (required) / `items: FeatureTabsItem[]` (required, each `{label, description?, media: ReactNode}`) / `id = "feature-tabs"` / `rail?: {label, meta?}` / `intro?: string` / `mediaUrl?: string` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A — no JS motion in this file; tab switching is Base UI's own instant mount/unmount, not an animated reveal.
- **Layout DNA**: EditorialSplit (`ratio="62/38"`, `flip` — content/38% holds the tab rail, media/62% holds the DeviceFrame), DeviceFrame (glow, wraps the active `TabsContent`), `ui/tabs` (real Base UI `Tabs.Root`/`List`/`Tab`/`Panel` — `orientation="vertical"`, uncontrolled `defaultValue`, roving-tabindex keyboard nav from the library). No local state needed, so the file stays a server component.

### ComparisonTable
- **What**: Us-vs-them comparison table — first column features, one column per product, "ours" carrying a continuous primary border + card fill down its full height, mono check/x marks.
- **Props**: `heading: string` (required) / `columns: ComparisonColumn[]` (required, `{name, highlight?}`) / `rows: ComparisonRow[]` (required, `{feature, values: (boolean|string)[]}`) / `id = "compare"` / `rail?: {label, meta?}` / `intro?: string` / `footnote?: string` / `className = ""`
- **Fits**: saas, commerce
- **Reduced motion**: N/A — static table, no JS motion.
- **Layout DNA**: CaptionRail (table caption, defaults to a static "Feature availability by plan" line if no `footnote` given so the primitive is always present), hand-rolled `<table>` (`border-separate`, not `ui/table`, so the highlighted column's corner radius actually renders instead of being dropped by collapsed borders); `overflow-x-auto` + `min-w-[640px]` degrades to horizontal scroll on mobile.

### TestimonialWall
- **What**: One oversized editorial pull-quote (serif-italic, display size) over a staggered OffsetGrid of smaller supporting quotes — never a uniform wall of equal cards.
- **Props**: `featured: TestimonialWallQuote & {avatar?: ReactNode}` (required) / `supporting: TestimonialWallQuote[]` (required) / `id = "testimonials"` / `rail?: {label, meta?}` / `className = ""`
- **Fits**: saas, leadgen, editorial
- **Reduced motion**: N/A — static, no JS motion.
- **Layout DNA**: CaptionRail (attribution for both the featured quote and each supporting quote, mono+hairline throughout), OffsetGrid (`columns={3}`, staggered supporting quotes).

### IntegrationsGrid
- **What**: Integration tiles (logo slot + name + one-liner) in a staggered OffsetGrid; hairline borders resolve to primary on hover.
- **Props**: `heading: string` (required) / `integrations: IntegrationTile[]` (required, `{name, description, logo?}`) / `id = "integrations"` / `rail?: {label, meta?}` / `intro?: string` / `columns = 4` / `className = ""`
- **Fits**: saas, app
- **Reduced motion**: N/A — hairline→primary border hover is CSS-only, pointer-fine gated.
- **Layout DNA**: OffsetGrid (`columns={3|4}`, staggered tile starts instead of a flat wall).

### MetricsBand
- **What**: Full-bleed inverted stat band — OdometerCounter drives 3-4 big figures set in mono, divided by hairline rules.
- **Props**: `stats: MetricsBandStat[]` (required, `{value: number, prefix?, suffix?, label}`) / `id = "metrics"` / `rail?: {label, meta?}` / `heading?: string` / `className = ""`
- **Fits**: saas, commerce
- **Reduced motion**: Delegated to `OdometerCounter` (`@/components/cinematic/OdometerCounter`) — under reduced motion each stat renders its final value immediately with no scroll wait and no digit roll.
- **Layout DNA**: `SectionShell tone="inverted"`, OdometerCounter (cinematic module) per stat wrapped in `font-mono` (numerals are "table figures" per spec §3, not body-face). Divider hairlines are color-mixed against `--background`, not `--foreground` — a foreground-mixed hairline would render dark-on-dark once the band is inverted, so this band always computes its own dividers off `--background` since `tone="inverted"` is fixed, not conditional.

### FaqCompact
- **What**: EditorialSplit 38/62 — sticky heading+intro left, `ui/accordion` answers right with hairline dividers between items.
- **Props**: `heading: string` (required) / `items: FaqItem[]` (required, `{q, a}`) / `id = "faq"` / `rail?: {label, meta?}` / `intro?: string` / `className = ""`
- **Fits**: saas, leadgen, app
- **Reduced motion**: N/A — accordion open/close is Base UI's own height transition; no scroll-triggered motion in this file.
- **Layout DNA**: EditorialSplit (`ratio="62/38"`, `flip` — the accordion sits in the `media` slot at 62%, the heading sits in `children` at 38%; EditorialSplit's own `sticky` prop only targets `media`, so stickiness is applied by hand to the `children` wrapper instead), `ui/accordion` (real Base UI `Accordion.Root`/`Item`/`Trigger`/`Panel`, uncontrolled `defaultValue`). No local state needed, so the file stays a server component.

### CtaPanel
- **What**: Closing band — LayeredHeadline set left-heavy against a CTA cluster that aligns to the end on desktop; an asymmetric two-zone close, not a centered banner.
- **Props**: `headline: {primary, overlay?, secondary?}` (required) / `primaryCta: {label, href}` (required) / `id = "cta"` / `rail?: {label, meta?}` / `tone: "inverted" | "card" = "inverted"` / `description?: string` / `secondaryCta?: {label, href}` / `microcopy?: string` / `className = ""`
- **Fits**: saas, leadgen, commerce
- **Reduced motion**: Delegated to LayeredHeadline's own scroll-reveal (masked rise, internally gated by `useReducedMotion`); no additional motion in this file.
- **Layout DNA**: LayeredHeadline (`size="display"`), tone-aware CTA/microcopy styling (`inverted` swaps ink to `--background`-derived tones so nothing goes invisible on the dark band).
