"use client";

import { useMemo, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SettingsFieldOption {
  label: string;
  value: string;
}

export type SettingsFieldType = "text" | "email" | "password" | "number" | "select" | "textarea";

export interface SettingsField {
  name: string;
  label: string;
  type?: SettingsFieldType;
  placeholder?: string;
  description?: string;
  /** Required for type "select". */
  options?: SettingsFieldOption[];
  defaultValue?: string;
  required?: boolean;
}

export interface SettingsSection {
  title: string;
  description?: string;
  fields: SettingsField[];
}

export interface SettingsFormProps {
  sections: SettingsSection[];
  /** Field name → error message. Sets aria-invalid and renders the message under the field. */
  errors?: Record<string, string>;
  onSubmit?: (values: Record<string, string>) => void;
  submitLabel?: string;
  className?: string;
}

/**
 * Config-driven settings form on `ui/input` + `ui/select` (+ textarea).
 * Every field is labeled; errors set aria-invalid and render as text.
 * Sticky bottom save bar appears only once the form is dirty.
 */
export default function SettingsForm({
  sections,
  errors = {},
  onSubmit,
  submitLabel = "Save changes",
  className = "",
}: SettingsFormProps) {
  const reduced = useReducedMotion();

  const initialValues = useMemo(() => {
    const next: Record<string, string> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        next[field.name] = field.defaultValue ?? "";
      }
    }
    return next;
  }, [sections]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const dirty = useMemo(
    () => Object.keys(initialValues).some((key) => values[key] !== initialValues[key]),
    [values, initialValues],
  );

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const barTransition = reduced
    ? "transition-none"
    : "transition-all duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]";

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("flex flex-col", className)}>
      <div className="flex flex-col divide-y divide-[color-mix(in_oklab,var(--foreground)_10%,transparent)]">
        {sections.map((section) => (
          <section
            key={section.title}
            className="grid grid-cols-1 gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,18rem)_1fr]"
          >
            <div>
              <h3 className="font-heading text-base font-medium">{section.title}</h3>
              {section.description && (
                <p className="mt-1.5 max-w-[34ch] text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {section.fields.map((field) => {
                const error = errors[field.name];
                const fieldId = `settings-${field.name}`;
                const errorId = error ? `${fieldId}-error` : undefined;
                const descriptionId = field.description ? `${fieldId}-description` : undefined;
                const describedBy = [errorId, descriptionId].filter(Boolean).join(" ") || undefined;

                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <Label htmlFor={fieldId}>
                      {field.label}
                      {field.required && (
                        <span aria-hidden className="text-destructive">
                          *
                        </span>
                      )}
                    </Label>

                    {field.type === "select" ? (
                      <Select
                        value={values[field.name]}
                        onValueChange={(value) => setField(field.name, String(value))}
                      >
                        <SelectTrigger
                          id={fieldId}
                          aria-invalid={!!error}
                          aria-describedby={describedBy}
                          className="min-h-11 w-full"
                        >
                          <SelectValue placeholder={field.placeholder ?? "Select…"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={fieldId}
                        placeholder={field.placeholder}
                        value={values[field.name]}
                        onChange={(event) => setField(field.name, event.target.value)}
                        aria-invalid={!!error}
                        aria-describedby={describedBy}
                        required={field.required}
                        className="min-h-24"
                      />
                    ) : (
                      <Input
                        id={fieldId}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        value={values[field.name]}
                        onChange={(event) => setField(field.name, event.target.value)}
                        aria-invalid={!!error}
                        aria-describedby={describedBy}
                        required={field.required}
                        className="min-h-11"
                      />
                    )}

                    {field.description && (
                      <p id={descriptionId} className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                    {error && (
                      <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div
        aria-hidden={!dirty}
        className={cn(
          "sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-4 border-t border-border bg-background px-4 py-4 sm:-mx-6 sm:px-6",
          barTransition,
          dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <p className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
          You have unsaved changes
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValues(initialValues)}
            tabIndex={dirty ? 0 : -1}
            className={cn(
              "inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-muted-foreground",
              "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)] hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            Discard
          </button>
          <button
            type="submit"
            tabIndex={dirty ? 0 : -1}
            className={cn(
              "inline-flex min-h-11 items-center rounded-[var(--radius-lg)] bg-primary px-5 text-sm font-medium text-primary-foreground",
              "transition-transform duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
