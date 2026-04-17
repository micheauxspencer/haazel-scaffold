"use client";

import { useRef, useEffect, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  overlay?: string;
  className?: string;
  children?: React.ReactNode;
  minHeight?: string;
  playbackRate?: number;
}

/**
 * Cinematic video background with autoplay, loop, and scroll-driven opacity.
 * Falls back to poster image if video fails to load.
 * Uses intersection observer to pause when off-screen (performance).
 */
export default function VideoBackground({
  src,
  poster,
  overlay = "rgba(6, 4, 22, 0.4)",
  className = "",
  children,
  minHeight = "100vh",
  playbackRate = 0.75,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer — pause video when off-screen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Set playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(0.9)" }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Color overlay */}
      <div
        className="absolute inset-0"
        style={{ background: overlay }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
