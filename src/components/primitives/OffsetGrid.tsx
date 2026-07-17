"use client";

import { Children, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface OffsetGridProps {
  children: ReactNode;
  /** Columns at md+. */
  columns?: 2 | 3 | 4;
  /**
   * Vertical offset pattern (CSS lengths), cycled across items at md+.
   * The default breaks the flat-top grid line without chaos.
   */
  offsets?: string[];
  /** Gap between items; defaults to the token element gap ×2. */
  gap?: string;
  className?: string;
}

/**
 * The broken grid: items share a grid but start at staggered vertical
 * offsets, so card walls stop reading as a template. Offsets are layout
 * (not animation) — they persist under reduced motion and neutralize on
 * mobile where the grid collapses to one column.
 */
export default function OffsetGrid({
  children,
  columns = 3,
  offsets = ["0px", "3.5rem", "1.25rem"],
  gap = "calc(var(--element-gap) * 2)",
  className = "",
}: OffsetGridProps) {
  const items = Children.toArray(children);
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns];

  return (
    <div
      style={{ gap } as CSSProperties}
      className={cn("grid grid-cols-1", colClass, className)}
    >
      {items.map((child, i) => (
        <div
          key={i}
          style={{ ["--og-y" as string]: offsets[i % offsets.length] }}
          className="md:[translate:0_var(--og-y)]"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
