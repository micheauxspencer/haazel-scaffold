"use client";

import { useEffect, useRef, useState } from "react";

interface OdometerCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function DigitRoller({
  digit,
  delay,
  active,
}: {
  digit: number;
  delay: number;
  active: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        height: "1em",
        overflow: "hidden",
        lineHeight: 1,
        position: "relative",
      }}
    >
      <span
        style={{
          display: "block",
          transform: active ? `translateY(${-digit * 1}em)` : "translateY(0em)",
          transition: active
            ? `transform 1.2s cubic-bezier(.16, 1, .3, 1) ${delay}s`
            : "none",
          willChange: "transform",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              height: "1em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function OdometerCounter({
  value,
  label,
  prefix,
  suffix,
  className = "",
}: OdometerCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => setActive(true),
        });
      });
    };

    init();
    return () => { ctx?.revert(); };
  }, []);

  const digits = String(value).split("");

  return (
    <div ref={containerRef} className={className} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "baseline",
          color: "inherit",
        }}
      >
        {prefix && (
          <span style={{ opacity: active ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
            {prefix}
          </span>
        )}
        {digits.map((d, i) => (
          <DigitRoller
            key={`${i}-${d}`}
            digit={parseInt(d, 10)}
            delay={i * 0.12}
            active={active}
          />
        ))}
        {suffix && (
          <span
            style={{
              fontSize: "0.5em",
              fontWeight: 400,
              marginLeft: "0.1em",
              opacity: active ? 1 : 0,
              transition: "opacity 0.6s ease 0.8s",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {label && (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            opacity: active ? 0.6 : 0,
            transition: "opacity 0.6s ease 1s",
            color: "inherit",
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
