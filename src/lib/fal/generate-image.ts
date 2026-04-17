import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

interface GenerateImageOptions {
  width?: number;
  height?: number;
  model?: string;
}

interface FalImageResult {
  data: {
    images: { url: string }[];
  };
}

export async function generateImage(
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string> {
  const {
    width = 1024,
    height = 1024,
    model = "fal-ai/recraft-v3",
  } = options;

  const result = (await fal.subscribe(model, {
    input: {
      prompt,
      image_size: {
        width,
        height,
      },
    },
  })) as FalImageResult;

  return result.data.images[0].url;
}
