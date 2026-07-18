import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface ChartPanelDatum {
  label: string;
  value: number;
}

export interface ChartPanelProps {
  title: string;
  data: ChartPanelDatum[];
  variant?: "line" | "bar" | "area";
  /** Right-aligned mono meta text next to the title ("Last 8 weeks"). */
  meta?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const WIDTH = 480;
const HEIGHT = 240;
const MARGIN = { top: 16, right: 10, bottom: 26, left: 10 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

function defaultFormatter(value: number) {
  return value.toLocaleString("en-US");
}

/**
 * Dependency-free inline-SVG chart card. Normalized viewBox, 4 hairline
 * gridlines, mono axis labels, native `<title>` hover tooltips. Purely a
 * function of `data` — deterministic, no randomness, no chart library.
 */
export default function ChartPanel({
  title,
  data,
  variant = "line",
  meta,
  valueFormatter = defaultFormatter,
  className = "",
}: ChartPanelProps) {
  const n = data.length;
  const values = data.map((d) => d.value);
  const maxValue = n ? Math.max(...values) : 0;
  const minValue = n ? Math.min(...values) : 0;
  const isBar = variant === "bar";

  const range = maxValue - minValue;
  const pad = range === 0 ? Math.max(Math.abs(maxValue), 1) * 0.2 : range * 0.15;
  const domainMax = isBar ? Math.max(maxValue * 1.12, maxValue + 1) : maxValue + pad;
  const domainMin = isBar ? 0 : minValue - pad;
  const domainSpan = domainMax - domainMin || 1;

  const xStep = n > 0 ? PLOT_WIDTH / n : 0;
  const centerX = (i: number) => MARGIN.left + xStep * (i + 0.5);
  const scaleY = (value: number) => MARGIN.top + (1 - (value - domainMin) / domainSpan) * PLOT_HEIGHT;
  const baselineY = MARGIN.top + PLOT_HEIGHT;
  const gridLines = [0, 1, 2, 3].map((k) => MARGIN.top + (PLOT_HEIGHT / 3) * k);

  const points = data.map((d, i) => ({ x: centerX(i), y: scaleY(d.value), datum: d }));
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x.toFixed(2)},${baselineY.toFixed(2)} L${points[0].x.toFixed(2)},${baselineY.toFixed(2)} Z`
      : "";

  const labelStep = Math.max(1, Math.ceil(n / 7));
  const barWidth = xStep * 0.52;

  return (
    <Card className={cn("gap-4", className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-sm font-medium text-foreground">{title}</h3>
          {meta && (
            <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
              {meta}
            </span>
          )}
        </div>

        {n === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No data.</p>
        ) : (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`${title} chart, ${n} data points`}
            className="h-auto w-full"
          >
            {gridLines.map((y, i) => (
              <line
                key={i}
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
                y1={y}
                y2={y}
                strokeWidth="1"
                className="stroke-[color-mix(in_oklab,var(--foreground)_10%,transparent)]"
              />
            ))}

            {variant === "area" && <path d={areaPath} className="fill-primary/10" stroke="none" />}

            {(variant === "line" || variant === "area") && (
              <path
                d={linePath}
                fill="none"
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {isBar &&
              points.map((p, i) => (
                <rect
                  key={i}
                  x={p.x - barWidth / 2}
                  y={p.y}
                  width={barWidth}
                  height={Math.max(baselineY - p.y, 0)}
                  rx="2"
                  className="fill-primary"
                >
                  <title>{`${p.datum.label}: ${valueFormatter(p.datum.value)}`}</title>
                </rect>
              ))}

            {!isBar &&
              points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="10" className="fill-transparent" />
                  <circle cx={p.x} cy={p.y} r="2.5" className="fill-primary" />
                  <title>{`${p.datum.label}: ${valueFormatter(p.datum.value)}`}</title>
                </g>
              ))}

            {points.map((p, i) =>
              i % labelStep === 0 ? (
                <text
                  key={i}
                  x={p.x}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-overline uppercase"
                >
                  {p.datum.label}
                </text>
              ) : null,
            )}
          </svg>
        )}
      </CardContent>
    </Card>
  );
}
