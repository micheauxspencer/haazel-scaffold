/**
 * HAAZEL — FAL image-to-video generator. Saves to public/videos/<name>.mp4
 *
 * Usage:
 *   npm run gen:video -- <name> <seed-image-path> "<prompt>" [--model standard|pro] [--ratio 16:9|9:16|1:1]
 *
 * standard ≈ $0.25/5s, pro ≈ $0.50/5s (see plugin references/asset-costs.md).
 * Seed images upload through FAL's own storage — no third-party temp hosts.
 * Requires FAL_KEY in the environment or .env.local.
 */
import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";

const MODELS: Record<string, string> = {
  standard: "fal-ai/kling-video/v1/standard/image-to-video",
  pro: "fal-ai/kling-video/v1.6/pro/image-to-video",
};

function readEnvLocal(key: string): string | undefined {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return undefined;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith(`${key}=`)) return trimmed.slice(key.length + 1);
  }
  return undefined;
}

const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flag = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
};
const [filename, seedPath, prompt] = positional;
const modelKey = flag("model", "standard");
const ratio = flag("ratio", "16:9");

if (!filename || !seedPath || !prompt) {
  console.error('Usage: npm run gen:video -- <name> <seed-image> "<prompt>" [--model standard|pro] [--ratio 16:9]');
  process.exit(1);
}
const model = MODELS[modelKey];
if (!model) {
  console.error(`Unknown model "${modelKey}". Options: ${Object.keys(MODELS).join(", ")}`);
  process.exit(1);
}

const FAL_KEY = process.env.FAL_KEY ?? readEnvLocal("FAL_KEY");
if (!FAL_KEY) {
  console.error("FAL_KEY required (env or .env.local).");
  process.exit(1);
}
fal.config({ credentials: FAL_KEY });

async function main() {
  const absSeed = path.resolve(seedPath);
  if (!fs.existsSync(absSeed)) {
    console.error(`Seed image not found: ${absSeed}`);
    process.exit(1);
  }

  console.log(`Uploading seed image: ${path.basename(absSeed)}`);
  const blob = new Blob([fs.readFileSync(absSeed)], { type: "image/jpeg" });
  const uploadedUrl = await fal.storage.upload(blob);
  console.log(`Uploaded: ${uploadedUrl}`);

  console.log(`Generating video (${modelKey}, ${ratio}) — may take 60–180 seconds`);
  console.log(`Prompt: ${prompt.slice(0, 100)}${prompt.length > 100 ? "…" : ""}`);

  const result = (await fal
    .subscribe(model, {
      input: {
        prompt,
        image_url: uploadedUrl,
        duration: "5",
        aspect_ratio: ratio,
      },
      logs: false,
    })
    .catch((e: unknown) => {
      const err = e as { status?: number; body?: unknown };
      console.error("FAL status:", err?.status);
      console.error("FAL body:", JSON.stringify(err?.body));
      throw e;
    })) as { data?: { video?: { url?: string } } };

  const url = result.data?.video?.url;
  if (!url) {
    console.error("No video URL returned.");
    process.exit(1);
  }

  const outDir = path.resolve(__dirname, "../public/videos");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${filename}.mp4`);

  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${(buf.byteLength / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
