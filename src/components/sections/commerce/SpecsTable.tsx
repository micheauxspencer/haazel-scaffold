import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface SpecRow {
  label: string;
  value: string;
  /** Small secondary note rendered beside the value ("true to size"). */
  detail?: string;
}

export interface SpecsTableProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading?: string;
  intro?: string;
  specs: SpecRow[];
  /** Optional row below the list linking to a spec sheet / size chart PDF. */
  download?: { label: string; href: string };
  className?: string;
}

/**
 * The spec sheet: a definition list rendered as hairline-ruled mono rows —
 * label left (overline mono), value right (tabular mono). No icons, no
 * cards; the restraint is the point on a materials/fit breakdown.
 */
export default function SpecsTable({
  id = "specs",
  rail,
  heading,
  intro,
  specs,
  download,
  className = "",
}: SpecsTableProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      {(heading || intro) && (
        <div className="mb-[var(--content-gap)] max-w-xl">
          {heading && <h2 className="text-heading font-heading font-medium">{heading}</h2>}
          {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        </div>
      )}

      <CaptionRail label="Spec sheet" meta={`${specs.length} details`} rule="bottom" className="mb-2" />

      <dl
        className={cn(
          "divide-y border-b",
          "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
          "divide-[color-mix(in_oklab,var(--foreground)_12%,transparent)]",
        )}
      >
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 py-4"
          >
            <dt className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              {spec.label}
            </dt>
            <dd className="text-right font-mono tabular-nums text-foreground">
              {spec.value}
              {spec.detail && (
                <span className="ml-3 text-sm text-muted-foreground">{spec.detail}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {download && (
        <a
          href={download.href}
          className={cn(
            "mt-[var(--content-gap)] inline-flex min-h-11 items-center gap-2",
            "font-mono text-overline uppercase tracking-[0.14em] text-foreground",
            "underline decoration-[color-mix(in_oklab,var(--foreground)_30%,transparent)] underline-offset-4",
            "transition-colors [transition-timing-function:var(--ease-standard)] hover:decoration-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          {download.label}
        </a>
      )}
    </SectionShell>
  );
}
