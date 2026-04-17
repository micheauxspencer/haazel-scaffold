"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  Palette,
  Code,
  Search,
  Sparkles,
  BarChart3,
  MonitorSmartphone,
  Briefcase,
  Globe,
  Layers,
  Zap,
  Shield,
  Heart,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  Code,
  Search,
  Sparkles,
  BarChart3,
  MonitorSmartphone,
  Briefcase,
  Globe,
  Layers,
  Zap,
  Shield,
  Heart,
};

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

interface ServicesGridProps {
  heading?: string;
  subtitle?: string;
  services: ServiceItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const gridCols = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ServicesGrid({
  heading,
  subtitle,
  services,
  columns = 3,
  className,
}: ServicesGridProps) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        {(heading || subtitle) && (
          <ScrollReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              {heading && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
                  {heading}
                </h2>
              )}
              {subtitle && (
                <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Grid */}
        <div className={cn("grid gap-6", gridCols[columns])}>
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Sparkles;
            const content = (
              <Card
                className={cn(
                  "transition-all duration-300 hover:ring-primary/30",
                  service.href && "cursor-pointer hover:-translate-y-1"
                )}
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                {service.href && (
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                )}
              </Card>
            );

            return (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                {service.href ? (
                  <Link href={service.href} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
