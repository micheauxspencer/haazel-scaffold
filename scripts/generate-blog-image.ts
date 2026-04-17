/**
 * HAAZEL SCAFFOLD — Blog Image Generator
 *
 * Generates a photorealistic image with fal.ai Recraft v3,
 * uploads it to Sanity CDN, and links it to a blog post by slug.
 *
 * Usage:
 *   FAL_KEY=xxx SANITY_API_TOKEN=yyy npx tsx scripts/generate-blog-image.ts "my-slug" "photorealistic prompt"
 *
 * Environment:
 *   FAL_KEY           - fal.ai API key
 *   SANITY_API_TOKEN  - Sanity write token
 *   NEXT_PUBLIC_SANITY_PROJECT_ID - Sanity project ID (falls back to brand.config.ts)
 *   NEXT_PUBLIC_SANITY_DATASET    - Sanity dataset (falls back to brand.config.ts)
 */

import { fal } from "@fal-ai/client";
import { createClient } from "@sanity/client";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// ── Validate args ──

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: npx tsx scripts/generate-blog-image.ts <slug> <prompt>");
  console.error('Example: npx tsx scripts/generate-blog-image.ts "my-post-slug" "Shot on Canon 5D, 35mm f/1.4, ..."');
  process.exit(1);
}

const [slug, prompt] = args;

// ── Validate environment ──

const FAL_KEY = process.env.FAL_KEY;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!FAL_KEY) {
  console.error("ERROR: FAL_KEY environment variable is required.");
  process.exit(1);
}
if (!SANITY_API_TOKEN) {
  console.error("ERROR: SANITY_API_TOKEN environment variable is required.");
  process.exit(1);
}

interface FalImageResult {
  data: {
    images: { url: string }[];
  };
}

async function main() {
  // Load brand config for Sanity project details
  const brandMod = await import(path.join(ROOT, "brand.config.ts"));
  const brand = brandMod.brand;

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || brand.sanity.projectId;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET || brand.sanity.dataset;

  if (!projectId || projectId === "REPLACE_ME") {
    console.error(
      "ERROR: Sanity project ID not configured. Update brand.config.ts or set NEXT_PUBLIC_SANITY_PROJECT_ID."
    );
    process.exit(1);
  }

  // ── Step 1: Generate image with fal.ai ──

  console.log("");
  console.log(`Generating image for slug: "${slug}"`);
  console.log(`Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}`);
  console.log("");

  fal.config({ credentials: FAL_KEY });

  console.log("Calling fal.ai Recraft v3...");
  const result = (await fal.subscribe("fal-ai/recraft-v3", {
    input: {
      prompt,
      image_size: "landscape_16_9" as any,
      style: "realistic_image" as any,
    },
  })) as FalImageResult;

  const imageUrl = result.data.images[0]?.url;
  if (!imageUrl) {
    console.error("ERROR: fal.ai returned no images.");
    process.exit(1);
  }
  console.log(`Image generated: ${imageUrl}`);

  // ── Step 2: Upload to Sanity CDN ──

  const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: SANITY_API_TOKEN,
  });

  console.log("Downloading image...");
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    console.error(`ERROR: Failed to download image: ${imageResponse.status}`);
    process.exit(1);
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  console.log("Uploading to Sanity CDN...");
  const asset = await sanityClient.assets.upload("image", imageBuffer, {
    filename: `${slug}-featured.webp`,
    contentType: "image/webp",
  });

  console.log(`Uploaded asset: ${asset._id}`);

  // ── Step 3: Find post by slug and attach image ──

  console.log(`Looking for post with slug: "${slug}"...`);

  // Try both "post" and "blogPost" document types
  const post = await sanityClient.fetch(
    `*[_type in ["post", "blogPost"] && slug.current == $slug][0]{ _id, _type, title }`,
    { slug }
  );

  if (!post) {
    console.error(
      `WARNING: No post found with slug "${slug}". Image uploaded but not linked.`
    );
    console.log(`Asset ID: ${asset._id}`);
    console.log("You can manually link this image to a post in Sanity Studio.");
    process.exit(0);
  }

  console.log(`Found post: "${post.title}" (${post._id})`);

  // Determine the image field name based on document type
  const imageField = post._type === "post" ? "mainImage" : "image";

  // Extract alt text from the prompt (first meaningful phrase)
  const altText = prompt
    .split(",")
    .slice(2, 4)
    .join(", ")
    .trim()
    .substring(0, 120);

  await sanityClient
    .patch(post._id)
    .set({
      [imageField]: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: altText || `Featured image for ${post.title}`,
      },
    })
    .commit();

  console.log(`Image linked to post "${post.title}".`);

  // Also set imageAlt if the document type supports it (blogPost schema)
  if (post._type === "blogPost") {
    await sanityClient
      .patch(post._id)
      .set({ imageAlt: altText || `Featured image for ${post.title}` })
      .commit();
  }

  console.log("");
  console.log("Done. Image generated, uploaded, and linked.");
  console.log("");
}

main().catch((err) => {
  console.error("Image generation failed:", err);
  process.exit(1);
});
