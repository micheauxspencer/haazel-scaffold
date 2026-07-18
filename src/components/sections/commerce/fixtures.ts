/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 *
 * Demo brand: The Classic Tee — a heritage golf-apparel drop. CAD pricing.
 */
import type { ProductHeroProps } from "./ProductHero";
import type { StickyBuyBarProps } from "./StickyBuyBar";
import type { SpecsTableProps } from "./SpecsTable";
import type { ProductGalleryProps } from "./ProductGallery";
import type { DropCountdownProps } from "./DropCountdown";
import type { BundleCardsProps } from "./BundleCards";

export const productHeroFixture: Omit<ProductHeroProps, "media"> = {
  rail: { label: "01 — Drop 002", meta: "The Classic Tee" },
  badge: "Drop 002 — live now",
  eyebrow: "Heritage golf apparel",
  headline: { primary: "Heritage Quarter-Zip", overlay: "Moss", secondary: "Merino wool, drop 002" },
  description:
    "Midweight merino quarter-zip in a heritage fit. Four-way stretch, brushed interior, snap chest pocket. Runs true to size.",
  price: { amount: "148", symbol: "$", currency: "CAD" },
  availability: "Ships in 3 days · 14 left",
  primaryCta: { label: "Add to bag", href: "#" },
  secondaryCta: { label: "Size guide", href: "#" },
};

export const stickyBuyBarFixture: Omit<StickyBuyBarProps, "thumb"> = {
  product: { name: "Heritage Quarter-Zip — Moss", price: "CAD $148" },
  cta: { label: "Add to bag", href: "#" },
  threshold: 600,
};

export const specsTableFixture: SpecsTableProps = {
  rail: { label: "02 — Specs", meta: "The Classic Tee" },
  heading: "Materials and fit",
  intro: "Everything measured before it shipped, not after a complaint.",
  specs: [
    { label: "Fabric", value: "100% merino wool", detail: "320 gsm" },
    { label: "Fit", value: "Heritage regular", detail: "true to size" },
    { label: "Pocket", value: "Snap chest pocket" },
    { label: "Collar", value: "Rib-knit half-zip" },
    { label: "Care", value: "Hand wash cold", detail: "lay flat to dry" },
    { label: "Origin", value: "Knit in Prince Edward County, ON" },
  ],
  download: { label: "Download size chart (PDF)", href: "#" },
};

export const productGalleryFixture: ProductGalleryProps = {
  images: [
    { src: "/demo/commerce/classic-tee-quarter-zip-01-front.jpg", alt: "Heritage Quarter-Zip in Moss, front" },
    { src: "/demo/commerce/classic-tee-quarter-zip-02-back.jpg", alt: "Heritage Quarter-Zip in Moss, back" },
    { src: "/demo/commerce/classic-tee-quarter-zip-03-pocket.jpg", alt: "Snap chest pocket detail" },
    { src: "/demo/commerce/classic-tee-quarter-zip-04-cuff.jpg", alt: "Rib-knit cuff detail" },
    { src: "/demo/commerce/classic-tee-quarter-zip-05-worn.jpg", alt: "Heritage Quarter-Zip worn on course" },
    { src: "/demo/commerce/classic-tee-quarter-zip-06-flat.jpg", alt: "Heritage Quarter-Zip folded flat, Moss colorway" },
  ],
};

export const dropCountdownFixture: Omit<DropCountdownProps, "live"> = {
  rail: { label: "03 — Countdown", meta: "The Classic Tee" },
  target: "2026-07-21T20:00:00-04:00",
  label: "Drop 002 closes in",
};

export const bundleCardsFixture: BundleCardsProps = {
  rail: { label: "04 — Bundles", meta: "Save when you stock up" },
  heading: "Build the kit",
  intro: "Same drop, packaged for the bag or the locker.",
  currency: "$",
  footnote: "* Bundle pricing applies at checkout. CAD, taxes calculated at cart.",
  bundles: [
    {
      name: "Quarter-Zip Only",
      tagline: "Just the piece",
      items: ["Heritage Quarter-Zip", "Care card"],
      price: "148",
      cta: { label: "Add to bag", href: "#" },
    },
    {
      name: "The Course Set",
      tagline: "Quarter-zip, cap, towel",
      items: ["Heritage Quarter-Zip", "Merino cap", "Waffle towel"],
      price: "212",
      compareAt: "238",
      savingsLabel: "Save $26",
      featured: true,
      cta: { label: "Add to bag", href: "#" },
    },
    {
      name: "Locker Bundle",
      tagline: "Everything from drop 002",
      items: ["Heritage Quarter-Zip", "Merino cap", "Waffle towel", "Travel pouch"],
      price: "268",
      compareAt: "306",
      savingsLabel: "Save $38",
      cta: { label: "Add to bag", href: "#" },
    },
  ],
};
