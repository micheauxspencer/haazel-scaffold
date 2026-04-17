"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

interface TextScrambleProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";
  chars?: string;
  speed?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  className?: string;
}

export default function TextScramble({
  text,
  as = "h2",
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*",
  speed = 50,
  stagger = 30,
  triggerOnScroll = true,
  className = "",
}: TextScrambleProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(
    text
      .split("")
      .map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]))
      .join(""),
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!triggerOnScroll) {
      runScramble();
      return;
    }

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (!hasAnimated.current) {
              hasAnimated.current = true;
              runScramble();
            }
          },
        });
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOnScroll, text]);

  function runScramble() {
    const letters = text.split("");
    const resolved = new Array(letters.length).fill(false);
    const current = display.split("");

    let frame = 0;

    function tick() {
      let allDone = true;

      for (let i = 0; i < letters.length; i++) {
        if (letters[i] === " ") {
          current[i] = " ";
          resolved[i] = true;
          continue;
        }

        if (resolved[i]) continue;

        allDone = false;

        // Character resolves after its stagger threshold
        if (frame > i * (stagger / speed) + 3) {
          current[i] = letters[i];
          resolved[i] = true;
        } else {
          current[i] = chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplay(current.join(""));
      frame++;

      if (!allDone) {
        setTimeout(tick, speed);
      }
    }

    tick();
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        fontFamily: "monospace, 'JetBrains Mono', 'Courier New'",
        whiteSpace: "pre-wrap",
      }}
    >
      {display}
    </Tag>
  );
}
