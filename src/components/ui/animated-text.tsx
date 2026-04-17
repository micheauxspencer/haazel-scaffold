"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/lib/animations/gsap-provider";
import { getPreset } from "@/lib/animations/presets";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delay?: number;
  /** Override preset split mode */
  splitBy?: "chars" | "words" | "lines";
  /** Trigger on scroll (true) or on mount (false) */
  onScroll?: boolean;
}

export function AnimatedText({
  children,
  as: Tag = "h1",
  className,
  delay = 0,
  splitBy,
  onScroll = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { isReady, preset } = useGSAPContext();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const config = getPreset(preset);
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]>;

    async function animate() {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = ref.current!;

      // Determine split mode
      const mode =
        splitBy ??
        (config.text.splitByChars
          ? "chars"
          : config.text.splitByWords
            ? "words"
            : config.text.splitByLines
              ? "lines"
              : null);

      if (!mode) {
        // No split — animate the whole element
        ctx = gsap.context(() => {
          gsap.from(el, {
            y: config.reveal.y,
            opacity: 0,
            duration: config.reveal.duration,
            delay,
            ease: config.reveal.ease,
            ...(onScroll && {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }),
          });
        }, el);
        return;
      }

      // Manual text splitting (no external dependency)
      const text = el.textContent ?? "";
      el.setAttribute("aria-label", text);

      let elements: HTMLSpanElement[] = [];

      if (mode === "chars") {
        el.innerHTML = "";
        elements = text.split("").map((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.setAttribute("aria-hidden", "true");
          el.appendChild(span);
          return span;
        });
      } else if (mode === "words") {
        el.innerHTML = "";
        elements = text.split(/\s+/).map((word, i, arr) => {
          const span = document.createElement("span");
          span.textContent = word;
          span.style.display = "inline-block";
          span.setAttribute("aria-hidden", "true");
          el.appendChild(span);
          if (i < arr.length - 1) {
            const space = document.createElement("span");
            space.innerHTML = "&nbsp;";
            space.style.display = "inline-block";
            el.appendChild(space);
          }
          return span;
        });
      } else {
        // lines — wrap each line in a span
        el.innerHTML = "";
        elements = text.split("\n").map((line) => {
          const span = document.createElement("span");
          span.textContent = line;
          span.style.display = "block";
          span.setAttribute("aria-hidden", "true");
          el.appendChild(span);
          return span;
        });
      }

      const stagger =
        mode === "chars"
          ? config.text.charStagger
          : mode === "words"
            ? config.text.wordStagger
            : config.text.lineStagger;

      const yDir =
        config.text.revealDirection === "up"
          ? { y: 40 }
          : config.text.revealDirection === "down"
            ? { y: -40 }
            : config.text.revealDirection === "left"
              ? { x: 40 }
              : config.text.revealDirection === "right"
                ? { x: -40 }
                : {};

      ctx = gsap.context(() => {
        gsap.from(elements, {
          ...yDir,
          opacity: 0,
          duration: config.reveal.duration,
          stagger,
          delay,
          ease: config.reveal.ease,
          ...(onScroll && {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }),
        });
      }, el);
    }

    animate();

    return () => {
      ctx?.revert();
    };
  }, [isReady, preset, children, delay, splitBy, onScroll]);

  return (
    // @ts-expect-error - dynamic tag typing
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
