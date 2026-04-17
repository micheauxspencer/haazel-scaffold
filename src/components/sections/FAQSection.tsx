"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  heading?: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

export function FAQSection({
  heading = "Frequently asked questions",
  subtitle,
  faqs,
  className,
}: FAQSectionProps) {
  // Build JSON-LD FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl">
              {heading}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={String(index)}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
