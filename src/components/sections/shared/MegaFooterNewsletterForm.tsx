"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaFooterNewsletterFormProps {
  heading?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** No backend wired up — receives the raw email string on submit. */
  onSubmit?: (email: string) => void;
  /** Matches the parent MegaFooter's tone so colors stay readable either way. */
  tone?: "default" | "inverted";
  className?: string;
}

/**
 * The one interactive island inside an otherwise-server MegaFooter. Kept in
 * its own file because "use client" is a module-level directive — it can't
 * be scoped to a single function inside MegaFooter.tsx.
 */
export default function MegaFooterNewsletterForm({
  heading = "Stay in the loop",
  description,
  placeholder = "you@email.com",
  buttonLabel = "Subscribe",
  onSubmit,
  tone = "default",
  className = "",
}: MegaFooterNewsletterFormProps) {
  const inputId = useId();
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const inverted = tone === "inverted";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    onSubmit?.(email);
    setStatus("done");
    form.reset();
  }

  return (
    <div className={className}>
      <h3
        className={cn(
          "font-mono text-overline uppercase tracking-[0.25em]",
          inverted ? "text-background/60" : "text-muted-foreground",
        )}
      >
        {heading}
      </h3>

      {description && (
        <p className={cn("mt-3 max-w-[32ch] text-sm", inverted ? "text-background/80" : "text-muted-foreground")}>
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex max-w-sm items-stretch gap-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          required
          placeholder={placeholder}
          className={cn(
            "min-h-11 w-full min-w-0 rounded-[var(--radius-lg)] border bg-transparent px-4 text-sm outline-none",
            "transition-colors [transition-timing-function:var(--ease-standard)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            inverted
              ? "border-background/25 text-background placeholder:text-background/45 focus-visible:border-background/60"
              : [
                  "text-foreground placeholder:text-muted-foreground focus-visible:border-primary",
                  "[border-color:color-mix(in_oklab,var(--foreground)_18%,transparent)]",
                ],
          )}
        />
        <button
          type="submit"
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[var(--radius-lg)] px-5 text-[0.9375rem] font-medium",
            "transition-transform [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            inverted ? "bg-background text-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-2 text-xs transition-opacity duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
          inverted ? "text-background/60" : "text-muted-foreground",
          status === "done" ? "opacity-100" : "opacity-0",
        )}
      >
        Thanks — you&rsquo;re on the list.
      </p>
    </div>
  );
}
