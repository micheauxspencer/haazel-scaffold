import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";
import OdometerCounter from "@/components/cinematic/OdometerCounter";

export interface StatBandStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface StatBandProps {
  id?: string;
  rail?: { label: string; meta?: string };
  stats: StatBandStat[];
  tone?: "default" | "card" | "inverted";
  className?: string;
}

/**
 * Full-width proof strip: animated OdometerCounter figures carry the
 * display face, CaptionRail carries the mono label underneath, hairline
 * verticals divide the columns. Two columns on mobile (the hairline still
 * reads as a cross), a single divided row from md up. No cards, no icons —
 * the numbers do the talking.
 */
export default function StatBand({
  id,
  rail,
  stats,
  tone = "default",
  className = "",
}: StatBandProps) {
  const inverted = tone === "inverted";
  const divideClass = inverted
    ? "divide-[color-mix(in_oklab,var(--background)_20%,transparent)]"
    : "divide-[color-mix(in_oklab,var(--foreground)_15%,transparent)]";

  return (
    <SectionShell id={id} rail={rail} tone={tone} className={className}>
      <dl
        className={cn(
          "grid grid-cols-2 gap-y-[var(--content-gap)] divide-x",
          "md:flex md:flex-row md:flex-wrap md:gap-y-0",
          divideClass,
        )}
      >
        {stats.map((stat, i) => (
          <div
            key={`${stat.label}-${i}`}
            className="flex flex-col items-center px-4 py-2 text-center md:flex-1 md:px-8"
          >
            {/* dt precedes dd in the DOM (label reads before value to AT users);
                order flips the value on top visually, label beneath. */}
            <dt className="order-2 mt-3 w-full">
              <CaptionRail
                label={stat.label}
                rule="none"
                className={cn("justify-center", inverted && "[&_span]:text-background/60")}
              />
            </dt>
            <dd className="order-1 font-display">
              <OdometerCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
