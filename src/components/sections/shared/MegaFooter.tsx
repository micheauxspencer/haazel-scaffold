import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import MegaFooterNewsletterForm from "./MegaFooterNewsletterForm";

export interface MegaFooterLink {
  label: string;
  href: string;
}

export interface MegaFooterColumn {
  heading: string;
  links: MegaFooterLink[];
}

export interface MegaFooterSocial {
  platform: string;
  href: string;
}

export interface MegaFooterNewsletterConfig {
  heading?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** No backend wired up — receives the raw email string on submit. */
  onSubmit?: (email: string) => void;
}

export interface MegaFooterProps {
  id?: string;
  /** Rendered huge across the top of the footer — the closing statement. */
  brandName: string;
  /** Render the wordmark as an outline (WebkitTextStroke) instead of solid fill. */
  wordmarkOutline?: boolean;
  columns: MegaFooterColumn[];
  /** Omit to skip the capture row entirely. */
  newsletter?: MegaFooterNewsletterConfig;
  /** Defaults to "© {year} {brandName}. All rights reserved." */
  copyright?: string;
  /** e.g. "Built with Next.js" — sits opposite the copyright line. */
  builtWith?: string;
  socials?: MegaFooterSocial[];
  /** "inverted" (default) reads as a closing statement band regardless of page theme. */
  tone?: "default" | "inverted";
  className?: string;
}

/**
 * The statement footer — replaces `layout/Footer` when a page composes its
 * own section stack (catalog note: swap it in wherever <Footer /> is
 * currently rendered). A page-width wordmark opens it, an asymmetric split
 * (EditorialSplit 62/38, flipped) pairs newsletter capture against the link
 * columns, and a CaptionRail closes it with copyright / credit / socials.
 * Server component — the newsletter form is the one client island.
 */
export default function MegaFooter({
  id,
  brandName,
  wordmarkOutline = false,
  columns,
  newsletter,
  copyright,
  builtWith,
  socials,
  tone = "inverted",
  className = "",
}: MegaFooterProps) {
  const inverted = tone === "inverted";
  const year = new Date().getFullYear();
  const strokeColor = inverted ? "var(--background)" : "var(--foreground)";
  const mutedClass = inverted ? "text-background/60" : "text-muted-foreground";
  const linkClass = cn(
    "inline-flex min-h-11 items-center text-sm transition-colors [transition-timing-function:var(--ease-standard)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    inverted ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground",
  );

  const columnsGrid = (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
      {columns.map((col) => (
        <div key={col.heading}>
          <h3 className={cn("font-mono text-overline uppercase tracking-[0.25em]", mutedClass)}>
            {col.heading}
          </h3>
          <ul className="mt-4 space-y-1">
            {/* Keyed by label: demo/placeholder links often share href="#". */}
            {col.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <SectionShell id={id} tone={tone} className={className}>
      <p
        className="mb-[var(--content-gap)] break-words text-display font-display font-medium uppercase leading-[0.9] tracking-[-0.02em]"
        style={
          wordmarkOutline
            ? { WebkitTextStroke: `1.5px ${strokeColor}`, WebkitTextFillColor: "transparent", color: "transparent" }
            : undefined
        }
      >
        {brandName}
      </p>

      {newsletter ? (
        <EditorialSplit ratio="62/38" flip align="start" media={columnsGrid}>
          <MegaFooterNewsletterForm
            heading={newsletter.heading}
            description={newsletter.description}
            placeholder={newsletter.placeholder}
            buttonLabel={newsletter.buttonLabel}
            onSubmit={newsletter.onSubmit}
            tone={tone}
          />
        </EditorialSplit>
      ) : (
        columnsGrid
      )}

      <div className="mt-[var(--content-gap)]">
        <CaptionRail
          label={copyright ?? `© ${year} ${brandName}. All rights reserved.`}
          meta={builtWith}
          rule="top"
          className={inverted ? "[&_span]:text-background/60" : undefined}
        />

        {socials && socials.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex min-h-11 items-center font-mono text-overline uppercase tracking-[0.18em]",
                  "transition-colors [transition-timing-function:var(--ease-standard)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  inverted ? "text-background/60 hover:text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {social.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
