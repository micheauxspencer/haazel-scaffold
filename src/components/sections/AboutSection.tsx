"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CounterAnimation } from "@/components/ui/counter-animation";

interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface AboutSectionProps {
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  stats?: Stat[];
  className?: string;
}

export function AboutSection({
  heading,
  description,
  imageSrc,
  imageAlt,
  stats,
  className,
}: AboutSectionProps) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text column */}
          <div className="space-y-6">
            <ScrollReveal>
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
                {heading}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                {description.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>

            {/* Stats row */}
            {stats && stats.length > 0 && (
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <div className="text-3xl font-bold text-foreground font-accent">
                        <CounterAnimation
                          end={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Image column */}
          <ScrollReveal delay={0.2} y={30}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
