import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface ServiceArea {
  city: string;
  href: string;
  count?: number;
}

export interface ServiceAreaListProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  areas: ServiceArea[];
  /** Unit label for the optional count ("jobs completed", "projects"). */
  countLabel?: string;
  className?: string;
}

/**
 * Programmatic-SEO city directory: a magazine-style multi-column list (CSS
 * `columns`, not a card grid) so a long area list reads as a reference index.
 * CaptionRail totals the list — the primitive move beyond SectionShell.
 */
export default function ServiceAreaList({
  id,
  rail,
  heading,
  intro,
  areas,
  countLabel,
  className = "",
}: ServiceAreaListProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <CaptionRail
        label={`${areas.length} service ${areas.length === 1 ? "area" : "areas"}`}
        rule="top"
        className="mt-[var(--content-gap)] mb-[var(--tight-gap)]"
      />

      <ul className="columns-1 gap-x-[var(--gutter)] sm:columns-2 md:columns-3">
        {areas.map((area) => (
          <li key={area.city} className="break-inside-avoid">
            <a
              href={area.href}
              className={cn(
                "flex min-h-11 items-center justify-between gap-4 border-b",
                "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
                "font-mono text-sm uppercase tracking-[0.08em] text-foreground",
                "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <span>{area.city}</span>
              {area.count !== undefined && (
                <span className="font-mono text-xs normal-case tracking-normal text-muted-foreground">
                  {area.count}
                  {countLabel ? ` ${countLabel}` : ""}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
