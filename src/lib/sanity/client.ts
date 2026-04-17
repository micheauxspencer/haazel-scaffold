import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const isSanityConfigured = projectId !== "placeholder" && projectId !== "";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

/**
 * Token-authenticated client for mutations (server-only).
 * Never import this in client components.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
