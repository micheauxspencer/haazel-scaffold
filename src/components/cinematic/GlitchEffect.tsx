"use client";

interface GlitchEffectProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  accentColor?: string;
  cyanColor?: string;
  className?: string;
}

export default function GlitchEffect({
  text,
  as: Tag = "div",
  accentColor = "#ff3b3b",
  cyanColor = "#00f0ff",
  className = "",
}: GlitchEffectProps) {
  const uid = `glitch-${text.replace(/\s+/g, "").slice(0, 6).toLowerCase()}`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .${uid} {
              position: relative;
              font-size: clamp(3.75rem, 12vw, 10rem);
              font-weight: 800;
              letter-spacing: -0.04em;
              text-transform: uppercase;
              cursor: default;
              color: rgba(234,231,226,0.95);
            }
            .${uid}::before,
            .${uid}::after {
              content: '${text}';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            .${uid}::before {
              color: ${cyanColor};
              clip-path: inset(0 0 70% 0);
              animation: none;
              transform: translate(0);
            }
            .${uid}::after {
              color: ${accentColor};
              clip-path: inset(70% 0 0 0);
              animation: none;
              transform: translate(0);
            }
            .${uid}:hover::before {
              animation: ${uid}-top 0.4s steps(2) infinite;
            }
            .${uid}:hover::after {
              animation: ${uid}-bot 0.4s steps(3) infinite;
            }
            @keyframes ${uid}-top {
              0%   { clip-path: inset(0 0 80% 0); transform: translate(-3px, -2px); }
              25%  { clip-path: inset(20% 0 50% 0); transform: translate(3px, 1px); }
              50%  { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 2px); }
              75%  { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
              100% { clip-path: inset(0 0 80% 0); transform: translate(0); }
            }
            @keyframes ${uid}-bot {
              0%   { clip-path: inset(80% 0 0 0); transform: translate(3px, 1px); }
              33%  { clip-path: inset(50% 0 20% 0); transform: translate(-3px, -2px); }
              66%  { clip-path: inset(30% 0 40% 0); transform: translate(2px, 2px); }
              100% { clip-path: inset(80% 0 0 0); transform: translate(0); }
            }
          `,
        }}
      />
      <Tag className={`${uid} ${className}`} data-text={text}>
        {text}
      </Tag>
    </>
  );
}
