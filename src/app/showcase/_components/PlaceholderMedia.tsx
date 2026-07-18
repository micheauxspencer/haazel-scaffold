import { useId } from "react";
import { ImageIcon, MonitorIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderMediaProps {
  /** Mono chip label; defaults to a generic description of the variant. */
  label?: string;
  /** CSS aspect-ratio, e.g. "16/10", "4/3", "1/1", "9/16". */
  ratio?: string;
  variant?: "photo" | "screenshot";
  className?: string;
}

/**
 * Token-styled stand-in for fixture `media`/ReactNode slots — no network
 * images, no hex anywhere. Layered color-mix bands + an inline-SVG texture
 * + a mono label chip, so it reads as a deliberate placeholder rather than
 * a gray box. Lives under showcase/_components so `npm run prune` removes
 * it along with the rest of the harness.
 */
export default function PlaceholderMedia({
  label,
  ratio = "16/10",
  variant = "photo",
  className = "",
}: PlaceholderMediaProps) {
  const patternId = useId();
  const gridId = `pm-grid-${patternId}`;
  const Icon = variant === "screenshot" ? MonitorIcon : ImageIcon;
  const chip = label ?? (variant === "screenshot" ? "Screenshot placeholder" : "Photo placeholder");

  return (
    <div
      role="img"
      aria-label={chip}
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-lg)]",
        "border [border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
        className,
      )}
    >
      {/* Layered color-mix background bands */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            "repeating-linear-gradient(135deg, color-mix(in oklab, var(--foreground) 6%, transparent) 0px, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px, transparent 13px)",
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 55%)",
            "linear-gradient(315deg, color-mix(in oklab, var(--foreground) 12%, transparent) 0%, transparent 60%)",
            "color-mix(in oklab, var(--foreground) 4%, var(--card))",
          ].join(", "),
        }}
      />

      {/* Subtle inline-SVG grid/diagonal texture — screenshots read as a
          rigid UI grid, photos get an added diagonal to feel less rigid. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <defs>
          <pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M28 0H0V28"
              fill="none"
              stroke="color-mix(in oklab, var(--foreground) 14%, transparent)"
              strokeWidth="1"
            />
            {variant === "photo" && (
              <path
                d="M0 0L28 28"
                fill="none"
                stroke="color-mix(in oklab, var(--foreground) 8%, transparent)"
                strokeWidth="1"
              />
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>

      {/* Corner frame marks — signals "this is a frame", not a broken image */}
      <div
        aria-hidden
        className="absolute inset-4 [&>span]:absolute [&>span]:h-3 [&>span]:w-3 [&>span]:border-[color-mix(in_oklab,var(--foreground)_25%,transparent)]"
      >
        <span className="left-0 top-0 border-l border-t" />
        <span className="right-0 top-0 border-r border-t" />
        <span className="bottom-0 left-0 border-b border-l" />
        <span className="bottom-0 right-0 border-b border-r" />
      </div>

      {/* Mono label chip */}
      <div
        className={cn(
          "absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-sm",
          "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
          "bg-[color-mix(in_oklab,var(--card)_88%,transparent)]",
        )}
      >
        <Icon aria-hidden className="size-3 text-muted-foreground" />
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {chip}
        </span>
      </div>
    </div>
  );
}
