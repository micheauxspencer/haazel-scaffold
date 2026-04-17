"use client";

import { type ElementType } from "react";

interface GradientStrokeTextProps {
  text: string;
  variant?: "stroke" | "filled";
  colors?: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  strokeWidth?: number;
  speed?: number;
  className?: string;
}

export default function GradientStrokeText({
  text,
  variant = "stroke",
  colors = ["#c8a97e", "#5eadb5", "#a8748e", "#e85d3a", "#4f46e5", "#c8a97e"],
  as = "h2",
  strokeWidth = 2,
  speed = 6,
  className = "",
}: GradientStrokeTextProps) {
  const Tag = as as ElementType;
  const uid = `gs-${text.replace(/\s+/g, "").slice(0, 8).toLowerCase()}`;
  const gradient = colors.join(", ");

  if (variant === "filled") {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes gradShift-${uid}{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`,
          }}
        />
        <Tag
          className={className}
          style={{
            fontSize: "clamp(3rem, 10vw, 8.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.95,
            background: `linear-gradient(135deg, ${gradient})`,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: `gradShift-${uid} ${speed * 0.67}s ease infinite`,
            userSelect: "none",
          }}
        >
          {text}
        </Tag>
      </>
    );
  }

  // Stroke variant (default) — matches source gradient-stroke.html
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes gradMove-${uid}{0%{background-position:0% 50%}100%{background-position:300% 50%}}`,
        }}
      />
      <Tag
        className={className}
        style={{
          fontSize: "clamp(3.75rem, 14vw, 12.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          lineHeight: 0.9,
          textAlign: "center",
          color: "transparent",
          WebkitTextStroke: `${strokeWidth}px currentColor`,
          background: `linear-gradient(90deg, ${gradient})`,
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `gradMove-${uid} ${speed}s linear infinite`,
          userSelect: "none",
        }}
      >
        {text}
      </Tag>
    </>
  );
}
