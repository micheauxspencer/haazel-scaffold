/**
 * HAAZEL — Catalog drift check.
 *
 * Verifies src/components/COMPONENT_CATALOG.md lists exactly the components
 * that exist in src/components/{cinematic,primitives,sections/*}. This is the
 * guard that ends the "docs say 14, code has 34" class of drift.
 *
 * Usage: npm run check:catalog   (exit 1 on drift)
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS = path.join(ROOT, "src", "components");
const CATALOG = path.join(COMPONENTS, "COMPONENT_CATALOG.md");

function componentFiles(): string[] {
  const found: string[] = [];
  const scanDirs = [path.join(COMPONENTS, "cinematic"), path.join(COMPONENTS, "primitives")];
  const sectionsRoot = path.join(COMPONENTS, "sections");
  if (fs.existsSync(sectionsRoot)) {
    for (const entry of fs.readdirSync(sectionsRoot, { withFileTypes: true })) {
      if (entry.isDirectory()) scanDirs.push(path.join(sectionsRoot, entry.name));
    }
  }
  for (const dir of scanDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".tsx") && !file.startsWith("index")) {
        found.push(path.basename(file, ".tsx"));
      }
    }
  }
  return found;
}

function catalogEntries(): string[] {
  if (!fs.existsSync(CATALOG)) {
    console.error(`Catalog not found: ${path.relative(ROOT, CATALOG)}`);
    process.exit(1);
  }
  const entries: string[] = [];
  for (const line of fs.readFileSync(CATALOG, "utf-8").split("\n")) {
    const m = line.match(/^###\s+([A-Za-z0-9]+)\s*$/);
    if (m) entries.push(m[1]);
  }
  return entries;
}

const inCode = new Set(componentFiles());
const inCatalog = new Set(catalogEntries());

const missingFromCatalog = [...inCode].filter((c) => !inCatalog.has(c)).sort();
const missingFromCode = [...inCatalog].filter((c) => !inCode.has(c)).sort();

if (missingFromCatalog.length || missingFromCode.length) {
  console.error("check:catalog FAILED — catalog and code drifted:");
  for (const c of missingFromCatalog) console.error(`  - in code, missing from catalog: ${c}`);
  for (const c of missingFromCode) console.error(`  - in catalog, missing from code: ${c}`);
  process.exit(1);
}
console.log(`check:catalog OK — ${inCode.size} components, catalog in sync.`);
