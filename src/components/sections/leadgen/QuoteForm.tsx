"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import SectionShell from "@/components/primitives/SectionShell";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface QuoteFormProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  /** Options for the service select. */
  services: string[];
  phone?: { display: string; href: string };
  address?: string;
  /** Short trust bullets rendered beside the form ("Free on-site quotes", …). */
  trustPoints?: string[];
  className?: string;
}

interface FormValues {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  website: string; // honeypot
}

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "service" | "form", string>>;

const EMPTY: FormValues = { name: "", phone: "", email: "", service: "", message: "", website: "" };

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.phone.trim()) {
    errors.phone = "Enter a phone number.";
  } else if (values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!values.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.service.trim()) errors.service = "Choose a service.";
  return errors;
}

/**
 * Quote intake — EditorialSplit at 42/58. The primitive always gives its
 * `media` slot the larger fr-share, so the form (the primary action) takes
 * that slot at 58% while the trust/contact panel takes `children` at 42%;
 * `flip` keeps the panel on the left and the form on the right per spec.
 */
export default function QuoteForm({
  id = "quote",
  rail,
  heading,
  intro,
  services,
  phone,
  address,
  trustPoints,
  className = "",
}: QuoteFormProps) {
  const reduced = useReducedMotion();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const ease = reduced
    ? "transition-none"
    : "transition-all duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]";

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key as keyof FieldErrors] ? { ...e, [key]: undefined } : e));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (values.website) return; // honeypot tripped — no-op client-side too

    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setErrors(json?.errors ?? { form: "Something went wrong. Please call us instead." });
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setErrors({ form: "Could not reach the server. Please call us instead." });
      setStatus("idle");
    }
  }

  const formPanel = (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border p-6 md:p-8",
        "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
      )}
    >
      {status === "success" ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-medium">Request received</h3>
          <p className="mt-2 max-w-[36ch] text-muted-foreground">
            Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""}. We&rsquo;ll call or email you back shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setValues(EMPTY);
              setStatus("idle");
            }}
            className={cn(
              "mt-6 inline-flex min-h-11 items-center px-4 text-sm font-medium text-foreground underline underline-offset-4",
              "decoration-[color-mix(in_oklab,var(--foreground)_30%,transparent)] hover:decoration-primary",
              ease,
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
          {/* Honeypot — off-screen for sighted/keyboard users, still present for bots. */}
          <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="qf-website">Leave this field blank</label>
            <input
              type="text"
              id="qf-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => setField("website", e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="qf-name">Name</Label>
              <Input
                id="qf-name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "qf-name-error" : undefined}
                className="mt-1.5 h-11"
              />
              {errors.name && (
                <p id="qf-name-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="qf-phone">Phone</Label>
              <Input
                id="qf-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "qf-phone-error" : undefined}
                className="mt-1.5 h-11"
              />
              {errors.phone && (
                <p id="qf-phone-error" role="alert" className="mt-1.5 text-sm text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="qf-email">Email</Label>
            <Input
              id="qf-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "qf-email-error" : undefined}
              className="mt-1.5 h-11"
            />
            {errors.email && (
              <p id="qf-email-error" role="alert" className="mt-1.5 text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="qf-service-trigger">Service</Label>
            <Select
              value={values.service || null}
              onValueChange={(v) => setField("service", (v as string) ?? "")}
              name="service"
            >
              <SelectTrigger
                id="qf-service-trigger"
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? "qf-service-error" : undefined}
                className="mt-1.5 h-11 w-full"
              >
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p id="qf-service-error" role="alert" className="mt-1.5 text-sm text-destructive">
                {errors.service}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="qf-message">Message</Label>
            <Textarea
              id="qf-message"
              name="message"
              rows={4}
              placeholder="Tell us a bit about the project (optional)"
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
              className="mt-1.5"
            />
          </div>

          {errors.form && (
            <p role="alert" className="text-sm text-destructive">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-primary px-7 py-3",
              "text-[0.9375rem] font-medium text-primary-foreground",
              "transition-transform [transition-timing-function:var(--ease-standard)]",
              "hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Request a quote
          </button>
        </form>
      )}
    </div>
  );

  const trustPanel = (
    <div>
      {phone && (
        <a
          href={phone.href}
          className={cn(
            "inline-flex min-h-11 w-fit items-center gap-2 text-lg font-medium text-foreground",
            "transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary",
          )}
        >
          <Phone className="h-4 w-4" aria-hidden />
          {phone.display}
        </a>
      )}
      {address && <p className="mt-2 text-muted-foreground">{address}</p>}

      {trustPoints && trustPoints.length > 0 && (
        <ul
          className={cn(
            "mt-8 space-y-3 border-t pt-6",
            "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
          )}
        >
          {trustPoints.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <EditorialSplit ratio="58/42" flip media={formPanel}>
        {trustPanel}
      </EditorialSplit>
    </SectionShell>
  );
}
