<!-- leadgen pack — merge into ../COMPONENT_CATALOG.md per SECTION_SPEC.md §6 -->

### LocalHero
- **What**: Phone-forward local-business hero — layered headline, service-area mono line, tel:/quote CTAs, trust chips, media panel.
- **Props**: `headline: {primary, overlay?, secondary?}` / `description: string` / `serviceAreas: string[]` / `phone: {display, href}` / `quoteCta: {label, href}` / `trustChips: {label, icon?}[]` / `media: ReactNode` (required) — `id?` / `eyebrow?` / `serviceAreaLabel? = "Serving"` / `mediaCaption?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: GSAP entrance rise (announcement/description/CTA row/trust chips) is skipped; content renders in its final position with no opacity/translate offset, matching the SaasHero pattern.
- **Layout DNA**: `EditorialSplit` (ratio `58/42`, `flip` so content stays left even though the primitive always gives `media` the larger fr-share), `LayeredHeadline` (`size="hero"`), inline SVG shield/check/star trust icons.

### ServiceCards
- **What**: Services as hairline cards — title, "from $X" in mono, arrow link. Not the banned icon-top-center 3-card wall.
- **Props**: `heading: string` / `services: {title, description, href, media?, priceFrom?}[]` (required) — `id?` / `rail?` / `intro?` / `currency? = "$"` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: no JS motion; static cards, CSS hover/focus transitions only (arrow translate, border color).
- **Layout DNA**: `OffsetGrid` (staggered card grid, 2 or 3 columns depending on list length).

### ProcessSteps
- **What**: Numbered process spine — giant display-face numerals held against one continuous hairline rule, alternating md: content indent for editorial stagger.
- **Props**: `heading: string` / `steps: {title, description, meta?}[]` (required) — `id?` / `rail?` / `intro?` / `className?` (optional)
- **Fits**: leadgen, saas, commerce
- **Reduced motion**: GSAP scroll-entrance stagger is skipped; steps render fully visible with no y/opacity offset.
- **Layout DNA**: no primitive beyond SectionShell — written reason: a fixed-width CSS-grid numeral column + one absolutely-positioned spine keeps every numeral right-aligned against the same hairline across rows; OffsetGrid's per-item offsets don't guarantee that shared alignment.

### ReviewsWall
- **What**: One review promoted to an oversized italic pull-quote, the rest in a card wall with inline-SVG star ratings.
- **Props**: `heading: string` / `reviews: {quote, author, source, rating, date?}[]` (required) — `id?` / `rail?` / `intro?` / `demoNotice?` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: GSAP scroll-entrance stagger is skipped; lead quote and cards render fully visible.
- **Layout DNA**: `OffsetGrid` for the review-card wall; lead review (`reviews[0]`) rendered as a standalone `font-heading italic` pull-quote above it. `demoNotice` surfaces fixture/demo labelling in the UI itself.

### QuoteForm
- **What**: Lead-capture form — name/phone/email/service/message with client-side validation, honeypot, POSTs JSON to `/api/quote`, swaps to a confirmation panel on success.
- **Props**: `heading: string` / `services: string[]` (required) — `id? = "quote"` / `rail?` / `intro?` / `phone?` / `address?` / `trustPoints?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: no GSAP; the shared CSS-transition token (`ease`) falls back to `transition-none` when reduced, gating the success-panel "send another" hover and the submit button's lift. Field validation/errors and the drag-free form fields carry no motion to reduce.
- **Layout DNA**: `EditorialSplit` (ratio `58/42`, `flip` — the form is the primary action so it takes the primitive's larger `media` slot at 58%, the trust/contact panel takes `children` at 42% and stays left); `ui/input`, `ui/textarea`, `ui/select`, `ui/label`.
- **Note**: pairs with `POST /api/quote` at `src/app/api/quote/route.ts` — validates the same required fields server-side, honors the `website` honeypot, and sends via the Resend REST API when `RESEND_API_KEY` is set (otherwise logs and returns `delivered: false`).

### BeforeAfterGallery
- **What**: Accessible before/after comparison slider — a full-frame range input drives the "after" layer's clip-path directly (no easing); primary item large, remaining items in a smaller grid.
- **Props**: `heading: string` / `items: {before: {src, alt}, after: {src, alt}, label?}[]` (required) — `id?` / `rail?` / `intro?` / `className?` (optional)
- **Fits**: leadgen, commerce
- **Reduced motion**: no scroll-entrance (matches the PricingTable precedent — a functional block renders complete rather than animating in). The handle's hover-scale affordance is gated on `useReducedMotion` + `usePointerFine`; the drag-driven clip-path and handle position are always direct-set 1:1 regardless of the setting, since that's user-driven manipulation, not an autoplaying animation.
- **Layout DNA**: `OffsetGrid` for the secondary items list. The slider frame itself uses no primitive — written reason: it needs two precisely layered `<img>` elements under a live clip-path, which a generic media primitive doesn't expose.

### ServiceAreaList
- **What**: Programmatic-SEO city directory — a CSS multi-column list of mono-typography links with hairline rules per row.
- **Props**: `heading: string` / `areas: {city, href, count?}[]` (required) — `id?` / `rail?` / `intro?` / `countLabel?` / `className?` (optional)
- **Fits**: leadgen
- **Reduced motion**: no JS motion; CSS color transition on link hover only.
- **Layout DNA**: `CaptionRail` (area count, e.g. "10 service areas") + native CSS `columns` list — written reason: a dense directory of city links reads as a reference index in flowing magazine columns; OffsetGrid's staggered vertical offsets are built for cards, not single-line text rows.

### TrustBadges
- **What**: Horizontal band of credential pills; inline-SVG shield/check/star icons cycle as defaults when the caller doesn't supply one.
- **Props**: `badges: {label, sublabel?, icon?}[]` (required) — `id?` / `rail?` / `heading?` / `tone? = "default"` / `className?` (optional)
- **Fits**: leadgen, saas, commerce, app
- **Reduced motion**: no JS motion; static pills, no transitions.
- **Layout DNA**: no primitive beyond SectionShell — written reason: a wrapping inline pill list is its own layout move; none of EditorialSplit/OffsetGrid/CaptionRail fit a horizontal credential band's shape. `tone="card"` optionally wraps the band in a bordered surface for use as a standalone strip.
