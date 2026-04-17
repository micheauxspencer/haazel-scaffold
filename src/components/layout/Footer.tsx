import Link from "next/link";
import { brand } from "@/lib/brand.config";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socialIcons: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  github: "GitHub",
};

export function Footer() {
  const { client } = brand;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground font-display"
            >
              {client.name}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {client.tagline}
            </p>
          </div>

          {/* Navigation column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <ul className="space-y-2">
              {client.socials?.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {socialIcons[social.platform] ?? social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {client.email && (
                <li>
                  <a
                    href={`mailto:${client.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {client.email}
                  </a>
                </li>
              )}
              {client.phone && (
                <li>
                  <a
                    href={`tel:${client.phone.replace(/\D/g, "")}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {client.phone}
                  </a>
                </li>
              )}
              {client.address && (
                <li>
                  {client.address.city}, {client.address.region}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {year} {client.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
