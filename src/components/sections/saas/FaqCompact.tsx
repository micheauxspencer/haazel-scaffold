import SectionShell from "@/components/primitives/SectionShell";
import EditorialSplit from "@/components/primitives/EditorialSplit";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCompactProps {
  id?: string;
  rail?: { label: string; meta?: string };
  heading: string;
  intro?: string;
  items: FaqItem[];
  className?: string;
}

/**
 * EditorialSplit 38/62: heading+intro pinned left, ui/accordion answers
 * right with hairline dividers. EditorialSplit's own `sticky` prop only
 * targets its `media` slot (built for sticky-image/scrolling-copy), and
 * here it's inverted — the accordion lives in `media` (62%, unpinned) and
 * the heading lives in `children` (38%, pinned) — so stickiness is applied
 * by hand on the children wrapper instead of via the `sticky` prop. The
 * accordion is a Base UI primitive (@/components/ui/accordion) that owns
 * its own open/close state and client boundary, so this file stays a
 * server component.
 */
export default function FaqCompact({
  id = "faq",
  rail,
  heading,
  intro,
  items,
  className = "",
}: FaqCompactProps) {
  return (
    <SectionShell id={id} rail={rail} className={className}>
      <EditorialSplit
        ratio="62/38"
        flip
        align="start"
        media={
          <Accordion defaultValue={[0]} className="w-full">
            {items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={i}
                className="[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]"
              >
                <AccordionTrigger className="py-5 font-heading text-lg font-medium transition-colors duration-[var(--duration-base)] [transition-timing-function:var(--ease-standard)] hover:text-primary hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        }
      >
        <div className="md:sticky md:top-[clamp(4rem,10vh,7rem)] md:self-start">
          <h2 className="text-heading font-heading font-medium">{heading}</h2>
          {intro && <p className="mt-4 max-w-[34ch] text-muted-foreground">{intro}</p>}
        </div>
      </EditorialSplit>
    </SectionShell>
  );
}
