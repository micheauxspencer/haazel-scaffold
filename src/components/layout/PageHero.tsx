import Link from "next/link";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-muted/40 py-24 sm:py-32",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span className="text-border" aria-hidden="true">
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <h1 className="text-4xl font-bold tracking-tight text-foreground font-display sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
