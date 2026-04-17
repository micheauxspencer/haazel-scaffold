import type { Metadata } from "next";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${brand.client.name}. Learn how we collect, use, and protect your data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle={`How ${brand.client.name} collects, uses, and protects your information.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <h2>Information We Collect</h2>
            <p>
              When you visit our website, we may collect certain information
              automatically, including your IP address, browser type, operating
              system, referring URLs, and information about how you interact
              with our site.
            </p>
            <p>
              If you contact us through our website forms, we collect the
              information you provide, such as your name, email address, and
              message content.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send you relevant communications (with your consent)</li>
              <li>Analyze website usage and performance</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information with trusted service
              providers who assist us in operating our website and conducting
              our business, provided they agree to keep this information
              confidential.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience.
              You can choose to disable cookies through your browser settings,
              though this may affect site functionality.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <h2>Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal
              information. To exercise these rights, please contact us at{" "}
              <a href={`mailto:${brand.client.email}`}>{brand.client.email}</a>.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact
              us at{" "}
              <a href={`mailto:${brand.client.email}`}>{brand.client.email}</a>{" "}
              or call us at {brand.client.phone}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
