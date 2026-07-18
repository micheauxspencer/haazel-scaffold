import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CaptionRail from "@/components/primitives/CaptionRail";

export interface ActivityFeedEntry {
  actor: { name: string; avatarSrc?: string };
  action: string;
  target?: string;
  time: string;
  icon?: ReactNode;
  /** Day-group label ("Today", "Jul 14") — read only when `groupByDay` is set. */
  date?: string;
}

export interface ActivityFeedProps {
  entries: ActivityFeedEntry[];
  /** Group consecutive entries sharing the same `date` under a heading. */
  groupByDay?: boolean;
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

function groupByDate(entries: ActivityFeedEntry[]) {
  const groups: { date: string; items: ActivityFeedEntry[] }[] = [];
  for (const entry of entries) {
    const date = entry.date ?? "";
    const current = groups[groups.length - 1];
    if (current && current.date === date) {
      current.items.push(entry);
    } else {
      groups.push({ date, items: [entry] });
    }
  }
  return groups;
}

function Timeline({ items }: { items: ActivityFeedEntry[] }) {
  return (
    <ol className="relative flex flex-col">
      <span
        aria-hidden
        className="absolute top-4 bottom-4 left-4 w-px -translate-x-1/2 bg-[color-mix(in_oklab,var(--foreground)_12%,transparent)]"
      />
      {items.map((entry, i) => (
        <li key={i} className="relative flex gap-4 py-3 first:pt-0 last:pb-0">
          <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-[color-mix(in_oklab,var(--foreground)_14%,transparent)]">
            {entry.icon ? (
              <span
                aria-hidden
                className="flex size-4 items-center justify-center text-muted-foreground [&_svg]:size-4"
              >
                {entry.icon}
              </span>
            ) : (
              <Avatar size="sm">
                {entry.actor.avatarSrc && (
                  <AvatarImage src={entry.actor.avatarSrc} alt={entry.actor.name} />
                )}
                <AvatarFallback>{initials(entry.actor.name) || "?"}</AvatarFallback>
              </Avatar>
            )}
          </span>
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1.5">
            <p className="min-w-0 text-sm leading-snug">
              <span className="font-medium text-foreground">{entry.actor.name}</span>{" "}
              <span className="text-muted-foreground">{entry.action}</span>
              {entry.target && (
                <>
                  {" "}
                  <span className="font-medium text-foreground">{entry.target}</span>
                </>
              )}
            </p>
            <time className="shrink-0 whitespace-nowrap font-mono text-overline tabular-nums text-muted-foreground">
              {entry.time}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Timeline — hairline left spine, avatar/icon nodes sitting on `bg-background`
 * to visually interrupt the line, mono right-aligned timestamps. Optional
 * day-grouped sections via `groupByDay` (reads each entry's `date` field).
 */
export default function ActivityFeed({ entries, groupByDay = false, className = "" }: ActivityFeedProps) {
  const groups = groupByDay ? groupByDate(entries) : [{ date: "", items: entries }];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {groups.map((group, gi) => (
        <div key={group.date || gi}>
          {groupByDay && group.date && (
            <CaptionRail label={group.date} rule="bottom" className="mb-3" />
          )}
          <Timeline items={group.items} />
        </div>
      ))}
    </div>
  );
}
