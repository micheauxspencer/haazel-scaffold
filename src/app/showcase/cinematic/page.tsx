import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeftIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  MailIcon,
  SettingsIcon,
  ZapIcon,
  SparklesIcon,
  LayersIcon,
} from "lucide-react";

import CaptionRail from "@/components/primitives/CaptionRail";
import PlaceholderMedia from "@/app/showcase/_components/PlaceholderMedia";

// Ambient & background (10)
import KineticMarquee from "@/components/cinematic/KineticMarquee";
import CircularText from "@/components/cinematic/CircularText";
import GlitchEffect from "@/components/cinematic/GlitchEffect";
import GradientStrokeText from "@/components/cinematic/GradientStrokeText";
import MeshGradient from "@/components/cinematic/MeshGradient";
import TextScramble from "@/components/cinematic/TextScramble";
import Typewriter from "@/components/cinematic/Typewriter";
import VideoBackground from "@/components/cinematic/VideoBackground";
import NoiseOverlay from "@/components/cinematic/NoiseOverlay";
import ScrollProgress from "@/components/cinematic/ScrollProgress";

// Click & tap (6)
import CoverflowCarousel from "@/components/cinematic/CoverflowCarousel";
import ParticleButton from "@/components/cinematic/ParticleButton";
import DynamicIsland from "@/components/cinematic/DynamicIsland";
import DockNav from "@/components/cinematic/DockNav";
import ViewTransitionMorph from "@/components/cinematic/ViewTransitionMorph";
import OdometerCounter from "@/components/cinematic/OdometerCounter";

// Cursor & hover (9 modules — CursorReveal exports 2)
import CursorGlow from "@/components/cinematic/CursorGlow";
import TiltCard from "@/components/cinematic/TiltCard";
import SpotlightBorderCards from "@/components/cinematic/SpotlightBorderCards";
import AccordionSlider from "@/components/cinematic/AccordionSlider";
import FlipCards from "@/components/cinematic/FlipCards";
import WipeReveal, { SpotlightReveal } from "@/components/cinematic/CursorReveal";
import ImageTrail from "@/components/cinematic/ImageTrail";
import MagneticGrid from "@/components/cinematic/MagneticGrid";
import DragPanGrid from "@/components/cinematic/DragPanGrid";

// Scroll-triggered (10)
import TextMaskReveal from "@/components/cinematic/TextMaskReveal";
import CanvasHero from "@/components/cinematic/CanvasHero";
import CurtainReveal from "@/components/cinematic/CurtainReveal";
import HorizontalScroll from "@/components/cinematic/HorizontalScroll";
import ColorShiftSection from "@/components/cinematic/ColorShiftSection";
import StickyStack from "@/components/cinematic/StickyStack";
import StickyCards from "@/components/cinematic/StickyCards";
import SplitScreen from "@/components/cinematic/SplitScreen";
import ZoomParallax from "@/components/cinematic/ZoomParallax";
import SVGDraw from "@/components/cinematic/SVGDraw";

/**
 * /showcase/cinematic — all 35 GSAP modules, grouped under the 4 category
 * headings from src/components/cinematic/.catalog/{ambient,click,cursor,scroll}.md.
 * Dev-only harness; pruned before client ship, excluded from sitemap.ts.
 *
 * Layout judgment calls (see final report for the full list):
 * - Only 3 of the "big" 300vh-class pinned/scrub modules run in their live,
 *   unconstrained form (CurtainReveal, StickyStack, HorizontalScroll) — each
 *   rendered full-bleed (no max-w/overflow wrapper) since their pin math and
 *   position:sticky targets the real window scroller; boxing them risks
 *   visually broken pins. CanvasHero is rendered via its own built-in
 *   staticImage/gradient fallback branch (frameCount and staticImage both
 *   omitted), which drops it to a plain 100vh panel with no pin at all.
 *   StickyCards and ZoomParallax also use GSAP `pin:true`, but their actual
 *   scroll footprint is tiny by design (StickyCards uses `pinSpacing:false`
 *   so it adds ~0 extra scroll height; ZoomParallax pins for exactly one
 *   fixed 100dvh, never more) — confirmed by reading both sources — so they
 *   run live too, full-bleed, without meaningfully violating the "keep it
 *   to a few live pins" intent.
 * - NoiseOverlay, ScrollProgress, DockNav, and DynamicIsland all render via
 *   real `position: fixed` internally (confirmed by reading each source).
 *   A bare bordered box would NOT contain them — overflow-hidden doesn't
 *   clip position:fixed descendants unless an ancestor has a transform.
 *   `FixedScope` below applies exactly that (a no-op `translateZ(0)`) to
 *   give each one a scoped "fake viewport" to stick to, rather than
 *   escaping to the real browser chrome for the rest of the page.
 * - VideoBackground has no real video asset in this scaffold. `src` points
 *   at a path that will 404; `poster` is a data-URI swatch. The component
 *   already handles this gracefully — `video.play()` on a failed source is
 *   caught and swallowed, so the poster just shows indefinitely — which is
 *   the "poster only" fallback the brief asked for, plus an explicit note.
 */

// ---------------------------------------------------------------------------
// Local helpers (page-only — not shared components per the brief's scope)
// ---------------------------------------------------------------------------

const HAIRLINE = "[border-color:color-mix(in_oklab,var(--foreground)_12%,transparent)]";
const HAIRLINE_SOFT = "[border-color:color-mix(in_oklab,var(--foreground)_9%,transparent)]";

/** Tiny inline data-URI SVG swatch — hex lives only inside this string. */
function swatch(hex: string, tag: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='640' height='480' fill='${hex}'/><path d='M0 0 640 480M640 0 0 480' stroke='#000' stroke-opacity='0.08' stroke-width='2'/><text x='320' y='248' font-family='monospace' font-size='22' fill='#000' fill-opacity='0.35' text-anchor='middle'>${tag}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function SectionIntro({ title, count, description }: { title: string; count: string; description: string }) {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
      <h2 className="text-heading font-heading font-medium">{title}</h2>
      <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
        <span className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">{count}</span>
        {" — "}
        {description}
      </p>
    </div>
  );
}

/** Boxed demo band — safe for every module with no real `position:fixed`. */
function DemoBand({
  index,
  title,
  meta,
  description,
  children,
}: {
  index: string;
  title: string;
  meta: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={`border-t ${HAIRLINE_SOFT} py-[var(--content-gap)]`}>
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
        <CaptionRail label={`${index} — ${title}`} meta={meta} />
        <p className="mb-6 mt-4 max-w-[60ch] text-sm text-muted-foreground">{description}</p>
        <div className={`overflow-hidden rounded-[var(--radius-lg)] border ${HAIRLINE}`}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Full-bleed demo band — for modules whose pin/sticky mechanics target the
 * real window scroller (CSS position:sticky or GSAP ScrollTrigger pin with
 * default pinType). No max-w/overflow wrapper around the live module.
 */
function FullBleedBand({
  index,
  title,
  meta,
  description,
  note,
  children,
}: {
  index: string;
  title: string;
  meta: string;
  description: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    // overflow-x-clip: contains wide tracks/3D side cards at mobile widths
    // without creating a scroll container (pin/sticky mechanics unaffected).
    <section className={`overflow-x-clip border-t ${HAIRLINE_SOFT} py-[var(--content-gap)]`}>
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
        <CaptionRail label={`${index} — ${title}`} meta={meta} />
        <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
      {note && (
        <div className="mx-auto mt-4 max-w-[var(--container-max)] px-[var(--gutter)]">
          <p className="font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground">{note}</p>
        </div>
      )}
    </section>
  );
}

/**
 * Scopes a `position:fixed` descendant to this box instead of the real
 * viewport — a no-op transform (`translateZ(0)`) establishes a new CSS
 * containing block for fixed/absolute descendants per spec, so the module
 * "docks" inside this preview instead of the browser chrome.
 */
function FixedScope({ height, children }: { height: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden" style={{ height, transform: "translateZ(0)" }}>
      {children}
    </div>
  );
}

function MiniCard({ label, tone = "default" }: { label: string; tone?: "default" | "card" }) {
  return (
    <div
      className={`flex h-full min-h-24 w-full items-center justify-center rounded-[var(--radius-md)] border p-6 text-center font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground ${HAIRLINE} ${
        tone === "card" ? "bg-card" : "bg-[color-mix(in_oklab,var(--foreground)_4%,var(--card))]"
      }`}
    >
      {label}
    </div>
  );
}

const dockIcon = (Icon: typeof HomeIcon) => <Icon aria-hidden className="size-5" color="currentColor" />;

export default function CinematicShowcase() {
  return (
    <div>
      <header className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] pt-[var(--content-gap)]">
        <CaptionRail label="Cinematic modules" meta="35 GSAP modules" />
        <Link
          href="/showcase"
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-overline uppercase tracking-[0.14em] text-muted-foreground transition-colors [transition-timing-function:var(--ease-standard)] hover:text-primary"
        >
          <ArrowLeftIcon aria-hidden className="size-3.5" />
          Back to showcase
        </Link>
        <h1 className="mt-8 text-display font-display font-medium tracking-[-0.02em]">
          Motion as a
          <span className="font-heading italic text-primary"> material</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-muted-foreground">
          Every module renders with `prefers-reduced-motion` off — toggle it
          in your OS to see each one collapse to its documented settled
          state. Grouped by trigger: ambient, click, cursor, scroll.
        </p>
      </header>

      {/* =================================================================
          AMBIENT & BACKGROUND — 10 modules, continuous or autoplay, no
          user input required.
      ================================================================= */}
      <SectionIntro
        title="Ambient & Background"
        count="10 modules"
        description="Continuous loops and autoplay backdrops — nothing here waits for a click or a hover."
      />

      <DemoBand
        index="01"
        title="KineticMarquee"
        meta="Ambient"
        description="Auto-scrolling ticker whose speed reacts to scroll velocity."
      >
        <KineticMarquee
          items={["Layout Design", "Not Blocks", "GSAP Powered", "Token Driven", "Cinematic Modules"]}
        />
      </DemoBand>

      <DemoBand
        index="02"
        title="CircularText"
        meta="Ambient"
        description="Text set along a circular SVG path, spinning continuously."
      >
        <div className="flex min-h-72 items-center justify-center p-10">
          <CircularText text="SCROLL TO EXPLORE • SCROLL TO EXPLORE • " size={220} fontSize={13} speed={18} />
        </div>
      </DemoBand>

      <DemoBand
        index="03"
        title="GlitchEffect"
        meta="Ambient"
        description="Hover-triggered RGB-split glitch distortion on text."
      >
        <div className="flex min-h-40 items-center justify-center p-10">
          <GlitchEffect text="HOVER TO GLITCH" as="h3" />
        </div>
      </DemoBand>

      <DemoBand
        index="04"
        title="GradientStrokeText"
        meta="Ambient"
        description="Display text with a continuously shifting multi-stop gradient, as a stroke outline or a filled clip."
      >
        <div className="flex flex-col gap-8 p-10">
          <div>
            <p className="mb-3 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              variant: stroke
            </p>
            <GradientStrokeText text="GRADIENT STROKE" variant="stroke" as="h3" />
          </div>
          <div>
            <p className="mb-3 font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              variant: filled
            </p>
            <GradientStrokeText text="GRADIENT FILL" variant="filled" as="h3" />
          </div>
        </div>
      </DemoBand>

      <DemoBand
        index="05"
        title="MeshGradient"
        meta="Ambient"
        description="Soft blurred color-blob backdrop that drifts and scales in a continuous ambient loop."
      >
        <MeshGradient>
          <div className="flex min-h-96 items-center justify-center p-10">
            <p className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">
              Ambient mesh backdrop
            </p>
          </div>
        </MeshGradient>
      </DemoBand>

      <DemoBand
        index="06"
        title="TextScramble"
        meta="Ambient"
        description="Text that resolves from randomized characters into the final string on scroll into view."
      >
        <div className="flex min-h-40 items-center justify-center p-10">
          <TextScramble text="Resolves from noise into signal." as="h3" />
        </div>
      </DemoBand>

      <DemoBand
        index="07"
        title="Typewriter"
        meta="Ambient"
        description="Cycles through phrases, typing and deleting each with a blinking caret."
      >
        <div className="flex min-h-40 items-center justify-center p-10">
          <Typewriter
            phrases={["Fill every weekend.", "Automate the payouts.", "Ship the season."]}
            as="p"
          />
        </div>
      </DemoBand>

      <FullBleedBand
        index="08"
        title="VideoBackground"
        meta="Ambient"
        description="Full-bleed autoplaying, looping, muted video background with a color overlay."
        note="No video asset ships in this scaffold — src 404s gracefully, poster (data-URI) renders and stays put indefinitely since play() never resolves."
      >
        <VideoBackground src="/assets/video/showcase-placeholder.mp4" poster={swatch("#6b6f76", "POSTER FALLBACK")} minHeight="60vh">
          <div className="flex h-[60vh] items-center justify-center">
            <p className="font-mono text-overline uppercase tracking-[0.2em] text-primary-foreground">
              Video background — poster only
            </p>
          </div>
        </VideoBackground>
      </FullBleedBand>

      <DemoBand
        index="09"
        title="NoiseOverlay"
        meta="Ambient"
        description="Fixed full-viewport film-grain texture. Scoped here to a preview box (see FixedScope note in file header) — opacity bumped from the 0.035 production default to 0.15 so it reads at this size."
      >
        <FixedScope height="12rem">
          <div className="flex h-full items-center justify-center">
            <MiniCard label="Grain texture — contained preview" />
          </div>
          <NoiseOverlay opacity={0.15} />
        </FixedScope>
      </DemoBand>

      <DemoBand
        index="10"
        title="ScrollProgress"
        meta="Ambient"
        description="Fixed top-of-viewport bar that fills as the real page scrolls. Scoped to a preview box — the fill still reflects this page's actual scroll position."
      >
        <FixedScope height="10rem">
          <div className="flex h-full items-center justify-center">
            <MiniCard label="Tracks real page scroll" />
          </div>
          <ScrollProgress height={3} />
        </FixedScope>
      </DemoBand>

      {/* =================================================================
          CLICK & TAP — 6 modules
      ================================================================= */}
      <SectionIntro
        title="Click & Tap"
        count="6 modules"
        description="Explicit interactions — a click or tap drives the state change."
      />

      <DemoBand
        index="01"
        title="CoverflowCarousel"
        meta="Click"
        description="3D coverflow carousel where cards fan out in perspective around a centered active item."
      >
        <div className="p-10">
          <CoverflowCarousel
            items={[
              { title: "Applications", description: "Route and approve in one queue.", background: "color-mix(in oklab, var(--primary) 22%, var(--card))" },
              { title: "Payouts", description: "Stripe payouts, same day.", background: "color-mix(in oklab, var(--chart-2) 30%, var(--card))" },
              { title: "Calendars", description: "Every venue, one view.", background: "color-mix(in oklab, var(--chart-3) 30%, var(--card))" },
              { title: "Messaging", description: "Bulk-message without leaving the app.", background: "color-mix(in oklab, var(--chart-4) 30%, var(--card))" },
            ]}
          />
        </div>
      </DemoBand>

      <DemoBand
        index="02"
        title="ParticleButton"
        meta="Click"
        description="Bursts small colored particles outward from its center on click."
      >
        <div className="flex min-h-40 items-center justify-center p-10">
          <ParticleButton className="rounded-[var(--radius-md)] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Click for particles
          </ParticleButton>
        </div>
      </DemoBand>

      <DemoBand
        index="03"
        title="DynamicIsland"
        meta="Click"
        description="Fixed pill that expands on click to reveal a notification list. Scoped to a preview box."
      >
        <FixedScope height="22rem">
          <div className="flex h-full items-center justify-center">
            <MiniCard label="Click the pill above to expand" />
          </div>
          <DynamicIsland
            label="3 new bookings"
            notifications={[
              { color: "var(--primary)", text: "Riverside Night Market — 2 new applications" },
              { color: "var(--chart-2)", text: "Payout released to Salt & Ember Kitchen" },
              { color: "var(--chart-3)", text: "Harbourfront Craft Fair — schedule updated" },
            ]}
          />
        </FixedScope>
      </DemoBand>

      <DemoBand
        index="04"
        title="DockNav"
        meta="Click"
        description="Fixed bottom dock of nav icons that magnify near the cursor, macOS-dock style. Scoped to a preview box."
      >
        <FixedScope height="14rem">
          <div className="flex h-full items-center justify-center">
            <MiniCard label="Hover the dock (fine pointer only)" />
          </div>
          <DockNav
            items={[
              { icon: dockIcon(HomeIcon), label: "Dashboard", color: "color-mix(in oklab, var(--primary) 70%, var(--card))" },
              { icon: dockIcon(CalendarIcon), label: "Bookings", color: "color-mix(in oklab, var(--chart-2) 70%, var(--card))" },
              { icon: dockIcon(UsersIcon), label: "Vendors", color: "color-mix(in oklab, var(--chart-3) 70%, var(--card))" },
              { icon: dockIcon(MailIcon), label: "Messages", color: "color-mix(in oklab, var(--chart-4) 70%, var(--card))" },
              { icon: dockIcon(SettingsIcon), label: "Settings", color: "color-mix(in oklab, var(--chart-5) 70%, var(--card))" },
            ]}
          />
        </FixedScope>
      </DemoBand>

      <DemoBand
        index="05"
        title="ViewTransitionMorph"
        meta="Click"
        description="A button that click-cycles through states, morphing size, radius, background, and content between them."
      >
        <div className="flex min-h-72 items-center justify-center p-10">
          <ViewTransitionMorph
            states={[
              {
                id: "compact",
                label: "Compact",
                width: "12rem",
                height: "3.5rem",
                borderRadius: "9999px",
                background: "color-mix(in oklab, var(--primary) 85%, transparent)",
                content: <span className="text-sm font-medium text-primary-foreground">Compact</span>,
              },
              {
                id: "card",
                label: "Card",
                width: "16rem",
                height: "8rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--card)",
                content: <span className="font-mono text-overline uppercase text-muted-foreground">Card state</span>,
              },
              {
                id: "wide",
                label: "Wide",
                width: "20rem",
                height: "5rem",
                borderRadius: "var(--radius-md)",
                background: "color-mix(in oklab, var(--chart-2) 30%, var(--card))",
                content: <span className="text-sm font-medium">Wide state</span>,
              },
            ]}
          />
        </div>
      </DemoBand>

      <DemoBand
        index="06"
        title="OdometerCounter"
        meta="Click"
        description="Scroll-triggered digit counter that rolls each digit into place like a mechanical odometer."
      >
        <div className="flex min-h-32 items-center justify-center p-10">
          <OdometerCounter value={2400} suffix="+" label="Vendors booked this season" />
        </div>
      </DemoBand>

      {/* =================================================================
          CURSOR & HOVER — 9 modules (CursorReveal contributes 2 demos)
      ================================================================= */}
      <SectionIntro
        title="Cursor & Hover"
        count="9 modules"
        description="Fine-pointer reactive effects — every one settles to a fully visible, non-hidden state on touch or reduced motion."
      />

      <DemoBand index="01" title="CursorGlow" meta="Cursor" description="Soft radial-gradient halo that trails the cursor with eased motion.">
        <CursorGlow>
          <div className="flex min-h-64 items-center justify-center p-10">
            <MiniCard label="Move your cursor over this band" tone="card" />
          </div>
        </CursorGlow>
      </DemoBand>

      <DemoBand index="02" title="TiltCard" meta="Cursor" description="Wraps content in a card that tilts in 3D toward the cursor with a spotlight overlay.">
        <div className="flex min-h-64 items-center justify-center p-10">
          <TiltCard className="w-full max-w-sm rounded-[var(--radius-lg)] border bg-card p-8">
            <p className="font-heading text-lg font-medium">Tilts toward the cursor</p>
            <p className="mt-2 text-sm text-muted-foreground">Fine pointer only — flat and static on touch.</p>
          </TiltCard>
        </div>
      </DemoBand>

      <DemoBand index="03" title="SpotlightBorderCards" meta="Cursor" description="Grid of cards whose border glow and interior spotlight track the cursor per-card.">
        <div className="p-10">
          <SpotlightBorderCards
            columns={3}
            items={[
              { icon: <ZapIcon aria-hidden className="size-5" />, title: "Fast setup", description: "Booking your first vendor within a day." },
              { icon: <SparklesIcon aria-hidden className="size-5" />, title: "Automated", description: "Waitlists and payouts run themselves." },
              { icon: <LayersIcon aria-hidden className="size-5" />, title: "Multi-venue", description: "One login across every market." },
            ]}
          />
        </div>
      </DemoBand>

      <DemoBand index="04" title="AccordionSlider" meta="Cursor" description="Row of image panels that expand on hover or tap to reveal a heading and description.">
        <div className="p-10">
          <AccordionSlider
            variant="horizontal"
            panels={[
              { image: swatch("#7a6f8a", "RIVERSIDE"), title: "01", heading: "Riverside Night Market", description: "Our largest weekly market." },
              { image: swatch("#6f8a7f", "HARBOUR"), title: "02", heading: "Harbourfront Craft Fair", description: "Monthly, waterfront." },
              { image: swatch("#8a7a6f", "OLD TOWN"), title: "03", heading: "Old Town Makers Market", description: "Handmade goods only." },
              { image: swatch("#6f7a8a", "MIDTOWN"), title: "04", heading: "Midtown Night Market", description: "Food-forward, evenings." },
            ]}
          />
        </div>
      </DemoBand>

      <DemoBand index="05" title="FlipCards" meta="Cursor" description="Cards that flip 180° in 3D on click, tap, or Enter to reveal a back face. Renders its own internal auto-fit grid — no external grid wrapper needed.">
        <div className="p-10">
          <FlipCards
            cards={[
              { frontTitle: "Applications", frontDesc: "Tap to flip", backTitle: "Sorted automatically", backDesc: "Rules route vendors to the right waitlist." },
              { frontTitle: "Payouts", frontDesc: "Tap to flip", backTitle: "Same-day Stripe", backDesc: "Payouts release the day the market closes." },
              { frontTitle: "Contracts", frontDesc: "Tap to flip", backTitle: "E-signed in app", backDesc: "No PDFs lost in email threads." },
            ]}
          />
        </div>
      </DemoBand>

      <DemoBand index="06a" title="CursorReveal — WipeReveal" meta="Cursor" description="Draggable vertical divider comparing two background images (default export).">
        <div className="p-10">
          <WipeReveal beforeImage={swatch("#8f8579", "BEFORE")} afterImage={swatch("#dde3e6", "AFTER")} />
        </div>
      </DemoBand>

      <DemoBand index="06b" title="CursorReveal — SpotlightReveal" meta="Cursor" description="Circular lens that reveals a second background layer under the cursor (named export). baseBackground/revealBackground accept any CSS background value, not just images — token gradients used here.">
        <div className="p-10">
          <SpotlightReveal
            baseBackground="color-mix(in oklab, var(--foreground) 8%, var(--card))"
            revealBackground="color-mix(in oklab, var(--primary) 55%, var(--card))"
          />
        </div>
      </DemoBand>

      <DemoBand index="07" title="ImageTrail" meta="Cursor" description="Spawns a trailing pool of rotating, fading colored blocks behind the cursor past a distance threshold.">
        <ImageTrail>
          <div className="flex min-h-72 items-center justify-center p-10">
            <MiniCard label="Move your cursor across this band" tone="card" />
          </div>
        </ImageTrail>
      </DemoBand>

      <DemoBand index="08" title="MagneticGrid" meta="Cursor" description="Grid of dots that displace toward the cursor within a magnet radius.">
        <div className="p-10">
          <MagneticGrid rows={6} cols={10} />
        </div>
      </DemoBand>

      <DemoBand index="09" title="DragPanGrid" meta="Cursor" description="Click/tap-and-drag pannable canvas of absolutely-positioned cards.">
        <DragPanGrid
          height="24rem"
          items={[
            { x: 0, y: 0, width: 220, height: 150, background: "color-mix(in oklab, var(--primary) 20%, var(--card))", content: <MiniCard label="Card A" /> },
            { x: 260, y: 60, width: 220, height: 150, background: "color-mix(in oklab, var(--chart-2) 24%, var(--card))", content: <MiniCard label="Card B" /> },
            { x: 90, y: 240, width: 220, height: 150, background: "color-mix(in oklab, var(--chart-3) 24%, var(--card))", content: <MiniCard label="Card C" /> },
            { x: 520, y: -40, width: 220, height: 150, background: "color-mix(in oklab, var(--chart-4) 24%, var(--card))", content: <MiniCard label="Card D" /> },
            { x: 380, y: 260, width: 220, height: 150, background: "color-mix(in oklab, var(--chart-5) 24%, var(--card))", content: <MiniCard label="Card E" /> },
          ]}
        />
      </DemoBand>

      {/* =================================================================
          SCROLL-TRIGGERED — 10 modules. CurtainReveal / StickyStack /
          HorizontalScroll are the 3 "live" big pins; StickyCards and
          ZoomParallax also pin but are lightweight (see file header note);
          CanvasHero uses its own non-pinned fallback branch. All five plus
          VideoBackground above render full-bleed. The remaining 4 (no pin
          mechanism at all — confirmed by source) render boxed.
      ================================================================= */}
      <SectionIntro
        title="Scroll-Triggered"
        count="10 modules"
        description="Scroll-scrubbed and pinned effects. Only the three heaviest run in full unconstrained form — see the note below each."
      />

      <DemoBand index="01" title="TextMaskReveal" meta="Scroll" description="Giant outlined headline that fills solid with color via a scroll-scrubbed clip-path reveal. No pin — scrubs in its own natural document position.">
        <div className="p-4">
          <TextMaskReveal text="REVEAL" />
        </div>
      </DemoBand>

      <DemoBand
        index="02"
        title="ColorShiftSection"
        meta="Scroll"
        description="Stacked full-height panels that tween document.body's background/text color as each enters view. No pin. Demo colors deliberately chosen from the page's own card/background tokens — including ending on the page default — so nothing looks broken if the tween is still settling when you scroll past it into later demos."
      >
        <ColorShiftSection
          panels={[
            {
              bg: "var(--card)",
              text: "var(--card-foreground)",
              children: (
                <p className="font-mono text-overline uppercase tracking-[0.18em]">Panel one — tweens to card tone</p>
              ),
            },
            {
              bg: "var(--background)",
              text: "var(--foreground)",
              children: (
                <p className="font-mono text-overline uppercase tracking-[0.18em]">Panel two — settles back to page default</p>
              ),
            },
          ]}
        />
      </DemoBand>

      <DemoBand index="03" title="SplitScreen" meta="Scroll" description="Two columns drift in opposite vertical directions as the section scrolls through the viewport. No pin — a plain scroll-linked parallax.">
        <div className="p-4">
          <SplitScreen
            leftItems={[<MiniCard key="l1" label="Left A" />, <MiniCard key="l2" label="Left B" />]}
            rightItems={[<MiniCard key="r1" label="Right A" />, <MiniCard key="r2" label="Right B" />]}
          />
        </div>
      </DemoBand>

      <DemoBand index="04" title="SVGDraw" meta="Scroll" description="An SVG path draws itself on scroll via a stroke-dasharray/dashoffset scrub. No pin.">
        <div className="p-4">
          <SVGDraw path="M40 110 L85 155 L165 55" viewBox="0 0 200 200" width="200" strokeColor="var(--primary)" strokeWidth={14} />
        </div>
      </DemoBand>

      <FullBleedBand
        index="05"
        title="CurtainReveal"
        meta="Scroll — live"
        description="Two sticky panels slide apart like theater curtains on scroll to reveal content behind them. One of the 3 modules running fully live/unconstrained (300vh, position:sticky targeting the real window scroller)."
      >
        <CurtainReveal leftText="DIS" rightText="COVER">
          <p className="font-mono text-overline uppercase tracking-[0.2em] text-muted-foreground">The curtains parted.</p>
        </CurtainReveal>
      </FullBleedBand>

      <FullBleedBand
        index="06"
        title="StickyStack"
        meta="Scroll — live"
        description="Pinned visual column cross-fades between images while matching text cards scroll past on the right. One of the 3 live modules (300vh with 3 items, GSAP pin targeting the real window scroller)."
      >
        <StickyStack
          items={[
            { visual: <PlaceholderMedia label="Applications" ratio="4/3" />, title: "Applications sort themselves", description: "Vendors apply once; rules route them to the right market or waitlist." },
            { visual: <PlaceholderMedia label="Payouts" ratio="4/3" />, title: "Stripe payouts, same day", description: "Vendor payouts release the day the market closes." },
            { visual: <PlaceholderMedia label="Calendars" ratio="4/3" />, title: "Multi-venue calendars", description: "One calendar view across every market, color-coded by venue." },
          ]}
        />
      </FullBleedBand>

      <FullBleedBand
        index="07"
        title="HorizontalScroll"
        meta="Scroll — live"
        description="Vertical scroll hijacked into a horizontal pan across a track of cards. The 3rd of the 3 live modules — height is computed from the number of cards found in the DOM (each needs a data-hcard attribute)."
      >
        <HorizontalScroll>
          {["Applications", "Payouts", "Calendars", "Messaging"].map((label) => (
            <div
              key={label}
              data-hcard
              className={`flex h-[60vh] w-[320px] shrink-0 flex-col justify-center rounded-[var(--radius-lg)] border p-8 ${HAIRLINE} bg-card`}
            >
              <p className="font-mono text-overline uppercase tracking-[0.18em] text-muted-foreground">Workflow</p>
              <p className="mt-3 text-heading font-heading font-medium">{label}</p>
            </div>
          ))}
        </HorizontalScroll>
      </FullBleedBand>

      <FullBleedBand
        index="08"
        title="CanvasHero"
        meta="Scroll — fallback"
        description="Normally a pinned 300vh hero that scrubs a preloaded frame sequence on canvas. Rendered here via its own staticImage/gradient fallback branch (frameCount and staticImage both omitted) — this drops showCanvas to false internally, so it renders as a plain, non-pinned 100vh panel with the built-in radial-gradient backdrop."
      >
        <CanvasHero>
          <p className="font-mono text-overline uppercase tracking-[0.2em] text-muted-foreground">
            Gradient fallback — no frames, no pin
          </p>
        </CanvasHero>
      </FullBleedBand>

      <FullBleedBand
        index="09"
        title="StickyCards"
        meta="Scroll — live"
        description="Cards pin in place and scale/fade as the next card scrolls over and stacks on top. Uses GSAP pin:true but with pinSpacing:false, so — confirmed by reading the source — it adds essentially no extra scroll height beyond the cards' own natural stacking; runs live."
      >
        <StickyCards
          cards={[
            { content: <p className="text-lg font-medium">First card — scroll to stack the next one on top.</p>, background: "var(--card)" },
            { content: <p className="text-lg font-medium">Second card — pins, then the next covers it.</p>, background: "color-mix(in oklab, var(--chart-2) 12%, var(--card))" },
            { content: <p className="text-lg font-medium">Third card — settles on top, un-pinned.</p>, background: "color-mix(in oklab, var(--chart-3) 12%, var(--card))" },
          ]}
        />
      </FullBleedBand>

      <FullBleedBand
        index="10"
        title="ZoomParallax"
        meta="Scroll — live"
        description="Pinned section where giant text scales up and fades out while the background zooms for depth parallax. Uses GSAP pin:true, but the section is a fixed 100dvh regardless of content — confirmed by reading the source — so it never grows beyond one extra viewport height; runs live."
      >
        <ZoomParallax text="CINEMATIC" backgroundColor="var(--card)">
          <p className="font-mono text-overline uppercase tracking-[0.2em] text-muted-foreground">
            Appears as the text zooms away
          </p>
        </ZoomParallax>
      </FullBleedBand>
    </div>
  );
}
