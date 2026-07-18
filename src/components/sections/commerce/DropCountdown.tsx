"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface DropCountdownProps {
  id?: string;
  rail?: { label: string; meta?: string };
  /** ISO date-time the drop opens or closes. */
  target: string;
  /** Rendered in place of the digits once `target` has passed. */
  live?: ReactNode;
  label?: string;
  className?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

const ZERO: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

function getRemaining(target: string): Remaining {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { ...ZERO, done: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  };
}

/**
 * Digit countdown to `target`. Server render and first client paint both
 * show the zeroed placeholder (mounted=false) — the real, clock-derived
 * value only appears after the effect runs, so hydration never has to
 * reconcile a server timestamp against a client one. Ticks via a single
 * setInterval, torn down on unmount; swaps to the `live` slot at zero.
 */
export default function DropCountdown({
  id = "countdown",
  rail,
  target,
  live,
  label = "Drop ends in",
  className = "",
}: DropCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState<Remaining>(ZERO);

  useEffect(() => {
    setMounted(true);
    setRemaining(getRemaining(target));
    const intervalId = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(intervalId);
  }, [target]);

  const isLive = mounted && remaining.done;
  const units: { value: number; label: string }[] = [
    { value: remaining.days, label: "days" },
    { value: remaining.hours, label: "hrs" },
    { value: remaining.minutes, label: "min" },
    { value: remaining.seconds, label: "sec" },
  ];

  return (
    <SectionShell id={id} rail={rail} className={className}>
      {isLive ? (
        live
      ) : (
        <div className="inline-flex flex-col gap-4">
          {label && <CaptionRail label={label} rule="none" />}
          <div
            role="timer"
            aria-label={label}
            className={cn(
              "flex divide-x",
              "[border-color:color-mix(in_oklab,var(--foreground)_15%,transparent)]",
              "divide-[color-mix(in_oklab,var(--foreground)_15%,transparent)]",
            )}
          >
            {units.map((u) => (
              <div key={u.label} className="flex flex-col items-center px-5 first:pl-0 last:pr-0">
                <span className="font-display text-display tabular-nums font-medium tracking-tight">
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="mt-1 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
