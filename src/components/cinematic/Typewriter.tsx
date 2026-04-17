"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

interface TypewriterProps {
  phrases: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  cursorColor?: string;
  loop?: boolean;
  className?: string;
}

export default function Typewriter({
  phrases,
  as = "span",
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 2000,
  cursorColor = "currentColor",
  loop = true,
  className = "",
}: TypewriterProps) {
  const Tag = as as ElementType;
  const [display, setDisplay] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Typing loop
  useEffect(() => {
    function tick() {
      const currentPhrase = phrases[phraseIdx.current];

      if (isDeleting.current) {
        charIdx.current--;
        setDisplay(currentPhrase.slice(0, charIdx.current));

        if (charIdx.current === 0) {
          isDeleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;

          if (!loop && phraseIdx.current === 0) return;

          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          timeoutRef.current = setTimeout(tick, deletingSpeed);
        }
      } else {
        charIdx.current++;
        setDisplay(currentPhrase.slice(0, charIdx.current));

        if (charIdx.current === currentPhrase.length) {
          // Pause at end of phrase
          isDeleting.current = true;
          timeoutRef.current = setTimeout(tick, pauseTime);
        } else {
          timeoutRef.current = setTimeout(tick, typingSpeed);
        }
      }
    }

    timeoutRef.current = setTimeout(tick, typingSpeed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phrases, typingSpeed, deletingSpeed, pauseTime, loop]);

  return (
    <Tag className={className} style={{ whiteSpace: "pre-wrap" }}>
      {display}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: cursorColor,
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          opacity: cursorVisible ? 1 : 0,
          transition: "opacity 0.1s",
        }}
        aria-hidden
      />
    </Tag>
  );
}
