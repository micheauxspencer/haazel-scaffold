import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import PlaceholderMedia from "@/app/showcase/_components/PlaceholderMedia";

import LocalHero from "@/components/sections/leadgen/LocalHero";
import TrustBadges from "@/components/sections/leadgen/TrustBadges";
import ServiceCards from "@/components/sections/leadgen/ServiceCards";
import ProcessSteps from "@/components/sections/leadgen/ProcessSteps";
import BeforeAfterGallery from "@/components/sections/leadgen/BeforeAfterGallery";
import ReviewsWall from "@/components/sections/leadgen/ReviewsWall";
import ServiceAreaList from "@/components/sections/leadgen/ServiceAreaList";
import QuoteForm from "@/components/sections/leadgen/QuoteForm";

import {
  localHeroFixture,
  trustBadgesFixture,
  serviceCardsFixture,
  processStepsFixture,
  beforeAfterGalleryFixture,
  reviewsWallFixture,
  serviceAreaListFixture,
  quoteFormFixture,
} from "@/components/sections/leadgen/fixtures";

/**
 * /showcase/leadgen — the 8 lead-gen pack sections rendered in real
 * assembled-page order with fixture content from fixtures.ts. Dev-only
 * harness; pruned before client ship (SECTION_SPEC.md §1, see also
 * showcase/page.tsx). Each section wraps itself in SectionShell, so this
 * page renders the components directly — no extra demo-band chrome.
 */

// beforeAfterGalleryFixture.items[].before/after.src point at
// /demo/leadgen/*.jpg files that don't exist under /public — swap only the
// `src` fields for tiny inline data-URI SVG swatches so the slider shows
// real tonal contrast instead of a broken image. alt/label stay exactly as
// fixtures.ts wrote them.
function swatch(hex: string, tag: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='640' height='480' fill='${hex}'/><path d='M0 0 640 480M640 0 0 480' stroke='#000' stroke-opacity='0.08' stroke-width='2'/><text x='320' y='248' font-family='monospace' font-size='22' fill='#000' fill-opacity='0.35' text-anchor='middle'>${tag}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const beforeAfterItems = beforeAfterGalleryFixture.items.map((item) => ({
  ...item,
  before: { ...item.before, src: swatch("#9a8f7d", "BEFORE") },
  after: { ...item.after, src: swatch("#dbe3e6", "AFTER") },
}));

export default function LeadgenShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="Lead-gen pack" meta="8 conversion sections" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          Phone-forward pages
          <span className="font-heading italic text-primary"> built to convert</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Eight sections for local-service businesses — hero through quote
          form, trust signals built in at every step.
        </p>
      </header>

      <LocalHero
        {...localHeroFixture}
        media={<PlaceholderMedia label="Deck railing install photo" ratio="4/3" variant="photo" />}
      />

      <TrustBadges {...trustBadgesFixture} />

      <ServiceCards {...serviceCardsFixture} />

      <ProcessSteps {...processStepsFixture} />

      <BeforeAfterGallery {...beforeAfterGalleryFixture} items={beforeAfterItems} />

      <ReviewsWall {...reviewsWallFixture} />

      <ServiceAreaList {...serviceAreaListFixture} />

      <QuoteForm {...quoteFormFixture} />
    </div>
  );
}
