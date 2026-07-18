"use client";

import { Fragment, useEffect, type ReactNode } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export interface CommandPaletteItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  heading: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandPaletteGroup[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Command palette — wraps `ui/command`'s cmdk-based `CommandDialog` and adds
 * a global Ctrl/Cmd+K toggle (listener cleaned up on unmount). Fully
 * controlled: parent owns `open`/`onOpenChange` (e.g. wired to AppShell's
 * `onSearchClick`).
 */
export default function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = "Type a command or search…",
  emptyMessage = "No results found.",
  className = "",
}: CommandPaletteProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const runItem = (item: CommandPaletteItem) => {
    onOpenChange(false);
    item.onSelect();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description={placeholder}
      className={className}
    >
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group, groupIndex) => (
          <Fragment key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.label} onSelect={() => runItem(item)}>
                  {item.icon && (
                    <span
                      aria-hidden
                      className="flex size-4 items-center justify-center [&_svg]:size-4"
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
            {groupIndex < groups.length - 1 && <CommandSeparator />}
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
