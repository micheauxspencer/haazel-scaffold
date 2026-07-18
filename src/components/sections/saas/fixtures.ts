/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 */
import type { SaasHeroProps } from "./SaasHero";
import type { PricingTableProps } from "./PricingTable";
import type { LogoCloudProps } from "./LogoCloud";
import type { FeatureBentoProps } from "./FeatureBento";
import type { FeatureTabsProps, FeatureTabsItem } from "./FeatureTabs";
import type { ComparisonTableProps } from "./ComparisonTable";
import type { TestimonialWallProps } from "./TestimonialWall";
import type { IntegrationsGridProps } from "./IntegrationsGrid";
import type { MetricsBandProps } from "./MetricsBand";
import type { FaqCompactProps } from "./FaqCompact";
import type { CtaPanelProps } from "./CtaPanel";

export const saasHeroFixture: Omit<SaasHeroProps, "media"> = {
  announcement: { label: "Series A — we raised $12M", href: "#" },
  eyebrow: "Bookings infrastructure",
  headline: { primary: "Fill every", overlay: "weekend", secondary: "on autopilot" },
  description:
    "VendorSpace routes applications, contracts, and payouts through one pipeline so organizers spend Saturdays at the market, not in a spreadsheet.",
  primaryCta: { label: "Start free", href: "#" },
  secondaryCta: { label: "Watch the 90-second tour", href: "#" },
  stats: [
    { value: "38k", label: "bookings" },
    { value: "12hr", label: "saved weekly" },
    { value: "99.98%", label: "uptime" },
  ],
  mediaUrl: "app.vendorspace.io/dashboard",
};

export const pricingFixture: PricingTableProps = {
  rail: { label: "03 — Pricing", meta: "No card required" },
  heading: "Priced for the season, not the seat",
  intro: "Start free while you set up. Upgrade when applications open.",
  currency: "$",
  annualNote: "2 months free",
  footnote: "* All plans include unlimited vendors and Stripe payouts.",
  plans: [
    {
      name: "Market",
      tagline: "One venue, one team",
      monthly: 49,
      annual: 39,
      unit: "/mo",
      features: [
        "Unlimited vendor applications",
        "Automated waitlists",
        "Stripe payouts",
        "Email support",
      ],
      cta: { label: "Start with Market", href: "#" },
    },
    {
      name: "Festival",
      tagline: "Multi-venue operators",
      monthly: 129,
      annual: 99,
      unit: "/mo",
      featured: true,
      features: [
        "Everything in Market",
        "Multi-venue calendars",
        "Contract e-sign",
        "Priority payouts",
        "Phone support",
      ],
      cta: { label: "Start with Festival", href: "#" },
    },
    {
      name: "Enterprise",
      tagline: "Cities and event groups",
      monthly: "Custom",
      features: [
        "Everything in Festival",
        "SSO and audit logs",
        "Dedicated onboarding",
        "SLA + uptime credits",
      ],
      cta: { label: "Talk to sales", href: "#" },
    },
  ],
};

export const logoCloudFixture: LogoCloudProps = {
  rail: { label: "02 — Trusted by", meta: "400+ organizers" },
  label: "Trusted by 400+ market and festival organizers",
  logos: [
    { name: "Northfield Makers Market" },
    { name: "Harbor City Festival Co." },
    { name: "Union Square Vendors" },
    { name: "Riverside Craft Collective" },
    { name: "Old Mill Night Market" },
    { name: "Prairie Fairgrounds Group" },
  ],
};

export const featureBentoFixture: FeatureBentoProps = {
  rail: { label: "02 — Platform", meta: "5 modules" },
  heading: "Every piece of the season, in one pipeline",
  intro:
    "From first application to final payout, VendorSpace replaces the spreadsheet-and-email stack most organizers are still running on.",
  items: [
    {
      tag: "Applications",
      title: "Applications sort themselves",
      description:
        "Vendors apply once; rules route them to the right market, waitlist, or category cap automatically.",
    },
    {
      tag: "Payouts",
      title: "Stripe payouts, same day",
      description: "Vendor payouts release the day the market closes, not the following week.",
    },
    {
      tag: "Contracts",
      title: "Contracts, e-signed in app",
      description: "No PDFs in email threads — contracts send, sign, and file themselves.",
    },
    {
      tag: "Calendars",
      title: "Multi-venue calendars",
      description: "One calendar view across every market you run, color-coded by venue.",
    },
    {
      tag: "Messaging",
      title: "Bulk vendor messaging",
      description: "Push a schedule change to 200 vendors in one send, not 200 emails.",
    },
  ],
};

/**
 * FeatureTabsItem.media is a required ReactNode, but this file is plain
 * .ts (no JSX) — same reason saasHeroFixture omits `media` above. The
 * showcase page supplies real media per tab at render time.
 */
export const featureTabsFixture: Omit<FeatureTabsProps, "items"> & {
  items: Omit<FeatureTabsItem, "media">[];
} = {
  rail: { label: "04 — Product tour", meta: "4 workflows" },
  heading: "One tour, four jobs done",
  intro: "Click through the workflows organizers run every week — applications, payouts, calendars, and messaging.",
  mediaUrl: "app.vendorspace.io/dashboard",
  items: [
    { label: "Applications", description: "Review, approve, and waitlist from one queue." },
    { label: "Payouts", description: "Stripe payouts release the day the market closes." },
    { label: "Calendars", description: "Every venue's schedule in one color-coded view." },
    { label: "Messaging", description: "Bulk-message vendors without leaving the app." },
  ],
};

export const comparisonTableFixture: ComparisonTableProps = {
  rail: { label: "05 — Compare", meta: "vs. spreadsheets & DIY" },
  heading: "What you stop doing by hand",
  intro: "A side-by-side against the two ways most organizers run vendor ops before VendorSpace.",
  columns: [{ name: "Spreadsheet + email" }, { name: "Generic form tools" }, { name: "VendorSpace", highlight: true }],
  rows: [
    { feature: "Vendor applications", values: [true, true, true] },
    { feature: "Automated waitlists", values: [false, false, true] },
    { feature: "Stripe payouts built in", values: [false, false, true] },
    { feature: "Contract e-signatures", values: [false, "Add-on", true] },
    { feature: "Multi-venue calendars", values: [false, false, true] },
    { feature: "Setup time", values: ["2-3 weeks", "3-5 days", "Same day"] },
  ],
  footnote: "Comparison reflects typical organizer workflows as of the 2026 season.",
};

export const testimonialWallFixture: TestimonialWallProps = {
  rail: { label: "06 — Testimonials", meta: "From organizers" },
  featured: {
    quote:
      "We ran four markets last season on one login. Payouts that used to eat a full Sunday now clear before we've broken down the tents.",
    name: "Maya R.",
    role: "Market Director",
    company: "Northfield Makers Market",
  },
  supporting: [
    {
      quote: "Waitlists used to be a shared spreadsheet. Now they fill themselves.",
      name: "Devon L.",
      role: "Operations Lead",
      company: "Harbor City Festival Co.",
    },
    {
      quote: "Our vendors stopped emailing us for contracts. They just sign in the app.",
      name: "Priya K.",
      role: "Founder",
      company: "Union Square Vendors",
    },
    {
      quote: "Switching saved us roughly 12 hours a week across three organizers.",
      name: "Sam T.",
      role: "Events Manager",
      company: "Riverside Craft Collective",
    },
  ],
};

export const integrationsGridFixture: IntegrationsGridProps = {
  rail: { label: "07 — Integrations", meta: "12 and counting" },
  heading: "Plugs into the tools you already run",
  intro: "VendorSpace sits alongside your payment, comms, and accounting stack instead of replacing it.",
  columns: 4,
  integrations: [
    { name: "Stripe", description: "Payouts and vendor invoicing." },
    { name: "Mailchimp", description: "Sync applicant and vendor lists." },
    { name: "Google Calendar", description: "Two-way sync for every venue." },
    { name: "QuickBooks", description: "Export payouts for reconciliation." },
    { name: "Slack", description: "Application alerts in your team channel." },
    { name: "Zapier", description: "Connect 3,000+ apps without code." },
    { name: "DocuSign", description: "Fallback e-sign for legacy contracts." },
    { name: "Twilio", description: "SMS reminders for vendor deadlines." },
  ],
};

/**
 * MetricsBandStat.value is a whole number (OdometerCounter rolls digits
 * individually); decimals/commas live in `suffix` instead — e.g. 99 + ".98%"
 * renders "99.98%" with only the "99" animating.
 */
export const metricsBandFixture: MetricsBandProps = {
  rail: { label: "03 — By the numbers", meta: "2026 season" },
  heading: "The season, in numbers",
  stats: [
    { value: 2400, suffix: "+", label: "Vendors booked this season" },
    { value: 38, suffix: "K", label: "Applications processed" },
    { value: 12, suffix: "hrs", label: "Saved weekly per organizer" },
    { value: 99, suffix: ".98%", label: "Payout uptime" },
  ],
};

export const faqCompactFixture: FaqCompactProps = {
  rail: { label: "08 — FAQ", meta: "Common questions" },
  heading: "Questions organizers ask before switching",
  intro: "Can't find yours? The team answers every ticket within one business day.",
  items: [
    {
      q: "How long does setup actually take?",
      a: "Most organizers are booking their first vendor within a day. Import your existing vendor list via CSV, set your application rules, and connect Stripe — no migration project required.",
    },
    {
      q: "Do vendors need to create an account?",
      a: "Yes, but it takes under two minutes. Vendors get a free account to apply, sign contracts, and track their own payout history across every organizer that uses VendorSpace.",
    },
    {
      q: "What happens to payments if a market is cancelled?",
      a: "Refunds route back through the same Stripe payout pipeline automatically. You can issue full, partial, or credit-based refunds from the dashboard without touching a spreadsheet.",
    },
    {
      q: "Can I run multiple venues from one account?",
      a: "Yes — the Festival and Enterprise plans support unlimited venues with separate calendars, application rules, and payout schedules under one login.",
    },
    {
      q: "Is there a contract, or can I cancel monthly?",
      a: "All plans are month-to-month by default. Annual billing is available at a discount, but nothing locks you into a season you haven't started yet.",
    },
  ],
};

export const ctaPanelFixture: CtaPanelProps = {
  rail: { label: "09 — Get started", meta: "Free to start" },
  tone: "inverted",
  headline: { primary: "Ready to run", overlay: "smoother", secondary: "markets this season?" },
  description: "Set up your first market in an afternoon. No credit card, no sales call required.",
  primaryCta: { label: "Start free", href: "#" },
  secondaryCta: { label: "Book a 15-minute demo", href: "#" },
  microcopy: "Free for your first market — upgrade when applications open.",
};
