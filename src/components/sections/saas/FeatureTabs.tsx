import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionShell from "@/components/primitives/SectionShell";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import DeviceFrame from "@/components/primitives/DeviceFrame";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface FeatureTabsItem {
  label: string;
  description?: string;
  /** Screenshot/demo rendered inside the DeviceFrame when this tab is active. */
  media: ReactNode;
}

export interface FeatureTabsProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  items: FeatureTabsItem[];
  /** URL shown in the DeviceFrame's browser-chrome pill. */
  mediaUrl?: string;
  className?: string;
}

/**
 * Vertical tab rail (38%) driving a DeviceFrame-framed media panel (62%),
 * composed via EditorialSplit(flip). Tabs/panels are the real Base UI
 * primitives at @/components/ui/tabs (Tabs.Root/List/Tab/Panel under the
 * shadcn names) — roving-tabindex keyboard nav and panel mount/unmount
 * come from the library for free. This file holds no interactive state of
 * its own (uncontrolled defaultValue), so it stays a server component; the
 * "use client" boundary already lives inside ui/tabs.tsx.
 */
export default function FeatureTabs({
  id = "feature-tabs",
  rail,
  heading,
  intro,
  items,
  mediaUrl,
  className = "",
}: FeatureTabsProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <div className="mb-[var(--content-gap)] max-w-2xl">
        <h2 className="text-heading font-heading font-medium">{heading}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>

      <Tabs defaultValue={0} orientation="vertical">
        <EditorialSplit
          ratio="62/38"
          flip
          align="start"
          media={
            <DeviceFrame url={mediaUrl} glow>
              {items.map((item, i) => (
                <TabsContent key={item.label} value={i}>
                  {item.media}
                </TabsContent>
              ))}
            </DeviceFrame>
          }
        >
          <TabsList variant="line" className="h-fit w-full flex-col items-stretch gap-0 bg-transparent p-0">
            {items.map((item, i) => (
              <TabsTrigger
                key={item.label}
                value={i}
                className={cn(
                  "group/trigger h-auto grow-0 flex-col items-start justify-start gap-1.5 whitespace-normal",
                  "rounded-none border-b px-0 py-5 text-left data-active:bg-transparent",
                  "[border-color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground",
                    "transition-colors duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
                    "group-data-active/trigger:text-primary",
                  )}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    "font-heading text-lg font-medium text-foreground/70",
                    "transition-colors duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)]",
                    "group-data-active/trigger:text-foreground",
                  )}
                >
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-sm font-normal text-muted-foreground">{item.description}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </EditorialSplit>
      </Tabs>
    </SectionShell>
  );
}
