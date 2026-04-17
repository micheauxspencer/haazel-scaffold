/**
 * HAAZEL SCAFFOLD — Brand Setup Script
 *
 * Reads brand.config.ts and:
 * - Creates/updates .env.local with Sanity config
 * - Outputs a summary of the brand configuration
 * - Optionally generates CSS custom property values (--generate-css flag)
 *
 * Usage:
 *   npx tsx scripts/setup-brand.ts
 *   npx tsx scripts/setup-brand.ts --generate-css
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

async function loadBrandConfig() {
  // Dynamic import of brand.config.ts
  const configPath = path.join(ROOT, "brand.config.ts");
  if (!fs.existsSync(configPath)) {
    console.error("ERROR: brand.config.ts not found at project root.");
    process.exit(1);
  }
  const mod = await import(configPath);
  return mod.brand;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function formatHSL(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  return `${h} ${s}% ${l}%`;
}

function updateEnvLocal(
  sanityProjectId: string,
  sanityDataset: string,
  domain: string
) {
  const envPath = path.join(ROOT, ".env.local");
  let existing: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex);
        const val = trimmed.substring(eqIndex + 1);
        existing[key] = val;
      }
    }
  }

  // Only set values that are empty or missing
  const defaults: Record<string, string> = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: sanityProjectId,
    NEXT_PUBLIC_SANITY_DATASET: sanityDataset,
    SANITY_API_TOKEN: "",
    FAL_KEY: "",
    NEXT_PUBLIC_SITE_URL: `https://${domain}`,
  };

  let changed = false;
  for (const [key, defaultVal] of Object.entries(defaults)) {
    if (!existing[key] && defaultVal) {
      existing[key] = defaultVal;
      changed = true;
      console.log(`  SET ${key}=${defaultVal}`);
    } else if (existing[key]) {
      console.log(`  SKIP ${key} (already set)`);
    } else {
      console.log(`  SKIP ${key} (no default value, set manually)`);
    }
  }

  if (changed) {
    const lines = Object.entries(existing).map(([k, v]) => `${k}=${v}`);
    fs.writeFileSync(envPath, lines.join("\n") + "\n");
    console.log("\n  .env.local updated.");
  } else {
    console.log("\n  .env.local unchanged (all values already set).");
  }
}

function generateCSSProperties(colors: Record<string, string>): string {
  const mapping: Record<string, string> = {
    background: "background",
    foreground: "foreground",
    primary: "primary",
    primaryDark: "primary-foreground",
    secondary: "secondary",
    accent: "accent",
    muted: "muted",
    mutedForeground: "muted-foreground",
    card: "card",
    cardForeground: "card-foreground",
    border: "border",
  };

  const lines: string[] = [];
  lines.push("/* Generated from brand.config.ts */");
  lines.push("/* Paste these into your globals.css :root / @theme block */");
  lines.push("");

  for (const [configKey, cssVar] of Object.entries(mapping)) {
    const hex = colors[configKey];
    if (hex) {
      lines.push(`  --${cssVar}: ${formatHSL(hex)};`);
    }
  }

  // Add commonly needed derived tokens
  lines.push("");
  lines.push("  /* Additional tokens (adjust as needed) */");
  lines.push(`  --ring: ${formatHSL(colors.primary)};`);
  lines.push(`  --input: ${formatHSL(colors.border)};`);

  if (colors.primaryLight) {
    lines.push(`  --primary-light: ${formatHSL(colors.primaryLight)};`);
  }
  if (colors.secondary) {
    lines.push(
      `  --secondary-foreground: ${formatHSL(colors.foreground)};`
    );
  }
  if (colors.accent) {
    lines.push(`  --accent-foreground: ${formatHSL(colors.foreground)};`);
  }

  return lines.join("\n");
}

async function main() {
  const flags = process.argv.slice(2);
  const generateCSS = flags.includes("--generate-css");

  console.log("");
  console.log("===========================================");
  console.log("  HAAZEL SCAFFOLD — Brand Setup");
  console.log("===========================================");
  console.log("");

  const brand = await loadBrandConfig();

  // ── Summary ──
  console.log("BRAND CONFIGURATION SUMMARY");
  console.log("-------------------------------------------");
  console.log(`  Client:        ${brand.client.name}`);
  console.log(`  Slug:          ${brand.client.slug}`);
  console.log(`  Domain:        ${brand.client.domain}`);
  console.log(`  Tagline:       ${brand.client.tagline}`);
  console.log(`  Style Preset:  ${brand.stylePreset}`);
  console.log(`  Sanity ID:     ${brand.sanity.projectId}`);
  console.log(`  Sanity Dataset: ${brand.sanity.dataset}`);
  console.log("");

  console.log("COLORS");
  console.log("-------------------------------------------");
  for (const [key, val] of Object.entries(brand.colors)) {
    console.log(`  ${key.padEnd(18)} ${val}  ->  hsl(${formatHSL(val as string)})`);
  }
  console.log("");

  console.log("TYPOGRAPHY");
  console.log("-------------------------------------------");
  console.log(`  Display:  ${brand.typography.display}`);
  console.log(`  Heading:  ${brand.typography.heading}`);
  console.log(`  Body:     ${brand.typography.body}`);
  if (brand.typography.accent) console.log(`  Accent:   ${brand.typography.accent}`);
  if (brand.typography.mono) console.log(`  Mono:     ${brand.typography.mono}`);
  console.log("");

  console.log("VOICE");
  console.log("-------------------------------------------");
  console.log(`  Tone:     ${brand.voice.tone.join(", ")}`);
  console.log(`  Style:    ${brand.voice.writingStyle}`);
  console.log(`  Banned:   ${brand.voice.bannedPhrases.join(", ")}`);
  console.log("");

  console.log("BLOG CONFIG");
  console.log("-------------------------------------------");
  console.log(`  Author:     ${brand.blog.authorName}`);
  console.log(`  Niche:      ${brand.blog.niche}`);
  console.log(`  Audience:   ${brand.blog.targetAudience}`);
  console.log(`  Region:     ${brand.blog.region}`);
  console.log(`  Schedule:   ${brand.blog.schedule}`);
  console.log(`  Categories: ${brand.blog.topicCategories.join(", ")}`);
  console.log("");

  console.log("IMAGE GENERATION");
  console.log("-------------------------------------------");
  console.log(`  Style:    ${brand.imagery.style}`);
  console.log(`  Cameras:  ${brand.imagery.cameras.join(", ")}`);
  console.log(`  Lenses:   ${brand.imagery.lenses.join(", ")}`);
  console.log(`  Subjects: ${brand.imagery.subjects.join(", ")}`);
  console.log("");

  // ── .env.local ──
  console.log("ENVIRONMENT (.env.local)");
  console.log("-------------------------------------------");
  if (brand.sanity.projectId === "REPLACE_ME") {
    console.log(
      "  WARNING: sanity.projectId is still 'REPLACE_ME'. Update brand.config.ts first."
    );
    console.log("");
  } else {
    updateEnvLocal(brand.sanity.projectId, brand.sanity.dataset, brand.client.domain);
    console.log("");
  }

  // ── CSS Generation ──
  if (generateCSS) {
    console.log("CSS CUSTOM PROPERTIES (--generate-css)");
    console.log("-------------------------------------------");
    console.log("Copy these into your globals.css :root block:");
    console.log("");
    console.log(generateCSSProperties(brand.colors));
    console.log("");
  } else {
    console.log("NEXT STEPS");
    console.log("-------------------------------------------");
    console.log("  1. Update globals.css @theme colors to match your brand palette.");
    console.log("     Run with --generate-css to output CSS custom property values:");
    console.log("       npx tsx scripts/setup-brand.ts --generate-css");
    console.log("");
    console.log("  2. Set SANITY_API_TOKEN and FAL_KEY in .env.local");
    console.log("  3. Deploy Sanity schemas: npx tsx scripts/setup-sanity-schema.ts");
    console.log("  4. Load Google Fonts in layout.tsx using next/font/google");
    console.log("");
  }

  console.log("===========================================");
  console.log("  Setup complete.");
  console.log("===========================================");
  console.log("");
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
