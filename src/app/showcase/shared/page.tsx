import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import AnnouncementBar from "@/components/sections/shared/AnnouncementBar";
import StatBand from "@/components/sections/shared/StatBand";
import ContactSplit from "@/components/sections/shared/ContactSplit";
import MegaFooter from "@/components/sections/shared/MegaFooter";
import {
  announcementBarFixture,
  statBandFixture,
  contactSplitFixture,
  megaFooterFixture,
} from "@/components/sections/shared/fixtures";

const STAT_BAND_TONES = ["default", "card", "inverted"] as const;

/**
 * /showcase/shared — the 4 cross-archetype sections. Fit constraint per
 * SECTION_SPEC.md §7: every entry here must work, unstyled-per-archetype,
 * across cinematic / saas / app / leadgen / commerce / editorial alike.
 */
export default function SharedShowcase() {
  return (
    <div>
      {/* AnnouncementBar is deliberately-outside-SectionShell utility chrome
          (SECTION_SPEC / shared.md) — it belongs at the absolute top of the
          page, above even the header, matching how it sits on a real site. */}
      <AnnouncementBar {...announcementBarFixture} storageKey="showcase-demo" />

      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="Shared pack" meta="4 cross-archetype sections" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          Works everywhere,
          <span className="font-heading italic text-primary"> styled nowhere</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Strictly token-driven, no archetype-specific styling — these four
          sections have to sit comfortably in a cinematic page or an app
          dashboard alike.
        </p>
      </header>

      {/* StatBand tones — same fixture content, tone swapped per instance */}
      {STAT_BAND_TONES.map((tone) => (
        <StatBand
          key={tone}
          {...statBandFixture}
          tone={tone}
          rail={statBandFixture.rail ? { ...statBandFixture.rail, meta: `tone: ${tone}` } : undefined}
        />
      ))}

      <ContactSplit {...contactSplitFixture} />

      {/* MegaFooter at page end, tone inverted (also this component's own default) */}
      <MegaFooter {...megaFooterFixture} tone="inverted" />
    </div>
  );
}
