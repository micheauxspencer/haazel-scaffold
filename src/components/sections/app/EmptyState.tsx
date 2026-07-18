import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  href: string;
}

export interface EmptyStateProps {
  heading: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

/** Layered, offset, rotated squares — geometric, deterministic, no illustration lib. */
function GeometricMark() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="size-16 text-muted-foreground">
      <rect
        x="18"
        y="10"
        width="52"
        height="52"
        rx="8"
        transform="rotate(-8 44 36)"
        className="fill-none opacity-30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="30"
        width="52"
        height="52"
        rx="8"
        transform="rotate(5 40 56)"
        className="fill-none opacity-50"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="23"
        y="23"
        width="50"
        height="50"
        rx="8"
        className="fill-card text-foreground"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M39 48h18M48 39v18"
        className="text-foreground"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Zero-state panel: geometric inline-SVG mark, heading, description, and
 * a primary/secondary action pair styled like SaasHero's CTAs for
 * cross-pack consistency.
 */
export default function EmptyState({
  heading,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-dashed px-6 py-16 text-center",
        "[border-color:color-mix(in_oklab,var(--foreground)_16%,transparent)]",
        className,
      )}
    >
      <GeometricMark />
      <div className="max-w-sm">
        <h3 className="font-heading text-lg font-medium">{heading}</h3>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {primaryAction && (
            <a
              href={primaryAction.href}
              className={cn(
                "inline-flex min-h-11 items-center rounded-[var(--radius-lg)] bg-primary px-5 text-sm font-medium text-primary-foreground",
                "transition-transform duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className={cn(
                "inline-flex min-h-11 items-center px-2 text-sm font-medium text-foreground",
                "underline decoration-[color-mix(in_oklab,var(--foreground)_30%,transparent)] underline-offset-4",
                "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)] hover:decoration-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
