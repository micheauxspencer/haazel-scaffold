/**
 * Route registry — the single list of live routes for this site.
 *
 * `npm run prune` rewrites this file when routes are removed, and
 * sitemap.ts derives from it, so pruned routes can never leak into
 * the sitemap. Keep entries in sync with src/app/ route directories.
 */

export interface SiteRoute {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

// HAAZEL:ROUTES — rewritten by `npm run prune`
export const siteRoutes: SiteRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

/** Dynamic-route features; prune flips these when the routes are removed. */
export const blogEnabled = true;
export const servicesEnabled = true;
// /HAAZEL:ROUTES
