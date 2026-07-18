"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MenuIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface AppShellNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface AppShellNavSection {
  label: string;
  items: AppShellNavItem[];
}

export interface AppShellBreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppShellProps {
  navSections: AppShellNavSection[];
  brand: { name: string; logo?: ReactNode };
  user: { name: string; email?: string; avatarSrc?: string };
  /** Rendered as a mono breadcrumb trail in the topbar. */
  breadcrumb?: AppShellBreadcrumbItem[];
  /** Fired by the topbar search button — wire this to open CommandPalette. */
  onSearchClick?: () => void;
  children: ReactNode;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Brand({ brand, collapsed }: { brand: AppShellProps["brand"]; collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4",
        collapsed && "justify-center px-0",
      )}
    >
      {brand.logo ? (
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center text-sidebar-primary [&_svg]:size-6"
        >
          {brand.logo}
        </span>
      ) : (
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-sidebar-primary font-display text-xs font-semibold text-sidebar-primary-foreground"
        >
          {brand.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span
        className={cn(
          "truncate font-heading text-sm font-semibold text-sidebar-foreground",
          collapsed && "sr-only",
        )}
      >
        {brand.name}
      </span>
    </div>
  );
}

function NavList({
  navSections,
  collapsed,
  onNavigate,
}: {
  navSections: AppShellNavSection[];
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Primary" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {navSections.map((section) => (
        <div key={section.label}>
          <CaptionRail
            label={section.label}
            rule="none"
            className={cn("mb-2 px-2", collapsed && "sr-only")}
          />
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-current={item.active ? "page" : undefined}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-2.5 text-sm font-medium",
                    "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    item.active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {item.active && (
                    <span
                      aria-hidden
                      className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary"
                    />
                  )}
                  {item.icon && (
                    <span
                      aria-hidden
                      className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * App shell — collapsible sidebar + topbar + main content area. The other
 * seven app/ components compose inside `children`; this is the only one
 * that owns page chrome. Sidebar collapses to an icon rail on desktop and
 * becomes a `ui/sheet` drawer below `md:`.
 */
export default function AppShell({
  navSections,
  brand,
  user,
  breadcrumb,
  onSearchClick,
  children,
  className = "",
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  const widthTransition = reduced
    ? "transition-none"
    : "transition-[width] duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]";
  const chevronTransition = reduced
    ? "transition-none"
    : "transition-transform duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]";

  return (
    <div className={cn("flex min-h-dvh bg-background text-foreground", className)}>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
          widthTransition,
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <Brand brand={brand} collapsed={collapsed} />
        <NavList navSections={navSections} collapsed={collapsed} />
        <div className="border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] text-sidebar-foreground/60",
              "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
              "hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <ChevronLeftIcon
              aria-hidden
              className={cn("size-4", chevronTransition, collapsed && "rotate-180")}
            />
            <span className={cn("text-xs font-medium", collapsed && "sr-only")}>Collapse</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar (sheet) + topbar/main share this Sheet so the topbar's
          trigger can reach the drawer's context. Dialog.Root renders no
          wrapper element, so this does not change the visual layout. */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="gap-0 bg-sidebar text-sidebar-foreground">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>{brand.name} navigation menu</SheetDescription>
          </SheetHeader>
          <Brand brand={brand} />
          <NavList navSections={navSections} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
            <SheetTrigger
              aria-label="Open navigation"
              className={cn(
                "flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-foreground/70 md:hidden",
                "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <MenuIcon aria-hidden className="size-5" />
            </SheetTrigger>

            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
                <ol className="flex items-center gap-1.5 overflow-hidden font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
                  {breadcrumb.map((crumb, i) => {
                    const isLast = i === breadcrumb.length - 1;
                    return (
                      <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
                        {i > 0 && (
                          <ChevronRightIcon aria-hidden className="size-3 shrink-0 opacity-50" />
                        )}
                        {crumb.href && !isLast ? (
                          <a href={crumb.href} className="truncate transition-colors hover:text-foreground">
                            {crumb.label}
                          </a>
                        ) : (
                          <span aria-current={isLast ? "page" : undefined} className="truncate text-foreground">
                            {crumb.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onSearchClick}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border px-3 text-sm text-muted-foreground",
                  "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
                  "hover:border-ring hover:text-foreground",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                )}
              >
                <SearchIcon aria-hidden className="size-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden rounded-[var(--radius-sm)] border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground sm:inline">
                  ⌘K
                </kbd>
              </button>

              <div className="flex items-center gap-2.5 border-l border-border pl-3">
                <Avatar size="sm">
                  {user.avatarSrc && <AvatarImage src={user.avatarSrc} alt={user.name} />}
                  <AvatarFallback>{initials(user.name) || "?"}</AvatarFallback>
                </Avatar>
                <div className="hidden leading-tight md:block">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-8 p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </Sheet>
    </div>
  );
}
