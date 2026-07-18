"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps {
  message: ReactNode;
  /** Wraps the message in a link when set. */
  href?: string;
  /** Show the dismiss control. Default true. */
  dismissible?: boolean;
  /** localStorage key the dismissal is persisted under — use a unique value per announcement. */
  storageKey?: string;
  tone?: "default" | "inverted" | "primary";
  className?: string;
}

/**
 * Slim persistent utility bar, not a content section — deliberately does
 * NOT compose SectionShell (its clamp(6rem,14vw,11rem) section rhythm would
 * blow the ≤40px height budget this component is required to stay under).
 * Borrows CaptionRail's mono/overline type language without the hairline
 * rule so it still reads as part of the same system.
 *
 * Neither the message link nor the dismiss button use the library's usual
 * min-h-11: a 44px-tall flex child would inflate this bar past its ≤40px
 * ceiling. Both instead meet WCAG 2.5.8 AA's 24px target-size minimum —
 * the line-height of the mono text for the link, an explicit h-6 w-6 for
 * the icon-only dismiss control.
 */
export default function AnnouncementBar({
  message,
  href,
  dismissible = true,
  storageKey = "announcement-bar",
  tone = "default",
  className = "",
}: AnnouncementBarProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const key = `haazel:${storageKey}`;

  useEffect(() => {
    setMounted(true);
    try {
      setDismissed(window.localStorage.getItem(key) === "1");
    } catch {
      // localStorage unavailable (privacy mode, etc.) — degrade to always-visible.
    }
  }, [key]);

  // SSR and first paint render nothing so a dismissed bar never flashes in,
  // and the server/client markup never disagrees.
  if (!mounted || dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // ignore — dismissal just won't persist this session
    }
  }

  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "inverted"
        ? "bg-foreground text-background"
        : [
            "bg-muted text-foreground border-b",
            "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
          ];

  const dismissClass =
    tone === "default"
      ? "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
      : "opacity-80 hover:bg-background/10 hover:opacity-100";

  const content = (
    <span className="inline-flex items-center gap-1.5">
      {message}
      {href && <ArrowRight className="h-3 w-3 shrink-0" aria-hidden />}
    </span>
  );

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={cn("relative flex min-h-8 items-center justify-center gap-3 px-10 py-1.5", toneClass, className)}
    >
      {href ? (
        <a
          href={href}
          className={cn(
            "font-mono text-overline tracking-[0.04em] underline-offset-2",
            "transition-colors [transition-timing-function:var(--ease-standard)] hover:underline",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          {content}
        </a>
      ) : (
        <span className="font-mono text-overline tracking-[0.04em]">{content}</span>
      )}

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className={cn(
            // A 44px control can't fit inside a ≤40px bar without overflowing it —
            // 24px meets the WCAG 2.5.8 AA minimum target size, so it's used here
            // deliberately instead of the library's usual min-h-11.
            "absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full",
            "transition-colors [transition-timing-function:var(--ease-standard)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            dismissClass,
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
