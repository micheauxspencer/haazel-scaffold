import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import OdometerCounter from "@/components/cinematic/OdometerCounter";

export interface MetricsBandStat {
  /** Whole-number value — OdometerCounter parses digits individually, so decimals/commas aren't supported; use prefix/suffix ("$", "K+", "%") instead. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface MetricsBandProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading?: string;
  /** 3 or 4 stats; OdometerCounter drives each figure. */
  stats: MetricsBandStat[];
  className?: string;
}

/**
 * Full-bleed inverted band: OdometerCounter (cinematic) drives 3-4 big
 * figures set in mono (numerals count as "table figures" per spec §3, so
 * font-mono rather than body face), divided by hairline rules tuned for
 * the inverted foreground/background swap — color-mixed against
 * --background, not --foreground, since this band always renders
 * tone="inverted" and a foreground-mixed hairline would go dark-on-dark.
 * OdometerCounter is itself a self-contained client component (its own
 * reduced-motion + scroll trigger), so this wrapper needs no client state.
 */
export default function MetricsBand({
  id = "metrics",
  rail,
  heading,
  stats,
  className = "",
}: MetricsBandProps) {
  const items = stats.slice(0, 4);

  return (
    <SectionShell id={id} rail={rail} tone="inverted" className={className}>
      {heading && (
        <h2 className="mb-[var(--content-gap)] max-w-2xl text-heading font-heading font-medium">{heading}</h2>
      )}

      <div
        className={cn(
          "grid grid-cols-1 divide-y md:flex md:flex-row md:flex-wrap md:items-start md:divide-y-0 md:divide-x",
          "divide-[color-mix(in_oklab,var(--background)_20%,transparent)]",
        )}
      >
        {items.map((stat, i) => (
          <div key={i} className="py-8 first:pt-0 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0 md:flex-1">
            <OdometerCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              className="font-mono"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
