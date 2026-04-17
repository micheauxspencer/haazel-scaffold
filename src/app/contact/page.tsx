import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/PageHero";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us",
  description: `Get in touch with ${brand.client.name}. Let's discuss your next project.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have a project in mind? We'd love to hear about it."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground font-display">
                Send us a message
              </h2>
              <p className="mb-8 text-muted-foreground">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-10">
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
                Get in touch
              </h2>

              <div className="space-y-6">
                {brand.client.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Email
                      </p>
                      <a
                        href={`mailto:${brand.client.email}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {brand.client.email}
                      </a>
                    </div>
                  </div>
                )}

                {brand.client.phone && (
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Phone
                      </p>
                      <a
                        href={`tel:${brand.client.phone}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {brand.client.phone}
                      </a>
                    </div>
                  </div>
                )}

                {brand.client.address && (
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {brand.client.address.city},{" "}
                        {brand.client.address.region}{" "}
                        {brand.client.address.postalCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                <div className="flex aspect-[4/3] items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-3 size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      Map integration coming soon
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      {brand.client.address?.city},{" "}
                      {brand.client.address?.region}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
