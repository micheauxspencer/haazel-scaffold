"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import CaptionRail from "@/components/primitives/CaptionRail";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface ContactSplitInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface ContactSplitHour {
  label: string;
  value: string;
}

export interface ContactSplitSocial {
  platform: string;
  href: string;
}

export interface ContactSplitSubmission {
  name: string;
  email: string;
  message: string;
}

export interface ContactSplitProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  info: ContactSplitInfo;
  hours?: ContactSplitHour[];
  socials?: ContactSplitSocial[];
  /** Receives the validated submission. Omit to fall back to a mailto: link. */
  onSubmit?: (data: ContactSplitSubmission) => void;
  className?: string;
}

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EditorialSplit asked for 42/58 (info/form) — the primitive's ratio enum
 * only ships 62/38, 58/42 and 70/30, so 58/42 + flip is used: flip swaps the
 * render order AND the fr split together, landing the content slot (info)
 * at 42% on the left and the media slot (form) at 58% on the right.
 */
export default function ContactSplit({
  id,
  rail,
  heading,
  info,
  hours,
  socials,
  onSubmit,
  className = "",
}: ContactSplitProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrId = useId();
  const emailErrId = useId();
  const messageErrId = useId();

  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "Enter your name.";
    if (!email) nextErrors.email = "Enter your email.";
    else if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!message) nextErrors.message = "Enter a message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (onSubmit) {
      onSubmit({ name, email, message });
      setSent(true);
      form.reset();
      return;
    }

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${info.email ?? ""}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const rowLinkClass = cn(
    "inline-flex min-h-11 items-center text-lg font-medium text-foreground",
    "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  );

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <EditorialSplit
        ratio="58/42"
        flip
        align="start"
        media={
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor={nameId}>Name</Label>
              <Input
                id={nameId}
                name="name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? nameErrId : undefined}
                onChange={() => clearError("name")}
                className="min-h-11"
              />
              {errors.name && (
                <p id={nameErrId} className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? emailErrId : undefined}
                onChange={() => clearError("email")}
                className="min-h-11"
              />
              {errors.email && (
                <p id={emailErrId} className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={messageId}>Message</Label>
              <Textarea
                id={messageId}
                name="message"
                rows={5}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? messageErrId : undefined}
                onChange={() => clearError("message")}
              />
              {errors.message && (
                <p id={messageErrId} className="text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-[var(--radius-lg)] bg-primary px-7 py-3",
                "text-[0.9375rem] font-medium text-primary-foreground",
                "transition-transform [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              Send message
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </button>

            <p role="status" aria-live="polite" className={cn("text-sm text-muted-foreground", sent ? "opacity-100" : "opacity-0")}>
              {sent ? "Thanks — your message is on its way." : ""}
            </p>
          </form>
        }
      >
        <h2 className="text-heading font-heading font-medium">{heading}</h2>

        <ul className="mt-8 space-y-6">
          {info.email && (
            <li>
              <CaptionRail label="Email" rule="top" className="mb-2" />
              <a href={`mailto:${info.email}`} className={rowLinkClass}>
                {info.email}
              </a>
            </li>
          )}
          {info.phone && (
            <li>
              <CaptionRail label="Phone" rule="top" className="mb-2" />
              <a href={`tel:${info.phone.replace(/[^\d+]/g, "")}`} className={rowLinkClass}>
                {info.phone}
              </a>
            </li>
          )}
          {info.address && (
            <li>
              <CaptionRail label="Address" rule="top" className="mb-2" />
              <p className="text-lg font-medium text-foreground">{info.address}</p>
            </li>
          )}
          {hours && hours.length > 0 && (
            <li>
              <CaptionRail label="Hours" rule="top" className="mb-2" />
              <dl className="space-y-1">
                {hours.map((h) => (
                  <div key={h.label} className="flex items-baseline justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{h.label}</dt>
                    <dd className="font-medium text-foreground">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          )}
          {socials && socials.length > 0 && (
            <li>
              <CaptionRail label="Follow" rule="top" className="mb-2" />
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex min-h-11 items-center font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground",
                      "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-foreground",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </li>
          )}
        </ul>
      </EditorialSplit>
    </SectionShell>
  );
}
