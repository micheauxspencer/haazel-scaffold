"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  heading: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function CTASection({
  heading,
  description,
  ctaLabel,
  ctaHref,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary py-24 sm:py-32",
        className
      )}
    >
      {/* Subtle decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground font-display sm:text-4xl">
              {heading}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-primary-foreground/80">
                {description}
              </p>
            )}
            <div className="mt-8">
              <MagneticButton as="a" href={ctaHref}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-base font-semibold"
                >
                  {ctaLabel}
                </Button>
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
