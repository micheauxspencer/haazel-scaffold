/**
 * HAAZEL — CanvasHero frame extractor (ffmpeg wrapper).
 *
 * Extracts a JPEG frame sequence from a video for the CanvasHero scroll-scrub
 * module and writes a manifest so frameCount never has to be hand-counted.
 *
 * Usage:
 *   npm run frames -- <video-path> <sequence-name> [--count 120] [--width 1600] [--quality 3]
 *
 * Output:
 *   public/frames/<sequence-name>/frame-0001.jpg … + manifest.json { frameCount, framePath }
 *
 * If ffmpeg is not installed, prints install guidance and exits 2 — the
 * haazel-assets skill then degrades to the VideoBackground mp4 path instead.
 */
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flag = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
};

const [videoPath, name] = positional;
const count = parseInt(flag("count", "120"), 10);
const width = parseInt(flag("width", "1600"), 10);
const quality = parseInt(flag("quality", "3"), 10); // ffmpeg -q:v (2 best … 31 worst)

if (!videoPath || !name) {
  console.error("Usage: npm run frames -- <video-path> <sequence-name> [--count 120] [--width 1600]");
  process.exit(1);
}

const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf-8", shell: false });
if (ffmpegCheck.error || ffmpegCheck.status !== 0) {
  console.error("ffmpeg not found on PATH.");
  console.error("Install: winget install Gyan.FFmpeg   (or choco install ffmpeg / brew install ffmpeg)");
  console.error("Without ffmpeg, use the VideoBackground module with the mp4 directly.");
  process.exit(2);
}

const absVideo = path.resolve(videoPath);
if (!fs.existsSync(absVideo)) {
  console.error(`Video not found: ${absVideo}`);
  process.exit(1);
}

// Probe duration to compute the fps filter for an exact-ish frame count.
const probe = spawnSync(
  "ffprobe",
  ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", absVideo],
  { encoding: "utf-8", shell: false },
);
const duration = parseFloat(probe.stdout?.trim() ?? "");
if (!duration || Number.isNaN(duration)) {
  console.error("Could not probe video duration (is ffprobe installed alongside ffmpeg?).");
  process.exit(2);
}

const fps = count / duration;
const outDir = path.join(ROOT, "public", "frames", name);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

console.log(`Extracting ~${count} frames (${fps.toFixed(2)} fps) at ${width}px wide…`);
const result = spawnSync(
  "ffmpeg",
  [
    "-i", absVideo,
    "-vf", `fps=${fps.toFixed(4)},scale=${width}:-2`,
    "-q:v", String(quality),
    path.join(outDir, "frame-%04d.jpg"),
  ],
  { encoding: "utf-8", shell: false },
);
if (result.status !== 0) {
  console.error(result.stderr?.slice(-2000));
  process.exit(1);
}

const frames = fs.readdirSync(outDir).filter((f) => f.endsWith(".jpg"));
const manifest = {
  frameCount: frames.length,
  framePath: `/frames/${name}/frame-`,
  width,
  source: path.basename(absVideo),
};
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const totalKb = frames.reduce((sum, f) => sum + fs.statSync(path.join(outDir, f)).size, 0) / 1024;
console.log(`Done: ${frames.length} frames in public/frames/${name}/ (${(totalKb / 1024).toFixed(1)} MB total)`);
console.log(`CanvasHero props: frameCount={${frames.length}} framePath="/frames/${name}/frame-"`);
