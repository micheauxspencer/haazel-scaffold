# Section Pack Specification

The contract for every component in `sections/{saas,app,leadgen,commerce,shared}/`.
Read this AND the two exemplars before writing a section:

- `sections/saas/SaasHero.tsx` — animated exemplar (primitives + motion + client)
- `sections/saas/PricingTable.tsx` — interactive exemplar (layout DNA on a "boring" block)

The point of this library is **layout design, not blocks**. A section that
could have come from any template generator is a failed section. Font pairing,
overlap, asymmetry, kinetic type — deliberate moves, on purpose, every time.

## 1. Structure

- One component per file, `export default function Name(props)`, props
  interface exported. File name = component name.
- Wrap in `SectionShell` from `@/components/primitives/SectionShell`
  (id, numbered rail, tone, bleed). No ad-hoc section padding — the shell owns
  vertical rhythm via `--section-gap`.
- Server component by default. Add `"use client"` ONLY for interactivity or
  GSAP. (Exemplars show both.)
- Content comes from **required props — no lorem defaults baked in**. Each
  pack has a `fixtures.ts` exporting demo content used only by `/showcase`.

## 2. Layout DNA (mandatory)

Compose the primitives (`@/components/primitives/`):

| Primitive | Use for |
|---|---|
| `SectionShell` | every section wrapper (rail = "01 — Label" numbering) |
| `LayeredHeadline` | hero-level headlines: display face + serif-italic overlay word |
| `CaptionRail` | labels, meta, credits — the mono+hairline system |
| `EditorialSplit` | any two-column moment — 62/38 or 58/42, never 50/50 |
| `OverlapField`/`OverlapItem` | layered compositions, elements breaking edges |
| `OffsetGrid` | any card/tile set — staggered starts, never a flat-top wall |
| `BleedImage` | full-width media with caption rail |
| `ScrollingText` | kinetic type bands between sections |
| `DeviceFrame` | product screenshots (browser/phone chrome + glow) |

Minimum bar: every section uses ≥1 primitive beyond SectionShell, or has a
written reason in its catalog entry.

**Banned patterns** (QA greps for these):
- Uniform icon-card grids (3 equal cards, icon-top-center) — use OffsetGrid,
  asymmetric emphasis, or a list with hairline rules instead.
- 50/50 splits. Emoji as icons (use `lucide-react` or inline SVG).
- Hardcoded colors — tokens only (`var(--…)`, `color-mix`, Tailwind token classes).
- `Lorem ipsum` anywhere. Center-aligning everything.
- Invisible borders: hairlines are `color-mix(in oklab, var(--foreground) 10-15%, transparent)` minimum.

## 3. Type system

- Sizes via token utilities: `text-hero`, `text-display`, `text-heading`,
  `text-subheading`, `text-overline` (+ Tailwind defaults for body).
- Faces via `font-display`, `font-heading`, `font-mono` — pair them: display
  for the statement, heading/serif for the aside, mono for labels/numbers.
- Numbers (prices, stats, table figures): `font-display` large or `font-mono`
  small — never body-face numerals for feature figures.

## 4. Motion policy

Sections ship **restrained-by-default**: entrance reveals only (masked rise
or ≤24px fade-translate, `once: true`), micro-interactions on hover/focus.
Scroll-scrub belongs to cinematic modules composed BY pages, not inside pack
sections. Always:

- `useReducedMotion` from `@/lib/motion/useReducedMotion`; settled state must
  render complete without JS (see exemplar pattern: conditional initial styles).
- Hover-only affordances gate on `usePointerFine`; content never hidden
  behind hover.
- CSS transitions use `var(--ease-standard, cubic-bezier(.16,1,.3,1))` and
  `--duration-*` tokens.

## 5. Responsive & a11y

- Mobile-first: single column at base, compose up at `md:`. Zero horizontal
  overflow at 375px. Touch targets ≥44px.
- Semantic HTML (section/nav/figure/dl where right). Every image prop carries
  `alt`. Interactive elements keyboard-reachable with visible focus
  (`focus-visible:` ring in token colors).
- Forms: label every input, `aria-invalid` on error, describe errors in text.

## 6. Catalog

Every section gets an entry in its pack's fragment
`src/components/sections/.catalog/<pack>.md`:

```
### ComponentName
- **What**: one line
- **Props**: `prop: type` (required) / `= default` (optional) — from the code
- **Fits**: archetypes this suits {cinematic, saas, app, leadgen, commerce, editorial}
- **Reduced motion**: behavior
- **Layout DNA**: which primitives/moves it uses
```

`npm run check:catalog` must pass once entries are merged into
`COMPONENT_CATALOG.md`.

## 7. Per-pack notes

- **saas/** — light-or-dark agnostic; product-led; DeviceFrame for shots;
  metrics in display face; restrained motion. Components: SaasHero✓,
  PricingTable✓, LogoCloud, FeatureBento, FeatureTabs, ComparisonTable,
  TestimonialWall, IntegrationsGrid, MetricsBand, FaqCompact, CtaPanel.
- **app/** — inside-the-product UI: AppShell (sidebar+topbar), DataTablePro,
  KpiCards, ChartPanel (dep-free SVG), ActivityFeed, SettingsForm, EmptyState,
  CommandPalette (cmdk). Motion = minimal (fades ≤ --duration-base). Uses
  `ui/` shadcn primitives heavily; density over drama; still token-pure.
- **leadgen/** — local-business conversion: LocalHero, ServiceCards,
  ProcessSteps, ReviewsWall, ServiceAreaList, QuoteForm (posts to
  `/api/quote`), BeforeAfterGallery, TrustBadges. Phone/CTA always in reach;
  trust signals concrete (real numbers, no fabricated reviews in fixtures —
  mark fixture content clearly as demo).
- **commerce/** — single-product drop energy: ProductHero, StickyBuyBar,
  SpecsTable, ProductGallery, DropCountdown, BundleCards. Editorial type,
  zero-radius-friendly (respect --radius), specs in mono.
- **shared/** — MegaFooter, AnnouncementBar, StatBand, ContactSplit. Must fit
  every archetype: strictly token-driven, no archetype-specific styling.
