"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface PricingPlan {
  name: string;
  tagline?: string;
  /** number → formatted with currency; string → rendered raw ("Custom"). */
  monthly: number | string;
  /** Per-month price when billed annually; omit to hide the toggle for this plan. */
  annual?: number | string;
  /** e.g. "/mo", "/seat/mo". */
  unit?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface PricingTableProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  plans: PricingPlan[];
  currency?: string;
  /** Shown beside the annual toggle ("Save 20%"). */
  annualNote?: string;
  footnote?: string;
  className?: string;
}

/**
 * Pricing without the template tell: asymmetric header (heading left, toggle
 * right), featured plan physically larger and raised via an uneven column
 * grid — not three identical cards. Prices set in the display face.
 */
export default function PricingTable({
  id = "pricing",
  rail,
  heading,
  intro,
  plans,
  currency = "$",
  annualNote,
  footnote,
  className = "",
}: PricingTableProps) {
  const [annual, setAnnual] = useState(true);
  const reduced = useReducedMotion();
  const hasAnnual = plans.some((p) => p.annual !== undefined);
  const ease = reduced
    ? "transition-none"
    : "transition-all duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]";

  const price = (plan: PricingPlan) => {
    const raw = annual && plan.annual !== undefined ? plan.annual : plan.monthly;
    return typeof raw === "number" ? `${currency}${raw}` : raw;
  };

  // Featured column is wider; grid stays uneven on purpose.
  const gridTemplate =
    plans.length === 3
      ? plans.findIndex((p) => p.featured) === 0
        ? "md:[grid-template-columns:1.15fr_1fr_1fr]"
        : plans.findIndex((p) => p.featured) === 2
          ? "md:[grid-template-columns:1fr_1fr_1.15fr]"
          : "md:[grid-template-columns:1fr_1.15fr_1fr]"
      : plans.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-4";

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-heading font-heading font-medium">{heading}</h2>
          {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        </div>

        {hasAnnual && (
          <div className="flex items-center gap-3">
            <div
              role="group"
              aria-label="Billing period"
              className={cn(
                "inline-flex rounded-full border p-1",
                "[border-color:color-mix(in_oklab,var(--foreground)_14%,transparent)]",
              )}
            >
              {(["Monthly", "Annual"] as const).map((label) => {
                const isAnnual = label === "Annual";
                const active = annual === isAnnual;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAnnual(isAnnual)}
                    className={cn(
                      "min-h-9 rounded-full px-4 font-mono text-overline uppercase tracking-[0.14em]",
                      ease,
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {annualNote && annual && (
              <span className="font-mono text-overline uppercase tracking-[0.14em] text-primary">
                {annualNote}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={cn("grid grid-cols-1 gap-6 md:items-start", gridTemplate)}>
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "relative flex flex-col p-8",
              "rounded-[var(--radius-lg)] border",
              ease,
              plan.featured
                ? [
                    "border-primary bg-card md:-translate-y-4",
                    "shadow-[0_32px_64px_-32px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
                  ]
                : "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
            )}
          >
            {plan.featured && (
              <CaptionRail label="Most popular" rule="none" tone="default" className="mb-4 [&_span]:text-primary" />
            )}

            <h3 className="font-heading text-xl font-medium">{plan.name}</h3>
            {plan.tagline && (
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            )}

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-medium tracking-tight">
                {price(plan)}
              </span>
              {plan.unit && typeof (annual && plan.annual !== undefined ? plan.annual : plan.monthly) === "number" && (
                <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                  {plan.unit}
                </span>
              )}
            </div>
            {annual && plan.annual !== undefined && typeof plan.annual === "number" && (
              <p className="mt-1 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                billed annually
              </p>
            )}

            <ul
              className={cn(
                "mt-8 flex-1 space-y-0 divide-y",
                "divide-[color-mix(in_oklab,var(--foreground)_8%,transparent)]",
              )}
            >
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 py-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className={plan.featured ? "" : "text-muted-foreground"}>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={plan.cta.href}
              className={cn(
                "mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-lg)] px-6 py-3 text-[0.9375rem] font-medium",
                ease,
                plan.featured
                  ? "bg-primary text-primary-foreground hover:-translate-y-0.5"
                  : [
                      "border text-foreground",
                      "[border-color:color-mix(in_oklab,var(--foreground)_18%,transparent)]",
                      "hover:border-primary hover:text-primary",
                    ],
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {plan.cta.label}
            </a>
          </article>
        ))}
      </div>

      {footnote && (
        <p className="mt-[var(--content-gap)] font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
          {footnote}
        </p>
      )}
    </SectionShell>
  );
}
