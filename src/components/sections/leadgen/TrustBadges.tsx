import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";

export interface TrustBadge {
  label: string;
  sublabel?: string;
  /** Custom icon; falls back to a cycled shield/check/star inline SVG. */
  icon?: ReactNode;
}

export interface TrustBadgesProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading?: string;
  badges: TrustBadge[];
  /** "card" wraps the band in a bordered surface — useful as a standalone strip. */
  tone?: "default" | "card";
  className?: string;
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M10 1.8l6.5 2.4v5.1c0 4.2-2.7 7.6-6.5 8.9-3.8-1.3-6.5-4.7-6.5-8.9V4.2L10 1.8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.2 10.1l1.9 1.9 3.9-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M10 1.6l2.47 5.4 5.93.63-4.45 4.02 1.24 5.85L10 14.6l-5.19 2.9 1.24-5.85L1.6 7.63l5.93-.63L10 1.6z" />
    </svg>
  );
}

function defaultGlyph(index: number) {
  const variant = index % 3;
  if (variant === 1) return <CheckGlyph />;
  if (variant === 2) return <StarGlyph />;
  return <ShieldGlyph />;
}

/**
 * Horizontal credential band. Hairline pills wrap on mobile; icons default
 * to a cycled shield/check/star inline-SVG set when the caller doesn't
 * supply one, so a plain label list still reads as designed.
 */
export default function TrustBadges({
  id,
  rail,
  heading,
  badges,
  tone = "default",
  className = "",
}: TrustBadgesProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      {heading && <h2 className="mb-[var(--content-gap)] text-heading font-heading font-medium">{heading}</h2>}

      <ul
        className={cn(
          "flex flex-wrap gap-3",
          tone === "card" &&
            [
              "rounded-[var(--radius-lg)] border bg-card p-6 text-card-foreground md:p-8",
              "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
            ],
        )}
      >
        {badges.map((badge, i) => (
          <li
            key={badge.label}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5",
              "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
            )}
          >
            <span className="text-primary">{badge.icon ?? defaultGlyph(i)}</span>
            <span className="leading-tight">
              <span className="block text-sm font-medium">{badge.label}</span>
              {badge.sublabel && (
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {badge.sublabel}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
