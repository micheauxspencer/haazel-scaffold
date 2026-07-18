"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CommandPalette from "@/components/sections/app/CommandPalette";
import { commandPaletteFixture } from "@/components/sections/app/fixtures";

/**
 * CommandPalette is fully controlled (`open`/`onOpenChange` are required
 * props — see AppShellNavItem doc comment: "parent owns open/onOpenChange").
 * A Server Component can't hold that state, so this is its own small client
 * island: a visible trigger button + the palette itself. The palette's own
 * global Ctrl/Cmd+K listener (see CommandPalette.tsx) works the moment this
 * mounts, independent of the trigger button.
 */
export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border px-4 text-sm text-foreground",
          "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-standard)]",
          "hover:border-ring hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
        <SearchIcon aria-hidden className="size-4" />
        Open command palette
        <kbd className="rounded-[var(--radius-sm)] border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      <p className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">
        Also opens on Ctrl/Cmd+K anywhere on this page.
      </p>
      <CommandPalette {...commandPaletteFixture} open={open} onOpenChange={setOpen} />
    </div>
  );
}
