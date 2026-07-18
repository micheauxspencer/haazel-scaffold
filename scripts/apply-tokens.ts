/**
 * HAAZEL — Token Applier
 *
 * Reads design/tokens.json (the machine source of truth produced by the
 * haazel-design-system skill) and deterministically rewrites the
 * marker-delimited HAAZEL regions in:
 *
 *   - src/app/globals.css   (COLORS-ROOT, COLORS-DARK, THEME-FONTS, THEME-TOKENS, TOKENS)
 *   - src/app/layout.tsx    (FONTS, SCHEME)
 *   - src/lib/brand.config.ts (COLORS, TYPOGRAPHY, PRESET, VOICE, IMAGERY)
 *   - package.json          (name ← meta.slug)
 *
 * Also seeds .env.local (Sanity/site URL defaults) — replaces the retired
 * setup-brand.ts.
 *
 * Usage:
 *   npm run tokens:apply                 # apply design/tokens.json
 *   npm run tokens:apply -- --tokens path/to/tokens.json
 *   npm run tokens:check                 # exit 1 if generated regions drifted
 *   npm run tokens:apply -- --dry-run    # print planned changes only
 */

import * as fs from "fs";
import * as path from "path";
// culori ships without bundled TS types; typed wrapper below keeps `any` contained.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const culori = require("culori") as {
  converter: (mode: string) => (color: string) => {
    l: number; c: number; h?: number; alpha?: number;
  } | undefined;
  interpolate: (colors: string[], mode: string) => (t: number) => object;
  formatHex: (color: object) => string;
};

const ROOT = path.resolve(__dirname, "..");

// ── Types (mirror templates/tokens.schema.json in the haazel plugin) ──

type ColorScheme = "dark" | "light" | "dual";

interface FontSpec {
  family: string;
  provider?: "google" | "local";
  weights?: number[];
  styles?: string[];
  axes?: Record<string, [number, number]>;
  fallback: string;
}

interface ScaleEntry {
  size: string;
  lineHeight?: number | string;
  font?: string;
  weight?: number;
  tracking?: string;
  transform?: string;
  style?: string;
}

interface Tokens {
  version: number;
  meta: {
    name: string;
    slug: string;
    domain?: string;
    archetype: "cinematic" | "saas" | "app" | "leadgen" | "commerce" | "editorial";
    colorScheme: ColorScheme;
    stylePreset?: string;
    generator?: string;
  };
  colors: {
    palette?: Record<string, { value: string; role?: string; maxShare?: number }>;
    brand?: Partial<Record<"primary" | "primaryDark" | "primaryLight" | "secondary" | "accent", string>>;
    semantic: Partial<Record<"dark" | "light", Record<string, string>>>;
    rules?: string[];
  };
  typography: {
    fonts: Record<"display" | "heading" | "body" | "mono", FontSpec>;
    scale: Record<string, ScaleEntry>;
  };
  shape: { radius: string; borderWidth?: string; hairline?: string };
  spacing: {
    grid?: number;
    sectionGap: string;
    contentGap: string;
    elementGap?: string;
    tightGap?: string;
    containerMax: string;
    gutter: string;
  };
  motion: {
    policy: "cinematic" | "expressive" | "restrained" | "minimal";
    easing: { standard: string; exit?: string };
    durations: { fast: string; base: string; slow: string; reveal: string };
    reducedMotion?: "reduce" | "off";
    smoothScroll?: boolean;
    ambient?: {
      cursorGlow?: boolean;
      noiseOverlay?: { enabled: boolean; opacity?: number };
    };
    bannedModules?: string[];
  };
  voice: {
    tone: string[];
    adjectives: string[];
    bannedPhrases: string[];
    writingStyle: string;
  };
  imagery: {
    style: "photorealistic" | "illustration" | "abstract" | "editorial";
    formulas?: Record<string, string>;
    subjects?: string[];
    lighting?: string[];
    cameras?: string[];
    lenses?: string[];
    grade?: string;
    avoid?: string[];
    colorTemperature?: string;
  };
}

// ── Semantic color var order (matches globals.css) ──

const SEMANTIC_KEYS = [
  "background", "foreground", "card", "cardForeground", "popover",
  "popoverForeground", "primary", "primaryForeground", "secondary",
  "secondaryForeground", "muted", "mutedForeground", "accent",
  "accentForeground", "destructive", "border", "input", "ring",
] as const;

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

// ── Color helpers ──

const toOklch = culori.converter("oklch");

function oklchString(cssColor: string): string {
  const c = toOklch(cssColor);
  if (!c) throw new Error(`Unparseable color: "${cssColor}"`);
  const r = (n: number, d = 3) => {
    const f = 10 ** d;
    return String(Math.round(n * f) / f);
  };
  const base = `${r(c.l)} ${r(c.c)} ${r(c.h ?? 0, 1)}`;
  if (c.alpha !== undefined && c.alpha < 1) {
    return `oklch(${base} / ${r(c.alpha * 100, 1)}%)`;
  }
  return `oklch(${base})`;
}

function shiftLightness(cssColor: string, delta: number): string {
  const c = toOklch(cssColor);
  if (!c) throw new Error(`Unparseable color: "${cssColor}"`);
  const shifted = { ...c, mode: "oklch", l: Math.min(0.98, Math.max(0.05, c.l + delta)) };
  return culori.formatHex(shifted);
}

function chartRamp(from: string, to: string): string[] {
  const interp = culori.interpolate([from, to], "oklch");
  return [0, 0.25, 0.5, 0.75, 1].map((t) => oklchString(culori.formatHex(interp(t))));
}

// ── Region replacement (shared with prune-site.ts) ──

import { replaceRegion } from "./lib/regions";

// ── Validation ──

function validate(t: Tokens): string[] {
  const errors: string[] = [];
  const need = (cond: unknown, msg: string) => { if (!cond) errors.push(msg); };

  need(t.meta?.slug, "meta.slug is required");
  need(t.meta?.name, "meta.name is required");
  need(
    ["cinematic", "saas", "app", "leadgen", "commerce", "editorial"].includes(t.meta?.archetype),
    `meta.archetype must be one of cinematic|saas|app|leadgen|commerce|editorial (got "${t.meta?.archetype}")`,
  );
  need(
    ["dark", "light", "dual"].includes(t.meta?.colorScheme),
    `meta.colorScheme must be dark|light|dual (got "${t.meta?.colorScheme}")`,
  );

  const scheme = t.meta?.colorScheme;
  if (scheme === "dark") need(t.colors?.semantic?.dark, "colors.semantic.dark is required for colorScheme dark");
  if (scheme === "light" || scheme === "dual") {
    need(t.colors?.semantic?.light, `colors.semantic.light is required for colorScheme ${scheme}`);
  }
  for (const schemeKey of ["dark", "light"] as const) {
    const set = t.colors?.semantic?.[schemeKey];
    if (!set) continue;
    for (const key of SEMANTIC_KEYS) {
      need(set[key], `colors.semantic.${schemeKey}.${key} is required`);
    }
  }

  for (const role of ["display", "heading", "body", "mono"] as const) {
    need(t.typography?.fonts?.[role]?.family, `typography.fonts.${role}.family is required`);
    need(t.typography?.fonts?.[role]?.fallback, `typography.fonts.${role}.fallback is required`);
  }
  need(t.typography?.scale?.hero?.size, "typography.scale.hero.size is required");
  need(t.shape?.radius !== undefined, "shape.radius is required");
  need(t.spacing?.sectionGap, "spacing.sectionGap is required");
  need(t.spacing?.containerMax, "spacing.containerMax is required");
  need(t.spacing?.gutter, "spacing.gutter is required");
  need(t.motion?.easing?.standard, "motion.easing.standard is required");
  need(t.motion?.durations?.base, "motion.durations.base is required");
  need(
    ["cinematic", "expressive", "restrained", "minimal"].includes(t.motion?.policy),
    `motion.policy must be cinematic|expressive|restrained|minimal (got "${t.motion?.policy}")`,
  );
  need(Array.isArray(t.voice?.tone), "voice.tone[] is required");
  need(t.voice?.writingStyle, "voice.writingStyle is required");
  need(t.imagery?.style, "imagery.style is required");
  return errors;
}

// ── Generators ──

function colorRegionBody(set: Record<string, string>, t: Tokens, indent: string, includeRadius: boolean): string[] {
  const out: string[] = [];
  for (const key of SEMANTIC_KEYS) {
    out.push(`${indent}--${kebab(key)}: ${oklchString(set[key])};`);
  }
  const ramp = chartRamp(set.primary, set.accent === set.primary ? set.mutedForeground : set.accent);
  ramp.forEach((v, i) => out.push(`${indent}--chart-${i + 1}: ${v};`));
  if (includeRadius) out.push(`${indent}--radius: ${t.shape.radius};`);
  out.push(`${indent}--sidebar: ${oklchString(set.card)};`);
  out.push(`${indent}--sidebar-foreground: ${oklchString(set.cardForeground)};`);
  out.push(`${indent}--sidebar-primary: ${oklchString(set.primary)};`);
  out.push(`${indent}--sidebar-primary-foreground: ${oklchString(set.primaryForeground)};`);
  out.push(`${indent}--sidebar-accent: ${oklchString(set.secondary)};`);
  out.push(`${indent}--sidebar-accent-foreground: ${oklchString(set.secondaryForeground)};`);
  out.push(`${indent}--sidebar-border: ${oklchString(set.border)};`);
  out.push(`${indent}--sidebar-ring: ${oklchString(set.ring)};`);
  return out;
}

function themeFontsBody(t: Tokens, indent: string): string[] {
  const f = t.typography.fonts;
  return [
    `${indent}--font-sans: var(--haazel-font-body), ${f.body.fallback};`,
    `${indent}--font-mono: var(--haazel-font-mono), ${f.mono.fallback};`,
    `${indent}--font-heading: var(--haazel-font-heading), ${f.heading.fallback};`,
    `${indent}--font-display: var(--haazel-font-display), ${f.display.fallback};`,
  ];
}

function themeTokensBody(t: Tokens, indent: string): string[] {
  const out = [
    `${indent}--spacing-section: var(--section-gap);`,
    `${indent}--spacing-content: var(--content-gap);`,
    `${indent}--spacing-gutter: var(--gutter);`,
  ];
  const scaleKeys = ["hero", "display", "heading", "subheading", "body", "caption", "overline"];
  for (const key of scaleKeys) {
    const entry = t.typography.scale[key];
    if (!entry) continue;
    out.push(`${indent}--text-${key}: ${entry.size};`);
    if (entry.lineHeight !== undefined) {
      out.push(`${indent}--text-${key}--line-height: ${entry.lineHeight};`);
    }
  }
  return out;
}

function tokensBody(t: Tokens, indent: string): string[] {
  const m = t.motion;
  const s = t.spacing;
  const hairline =
    t.shape.hairline ??
    `${t.shape.borderWidth ?? "1px"} solid color-mix(in oklab, var(--foreground) 15%, transparent)`;
  return [
    `${indent}--ease-standard: ${m.easing.standard};`,
    `${indent}--ease-exit: ${m.easing.exit ?? "cubic-bezier(0.7, 0, 0.84, 0)"};`,
    `${indent}--duration-fast: ${m.durations.fast};`,
    `${indent}--duration-base: ${m.durations.base};`,
    `${indent}--duration-slow: ${m.durations.slow};`,
    `${indent}--duration-reveal: ${m.durations.reveal};`,
    `${indent}--section-gap: ${s.sectionGap};`,
    `${indent}--content-gap: ${s.contentGap};`,
    `${indent}--element-gap: ${s.elementGap ?? "1.25rem"};`,
    `${indent}--tight-gap: ${s.tightGap ?? "0.625rem"};`,
    `${indent}--container-max: ${s.containerMax};`,
    `${indent}--gutter: ${s.gutter};`,
    `${indent}--hairline: ${hairline};`,
  ];
}

function googleFontIdentifier(family: string): string {
  return family
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .join("_");
}

function layoutFontsBody(t: Tokens): string[] {
  const roles = ["display", "heading", "body", "mono"] as const;
  const fonts = t.typography.fonts;

  // Owner = first role (in order) using each unique family.
  const ownerOfFamily = new Map<string, (typeof roles)[number]>();
  for (const role of roles) {
    const fam = fonts[role].family;
    if (!ownerOfFamily.has(fam)) ownerOfFamily.set(fam, role);
  }

  const importNames = [...ownerOfFamily.keys()].map(googleFontIdentifier);
  const out: string[] = [];
  out.push(`import { ${[...new Set(importNames)].join(", ")} } from "next/font/google";`);
  out.push("");

  const constOfRole = new Map<string, string>();
  for (const [family, ownerRole] of ownerOfFamily) {
    const spec = fonts[ownerRole];
    const constName = `font${ownerRole[0].toUpperCase()}${ownerRole.slice(1)}`;
    constOfRole.set(ownerRole, constName);
    const opts: string[] = [
      `  variable: "--haazel-font-${ownerRole}",`,
      `  subsets: ["latin"],`,
      `  display: "swap",`,
    ];
    const hasAxes = Boolean(spec.axes && Object.keys(spec.axes).length);
    // next/font: axes require the variable font, which forbids numeric
    // weights ("Axes can only be defined … when weight is nonexistent or
    // set to `variable`"). Axes present → load variable, skip weights.
    if (spec.weights?.length && !hasAxes) {
      opts.push(`  weight: [${spec.weights.map((w) => `"${w}"`).join(", ")}],`);
    }
    if (spec.styles?.length && spec.styles.some((s) => s !== "normal")) {
      opts.push(`  style: [${spec.styles.map((s) => `"${s}"`).join(", ")}],`);
    }
    if (hasAxes) {
      opts.push(`  axes: [${Object.keys(spec.axes!).map((a) => `"${a}"`).join(", ")}],`);
    }
    out.push(`const ${constName} = ${googleFontIdentifier(family)}({`);
    out.push(...opts);
    out.push(`});`);
    out.push("");
  }

  const loadedVars = [...ownerOfFamily.values()].map(
    (role) => `\${${constOfRole.get(role)}.variable}`,
  );
  out.push(`/** One className entry per loaded font; alias roles map via fontAliasStyle. */`);
  out.push(`const fontClassNames = \`${loadedVars.join(" ")}\`;`);

  const aliasLines: string[] = [];
  for (const role of roles) {
    const owner = ownerOfFamily.get(fonts[role].family);
    if (owner !== role) {
      aliasLines.push(
        `  ["--haazel-font-${role}" as string]: "var(--haazel-font-${owner})",`,
      );
    }
  }
  out.push(`/** Extra vars for roles that alias another loaded family. */`);
  out.push(`const fontAliasStyle: React.CSSProperties = {`);
  if (aliasLines.length) out.push(...aliasLines);
  out.push(`};`);
  return out;
}

function schemeBody(t: Tokens): string[] {
  return [`const schemeClass = ${t.meta.colorScheme === "dark" ? '"dark"' : '""'};`];
}

// ── brand.config.ts regions ──

const q = (s: string) => JSON.stringify(s);

function brandColorsBody(t: Tokens): string[] {
  const scheme = t.meta.colorScheme === "dark" ? "dark" : "light";
  const set = t.colors.semantic[scheme]!;
  const brandOverrides = t.colors.brand ?? {};
  const primary = brandOverrides.primary ?? set.primary;
  return [
    `  colors: {`,
    `    primary: ${q(primary)},`,
    `    primaryDark: ${q(brandOverrides.primaryDark ?? shiftLightness(primary, -0.12))},`,
    `    primaryLight: ${q(brandOverrides.primaryLight ?? shiftLightness(primary, 0.12))},`,
    `    secondary: ${q(brandOverrides.secondary ?? set.secondary)},`,
    `    accent: ${q(brandOverrides.accent ?? set.accent)},`,
    `    background: ${q(set.background)},`,
    `    foreground: ${q(set.foreground)},`,
    `    muted: ${q(set.muted)},`,
    `    mutedForeground: ${q(set.mutedForeground)},`,
    `    card: ${q(set.card)},`,
    `    cardForeground: ${q(set.cardForeground)},`,
    `    border: ${q(set.border)},`,
    `  },`,
  ];
}

function brandTypographyBody(t: Tokens): string[] {
  const f = t.typography.fonts;
  return [
    `  typography: {`,
    `    display: ${q(f.display.family)},`,
    `    heading: ${q(f.heading.family)},`,
    `    body: ${q(f.body.family)},`,
    `    accent: ${q(f.mono.family)},`,
    `    mono: ${q(f.mono.family)},`,
    `  },`,
  ];
}

const PRESET_OF_POLICY: Record<Tokens["motion"]["policy"], string> = {
  cinematic: "cinematic",
  expressive: "creative",
  restrained: "corporate",
  minimal: "minimalist",
};

function brandPresetBody(t: Tokens): string[] {
  const preset = t.meta.stylePreset ?? PRESET_OF_POLICY[t.motion.policy];
  return [`  stylePreset: ${q(preset)},`];
}

function brandVoiceBody(t: Tokens): string[] {
  const v = t.voice;
  return [
    `  voice: {`,
    `    tone: [${v.tone.map(q).join(", ")}],`,
    `    adjectives: [${v.adjectives.map(q).join(", ")}],`,
    `    bannedPhrases: [`,
    ...v.bannedPhrases.map((p) => `      ${q(p)},`),
    `    ],`,
    `    writingStyle:`,
    `      ${q(v.writingStyle)},`,
    `  },`,
  ];
}

function brandImageryBody(t: Tokens): string[] {
  const im = t.imagery;
  const list = (arr: string[] | undefined, fallback: string[]) =>
    (arr?.length ? arr : fallback).map((s) => `      ${q(s)},`);
  return [
    `  imagery: {`,
    `    style: ${q(im.style)},`,
    `    subjects: [`,
    ...list(im.subjects, ["brand environments"]),
    `    ],`,
    `    lighting: [`,
    ...list(im.lighting, ["natural light"]),
    `    ],`,
    `    cameras: [`,
    ...list(im.cameras, ["Sony A7III"]),
    `    ],`,
    `    lenses: [`,
    ...list(im.lenses, ["35mm f/1.4"]),
    `    ],`,
    `    avoidKeywords: [`,
    ...list(im.avoid, ["no text", "no watermarks", "no stock photo feel"]),
    `    ],`,
    `    colorTemperature: ${q(im.colorTemperature ?? "neutral")},`,
    `  },`,
  ];
}

// ── .env.local seeding (folded in from the retired setup-brand.ts) ──

function seedEnvLocal(t: Tokens, write: boolean): string[] {
  const envPath = path.join(ROOT, ".env.local");
  const existing: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) existing[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
    }
  }
  const defaults: Record<string, string> = {
    NEXT_PUBLIC_SANITY_DATASET: "production",
    NEXT_PUBLIC_SITE_URL: t.meta.domain ? `https://${t.meta.domain}` : "",
  };
  const added: string[] = [];
  for (const [key, val] of Object.entries(defaults)) {
    if (!existing[key] && val) {
      existing[key] = val;
      added.push(key);
    }
  }
  if (added.length && write) {
    fs.writeFileSync(
      envPath,
      Object.entries(existing).map(([k, v]) => `${k}=${v}`).join("\n") + "\n",
    );
  }
  return added;
}

// ── Main ──

interface FilePlan {
  file: string;
  next: string;
  changed: boolean;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const dryRun = args.includes("--dry-run");
  const tokensFlag = args.indexOf("--tokens");
  const tokensPath = path.resolve(
    ROOT,
    tokensFlag !== -1 ? args[tokensFlag + 1] : path.join("design", "tokens.json"),
  );

  if (!fs.existsSync(tokensPath)) {
    console.error(`tokens file not found: ${tokensPath}`);
    console.error(`Run the haazel-design-system skill to generate design/tokens.json first.`);
    process.exit(1);
  }

  const tokens: Tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));
  const errors = validate(tokens);
  if (errors.length) {
    console.error("tokens.json failed validation:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const scheme = tokens.meta.colorScheme;
  const darkSet = tokens.colors.semantic.dark ?? tokens.colors.semantic.light!;
  const lightSet = tokens.colors.semantic.light ?? tokens.colors.semantic.dark!;
  const rootSet = scheme === "dark" ? darkSet : lightSet;

  const plans: FilePlan[] = [];
  const plan = (relFile: string, transform: (content: string) => string) => {
    const file = path.join(ROOT, relFile);
    const current = fs.readFileSync(file, "utf-8");
    const next = transform(current);
    plans.push({ file: relFile, next, changed: next !== current });
  };

  plan(path.join("src", "app", "globals.css"), (c) => {
    let out = c;
    out = replaceRegion(out, "COLORS-ROOT", colorRegionBody(rootSet, tokens, "  ", true));
    out = replaceRegion(out, "COLORS-DARK", colorRegionBody(darkSet, tokens, "  ", false));
    out = replaceRegion(out, "THEME-FONTS", themeFontsBody(tokens, "  "));
    out = replaceRegion(out, "THEME-TOKENS", themeTokensBody(tokens, "  "));
    out = replaceRegion(out, "TOKENS", tokensBody(tokens, "  "));
    return out;
  });

  plan(path.join("src", "app", "layout.tsx"), (c) => {
    let out = c;
    out = replaceRegion(out, "FONTS", layoutFontsBody(tokens));
    out = replaceRegion(out, "SCHEME", schemeBody(tokens));
    return out;
  });

  plan(path.join("src", "lib", "brand.config.ts"), (c) => {
    let out = c;
    out = replaceRegion(out, "COLORS", brandColorsBody(tokens));
    out = replaceRegion(out, "TYPOGRAPHY", brandTypographyBody(tokens));
    out = replaceRegion(out, "PRESET", brandPresetBody(tokens));
    out = replaceRegion(out, "VOICE", brandVoiceBody(tokens));
    out = replaceRegion(out, "IMAGERY", brandImageryBody(tokens));
    return out;
  });

  plan("package.json", (c) => {
    const pkg = JSON.parse(c);
    if (pkg.name === tokens.meta.slug) return c;
    pkg.name = tokens.meta.slug;
    return JSON.stringify(pkg, null, 2) + "\n";
  });

  const changed = plans.filter((p) => p.changed);

  if (check) {
    if (changed.length) {
      console.error("tokens:check FAILED — generated regions drifted from tokens.json:");
      for (const p of changed) console.error(`  - ${p.file}`);
      console.error("Run `npm run tokens:apply` (or revert hand edits inside HAAZEL markers).");
      process.exit(1);
    }
    console.log("tokens:check OK — all generated regions match tokens.json.");
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] tokens: ${path.relative(ROOT, tokensPath)}`);
    for (const p of plans) {
      console.log(`  ${p.changed ? "WOULD WRITE" : "unchanged  "} ${p.file}`);
    }
    return;
  }

  for (const p of plans) {
    if (p.changed) fs.writeFileSync(path.join(ROOT, p.file), p.next);
  }
  const envAdded = seedEnvLocal(tokens, true);

  console.log(`Applied ${path.relative(ROOT, tokensPath)} (${tokens.meta.name} · ${tokens.meta.archetype} · ${scheme})`);
  for (const p of plans) {
    console.log(`  ${p.changed ? "wrote    " : "unchanged"} ${p.file}`);
  }
  if (envAdded.length) console.log(`  seeded   .env.local (${envAdded.join(", ")})`);
}

main();
