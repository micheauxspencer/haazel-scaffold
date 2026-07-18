import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { ReactNode } from "react";

import CaptionRail from "@/components/primitives/CaptionRail";
import LayeredHeadline from "@/components/primitives/LayeredHeadline";
import { OverlapField, OverlapItem } from "@/components/primitives/OverlapField";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import OffsetGrid from "@/components/primitives/OffsetGrid";
import BleedImage from "@/components/primitives/BleedImage";
import ScrollingText from "@/components/primitives/ScrollingText";
import DeviceFrame from "@/components/primitives/DeviceFrame";
import SectionShell from "@/components/primitives/SectionShell";
import PlaceholderMedia from "@/app/showcase/_components/PlaceholderMedia";

/**
 * /showcase/primitives — the 9 layout primitives every section in every
 * pack composes. No fixtures.ts here (SECTION_SPEC.md §1 scopes fixtures to
 * the section packs) — demo copy below exists only to fill the frame.
 */

function DemoBand({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <SectionShell rail={{ label: `${index} — ${title}` }}>
      <p className="mb-[var(--content-gap)] max-w-[60ch] text-sm text-muted-foreground">
        {description}
      </p>
      <div className="rounded-[var(--radius-lg)] border p-6 [border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)] md:p-10">
        {children}
      </div>
    </SectionShell>
  );
}

export default function PrimitivesShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="Layout primitives" meta="9 — the anti-generic layer" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          The anti-generic
          <span className="font-heading italic text-primary"> layer</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Every section in every pack composes these nine primitives — layout
          design, not blocks.
        </p>
      </header>

      {/* 01 — LayeredHeadline: hero + display sizes */}
      <DemoBand
        index="01"
        title="LayeredHeadline"
        description="Font-pairing collage headline — display face carries the line, a serif-italic overlay word breaks it, mono eyebrow anchors it."
      >
        <div className="flex flex-col gap-[var(--content-gap)]">
          <div>
            <p className="mb-4 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              size: hero
            </p>
            <LayeredHeadline
              size="hero"
              eyebrow="Est. 2026 — Toronto"
              primary="Built for"
              overlay="how you scroll"
              secondary="not how a template scrolls"
            />
          </div>
          <div>
            <p className="mb-4 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              size: display
            </p>
            <LayeredHeadline
              size="display"
              eyebrow="Layout primitive 01"
              primary="Pair extremes,"
              overlay="overlap"
              secondary="on purpose, every time"
            />
          </div>
        </div>
      </DemoBand>

      {/* 02 — OverlapField: 2-item composition */}
      <DemoBand
        index="02"
        title="OverlapField / OverlapItem"
        description="12-column composition field where items share rows and deliberately overlap — the tool for image-under, type-over layouts."
      >
        <OverlapField>
          <OverlapItem col="1 / 8" row={1} z={2} offsetY="8%">
            <div className="rounded-[var(--radius-lg)] border bg-card p-6 [border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)] md:p-8">
              <p className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                col: 1 / 8 · z: 2
              </p>
              <p className="mt-3 text-heading font-heading font-medium">Type breaks the edge</p>
              <p className="mt-3 text-sm text-muted-foreground">
                This card sits above the media at z=2, nudged down 8% so it
                overlaps instead of stacking politely beside it.
              </p>
            </div>
          </OverlapItem>
          <OverlapItem col="5 / 13" row={1} z={1}>
            <PlaceholderMedia label="Media — col 5/13, z: 1" ratio="4/3" />
          </OverlapItem>
        </OverlapField>
      </DemoBand>

      {/* 03 — EditorialSplit w/ overhang */}
      <DemoBand
        index="03"
        title="EditorialSplit"
        description="Asymmetric two-column split — 62/38 by default, never 50/50 — with content overhanging across the seam."
      >
        <EditorialSplit media={<PlaceholderMedia label="Media — 62% column" ratio="4/3" />} overhang>
          <p className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
            ratio: 62/38 · overhang
          </p>
          <p className="mt-3 text-heading font-heading font-medium">Content breaks the seam</p>
          <p className="mt-3 text-muted-foreground">
            With <code>overhang</code>, the content column pulls 14% into the
            media column at md+ instead of sitting flush against the gutter.
          </p>
        </EditorialSplit>
      </DemoBand>

      {/* 04 — OffsetGrid of 5 simple cards */}
      <DemoBand
        index="04"
        title="OffsetGrid"
        description="Broken grid — items share columns but start at staggered vertical offsets, killing the flat-top card wall."
      >
        <OffsetGrid columns={3}>
          {["One", "Two", "Three", "Four", "Five"].map((n, i) => (
            <div
              key={n}
              className="rounded-[var(--radius-lg)] border bg-card p-6 [border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]"
            >
              <p className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 font-heading text-lg font-medium">Card {n}</p>
            </div>
          ))}
        </OffsetGrid>
      </DemoBand>

      {/* 05 — BleedImage w/ PlaceholderMedia */}
      <DemoBand
        index="05"
        title="BleedImage"
        description="Full-bleed media band with an inset caption rail and restrained ±8% parallax."
      >
        <BleedImage caption="Full-bleed media band" credit="Placeholder media" height="24rem">
          {/* BleedImage's own sizing hooks (`[&>img]:h-full …`) target img/video
              tags; PlaceholderMedia renders a div, so it's stretched by hand
              here and its own border/radius are cancelled for a true bleed. */}
          <PlaceholderMedia label="Full-bleed placeholder" className="h-full w-full rounded-none border-0" />
        </BleedImage>
      </DemoBand>

      {/* 06 — CaptionRail variants */}
      <DemoBand
        index="06"
        title="CaptionRail"
        description="Mono overline + hairline rule system — section numbering, captions, meta. The connective tissue between sections."
      >
        <div className="flex flex-col gap-6">
          <CaptionRail label="rule: top · tone: muted (default)" meta="Meta text" rule="top" tone="muted" />
          <CaptionRail label="rule: bottom · tone: default" meta="04 / 09" rule="bottom" tone="default" />
          <CaptionRail label="rule: none — no hairline" rule="none" tone="muted" />
        </div>
      </DemoBand>

      {/* 07 — ScrollingText: 2 rows */}
      <DemoBand
        index="07"
        title="ScrollingText"
        description="Scroll-scrubbed kinetic type band — two opposing rows of display type moving with the page, not on a timer."
      >
        <ScrollingText
          rows={[
            { text: "Layout Design", direction: 1 },
            { text: "Not Blocks", direction: -1 },
          ]}
        />
      </DemoBand>

      {/* 08 — DeviceFrame: browser + phone */}
      <DemoBand
        index="08"
        title="DeviceFrame"
        description="Product-shot framing — browser chrome, phone shell, or bare panel with an ambient primary-tinted glow."
      >
        <div className="grid grid-cols-1 gap-[var(--content-gap)] md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              variant: browser
            </p>
            <DeviceFrame variant="browser" url="app.example.com/dashboard">
              <PlaceholderMedia variant="screenshot" label="Browser screenshot" ratio="16/10" />
            </DeviceFrame>
          </div>
          <div>
            <p className="mb-4 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              variant: phone
            </p>
            <DeviceFrame variant="phone">
              <PlaceholderMedia variant="screenshot" label="Phone screenshot" ratio="9/19" />
            </DeviceFrame>
          </div>
        </div>
      </DemoBand>

      {/* 09 — SectionShell: tones incl. inverted */}
      <div className="mt-[var(--content-gap)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
          <CaptionRail label="09 — SectionShell" meta="tone: default / card / inverted" />
          <p className="mb-[var(--content-gap)] mt-6 max-w-[60ch] text-sm text-muted-foreground">
            Standard section wrapper — token vertical rhythm, container +
            gutter, optional numbered rail, and three tone bands. Shown raw
            (not nested in another SectionShell) since the tone bands are the
            point.
          </p>
        </div>
        <SectionShell tone="default" rail={{ label: "Tone: default", meta: "bg-background" }}>
          <p className="text-heading font-heading font-medium">Default tone</p>
          <p className="mt-3 max-w-[48ch] text-muted-foreground">
            No background override — inherits the page background.
          </p>
        </SectionShell>
        <SectionShell tone="card" rail={{ label: "Tone: card", meta: "bg-card" }}>
          <p className="text-heading font-heading font-medium">Card tone</p>
          <p className="mt-3 max-w-[48ch] text-muted-foreground">
            Wraps the section in the card surface color.
          </p>
        </SectionShell>
        <SectionShell tone="inverted" rail={{ label: "Tone: inverted", meta: "bg-foreground" }}>
          <p className="text-heading font-heading font-medium">Inverted tone</p>
          <p className="mt-3 max-w-[48ch] text-muted-foreground">
            Flips foreground/background for a dramatic closing band — the
            rail label itself dims via the same tone-aware CSS the real
            sections use.
          </p>
        </SectionShell>
      </div>
    </div>
  );
}
