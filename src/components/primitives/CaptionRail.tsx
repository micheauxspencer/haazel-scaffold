import { cn } from "@/lib/utils";

interface CaptionRailProps {
  /** Left label, set in mono overline style. */
  label: string;
  /** Optional right-aligned meta (index, credit, coordinates…). */
  meta?: string;
  /** Hairline rule placement. */
  rule?: "top" | "bottom" | "none";
  tone?: "default" | "muted";
  className?: string;
}

/**
 * The mono overline + hairline system — the connective tissue between
 * sections. Use it to label sections ("01 — THE PROCESS"), caption media,
 * and carry meta info. Small, but it's half of what makes a page read as
 * designed rather than assembled.
 */
export default function CaptionRail({
  label,
  meta,
  rule = "top",
  tone = "muted",
  className = "",
}: CaptionRailProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-[var(--element-gap)]",
        rule === "top" && "border-t pt-[var(--tight-gap)]",
        rule === "bottom" && "border-b pb-[var(--tight-gap)]",
        "[border-color:color-mix(in_oklab,var(--foreground)_15%,transparent)]",
        className,
      )}
    >
      <span
        className={cn(
          "font-mono text-overline uppercase tracking-[0.25em]",
          tone === "muted" ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
      {meta && (
        <span className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
          {meta}
        </span>
      )}
    </div>
  );
}
