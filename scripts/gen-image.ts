/**
 * HAAZEL — FAL image generator. Saves to public/images/<name>.jpg
 *
 * Usage:
 *   npm run gen:image -- <filename> "<prompt>" [size] [--model recraft|nano-banana]
 *   sizes: landscape_16_9 (default) | portrait_4_5 | square_1_1 | portrait_16_9
 *
 * Requires FAL_KEY in the environment or .env.local.
 * (The haazel-assets skill can use the Higgsfield MCP instead — this script
 * is the FAL path, delegated to the asset-runner agent.)
 */
import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";

const MODELS: Record<string, string> = {
  recraft: "fal-ai/recraft-v3",
  "nano-banana": "fal-ai/nano-banana-pro",
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

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const modelFlag = process.argv.indexOf("--model");
const modelKey = modelFlag !== -1 ? process.argv[modelFlag + 1] : "recraft";
const [filename, prompt, size = "landscape_16_9"] = args;

if (!filename || !prompt) {
  console.error('Usage: npm run gen:image -- <filename> "<prompt>" [size] [--model recraft|nano-banana]');
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

const outDir = path.resolve(__dirname, "../public/images");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log(`Generating: ${filename}.jpg (${size}, ${model})`);
  console.log(`Prompt: ${prompt.slice(0, 100)}${prompt.length > 100 ? "…" : ""}`);

  const input: Record<string, unknown> = { prompt, image_size: size };
  if (modelKey === "recraft") input.style = "realistic_image";

  const result = (await fal.subscribe(model, { input }).catch((e: unknown) => {
    const err = e as { status?: number; body?: { detail?: unknown } };
    console.error("FAL status:", err?.status);
    console.error("FAL detail:", JSON.stringify(err?.body?.detail ?? err?.body));
    throw e;
  })) as { data?: { images?: { url?: string }[] } };

  const url = result.data?.images?.[0]?.url;
  if (!url) {
    console.error("No image returned.");
    process.exit(1);
  }

  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(outDir, `${filename}.jpg`);
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${(buf.byteLength / 1024).toFixed(0)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
