import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import PlaceholderMedia from "@/app/showcase/_components/PlaceholderMedia";

import SaasHero from "@/components/sections/saas/SaasHero";
import LogoCloud from "@/components/sections/saas/LogoCloud";
import FeatureBento from "@/components/sections/saas/FeatureBento";
import MetricsBand from "@/components/sections/saas/MetricsBand";
import FeatureTabs from "@/components/sections/saas/FeatureTabs";
import ComparisonTable from "@/components/sections/saas/ComparisonTable";
import TestimonialWall from "@/components/sections/saas/TestimonialWall";
import IntegrationsGrid from "@/components/sections/saas/IntegrationsGrid";
import PricingTable from "@/components/sections/saas/PricingTable";
import FaqCompact from "@/components/sections/saas/FaqCompact";
import CtaPanel from "@/components/sections/saas/CtaPanel";

import {
  saasHeroFixture,
  logoCloudFixture,
  featureBentoFixture,
  metricsBandFixture,
  featureTabsFixture,
  comparisonTableFixture,
  testimonialWallFixture,
  integrationsGridFixture,
  pricingFixture,
  faqCompactFixture,
  ctaPanelFixture,
} from "@/components/sections/saas/fixtures";

/**
 * /showcase/saas — the 11 SaaS marketing sections rendered back to back
 * with fixture content, in real shipping order (hero through closing CTA).
 * Each section owns its own SectionShell (numbered rail + vertical rhythm
 * per SECTION_SPEC.md §1), so this page adds no extra wrapper chrome.
 * Dev-only harness — pruned before client ship, excluded from sitemap.ts.
 */
export default function SaasShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="SaaS pack" meta="11 marketing sections" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          The full funnel
          <span className="font-heading italic text-primary"> in one scroll</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          All eleven SaaS marketing sections, rendered in shipping order — hero through closing CTA.
        </p>
      </header>

      <SaasHero
        {...saasHeroFixture}
        media={<PlaceholderMedia variant="screenshot" label="VendorSpace dashboard" ratio="16/10" />}
      />

      <LogoCloud {...logoCloudFixture} />

      <FeatureBento
        {...featureBentoFixture}
        items={featureBentoFixture.items.map((item, i) => ({
          ...item,
          media: (
            <PlaceholderMedia
              variant="screenshot"
              ratio={i === 0 ? "16/10" : "4/3"}
              label={`${item.tag ?? item.title} screenshot`}
            />
          ),
        }))}
      />

      <MetricsBand {...metricsBandFixture} />

      <FeatureTabs
        {...featureTabsFixture}
        items={featureTabsFixture.items.map((item) => ({
          ...item,
          media: (
            <PlaceholderMedia variant="screenshot" ratio="16/10" label={`${item.label} workflow screenshot`} />
          ),
        }))}
      />

      <ComparisonTable {...comparisonTableFixture} />

      <TestimonialWall {...testimonialWallFixture} />

      <IntegrationsGrid {...integrationsGridFixture} />

      <PricingTable {...pricingFixture} />

      <FaqCompact {...faqCompactFixture} />

      <CtaPanel {...ctaPanelFixture} />
    </div>
  );
}
