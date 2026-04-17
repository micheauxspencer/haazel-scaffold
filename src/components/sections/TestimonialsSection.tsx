"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

interface TestimonialsSectionProps {
  heading?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  columns?: 2 | 3;
  className?: string;
}

export function TestimonialsSection({
  heading = "What our clients say",
  subtitle,
  testimonials,
  columns = 3,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
              {heading}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div
          className={cn(
            "grid gap-6",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4">
                  <Quote className="size-6 text-primary/40" />

                  <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
