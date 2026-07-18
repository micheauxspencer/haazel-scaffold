"use client";
// Client page: table column `render` functions and form callbacks can't
// cross a server→client boundary; the demo passes them freely client-side.

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import AppShell from "@/components/sections/app/AppShell";
import KpiCards from "@/components/sections/app/KpiCards";
import ChartPanel from "@/components/sections/app/ChartPanel";
import DataTablePro from "@/components/sections/app/DataTablePro";
import ActivityFeed from "@/components/sections/app/ActivityFeed";
import SettingsForm from "@/components/sections/app/SettingsForm";
import EmptyState from "@/components/sections/app/EmptyState";
import CommandPaletteDemo from "@/app/showcase/app/_components/CommandPaletteDemo";
import {
  appShellFixture,
  revenueKpiFixture,
  revenueChartFixture,
  bookingsByMarketChartFixture,
  bookingsTableFixture,
  activityFeedFixture,
  organizationSettingsFixture,
  bookingsEmptyStateFixture,
} from "@/components/sections/app/fixtures";

/**
 * /showcase/app — the 8 dashboard components. Unlike the marketing packs,
 * none of these self-wrap in SectionShell (SECTION_SPEC.md §7 — they're
 * meant to live inside AppShell's own content padding), so this page
 * supplies its own moderate container rhythm instead of the big
 * marketing --section-gap.
 */
export default function AppShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="App pack" meta="8 dashboard components" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          Density over
          <span className="font-heading italic text-primary"> drama</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Inside-the-product UI — minimal motion, real shadcn primitives,
          still token-pure.
        </p>
      </header>

      {/* AppShell + KpiCards + ChartPanel + DataTablePro, bounded to a fixed
          height as a showcase demo only — AppShell normally owns full page
          chrome (min-h-dvh), so it's framed and clipped here, not styled
          differently. onSearchClick is intentionally left unwired (it's
          optional, and appShellFixture's own Omit excludes it) — the
          CommandPalette gets its own dedicated demo below instead. */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-section">
        <p className="mb-4 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
          AppShell — bounded to 640px here as a showcase demo, not real page chrome
        </p>
        <div className="h-[640px] overflow-hidden rounded-[var(--radius-lg)] border [border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]">
          <AppShell {...appShellFixture}>
            <KpiCards {...revenueKpiFixture} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartPanel {...revenueChartFixture} />
              <ChartPanel {...bookingsByMarketChartFixture} />
            </div>
            <DataTablePro {...bookingsTableFixture} />
          </AppShell>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-[var(--content-gap)]">
        <CaptionRail label="ActivityFeed" meta="Grouped by day" />
        <div className="mt-[var(--content-gap)]">
          <ActivityFeed {...activityFeedFixture} />
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-[var(--content-gap)]">
        <CaptionRail label="SettingsForm" meta="Config-driven" />
        <div className="mt-[var(--content-gap)]">
          <SettingsForm {...organizationSettingsFixture} />
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-[var(--content-gap)]">
        <CaptionRail label="EmptyState" meta="Zero state" />
        <div className="mt-[var(--content-gap)]">
          <EmptyState {...bookingsEmptyStateFixture} />
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-[var(--content-gap)]">
        <CaptionRail label="CommandPalette" meta="Cmd/Ctrl+K" />
        <div className="mt-[var(--content-gap)]">
          <CommandPaletteDemo />
        </div>
      </div>
    </div>
  );
}
