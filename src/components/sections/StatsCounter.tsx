"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CounterAnimation } from "@/components/ui/counter-animation";

interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface StatsCounterProps {
  stats: StatItem[];
  heading?: string;
  className?: string;
}

export function StatsCounter({ stats, heading, className }: StatsCounterProps) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
              {heading}
            </h2>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-foreground font-accent sm:text-5xl">
                  <CounterAnimation
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
