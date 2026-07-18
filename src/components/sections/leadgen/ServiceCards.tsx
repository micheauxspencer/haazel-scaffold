import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import OffsetGrid from "@/components/primitives/OffsetGrid";

export interface Service {
  title: string;
  description: string;
  href: string;
  /** Optional photo/icon media rendered at the top of the card. */
  media?: ReactNode;
  priceFrom?: number | string;
}

export interface ServiceCardsProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  services: Service[];
  /** Currency prefix for numeric priceFrom values. */
  currency?: string;
  className?: string;
}

/**
 * Services as an OffsetGrid of hairline cards — title, "from $X" in mono,
 * arrow link. Deliberately not the banned icon-top-center 3-card wall: media
 * (if any) leads full-bleed, copy and price anchor the bottom, offsets break
 * the flat top edge.
 */
export default function ServiceCards({
  id,
  rail,
  heading,
  intro,
  services,
  currency = "$",
  className = "",
}: ServiceCardsProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <OffsetGrid columns={services.length >= 3 ? 3 : 2}>
        {services.map((service) => (
          <a
            key={service.title}
            href={service.href}
            className={cn(
              "group/card flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border",
              "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
              "transition-colors [transition-timing-function:var(--ease-standard)] hover:border-primary",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {service.media && (
              <div className="aspect-[4/3] w-full overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover">
                {service.media}
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-heading text-xl font-medium">{service.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.description}</p>
              <div
                className={cn(
                  "mt-6 flex items-center justify-between border-t pt-4",
                  "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
                )}
              >
                {service.priceFrom !== undefined ? (
                  <span className="font-mono text-sm uppercase tracking-[0.1em] text-foreground">
                    from {typeof service.priceFrom === "number" ? `${currency}${service.priceFrom}` : service.priceFrom}
                  </span>
                ) : (
                  <span />
                )}
                <ArrowUpRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground",
                    "transition-transform [transition-timing-function:var(--ease-standard)]",
                    "group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-primary",
                  )}
                  aria-hidden
                />
              </div>
            </div>
          </a>
        ))}
      </OffsetGrid>
    </SectionShell>
  );
}
