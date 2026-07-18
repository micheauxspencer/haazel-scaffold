/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 *
 * Deliberately neutral: no archetype-specific voice or invented brand
 * metrics, so these read fine as a stand-in for a cinematic, saas, app,
 * leadgen, commerce, or editorial page alike.
 */
import type { MegaFooterProps } from "./MegaFooter";
import type { AnnouncementBarProps } from "./AnnouncementBar";
import type { StatBandProps } from "./StatBand";
import type { ContactSplitProps } from "./ContactSplit";

export const megaFooterFixture: MegaFooterProps = {
  brandName: "Northline",
  columns: [
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      heading: "Product",
      links: [
        { label: "Overview", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Docs", href: "#" },
        { label: "Support", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
  ],
  newsletter: {
    heading: "Stay in the loop",
    description: "Occasional notes on what we're shipping. No spam.",
    placeholder: "you@email.com",
    buttonLabel: "Subscribe",
  },
  builtWith: "Built with Next.js",
  socials: [
    { platform: "Instagram", href: "#" },
    { platform: "LinkedIn", href: "#" },
    { platform: "Twitter", href: "#" },
  ],
};

export const announcementBarFixture: AnnouncementBarProps = {
  message: "Now booking for fall — limited availability.",
  href: "#",
  storageKey: "showcase-announcement",
  tone: "default",
};

export const statBandFixture: StatBandProps = {
  rail: { label: "By the numbers", meta: "Updated quarterly" },
  tone: "default",
  stats: [
    { value: 128, suffix: "+", label: "Projects shipped" },
    { value: 42, label: "Team members" },
    { value: 99, suffix: "%", label: "On-time delivery" },
    { value: 12, label: "Years operating" },
  ],
};

export const contactSplitFixture: ContactSplitProps = {
  rail: { label: "Get in touch", meta: "Usually reply within a day" },
  heading: "Tell us about your project",
  info: {
    email: "hello@northline.co",
    phone: "(416) 555-0199",
    address: "88 Queen St W, Toronto, ON",
  },
  hours: [
    { label: "Mon – Fri", value: "9am – 6pm" },
    { label: "Sat", value: "10am – 2pm" },
    { label: "Sun", value: "Closed" },
  ],
  socials: [
    { platform: "Instagram", href: "#" },
    { platform: "LinkedIn", href: "#" },
  ],
};
