### AppShell
- **What**: Collapsible sidebar + topbar shell that frames the other seven app/ components inside a dashboard's main content area.
- **Props**: `navSections: AppShellNavSection[]` (required) / `brand: {name, logo?}` (required) / `user: {name, email?, avatarSrc?}` (required) / `children: ReactNode` (required) / `breadcrumb?: AppShellBreadcrumbItem[]` / `onSearchClick?: () => void` / `className?: string`
- **Fits**: app
- **Reduced motion**: sidebar-collapse width transition and the collapse-button chevron rotation both drop to `transition-none` under `useReducedMotion`; expanded/collapsed states render correctly with no JS either way.
- **Layout DNA**: `CaptionRail` for mono nav-section labels, `ui/sheet` for the mobile drawer (shares one `Sheet` root with the topbar's trigger so context connects correctly), `ui/avatar` for the identity slot. Styled on `--sidebar-*` tokens, not `--card`/`--popover`, so the rail reads as its own surface.

### DataTablePro
- **What**: Generic sortable, paginated data table on `ui/table` with an optional status→badge column mapping and a sticky header inside a scroll region.
- **Props**: `columns: DataTableColumn[]` (required) / `rows: Record<string, unknown>[]` (required) / `caption?: string` / `statusBadge?: DataTableStatusBadge` / `pageSize = 8` / `emptyState?: ReactNode` / `className?: string`
- **Fits**: app
- **Reduced motion**: no JS-driven motion; the sort-chevron rotation and row-hover state are plain CSS transitions (non-vestibular colour/rotate feedback), unaffected by `prefers-reduced-motion`.
- **Layout DNA**: `ui/table` + `ui/card` (header/content/footer frame the sticky-header scroll region and the pagination footer), `ui/badge` for status. Density exception: a uniform row stack is correct here — the "uniform grid" ban is a marketing-section rule, not a data-table rule.

### KpiCards
- **What**: Stat-card grid with display-face tabular values, directional delta pills, and an optional dependency-free SVG sparkline per card.
- **Props**: `items: KpiCardItem[]` (required) / `columns?: 2 | 4 = 4` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component (no `"use client"`, no animation to gate).
- **Layout DNA**: `ui/card`. Density exception used deliberately: a uniform 2/4-column grid of equal-weight cards is the correct pattern for a KPI row (the app pack's explicit density exception to the "uniform grid" ban), not `OffsetGrid`.

### ChartPanel
- **What**: Dependency-free inline-SVG chart card (line/bar/area) with 4 hairline gridlines, mono axis labels and native `<title>` hover tooltips.
- **Props**: `title: string` (required) / `data: ChartPanelDatum[]` (required) / `variant?: "line" | "bar" | "area" = "line"` / `meta?: string` / `valueFormatter?: (value: number) => string` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component; geometry is a pure function of `data` computed once per render, nothing to gate.
- **Layout DNA**: `ui/card` frame around a hand-rolled normalized-viewBox SVG (no chart library); gridlines at `color-mix(in oklab, var(--foreground) 10%, transparent)`, deterministic output for identical `data`.

### ActivityFeed
- **What**: Vertical timeline with a hairline left spine, avatar/icon nodes, and right-aligned mono timestamps; entries can be grouped into day sections.
- **Props**: `entries: ActivityFeedEntry[]` (required) / `groupByDay?: boolean = false` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component, no animation to gate.
- **Layout DNA**: `CaptionRail` for day-group headings, `ui/avatar` for actor nodes. Hairline spine at `color-mix(in oklab, var(--foreground) 12%, transparent)`; nodes sit on `bg-background` to visually interrupt the line, the same layered-edge move `OverlapField` uses elsewhere, at dashboard density.

### SettingsForm
- **What**: Config-driven settings form (`ui/input` + `ui/select` + textarea) with per-field labels/errors and a sticky save bar that only appears once the form is dirty.
- **Props**: `sections: SettingsSection[]` (required) / `errors?: Record<string, string>` / `onSubmit?: (values: Record<string, string>) => void` / `submitLabel = "Save changes"` / `className?: string`
- **Fits**: app
- **Reduced motion**: the save bar's show/hide transition (translate + opacity) drops to `transition-none` under `useReducedMotion`; it stays correctly shown/hidden via `aria-hidden` + `tabIndex` regardless of the JS motion path.
- **Layout DNA**: asymmetric `18rem / 1fr` section header split (never 50/50), hairline `divide-y` between sections, label/description/error stack per field.

### EmptyState
- **What**: Zero-state panel — a hand-authored geometric inline-SVG mark (layered, offset, rotated squares), heading, description, and a primary/secondary action pair.
- **Props**: `heading: string` (required) / `description?: string` / `primaryAction?: {label, href}` / `secondaryAction?: {label, href}` / `className?: string`
- **Fits**: app
- **Reduced motion**: static server component; the primary CTA's hover-lift is a plain CSS transition (non-essential micro-feedback), no reduced-motion gate needed.
- **Layout DNA**: mirrors the CTA pair from `SaasHero`/`PricingTable` (solid primary button + underlined secondary link) for cross-pack consistency; the mark is offset/rotated rects, not a centered blob — no emoji, no illustration library.

### CommandPalette
- **What**: ⌘K/Ctrl+K command palette wrapping `ui/command`'s cmdk-based `CommandDialog`, with grouped, iconable, shortcut-labeled actions.
- **Props**: `open: boolean` (required) / `onOpenChange: (open: boolean) => void` (required) / `groups: CommandPaletteGroup[]` (required) / `placeholder?: string` / `emptyMessage?: string` / `className?: string`
- **Fits**: app
- **Reduced motion**: open/close animation is owned by the shared `ui/dialog` primitive, not reimplemented here; the global keydown listener is motion-inert and is removed on unmount.
- **Layout DNA**: `ui/command` (`CommandDialog`, `CommandInput`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`) — cmdk-based, no custom list/filter logic.
