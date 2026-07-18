import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface LogoCloudLogo {
  /** Accessible name; also the visible fallback text if no src/svg is given. */
  name: string;
  /** Raster/vector logo URL. */
  src?: string;
  /** Inline SVG mark — takes precedence over src. */
  svg?: ReactNode;
}

export interface LogoCloudProps {
  id?: string;
  rail?: { label: string; meta?: string };
  /** CaptionRail label, e.g. "Trusted by 400+ event teams". */
  label: string;
  logos: LogoCloudLogo[];
  className?: string;
}

/**
 * Trusted-by band: a mono CaptionRail label sits beside a single hairline-
 * bound row of marks that wraps naturally — never a boxed logo grid. Marks
 * sit at half-strength grayscale and resolve to full color on hover, gated
 * to fine pointers via a CSS media query so this stays a server component.
 */
export default function LogoCloud({
  id = "trusted-by",
  rail,
  label,
  logos,
  className = "",
}: LogoCloudProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div
        className={cn(
          "flex flex-col gap-6 border-t border-b py-[var(--content-gap)] md:flex-row md:items-center md:gap-14",
          "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
        )}
      >
        <CaptionRail label={label} rule="none" className="shrink-0 md:max-w-[15ch]" />

        <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-7">
          {logos.map((logo) => (
            <li key={logo.name} className="shrink-0">
              <span
                className={cn(
                  "flex items-center gap-2 text-muted-foreground grayscale opacity-60",
                  "transition-[filter,opacity,color] duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
                  "[@media(hover:hover)_and_(pointer:fine)]:hover:grayscale-0",
                  "[@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100",
                  "[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
                )}
              >
                {logo.svg ? (
                  logo.svg
                ) : logo.src ? (
                  <img src={logo.src} alt={logo.name} className="h-6 w-auto md:h-7" loading="lazy" />
                ) : (
                  <span className="font-heading text-lg font-medium tracking-tight">{logo.name}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
