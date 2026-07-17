/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 */
import type { SaasHeroProps } from "./SaasHero";
import type { PricingTableProps } from "./PricingTable";

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
