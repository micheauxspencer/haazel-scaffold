import Link from "next/link";
import CaptionRail from "@/components/primitives/CaptionRail";

/**
 * /showcase — the living catalog + QA harness. Renders every library
 * component with fixture content, one pack per route (34 scroll-triggered
 * modules on one page would fight each other). ALWAYS removed by
 * `npm run prune --write`; excluded from sitemap.ts by design.
 */

const packs = [
  { slug: "primitives", label: "Layout primitives", note: "9 — the anti-generic layer" },
  { slug: "cinematic", label: "Cinematic modules", note: "35 GSAP modules, paginated" },
  { slug: "saas", label: "SaaS pack", note: "11 marketing sections" },
  { slug: "app", label: "App pack", note: "8 dashboard components" },
  { slug: "leadgen", label: "Lead-gen pack", note: "8 conversion sections" },
  { slug: "commerce", label: "Commerce pack", note: "6 drop sections" },
  { slug: "shared", label: "Shared pack", note: "4 cross-archetype sections" },
];

export default function ShowcaseIndex() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-section">
      <CaptionRail label="Haazel showcase" meta="dev harness — pruned from client builds" />
      <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
        The component
        <span className="font-heading italic text-primary"> catalog</span>
      </h1>
      <p className="mt-6 max-w-[48ch] text-muted-foreground">
        Every component rendered with fixture content. Use it to review packs,
        test reduced motion, and QA at 375px. Source of truth:
        src/components/COMPONENT_CATALOG.md.
      </p>

      <ul className="mt-[var(--content-gap)] divide-y divide-[color-mix(in_oklab,var(--foreground)_10%,transparent)] border-y [border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]">
        {packs.map((pack, i) => (
          <li key={pack.slug}>
            <Link
              href={`/showcase/${pack.slug}`}
              className="group flex items-baseline justify-between gap-6 py-6 transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
            >
              <span className="flex items-baseline gap-6">
                <span className="font-mono text-overline text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-heading font-heading font-medium">{pack.label}</span>
              </span>
              <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground group-hover:text-primary">
                {pack.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
