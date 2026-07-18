import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface ComparisonColumn {
  name: string;
  /** Visually highlighted as "ours" — continuous primary border + card fill. */
  highlight?: boolean;
}

export interface ComparisonRow {
  feature: string;
  /** One entry per column, aligned by index. Boolean renders check/x; string renders as mono text. */
  values: (boolean | string)[];
}

export interface ComparisonTableProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  footnote?: string;
  className?: string;
}

const hairline = "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]";
const primaryX = "border-x [border-left-color:var(--primary)] [border-right-color:var(--primary)]";
const primaryTop = "border-t [border-top-color:var(--primary)]";
const primaryBottom = "border-b [border-bottom-color:var(--primary)]";

/**
 * Us-vs-them comparison. Hand-rolled <table> rather than ui/table so the
 * highlighted "ours" column can carry a continuous primary border + card
 * fill down its full height — border-separate (not collapse) so the
 * highlighted column's top/bottom corner radius actually renders instead
 * of being silently dropped by collapsed borders. Wrapped in an
 * overflow-x-auto strip with a min-width table so it degrades to
 * horizontal scroll instead of squeezing columns on mobile.
 */
export default function ComparisonTable({
  id = "compare",
  rail,
  heading,
  intro,
  columns,
  rows,
  footnote,
  className = "",
}: ComparisonTableProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <figure>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th
                  className={cn(
                    "border-b px-4 py-4 text-left align-bottom font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground",
                    hairline,
                  )}
                >
                  Feature
                </th>
                {columns.map((col) => (
                  <th
                    key={col.name}
                    className={cn(
                      "border-b px-4 py-4 text-left align-bottom font-heading text-base font-medium",
                      hairline,
                      col.highlight && [primaryX, primaryTop, "rounded-t-[var(--radius-md)] bg-card"],
                    )}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const isLast = rowIndex === rows.length - 1;
                return (
                  <tr key={row.feature}>
                    <td className={cn("border-b px-4 py-4 text-sm text-foreground", hairline)}>{row.feature}</td>
                    {row.values.map((value, i) => {
                      const col = columns[i];
                      return (
                        <td
                          key={col?.name ?? i}
                          className={cn(
                            "border-b px-4 py-4 text-sm",
                            hairline,
                            col?.highlight && [
                              primaryX,
                              "bg-card",
                              isLast && [primaryBottom, "rounded-b-[var(--radius-md)]"],
                            ],
                          )}
                        >
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-4 w-4 text-primary" aria-label="Included" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/50" aria-label="Not included" />
                            )
                          ) : (
                            <span className="font-mono text-sm">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <CaptionRail
          label={footnote ?? "Feature availability by plan"}
          rule="none"
          className="pt-[var(--tight-gap)]"
        />
      </figure>
    </SectionShell>
  );
}
