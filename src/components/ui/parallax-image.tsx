"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  speed?: number;
  priority?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  fill = true,
  className,
  containerClassName,
  speed,
  priority = false,
}: ParallaxImageProps) {
  const ref = useParallax<HTMLDivElement>({ speed });

  return (
    <div className={cn("overflow-hidden", containerClassName)}>
      <div ref={ref}>
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          className={cn("object-cover", className)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}
