import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const RubricsSchema = z.object({
  version: z.string(),
  description: z.string(),
  scoreScale: z.object({
    min: z.number().int(),
    max: z.number().int(),
    label: z.string(),
  }),
  levelThresholds: z.record(z.number().int()),
  rubrics: z.array(
    z.object({
      watsonLevel: z.number().int().min(1).max(6),
      indicators: z.array(z.string().min(1)),
      keywords: z.array(z.string().min(1)),
      criteria: z.record(z.string().min(1)),
    })
  ),
});

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "rubrics.json");
const parsed = RubricsSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));

if (!parsed.success) {
  console.error("❌ packages/rubrics GAGAL validasi:");
  for (const issue of parsed.error.issues) {
    console.error(`   - ${issue.path.join(".") || "root"}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(
  `✅ rubrics.json valid (${parsed.data.rubrics.length} level rubrik, skala ${parsed.data.scoreScale.min}-${parsed.data.scoreScale.max})`
);
