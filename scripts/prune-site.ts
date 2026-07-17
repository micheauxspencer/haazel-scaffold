/**
 * HAAZEL — Site Pruner
 *
 * Removes scaffold demo routes/sections a client site doesn't use, and keeps
 * nav + sitemap consistent so dead demo pages can never ship to production.
 *
 * Usage:
 *   npm run prune -- --keep about,contact            # dry-run (default)
 *   npm run prune -- --keep about,blog,contact --write
 *   npm run prune -- --keep none --write             # one-pager: home only
 *
 * Route names: about, services, blog, contact, privacy, terms.
 * "home" is always kept. /showcase is ALWAYS removed on --write (dev harness).
 *
 * What --write does:
 *   1. Deletes src/app/<route>/ for every route not kept (+ showcase).
 *   2. Rewrites the HAAZEL:ROUTES region in src/lib/site-routes.ts
 *      (sitemap.ts derives from it).
 *   3. Rewrites the HAAZEL:NAV regions in src/app/layout.tsx and
 *      src/components/layout/Footer.tsx. If /contact is pruned, the navbar
 *      CTA becomes "#contact" (anchor) so it never 404s.
 *   4. Deletes unreferenced demo sections in src/components/sections/ (only
 *      the 8 stock scaffold demos; bespoke section packs are never touched).
 *   5. Warns about leftover references to pruned routes across src/.
 */

import * as fs from "fs";
import * as path from "path";
import { replaceRegion } from "./lib/regions";

const ROOT = path.resolve(__dirname, "..");

interface RouteDef {
  label: string;
  changeFrequency: string;
  priority: number;
  nav: boolean;
}

const PRUNABLE: Record<string, RouteDef> = {
  about: { label: "About", changeFrequency: "monthly", priority: 0.8, nav: true },
  services: { label: "Services", changeFrequency: "monthly", priority: 0.8, nav: true },
  blog: { label: "Blog", changeFrequency: "daily", priority: 0.9, nav: true },
  contact: { label: "Contact", changeFrequency: "monthly", priority: 0.7, nav: true },
  privacy: { label: "Privacy", changeFrequency: "yearly", priority: 0.3, nav: false },
  terms: { label: "Terms", changeFrequency: "yearly", priority: 0.3, nav: false },
};

const DEMO_SECTIONS = [
  "HeroSection", "AboutSection", "ServicesGrid", "StatsCounter",
  "TestimonialsSection", "FAQSection", "BlogPreviewSection", "CTASection",
];

function walk(dir: string, exts: string[], acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, exts, acc);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      acc.push(full);
    }
  }
  return acc;
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const keepFlag = args.indexOf("--keep");
  if (keepFlag === -1 || !args[keepFlag + 1]) {
    console.error("Usage: npm run prune -- --keep <route,route|none> [--write]");
    console.error(`Prunable routes: ${Object.keys(PRUNABLE).join(", ")}`);
    process.exit(1);
  }

  // PowerShell splits `a,b` into separate argv entries — gather every value
  // after --keep up to the next flag, then split on commas/whitespace.
  const keepValues: string[] = [];
  for (let i = keepFlag + 1; i < args.length && !args[i].startsWith("--"); i++) {
    keepValues.push(...args[i].split(/[,\s]+/));
  }
  const cleaned = keepValues.map((s) => s.trim()).filter(Boolean);
  const keep = new Set(cleaned.filter((s) => s !== "none" && s !== "home"));
  for (const name of keep) {
    if (!PRUNABLE[name]) {
      console.error(`Unknown route "${name}". Prunable: ${Object.keys(PRUNABLE).join(", ")}`);
      process.exit(1);
    }
  }

  const prune = Object.keys(PRUNABLE).filter((r) => !keep.has(r));
  const mode = write ? "WRITE" : "DRY-RUN";
  console.log(`prune-site [${mode}] keep: home${keep.size ? ", " + [...keep].join(", ") : ""}`);
  console.log(`  removing routes: ${prune.join(", ") || "(none)"} + showcase`);

  // 1. Route directories
  const dirsToDelete = [...prune, "showcase"]
    .map((r) => path.join(ROOT, "src", "app", r))
    .filter((d) => fs.existsSync(d));
  for (const dir of dirsToDelete) {
    console.log(`  ${write ? "delete" : "would delete"} ${path.relative(ROOT, dir)}\\`);
    if (write) fs.rmSync(dir, { recursive: true, force: true });
  }

  // 2. site-routes.ts registry
  const routesBody: string[] = [
    `export const siteRoutes: SiteRoute[] = [`,
    `  { path: "/", changeFrequency: "weekly", priority: 1.0 },`,
    ...[...keep].map((r) => {
      const def = PRUNABLE[r];
      return `  { path: "/${r}", changeFrequency: "${def.changeFrequency}", priority: ${def.priority} },`;
    }),
    `];`,
    ``,
    `/** Dynamic-route features; prune flips these when the routes are removed. */`,
    `export const blogEnabled = ${keep.has("blog")};`,
    `export const servicesEnabled = ${keep.has("services")};`,
  ];
  const siteRoutesPath = path.join(ROOT, "src", "lib", "site-routes.ts");
  if (write) {
    fs.writeFileSync(
      siteRoutesPath,
      replaceRegion(fs.readFileSync(siteRoutesPath, "utf-8"), "ROUTES", routesBody),
    );
  }
  console.log(`  ${write ? "rewrote" : "would rewrite"} src/lib/site-routes.ts (HAAZEL:ROUTES)`);

  // 3. Nav regions (layout + footer)
  const navEntries = [
    `  { label: "Home", href: "/" },`,
    ...[...keep].filter((r) => PRUNABLE[r].nav).map(
      (r) => `  { label: "${PRUNABLE[r].label}", href: "/${r}" },`,
    ),
  ];
  const ctaHref = keep.has("contact") ? "/contact" : "#contact";
  const layoutNavBody = [
    `const navLinks = [`,
    ...navEntries,
    `];`,
    `const ctaLabel = "Get in Touch";`,
    `const ctaHref = "${ctaHref}";`,
  ];
  const footerNavBody = [`const navLinks = [`, ...navEntries, `];`];

  const layoutPath = path.join(ROOT, "src", "app", "layout.tsx");
  const footerPath = path.join(ROOT, "src", "components", "layout", "Footer.tsx");
  if (write) {
    fs.writeFileSync(
      layoutPath,
      replaceRegion(fs.readFileSync(layoutPath, "utf-8"), "NAV", layoutNavBody),
    );
    fs.writeFileSync(
      footerPath,
      replaceRegion(fs.readFileSync(footerPath, "utf-8"), "NAV", footerNavBody),
    );
  }
  console.log(`  ${write ? "rewrote" : "would rewrite"} layout.tsx + Footer.tsx (HAAZEL:NAV, cta → ${ctaHref})`);

  // 4. Unreferenced stock demo sections
  const sourceFiles = walk(path.join(ROOT, "src"), [".tsx", ".ts"]);
  const sectionsDir = path.join(ROOT, "src", "components", "sections");
  for (const name of DEMO_SECTIONS) {
    const file = path.join(sectionsDir, `${name}.tsx`);
    if (!fs.existsSync(file)) continue;
    const referenced = sourceFiles.some((f) => {
      if (path.resolve(f) === path.resolve(file)) return false;
      const content = fs.readFileSync(f, "utf-8");
      return content.includes(`sections/${name}`);
    });
    if (!referenced) {
      console.log(`  ${write ? "delete" : "would delete"} src/components/sections/${name}.tsx (unreferenced demo)`);
      if (write) fs.rmSync(file, { force: true });
    }
  }

  // 5. Leftover references to pruned routes.
  // In dry-run, skip files that --write would delete or rewrite anyway —
  // the post-write scan is the exact one.
  const rewrittenFiles = new Set(
    [layoutPath, footerPath, siteRoutesPath].map((p) => path.resolve(p)),
  );
  const currentFiles = walk(path.join(ROOT, "src"), [".tsx", ".ts"]).filter((f) => {
    if (write) return true;
    const abs = path.resolve(f);
    if (rewrittenFiles.has(abs)) return false;
    return !dirsToDelete.some((d) => abs.startsWith(path.resolve(d) + path.sep));
  });
  const warnings: string[] = [];
  for (const r of prune) {
    const needle = `"/${r}`;
    for (const f of currentFiles) {
      const content = fs.readFileSync(f, "utf-8");
      if (content.includes(needle)) {
        warnings.push(`${path.relative(ROOT, f)} still references "/${r}"`);
      }
    }
  }
  if (warnings.length) {
    console.log(`  WARNINGS (fix by hand or via haazel QA):`);
    for (const w of [...new Set(warnings)]) console.log(`    - ${w}`);
  }

  if (!write) {
    console.log(`\nDry run only. Re-run with --write to apply.`);
  } else {
    console.log(`\nDone. Run \`npx next build\` to verify.`);
  }
}

main();
