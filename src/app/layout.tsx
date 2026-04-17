import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GSAPProvider } from "@/lib/animations/gsap-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { brand } from "@/lib/brand.config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateLocalBusinessSchema } from "@/lib/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generatePageMetadata({
  title: brand.client.name,
  description: brand.client.description,
  path: "/",
});

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateLocalBusinessSchema(brand);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
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
                ctaLabel="Get in Touch"
                ctaHref="/contact"
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
