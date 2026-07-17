import { type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface EditorialSplitProps {
  /** Media / visual side. */
  media: ReactNode;
  /** Content side. */
  children: ReactNode;
  /** Asymmetric ratio, "media/content" percentages. Never 50/50. */
  ratio?: "62/38" | "58/42" | "70/30";
  /** Content first (media right) at md+. */
  flip?: boolean;
  /** Content overhangs into the media column (breaks the seam). */
  overhang?: boolean;
  /** Media sticks in the viewport while content scrolls. */
  sticky?: boolean;
  /** Vertical alignment of the content column. */
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * The asymmetric split — 62/38 by default, on principle. A 50/50 split is a
 * template tell; this primitive won't produce one. `overhang` lets the content
 * block break across the column seam, `sticky` pins the media for longer copy.
 */
export default function EditorialSplit({
  media,
  children,
  ratio = "62/38",
  flip = false,
  overhang = false,
  sticky = false,
  align = "center",
  className = "",
}: EditorialSplitProps) {
  const [m, c] = ratio.split("/").map(Number);
  const columns = flip ? `${c}fr ${m}fr` : `${m}fr ${c}fr`;
  const style: CSSProperties = { ["--es-cols" as string]: columns };

  const alignClass =
    align === "start" ? "self-start" : align === "end" ? "self-end" : "self-center";

  const mediaEl = (
    <div className={cn("relative", sticky && "md:sticky md:top-[clamp(4rem,10vh,7rem)] md:self-start")}>
      {media}
    </div>
  );

  const contentEl = (
    <div
      className={cn(
        "relative z-10",
        alignClass,
        overhang && (flip ? "md:[margin-inline-end:-14%]" : "md:[margin-inline-start:-14%]"),
      )}
    >
      {children}
    </div>
  );

  return (
    <div
      style={style}
      className={cn(
        "grid grid-cols-1 gap-y-[var(--content-gap)] md:[grid-template-columns:var(--es-cols)] md:gap-x-[var(--gutter)]",
        className,
      )}
    >
      {flip ? contentEl : mediaEl}
      {flip ? mediaEl : contentEl}
    </div>
  );
}
