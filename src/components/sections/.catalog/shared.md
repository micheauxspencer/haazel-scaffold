## shared

Fit constraint for this pack: every entry must work, unstyled-per-archetype,
across cinematic / saas / app / leadgen / commerce / editorial. Nothing here
reads as archetype-specific — tokens only.

### MegaFooter
- **What**: Statement footer — full-bleed font-display wordmark, an asymmetric EditorialSplit pairing newsletter capture against link columns, and a CaptionRail bottom bar for copyright/credit/socials.
- **Props**: `brandName: string` (required) / `columns: MegaFooterColumn[]` (required) / `wordmarkOutline?: boolean = false` / `newsletter?: MegaFooterNewsletterConfig` / `copyright?: string` (defaults to `© {year} {brandName}. All rights reserved.`) / `builtWith?: string` / `socials?: MegaFooterSocial[]` / `tone?: "default" | "inverted" = "inverted"` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No JS-driven motion — server component, nothing scroll- or entrance-animated. Hover states (link color, newsletter button lift) are plain token-eased CSS transitions, not gated behind `useReducedMotion`.
- **Layout DNA**: `SectionShell` (tone) + `EditorialSplit` (`62/38`, flipped — newsletter narrow-left, link columns wide-right; falls back to a plain responsive grid when `newsletter` is omitted) + `CaptionRail` (bottom bar). The giant outline-capable wordmark is the deliberate typographic statement. Catalog note: **replaces `layout/Footer` when a page composes its own section stack.**

### MegaFooterNewsletterForm
- **What**: The client-only newsletter capture form `MegaFooter` composes into its `EditorialSplit` content slot — split into its own file because `"use client"` is a module-level directive and can't be scoped to one function inside the otherwise-server `MegaFooter.tsx`. Not intended to be dropped into a page on its own.
- **Props**: `heading?: string = "Stay in the loop"` / `description?: string` / `placeholder?: string = "you@email.com"` / `buttonLabel?: string = "Subscribe"` / `onSubmit?: (email: string) => void` / `tone?: "default" | "inverted" = "default"` (matches the parent's tone) / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial (inherits `MegaFooter`'s fit — it only ever renders inside that component's newsletter slot)
- **Reduced motion**: No JS motion; the post-submit confirmation line is a plain CSS opacity fade.
- **Layout DNA**: No primitives — a labeled input + button pair, hand-styled with explicit tone-aware color branches rather than `ui/Input` (`ui/Input`'s fixed theme tokens don't adapt to a locally-`inverted` section the way this needs to).

### AnnouncementBar
- **What**: Dismissible ≤40px top utility bar with localStorage-persisted dismissal and three tone variants.
- **Props**: `message: ReactNode` (required) / `href?: string` / `dismissible?: boolean = true` / `storageKey?: string = "announcement-bar"` / `tone?: "default" | "inverted" | "primary" = "default"` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No motion to gate — mount/dismiss is a hard show/hide (renders nothing until mounted-and-not-dismissed to keep SSR and client markup in agreement), not an animated transition. `useReducedMotion` is intentionally not imported.
- **Layout DNA**: Deliberately bypasses `SectionShell` — a persistent utility bar sits outside normal section vertical rhythm (`--section-gap` would blow the height budget). Borrows `CaptionRail`'s mono/overline type language without its hairline rule. The 24px dismiss control is a documented, spec-driven exception to the library's usual `min-h-11` (WCAG 2.5.8 AA's 24px minimum, chosen because a 44px control cannot fit inside a ≤40px bar).

### StatBand
- **What**: Full-width animated stat strip — `OdometerCounter` figures in the display face over mono `CaptionRail` labels, hairline-divided columns.
- **Props**: `stats: StatBandStat[]` (required, each `{ value: number; prefix?: string; suffix?: string; label: string }`) / `rail?: { label: string; meta?: string }` / `tone?: "default" | "card" | "inverted" = "default"` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: Delegates entirely to `OdometerCounter`'s own `useReducedMotion` handling — final values render immediately with no digit-roll when reduced motion is on; StatBand adds no motion of its own.
- **Layout DNA**: `SectionShell` (tone) + `CaptionRail` (`rule="none"`, one per stat, for the mono label) + hairline `divide-x` verticals (`color-mix` hairline, tone-aware). Composes the cinematic `OdometerCounter` module for the animated figures rather than reimplementing counting — number gets `font-display` via ancestor inheritance since OdometerCounter sets no font-family of its own.

### ContactSplit
- **What**: Asymmetric contact section — heading, contact rows, optional hours and socials beside a validated message form with an `onSubmit` prop or a `mailto:` fallback.
- **Props**: `heading: string` (required) / `info: ContactSplitInfo` (required, `{ email?, phone?, address? }`) / `hours?: ContactSplitHour[]` (`{ label, value }`) / `socials?: ContactSplitSocial[]` (`{ platform, href }`) / `onSubmit?: (data: { name, email, message }) => void` (omit for the `mailto:` fallback, addressed to `info.email`) / `rail?: { label: string; meta?: string }` / `id?: string` / `className?: string`
- **Fits**: cinematic, saas, app, leadgen, commerce, editorial
- **Reduced motion**: No JS-driven motion. The post-submit confirmation line is a plain CSS opacity fade (non-vestibular), not gated behind `useReducedMotion`.
- **Layout DNA**: `SectionShell` + `EditorialSplit` + per-row `CaptionRail` (mono label + hairline for each contact/hours/socials block). The spec called for a 42/58 split; `EditorialSplit`'s ratio enum only ships `62/38` / `58/42` / `70/30`, so `ratio="58/42"` with `flip` is used — flip swaps both the render order and the fr split together, landing the content slot (info) at 42% on the left and the media slot (form) at 58% on the right. Form fields use `ui/input`, `ui/textarea`, `ui/label` with `aria-invalid` + `aria-describedby` wired to inline error text.
