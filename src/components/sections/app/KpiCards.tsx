import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface KpiCardDelta {
  value: string;
  direction: "up" | "down" | "flat";
}

export interface KpiCardItem {
  label: string;
  value: string;
  delta?: KpiCardDelta;
  /** Optional trend series rendered as a dependency-free inline SVG sparkline. */
  sparkline?: number[];
  caption?: string;
}

export interface KpiCardsProps {
  items: KpiCardItem[];
  /** Grid density — density exception to the pack's uniform-grid ban. */
  columns?: 2 | 4;
  className?: string;
}

function deltaColorClass(direction?: KpiCardDelta["direction"]) {
  if (direction === "up") return "text-primary";
  if (direction === "down") return "text-destructive";
  return "text-muted-foreground";
}

function sparklinePath(values: number[], width: number, height: number, pad: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (v - min) / span) * (height - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const width = 100;
  const height = 32;
  const pad = 2;
  const line = sparklinePath(values, width, height, pad);
  const area = `${line} L${(width - pad).toFixed(2)},${(height - pad).toFixed(2)} L${pad.toFixed(2)},${(height - pad).toFixed(2)} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-8 w-full overflow-visible", className)}
    >
      <path d={area} fill="currentColor" fillOpacity="0.12" stroke="none" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function DeltaBadge({ delta }: { delta: KpiCardDelta }) {
  const Icon = delta.direction === "up" ? ArrowUpIcon : delta.direction === "down" ? ArrowDownIcon : MinusIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs font-medium tabular-nums",
        deltaColorClass(delta.direction),
      )}
    >
      <Icon aria-hidden className="size-3" />
      {delta.value}
    </span>
  );
}

/**
 * Stat-card grid — display-face values, mono labels, directional deltas
 * (up → primary, down → destructive, flat → muted) and an optional
 * dependency-free sparkline per card. Uniform 2/4-col grid is deliberate:
 * app pack's density exception to the "uniform grid" ban.
 */
export default function KpiCards({ items, columns = 4, className = "" }: KpiCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2",
        columns === 4 && "xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <Card key={item.label} className="gap-3">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                {item.label}
              </span>
              {item.delta && <DeltaBadge delta={item.delta} />}
            </div>
            <p className="font-display text-3xl font-medium tabular-nums tracking-tight">
              {item.value}
            </p>
            {item.sparkline && item.sparkline.length > 1 && (
              <Sparkline values={item.sparkline} className={deltaColorClass(item.delta?.direction)} />
            )}
            {item.caption && <p className="text-xs text-muted-foreground">{item.caption}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
