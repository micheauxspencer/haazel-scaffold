import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description: `Terms of service for ${brand.client.name}. Review the terms governing use of our website and services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        subtitle="Please review the terms and conditions governing use of our website and services."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the {brand.client.name} website, you agree
              to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our website.
            </p>

            <h2>Services</h2>
            <p>
              {brand.client.name} provides web design, development, and
              digital marketing services. Specific project terms, deliverables,
              timelines, and pricing are outlined in individual project
              agreements.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos,
              images, and software, is the property of {brand.client.name} or
              its content suppliers and is protected by intellectual property
              laws.
            </p>
            <p>
              Upon full payment, clients receive ownership of custom
              deliverables as outlined in their project agreement. We retain
              the right to display completed work in our portfolio.
            </p>

            <h2>User Responsibilities</h2>
            <p>When using our website, you agree to:</p>
            <ul>
              <li>Provide accurate information when contacting us</li>
              <li>Not use the site for any unlawful purpose</li>
              <li>Not attempt to gain unauthorized access to any part of the site</li>
              <li>Not reproduce or distribute content without permission</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              {brand.client.name} shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your
              use of our website or services. Our total liability shall not
              exceed the amount paid for the specific service in question.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the content, privacy policies, or practices of
              any third-party sites.
            </p>

            <h2>Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our
              website at our sole discretion, without notice, for conduct
              that we believe violates these terms or is harmful to other
              users, us, or third parties.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance
              with the laws of {brand.client.address?.region ?? "Ontario"},{" "}
              {brand.client.address?.country === "CA" ? "Canada" : brand.client.address?.country ?? "Canada"}.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href={`mailto:${brand.client.email}`}>{brand.client.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
