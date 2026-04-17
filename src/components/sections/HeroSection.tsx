"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/ui/animated-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";

interface HeroCTA {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
}

interface HeroSectionProps {
  variant?: "video-bg" | "parallax" | "centered" | "split";
  headline: string;
  subheadline?: string;
  ctas?: HeroCTA[];
  backgroundImage?: string;
  backgroundVideo?: string;
  sideImage?: string;
  className?: string;
}

export function HeroSection({
  variant = "centered",
  headline,
  subheadline,
  ctas = [],
  backgroundImage,
  backgroundVideo,
  sideImage,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-svh items-center overflow-hidden",
        className
      )}
    >
      {/* Video background */}
      {variant === "video-bg" && backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="size-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/70" />
        </div>
      )}

      {/* Parallax background */}
      {variant === "parallax" && backgroundImage && (
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={backgroundImage}
            alt=""
            fill
            priority
            containerClassName="size-full"
            className="scale-110"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}

      {/* Static background for centered/split */}
      {(variant === "centered" || variant === "split") && backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {variant === "split" ? (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text side */}
            <div className="space-y-6">
              <AnimatedText
                as="h1"
                className="text-4xl font-bold tracking-tight text-foreground font-display sm:text-5xl lg:text-6xl"
                splitBy="words"
              >
                {headline}
              </AnimatedText>

              {subheadline && (
                <ScrollReveal delay={0.3}>
                  <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                    {subheadline}
                  </p>
                </ScrollReveal>
              )}

              {ctas.length > 0 && (
                <ScrollReveal delay={0.5}>
                  <div className="flex flex-wrap gap-4">
                    {ctas.map((cta) => (
                      <MagneticButton key={cta.label} as="a" href={cta.href}>
                        <Button variant={cta.variant ?? "default"} size="lg">
                          {cta.label}
                        </Button>
                      </MagneticButton>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Image side */}
            {sideImage && (
              <ScrollReveal delay={0.4} y={30}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={sideImage}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
            )}
          </div>
        ) : (
          /* Centered / video-bg / parallax layout */
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedText
              as="h1"
              className="text-4xl font-bold tracking-tight text-foreground font-display sm:text-5xl lg:text-6xl xl:text-7xl"
              splitBy="words"
            >
              {headline}
            </AnimatedText>

            {subheadline && (
              <ScrollReveal delay={0.3}>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {subheadline}
                </p>
              </ScrollReveal>
            )}

            {ctas.length > 0 && (
              <ScrollReveal delay={0.5}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  {ctas.map((cta) => (
                    <MagneticButton key={cta.label} as="a" href={cta.href}>
                      <Button variant={cta.variant ?? "default"} size="lg">
                        {cta.label}
                      </Button>
                    </MagneticButton>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
