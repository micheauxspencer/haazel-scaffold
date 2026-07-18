# Haazel Scaffold

The Next.js base every haazel build clones (`degit micheauxspencer/haazel-scaffold#v0.2.0`).
Next 16 · React 19 · Tailwind v4 (CSS-first) · shadcn on Base UI · GSAP + Lenis · Sanity-ready · FAL client.

> This is NOT the Next.js you know — read `AGENTS.md` and
> `node_modules/next/dist/docs/` before writing code.

## The component library (82)

| Group | Where | Count |
|---|---|---|
| Layout primitives — the anti-generic layer (LayeredHeadline, OverlapField, EditorialSplit, OffsetGrid, BleedImage, CaptionRail, ScrollingText, DeviceFrame, SectionShell) | `src/components/primitives/` | 9 |
| Cinematic GSAP modules (scroll-driven 10 · cursor 9 · click 6 · ambient 10) | `src/components/cinematic/` | 35 |
| Section packs — saas 11 · app 8 · leadgen 8+API · commerce 6 · shared 5 | `src/components/sections/` | 38 |

Source of truth: [`src/components/COMPONENT_CATALOG.md`](src/components/COMPONENT_CATALOG.md)
(`npm run check:catalog` fails on drift). Conventions:
[`cinematic/CONVENTIONS.md`](src/components/cinematic/CONVENTIONS.md) (reduced-motion settled
states, pointer gating, tokens-only colors) and
[`sections/SECTION_SPEC.md`](src/components/sections/SECTION_SPEC.md) (the section contract).

Browse everything live at **`/showcase`** (`npm run dev`) — the harness is
auto-removed from client builds by `npm run prune`.

## The token pipeline

`design/tokens.json` is the machine source of truth (schema ships in the
haazel plugin). `npm run tokens:apply` deterministically rewrites the
HAAZEL marker regions in `globals.css` (oklch colors, fonts, motion/spacing
tokens), `layout.tsx` (next/font codegen + color-scheme class), and
`brand.config.ts` — plus the package name. Never hand-edit inside markers;
`npm run tokens:check` catches drift.

## Scripts

| Script | Does |
|---|---|
| `npm run tokens:apply` / `tokens:check` | apply/verify design tokens (`--dry-run` supported) |
| `npm run prune -- --keep about,contact --write` | remove unused routes + demo sections; rewrites nav, Footer, sitemap registry, package name; dry-run by default |
| `npm run gen:image` / `gen:video` | FAL asset generation (`FAL_KEY`), Kling video standard/pro |
| `npm run frames -- <video> <name>` | ffmpeg frame extraction for CanvasHero + `manifest.json` with exact frameCount |
| `npm run check:catalog` | catalog ↔ exports sync gate |

## Per-client flow (driven by the haazel plugin)

1. `npx degit micheauxspencer/haazel-scaffold#v0.2.0 <slug>` + `npm install`
2. haazel-design-system writes `design/tokens.json` → `npm run tokens:apply`
3. Compose pages from the catalog (sections + primitives + cinematic per the
   archetype's motion policy)
4. `npm run prune -- --keep <routes> --write`
5. `npm run build` green → git commit (deployment is manual by design)

Env (`.env.example`): Sanity project vars, `FAL_KEY`, `NEXT_PUBLIC_SITE_URL`,
`RESEND_API_KEY` + `QUOTE_TO_EMAIL` (quote form delivery).
