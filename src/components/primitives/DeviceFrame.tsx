import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DeviceFrameProps {
  /** Screenshot / demo media. */
  children: ReactNode;
  variant?: "browser" | "phone" | "bare";
  /** Shown in the browser variant's URL pill. */
  url?: string;
  /** Ambient glow behind the frame (primary-tinted). */
  glow?: boolean;
  /** Any CSS color for the glow. */
  glowColor?: string;
  className?: string;
}

/**
 * Product-shot framing for SaaS/app imagery: browser chrome, phone shell, or
 * bare panel — with an optional ambient glow. Keeps screenshots looking like
 * product, not pasted rectangles. Static by design; wrap in TiltCard or an
 * OverlapItem for motion.
 */
export default function DeviceFrame({
  children,
  variant = "browser",
  url,
  glow = true,
  glowColor = "var(--primary)",
  className = "",
}: DeviceFrameProps) {
  const frame = (
    <div
      className={cn(
        "relative overflow-hidden border bg-card",
        "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
        variant === "phone"
          ? "mx-auto aspect-[9/19] w-full max-w-[22rem] rounded-[2.5rem] border-[6px]"
          : "rounded-[var(--radius-lg)]",
        "shadow-[0_24px_80px_-24px_color-mix(in_oklab,var(--background)_20%,rgb(0_0_0/0.45))]",
      )}
    >
      {variant === "browser" && (
        <div
          className={cn(
            "flex items-center gap-3 border-b px-4 py-2.5",
            "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
            "bg-[color-mix(in_oklab,var(--card)_92%,var(--foreground)_8%)]",
          )}
        >
          <div className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklab,var(--foreground)_22%,transparent)]"
              />
            ))}
          </div>
          {url && (
            <span className="mx-auto flex-1 truncate rounded-[var(--radius-sm)] bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)] px-3 py-1 text-center font-mono text-[0.6875rem] text-muted-foreground">
              {url}
            </span>
          )}
        </div>
      )}
      {variant === "phone" && (
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_16%,var(--card))]" aria-hidden />
      )}
      <div className="[&>img]:block [&>img]:w-full [&>video]:block [&>video]:w-full">
        {children}
      </div>
    </div>
  );

  if (!glow) return <div className={className}>{frame}</div>;

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        // Halo spread comes from blur (ink overflow) — scaled/inset boxes
        // would widen the document's scrollable area on small screens.
        className="absolute inset-0 -z-10 rounded-[50%] blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, color-mix(in oklab, ${glowColor} 30%, transparent), transparent 72%)`,
        }}
      />
      {frame}
    </div>
  );
}
