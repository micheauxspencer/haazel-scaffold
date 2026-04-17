import type { StylePreset } from "@/types/brand";

export interface AnimationPreset {
  /** Scroll reveal: how elements appear on scroll */
  reveal: {
    y: number;
    opacity: number;
    duration: number;
    stagger: number;
    ease: string;
  };
  /** Hero section animations */
  hero: {
    titleSplit: boolean;
    titleStagger: number;
    subtitleDelay: number;
    parallaxStrength: number;
    overlayFade: boolean;
  };
  /** Section transitions */
  section: {
    scrubSpeed: number;
    pinEnabled: boolean;
    parallaxImages: boolean;
    backgroundShift: boolean;
  };
  /** Text animation style */
  text: {
    splitByChars: boolean;
    splitByWords: boolean;
    splitByLines: boolean;
    charStagger: number;
    wordStagger: number;
    lineStagger: number;
    revealDirection: "up" | "down" | "left" | "right" | "none";
  };
  /** Interactive effects */
  interactive: {
    magneticButtons: boolean;
    cursorFollower: boolean;
    hoverScale: number;
    hoverRotation: number;
  };
  /** Counter/stats animation */
  counter: {
    duration: number;
    ease: string;
  };
}

const cinematic: AnimationPreset = {
  reveal: { y: 80, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
  hero: {
    titleSplit: true,
    titleStagger: 0.04,
    subtitleDelay: 0.6,
    parallaxStrength: 0.5,
    overlayFade: true,
  },
  section: {
    scrubSpeed: 1,
    pinEnabled: true,
    parallaxImages: true,
    backgroundShift: true,
  },
  text: {
    splitByChars: true,
    splitByWords: false,
    splitByLines: true,
    charStagger: 0.02,
    wordStagger: 0.05,
    lineStagger: 0.1,
    revealDirection: "up",
  },
  interactive: {
    magneticButtons: true,
    cursorFollower: true,
    hoverScale: 1.05,
    hoverRotation: 2,
  },
  counter: { duration: 2.5, ease: "power2.out" },
};

const minimalist: AnimationPreset = {
  reveal: { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
  hero: {
    titleSplit: false,
    titleStagger: 0,
    subtitleDelay: 0.3,
    parallaxStrength: 0.15,
    overlayFade: false,
  },
  section: {
    scrubSpeed: 0.5,
    pinEnabled: false,
    parallaxImages: false,
    backgroundShift: false,
  },
  text: {
    splitByChars: false,
    splitByWords: false,
    splitByLines: false,
    charStagger: 0,
    wordStagger: 0,
    lineStagger: 0,
    revealDirection: "up",
  },
  interactive: {
    magneticButtons: false,
    cursorFollower: false,
    hoverScale: 1.02,
    hoverRotation: 0,
  },
  counter: { duration: 1.5, ease: "power2.out" },
};

const brutalist: AnimationPreset = {
  reveal: { y: 0, opacity: 0, duration: 0.3, stagger: 0.02, ease: "power1.out" },
  hero: {
    titleSplit: true,
    titleStagger: 0.01,
    subtitleDelay: 0.1,
    parallaxStrength: 0,
    overlayFade: false,
  },
  section: {
    scrubSpeed: 0,
    pinEnabled: false,
    parallaxImages: false,
    backgroundShift: false,
  },
  text: {
    splitByChars: true,
    splitByWords: false,
    splitByLines: false,
    charStagger: 0.01,
    wordStagger: 0,
    lineStagger: 0,
    revealDirection: "none",
  },
  interactive: {
    magneticButtons: false,
    cursorFollower: false,
    hoverScale: 1,
    hoverRotation: 0,
  },
  counter: { duration: 0.5, ease: "none" },
};

const luxury: AnimationPreset = {
  reveal: { y: 60, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power2.inOut" },
  hero: {
    titleSplit: true,
    titleStagger: 0.06,
    subtitleDelay: 0.8,
    parallaxStrength: 0.3,
    overlayFade: true,
  },
  section: {
    scrubSpeed: 1.5,
    pinEnabled: true,
    parallaxImages: true,
    backgroundShift: true,
  },
  text: {
    splitByChars: false,
    splitByWords: true,
    splitByLines: true,
    charStagger: 0,
    wordStagger: 0.08,
    lineStagger: 0.15,
    revealDirection: "up",
  },
  interactive: {
    magneticButtons: true,
    cursorFollower: false,
    hoverScale: 1.03,
    hoverRotation: 0,
  },
  counter: { duration: 3, ease: "power2.inOut" },
};

const corporate: AnimationPreset = {
  reveal: { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
  hero: {
    titleSplit: false,
    titleStagger: 0,
    subtitleDelay: 0.4,
    parallaxStrength: 0.1,
    overlayFade: false,
  },
  section: {
    scrubSpeed: 0.5,
    pinEnabled: false,
    parallaxImages: false,
    backgroundShift: false,
  },
  text: {
    splitByChars: false,
    splitByWords: false,
    splitByLines: true,
    charStagger: 0,
    wordStagger: 0,
    lineStagger: 0.08,
    revealDirection: "up",
  },
  interactive: {
    magneticButtons: false,
    cursorFollower: false,
    hoverScale: 1.02,
    hoverRotation: 0,
  },
  counter: { duration: 2, ease: "power2.out" },
};

const creative: AnimationPreset = {
  reveal: { y: 60, opacity: 0, duration: 1.0, stagger: 0.12, ease: "back.out(1.7)" },
  hero: {
    titleSplit: true,
    titleStagger: 0.03,
    subtitleDelay: 0.5,
    parallaxStrength: 0.4,
    overlayFade: true,
  },
  section: {
    scrubSpeed: 0.8,
    pinEnabled: true,
    parallaxImages: true,
    backgroundShift: true,
  },
  text: {
    splitByChars: true,
    splitByWords: true,
    splitByLines: false,
    charStagger: 0.015,
    wordStagger: 0.04,
    lineStagger: 0,
    revealDirection: "left",
  },
  interactive: {
    magneticButtons: true,
    cursorFollower: true,
    hoverScale: 1.08,
    hoverRotation: 5,
  },
  counter: { duration: 2, ease: "elastic.out(1, 0.5)" },
};

const ecommerce: AnimationPreset = {
  reveal: { y: 30, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
  hero: {
    titleSplit: false,
    titleStagger: 0,
    subtitleDelay: 0.2,
    parallaxStrength: 0.1,
    overlayFade: false,
  },
  section: {
    scrubSpeed: 0.3,
    pinEnabled: false,
    parallaxImages: false,
    backgroundShift: false,
  },
  text: {
    splitByChars: false,
    splitByWords: false,
    splitByLines: false,
    charStagger: 0,
    wordStagger: 0,
    lineStagger: 0,
    revealDirection: "up",
  },
  interactive: {
    magneticButtons: false,
    cursorFollower: false,
    hoverScale: 1.05,
    hoverRotation: 0,
  },
  counter: { duration: 1, ease: "power2.out" },
};

const presets: Record<StylePreset, AnimationPreset> = {
  cinematic,
  minimalist,
  brutalist,
  luxury,
  corporate,
  creative,
  ecommerce,
};

export function getPreset(name: StylePreset): AnimationPreset {
  return presets[name] ?? presets.cinematic;
}

export { cinematic, minimalist, brutalist, luxury, corporate, creative, ecommerce };
