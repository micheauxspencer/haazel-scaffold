/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 *
 * Flavor: a fictional GTA aluminum/glass railings company. All reviews,
 * ratings, and review counts below are placeholder demo content — clearly
 * labelled as such — never real testimonials. Swap for verified Google
 * reviews before shipping a client build.
 */
import type { LocalHeroProps } from "./LocalHero";
import type { ServiceCardsProps } from "./ServiceCards";
import type { ProcessStepsProps } from "./ProcessSteps";
import type { ReviewsWallProps } from "./ReviewsWall";
import type { QuoteFormProps } from "./QuoteForm";
import type { BeforeAfterGalleryProps } from "./BeforeAfterGallery";
import type { ServiceAreaListProps } from "./ServiceAreaList";
import type { TrustBadgesProps } from "./TrustBadges";

const SERVICES = [
  {
    title: "Aluminum Railings",
    description:
      "Powder-coated aluminum railings for decks, porches, and stairs — low-maintenance and built for GTA winters.",
    href: "#",
    priceFrom: 1800,
  },
  {
    title: "Glass Railings",
    description:
      "Frameless and semi-frameless glass systems that keep sightlines open on decks, balconies, and pool surrounds.",
    href: "#",
    priceFrom: 2600,
  },
  {
    title: "Deck & Stair Railings",
    description: "Code-compliant railings engineered to match your deck's exact rise, run, and post spacing.",
    href: "#",
    priceFrom: 1500,
  },
  {
    title: "Pool Enclosures",
    description: "Self-closing gates and pool-code fencing in aluminum or glass, inspected and permit-ready.",
    href: "#",
    priceFrom: 3200,
  },
  {
    title: "Balcony Railings",
    description:
      "High-rise and low-rise balcony railing replacement, coordinated with property management and condo boards.",
    href: "#",
    priceFrom: 2100,
  },
  {
    title: "Railing Repair & Restoration",
    description: "Loose posts, failed welds, cloudy glass — we repair existing railings or restore them to like-new.",
    href: "#",
    priceFrom: 350,
  },
];

const SERVICE_NAMES = SERVICES.map((s) => s.title);

export const localHeroFixture: Omit<LocalHeroProps, "media"> = {
  eyebrow: "Aluminum & glass railings — GTA",
  headline: { primary: "Railings built for", overlay: "how you live", secondary: "outside" },
  description:
    "GTA Railings Co. designs, fabricates, and installs aluminum and glass railings for decks, stairs, balconies, and pools — free on-site quotes, most installs completed in a day.",
  serviceAreas: ["Toronto", "Vaughan", "Markham"],
  phone: { display: "(416) 555-0134", href: "tel:+14165550134" },
  quoteCta: { label: "Get a free quote", href: "#quote" },
  trustChips: [
    { label: "Licensed & insured", icon: "shield" },
    { label: "WSIB covered", icon: "check" },
    { label: "15+ years", icon: "star" },
  ],
  mediaCaption: "Frameless glass railing — Vaughan deck install",
};

export const serviceCardsFixture: ServiceCardsProps = {
  rail: { label: "01 — Services", meta: "6 railing systems" },
  heading: "Railings, fabricated and installed in-house",
  intro: "Every job is measured, engineered, and welded at our Vaughan shop — nothing subcontracted.",
  services: SERVICES,
};

export const processStepsFixture: ProcessStepsProps = {
  rail: { label: "02 — Process", meta: "Quote to install" },
  heading: "From measure to walkthrough in four steps",
  intro: "Most residential jobs go from first call to finished install in two to three weeks.",
  steps: [
    {
      title: "Free on-site consultation",
      description:
        "We measure your deck, stairs, or balcony and talk through aluminum vs. glass, code requirements, and budget.",
      meta: "Same-week booking",
    },
    {
      title: "Custom design & fixed quote",
      description: "You get a line-item quote and a shop drawing before anything is fabricated — no surprise change orders.",
      meta: "48-hour turnaround",
    },
    {
      title: "In-house fabrication",
      description: "Aluminum is cut, welded, and powder-coated at our shop; glass panels are ordered to your exact spec.",
      meta: "1–2 weeks",
    },
    {
      title: "Install & final walkthrough",
      description: "Our crew installs, cleans up, and walks the site with you before calling the job done.",
      meta: "Most jobs: 1 day",
    },
  ],
};

export const reviewsWallFixture: ReviewsWallProps = {
  rail: { label: "03 — Reviews", meta: "Google" },
  heading: "What GTA homeowners say",
  intro: "A sample of recent jobs — every review below is placeholder demo content.",
  demoNotice: "Demo review — replace with real Google reviews before launch.",
  reviews: [
    {
      quote:
        "The glass railing completely changed how our deck feels — no more sightline blocked by pickets. Crew was in and out in a day and left the site cleaner than they found it.",
      author: "Priya S. (Demo review)",
      source: "Google Reviews",
      rating: 5,
      date: "March 2026",
    },
    {
      quote: "Quote matched the final invoice exactly. No add-ons, no surprises.",
      author: "Mark D. (Demo review)",
      source: "Google Reviews",
      rating: 5,
      date: "February 2026",
    },
    {
      quote: "Fixed a wobbly stair railing another company installed. Fast, fair price, showed up on time.",
      author: "Lauren K. (Demo review)",
      source: "Google Reviews",
      rating: 4,
      date: "January 2026",
    },
    {
      quote: "Pool enclosure passed inspection on the first try. They handled the permit paperwork for us.",
      author: "Two Rivers Property Mgmt (Demo review)",
      source: "Google Reviews",
      rating: 5,
      date: "November 2025",
    },
  ],
};

export const quoteFormFixture: QuoteFormProps = {
  rail: { label: "04 — Get a quote", meta: "Reply within 1 business day" },
  heading: "Request your free quote",
  intro: "Tell us about the project — we'll follow up by phone or email with next steps.",
  services: SERVICE_NAMES,
  phone: { display: "(416) 555-0134", href: "tel:+14165550134" },
  address: "184 Bramalea Rd, Vaughan, ON",
  trustPoints: [
    "Free on-site measure and quote",
    "Fixed pricing before we start",
    "Licensed, insured, WSIB covered",
    "Most installs completed in a day",
  ],
};

export const beforeAfterGalleryFixture: BeforeAfterGalleryProps = {
  rail: { label: "05 — Recent work", meta: "Drag to compare" },
  heading: "Before and after",
  intro: "A few recent railing replacements across the GTA.",
  items: [
    {
      before: { src: "/demo/leadgen/railing-deck-before.jpg", alt: "Weathered wood deck railing before replacement" },
      after: { src: "/demo/leadgen/railing-deck-after.jpg", alt: "New aluminum deck railing after installation" },
      label: "Wood picket → aluminum, Markham",
    },
    {
      before: { src: "/demo/leadgen/railing-glass-before.jpg", alt: "Old iron balcony railing before replacement" },
      after: { src: "/demo/leadgen/railing-glass-after.jpg", alt: "Frameless glass balcony railing after installation" },
      label: "Iron → frameless glass, Toronto",
    },
    {
      before: { src: "/demo/leadgen/railing-pool-before.jpg", alt: "Pool area with no fencing before installation" },
      after: { src: "/demo/leadgen/railing-pool-after.jpg", alt: "Pool enclosure with glass fencing after installation" },
      label: "Pool enclosure, Richmond Hill",
    },
  ],
};

export const serviceAreaListFixture: ServiceAreaListProps = {
  rail: { label: "06 — Service area", meta: "GTA" },
  heading: "Where we install",
  intro: "Based in Vaughan, serving the Greater Toronto Area.",
  countLabel: "jobs this year",
  areas: [
    { city: "Toronto", href: "#", count: 62 },
    { city: "Vaughan", href: "#", count: 48 },
    { city: "Markham", href: "#", count: 31 },
    { city: "Richmond Hill", href: "#", count: 27 },
    { city: "Mississauga", href: "#", count: 24 },
    { city: "Brampton", href: "#", count: 19 },
    { city: "Oakville", href: "#", count: 15 },
    { city: "Aurora", href: "#", count: 12 },
    { city: "Newmarket", href: "#", count: 11 },
    { city: "Whitby", href: "#", count: 8 },
  ],
};

export const trustBadgesFixture: TrustBadgesProps = {
  rail: { label: "07 — Trust", meta: "Credentials" },
  heading: "Why GTA homeowners choose us",
  tone: "card",
  badges: [
    { label: "Licensed & insured", sublabel: "ON #123456 (demo)" },
    { label: "WSIB covered", sublabel: "Clearance on request" },
    { label: "15+ years in business", sublabel: "Est. 2011" },
    { label: "4.9★ Google rating", sublabel: "140+ reviews (demo figure)" },
  ],
};
