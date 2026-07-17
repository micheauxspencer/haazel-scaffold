import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import CaptionRail from "./CaptionRail";

interface SectionShellProps {
  /** Anchor id for nav (e.g. "pricing"). */
  id?: string;
  /** Numbered rail above the content ("02 — Pricing" pattern). */
  rail?: { label: string; meta?: string };
  /** Full-width children (media bands, marquees) — no container. */
  bleed?: boolean;
  /** Background treatment. "inverted" flips fg/bg for a dramatic band. */
  tone?: "default" | "card" | "inverted";
  children: ReactNode;
  className?: string;
}

/**
 * The standard section wrapper: token vertical rhythm (--section-gap),
 * token container + gutter, optional numbered caption rail. Every section
 * in sections/ composes this so pages get a consistent spatial spine —
 * variety comes from what's inside, not from ad-hoc padding.
 */
export default function SectionShell({
  id,
  rail,
  bleed = false,
  tone = "default",
  children,
  className = "",
}: SectionShellProps) {
  const toneClass =
    tone === "card"
      ? "bg-card text-card-foreground"
      : tone === "inverted"
        ? "bg-foreground text-background"
        : "";

  const railEl = rail && (
    <CaptionRail
      label={rail.label}
      meta={rail.meta}
      rule="top"
      className={cn("mb-[var(--content-gap)]", tone === "inverted" && "[&_span]:text-background/60")}
    />
  );

  return (
    <section id={id} className={cn("py-section", toneClass, className)}>
      {bleed ? (
        <>
          {rail && (
            <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
              {railEl}
            </div>
          )}
          {children}
        </>
      ) : (
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
          {railEl}
          {children}
        </div>
      )}
    </section>
  );
}
