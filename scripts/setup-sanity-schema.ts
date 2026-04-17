/**
 * HAAZEL SCAFFOLD — Sanity Schema Deployer
 *
 * Reads all schema definitions from src/lib/sanity/schemas/ and outputs
 * them in a format ready for deployment via Sanity MCP deploy_schema tool
 * or manual paste into Sanity Studio.
 *
 * Usage:
 *   npx tsx scripts/setup-sanity-schema.ts
 *   npx tsx scripts/setup-sanity-schema.ts --json    (output as JSON for programmatic use)
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "src", "lib", "sanity", "schemas");

async function loadBrandConfig() {
  const mod = await import(path.join(ROOT, "brand.config.ts"));
  return mod.brand;
}

/**
 * Converts a Sanity defineType schema into a plain object declaration
 * suitable for the MCP deploy_schema tool.
 */
function schemaToDeclaration(schema: any): string {
  const lines: string[] = [];
  lines.push("{");
  lines.push(`  name: '${schema.name}',`);
  lines.push(`  type: '${schema.type}',`);
  if (schema.title) lines.push(`  title: '${schema.title}',`);

  if (schema.fields && schema.fields.length > 0) {
    lines.push("  fields: [");
    for (const field of schema.fields) {
      lines.push(fieldToDeclaration(field, 4));
    }
    lines.push("  ],");
  }

  if (schema.orderings) {
    lines.push(`  orderings: ${JSON.stringify(schema.orderings, null, 2).replace(/\n/g, "\n  ")},`);
  }

  lines.push("}");
  return lines.join("\n");
}

function fieldToDeclaration(field: any, indent: number): string {
  const pad = " ".repeat(indent);
  const parts: string[] = [];

  parts.push(`${pad}{`);
  parts.push(`${pad}  name: '${field.name}',`);
  parts.push(`${pad}  type: '${field.type}',`);
  if (field.title) parts.push(`${pad}  title: '${field.title}',`);
  if (field.description)
    parts.push(`${pad}  description: '${field.description}',`);
  if (field.rows) parts.push(`${pad}  rows: ${field.rows},`);

  // Handle validation rules as simple declarations
  if (field.validation) {
    // We represent common validation patterns
    const validationStr = inferValidation(field);
    if (validationStr) {
      parts.push(`${pad}  validation: (Rule) => ${validationStr},`);
    }
  }

  // Handle options
  if (field.options) {
    parts.push(
      `${pad}  options: ${JSON.stringify(field.options)},`
    );
  }

  // Handle 'of' for arrays
  if (field.of) {
    const ofStr = JSON.stringify(field.of, null, 2)
      .split("\n")
      .map((line: string, i: number) => (i === 0 ? line : `${pad}  ${line}`))
      .join("\n");
    parts.push(`${pad}  of: ${ofStr},`);
  }

  // Handle 'to' for references
  if (field.to) {
    parts.push(`${pad}  to: ${JSON.stringify(field.to)},`);
  }

  // Handle nested fields (for image/object types)
  if (field.fields && field.fields.length > 0) {
    parts.push(`${pad}  fields: [`);
    for (const subField of field.fields) {
      parts.push(fieldToDeclaration(subField, indent + 4));
    }
    parts.push(`${pad}  ],`);
  }

  parts.push(`${pad}},`);
  return parts.join("\n");
}

function inferValidation(field: any): string | null {
  // Attempt to read known validation patterns from the schema
  // Since validation functions can't be serialized, we use field metadata
  const rules: string[] = [];

  // Heuristic: required fields, max length, etc. based on field name/type
  if (field.type === "string" && field.name === "title") {
    rules.push("Rule.required()");
  }
  if (field.type === "slug") {
    rules.push("Rule.required()");
  }

  return rules.length > 0 ? rules.join(".") : null;
}

async function main() {
  const flags = process.argv.slice(2);
  const jsonMode = flags.includes("--json");

  const brand = await loadBrandConfig();

  // Read schema files
  const schemaFiles = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts");

  console.log("");

  if (!jsonMode) {
    console.log("===========================================");
    console.log("  HAAZEL SCAFFOLD — Sanity Schema Export");
    console.log("===========================================");
    console.log("");
    console.log(`Project ID: ${brand.sanity.projectId}`);
    console.log(`Dataset:    ${brand.sanity.dataset}`);
    console.log(`Schemas:    ${schemaFiles.join(", ")}`);
    console.log("");
  }

  // Load each schema module
  const schemas: any[] = [];
  for (const file of schemaFiles) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const mod = await import(filePath);
    const schema = mod.default;
    if (schema && schema.name) {
      schemas.push(schema);
    }
  }

  if (jsonMode) {
    // Output raw schema objects as JSON
    console.log(JSON.stringify(schemas, null, 2));
    return;
  }

  // ── Output MCP deploy_schema format ──

  console.log("SCHEMA DECLARATIONS FOR SANITY MCP deploy_schema");
  console.log("=================================================");
  console.log("");
  console.log("Use these with the Sanity MCP deploy_schema tool:");
  console.log(`  resource: { projectId: "${brand.sanity.projectId}", dataset: "${brand.sanity.dataset}" }`);
  console.log("");
  console.log("--- BEGIN SCHEMA DECLARATIONS ---");
  console.log("");

  for (const schema of schemas) {
    console.log(`// ${schema.title || schema.name}`);
    console.log(schemaToDeclaration(schema));
    console.log("");
  }

  console.log("--- END SCHEMA DECLARATIONS ---");
  console.log("");

  // ── Deployment instructions ──

  console.log("DEPLOYMENT OPTIONS");
  console.log("===========================================");
  console.log("");
  console.log("Option 1: Sanity MCP deploy_schema (recommended for headless)");
  console.log("  Copy the schema declarations above and use the Sanity MCP");
  console.log("  deploy_schema tool with your project ID and dataset.");
  console.log("");
  console.log("Option 2: Sanity Studio (if you have a local studio)");
  console.log("  The schemas in src/lib/sanity/schemas/ are already in the");
  console.log("  correct format for Sanity Studio. Deploy with:");
  console.log("    npx sanity deploy");
  console.log("");
  console.log("Option 3: Sanity CLI schema extraction");
  console.log("  npx sanity schema extract --enforce-required-fields");
  console.log("");

  // ── Raw schema file listing for reference ──

  console.log("SCHEMA FILES");
  console.log("===========================================");
  for (const file of schemaFiles) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`\n--- ${file} ---`);
    console.log(content);
  }
}

main().catch((err) => {
  console.error("Schema export failed:", err);
  process.exit(1);
});
