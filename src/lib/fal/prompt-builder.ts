import type { BrandConfig } from "@/types/brand";

export function buildImagePrompt(topic: string, brand: BrandConfig): string {
  const { imagery } = brand;

  const camera =
    imagery.cameras[Math.floor(Math.random() * imagery.cameras.length)];
  const lens =
    imagery.lenses[Math.floor(Math.random() * imagery.lenses.length)];
  const lighting =
    imagery.lighting[Math.floor(Math.random() * imagery.lighting.length)];
  const subject =
    imagery.subjects[Math.floor(Math.random() * imagery.subjects.length)];

  const parts = [
    `Shot on ${camera}`,
    lens,
    `${topic}, ${subject}`,
    lighting,
    `${imagery.style} style`,
    imagery.colorTemperature ? `${imagery.colorTemperature} tones` : null,
    imagery.avoidKeywords.length > 0
      ? imagery.avoidKeywords.join(", ")
      : null,
  ].filter(Boolean);

  return parts.join(", ");
}
