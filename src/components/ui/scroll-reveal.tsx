"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  ...options
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(options);

  return (
    // @ts-expect-error - dynamic tag typing
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
