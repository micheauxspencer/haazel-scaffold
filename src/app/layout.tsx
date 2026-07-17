import type { Metadata } from "next";
// HAAZEL:FONTS — written by `npm run tokens:apply`; do not hand-edit inside markers
import { Geist, Geist_Mono } from "next/font/google";

const fontBody = Geist({
  variable: "--haazel-font-body",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--haazel-font-mono",
  subsets: ["latin"],
});

/** One className entry per loaded font; heading/display alias body by default. */
const fontClassNames = `${fontBody.variable} ${fontMono.variable}`;
/** Extra vars for roles that alias another loaded family. */
const fontAliasStyle: React.CSSProperties = {
  ["--haazel-font-heading" as string]: "var(--haazel-font-body)",
  ["--haazel-font-display" as string]: "var(--haazel-font-body)",
};
// /HAAZEL:FONTS
// HAAZEL:SCHEME — written by `npm run tokens:apply`; "dark" | "" per tokens meta.colorScheme
const schemeClass = "dark";
// /HAAZEL:SCHEME
import { TooltipProvider } from "@/components/ui/tooltip";
import { GSAPProvider } from "@/lib/animations/gsap-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateLocalBusinessSchema } from "@/lib/seo/json-ld";
import "./globals.css";

export const metadata: Metadata = generatePageMetadata({
  title: brand.client.name,
  description: brand.client.description,
  path: "/",
});

// HAAZEL:NAV — rewritten by `npm run prune` to match kept routes
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
const ctaLabel = "Get in Touch";
const ctaHref = "/contact";
// /HAAZEL:NAV

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateLocalBusinessSchema(brand);

  return (
    <html
      lang="en"
      className={`${fontClassNames} ${schemeClass} h-full antialiased`.trim()}
      style={fontAliasStyle}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TooltipProvider>
          <GSAPProvider preset={brand.stylePreset}>
            <SmoothScroll>
              <Navbar
                brandName={brand.client.name}
                links={navLinks}
                ctaLabel={ctaLabel}
                ctaHref={ctaHref}
              />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScroll>
          </GSAPProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
