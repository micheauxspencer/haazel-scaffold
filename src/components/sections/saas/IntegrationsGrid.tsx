import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import OffsetGrid from "@/components/primitives/OffsetGrid";

export interface IntegrationTile {
  name: string;
  description: string;
  logo?: ReactNode;
}

export interface IntegrationsGridProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  integrations: IntegrationTile[];
  columns?: 3 | 4;
  className?: string;
}

/**
 * Integration tiles in a staggered OffsetGrid — hairline borders resolve to
 * primary on hover, gated to fine pointers via a CSS media query so this
 * stays a server component.
 */
export default function IntegrationsGrid({
  id = "integrations",
  rail,
  heading,
  intro,
  integrations,
  columns = 4,
  className = "",
}: IntegrationsGridProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <OffsetGrid columns={columns}>
        {integrations.map((tile) => (
          <div
            key={tile.name}
            className={cn(
              "flex h-full flex-col gap-5 border p-6",
              "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
              "transition-colors duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
              "[@media(hover:hover)_and_(pointer:fine)]:hover:[border-color:var(--primary)]",
            )}
          >
            <div className="flex h-11 w-11 items-center justify-center border font-mono text-sm [border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]">
              {tile.logo ?? tile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium">{tile.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{tile.description}</p>
            </div>
          </div>
        ))}
      </OffsetGrid>
    </SectionShell>
  );
}
