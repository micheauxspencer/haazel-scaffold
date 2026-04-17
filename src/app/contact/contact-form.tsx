"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Placeholder submit handler — replace with your form endpoint
    // (e.g., Formspree, Resend, or a custom API route)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">
          Message sent!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. We'll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            disabled={status === "sending"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (optional)</Label>
        <Input
          id="company"
          name="company"
          placeholder="Your company"
          disabled={status === "sending"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          rows={5}
          required
          disabled={status === "sending"}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="w-full sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
