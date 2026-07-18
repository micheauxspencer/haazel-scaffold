import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import PlaceholderMedia from "@/app/showcase/_components/PlaceholderMedia";
import ProductHero from "@/components/sections/commerce/ProductHero";
import ProductGallery from "@/components/sections/commerce/ProductGallery";
import SpecsTable from "@/components/sections/commerce/SpecsTable";
import BundleCards from "@/components/sections/commerce/BundleCards";
import DropCountdown from "@/components/sections/commerce/DropCountdown";
import StickyBuyBar from "@/components/sections/commerce/StickyBuyBar";
import {
  productHeroFixture,
  productGalleryFixture,
  specsTableFixture,
  bundleCardsFixture,
  dropCountdownFixture,
  stickyBuyBarFixture,
} from "@/components/sections/commerce/fixtures";

/**
 * /showcase/commerce — the six single-product drop sections: hero, gallery,
 * specs, bundles, countdown, and the sticky buy bar. Content is fixture-only
 * (see commerce/fixtures.ts). Two deliberate overrides below: the countdown
 * target (the fixture's own target sits only 4 days out from today, too
 * close to real time to reliably demo by review) and the buy-bar's scroll
 * threshold (600px doesn't reliably occur on a single demo page).
 */

// Far-future placeholder so the countdown always demos live ticking digits
// instead of racing toward zero. Never derived from Date.now() — that would
// break SSR hydration and go stale.
const SHOWCASE_COUNTDOWN_TARGET = "2027-01-01T00:00:00Z";

// Tiny inline data-URI SVG swatch generator. fixtures.ts points
// ProductGallery at /demo/commerce/*.jpg files that don't exist under
// /public in this repo, so rendering the fixture's own `src` values verbatim
// would show broken images. Hex literals live ONLY inside this helper's SVG
// string, per the tokens-only rule everywhere else in the file.
function swatch(hex: string, tag: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='640' height='480' fill='${hex}'/><path d='M0 0 640 480M640 0 0 480' stroke='#000' stroke-opacity='0.08' stroke-width='2'/><text x='320' y='248' font-family='monospace' font-size='22' fill='#000' fill-opacity='0.35' text-anchor='middle'>${tag}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Six muted moss/olive tones for the gallery frames — the fixture's
// colorway is Moss — so the set reads as distinct front/back/detail/worn/
// flat shots rather than six repeats of the same placeholder.
const galleryTones: { hex: string; tag: string }[] = [
  { hex: "#6b715c", tag: "FRONT" },
  { hex: "#454a3a", tag: "BACK" },
  { hex: "#83876d", tag: "POCKET" },
  { hex: "#565c47", tag: "CUFF" },
  { hex: "#9a9c82", tag: "WORN" },
  { hex: "#3c4032", tag: "FLAT" },
];

const galleryImages = productGalleryFixture.images.map((image, i) => ({
  ...image,
  src: swatch(galleryTones[i % galleryTones.length].hex, galleryTones[i % galleryTones.length].tag),
}));

export default function CommerceShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="Commerce pack" meta="6 drop sections" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          Product drop,
          <span className="font-heading italic text-primary"> end to end</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Every section a single product page needs, from the oversized hero shot to the sticky buy bar at checkout.
        </p>
      </header>

      <ProductHero
        {...productHeroFixture}
        media={<PlaceholderMedia label="Heritage Quarter-Zip — Moss" ratio="4/3" variant="photo" />}
      />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-section">
        <ProductGallery {...productGalleryFixture} images={galleryImages} />
      </div>

      <SpecsTable {...specsTableFixture} />

      <BundleCards {...bundleCardsFixture} />

      <DropCountdown {...dropCountdownFixture} target={SHOWCASE_COUNTDOWN_TARGET} />

      <StickyBuyBar
        {...stickyBuyBarFixture}
        threshold={100}
        thumb={<img src={galleryImages[0].src} alt="" className="h-full w-full object-cover" />}
      />
    </div>
  );
}
