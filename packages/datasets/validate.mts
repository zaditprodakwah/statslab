import { readdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DatasetSchema } from "../../apps/web/src/lib/datasetSchema";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.error("Tidak ada file dataset JSON ditemukan di packages/datasets.");
  process.exit(1);
}

let failed = 0;

for (const file of files) {
  let raw: string;
  try {
    raw = readFileSync(path.join(dir, file), "utf8");
  } catch (err) {
    failed++;
    console.error(`❌ ${file}: tidak dapat dibaca — ${err}`);
    continue;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    failed++;
    console.error(`❌ ${file}: bukan JSON valid — ${err}`);
    continue;
  }

  const result = DatasetSchema.safeParse(parsed);
  if (!result.success) {
    failed++;
    console.error(`❌ ${file} GAGAL validasi:`);
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".") || "root"}: ${issue.message}`);
    }
  } else {
    const tasks = result.data.tasks?.length ?? 0;
    console.log(
      `✅ ${file} valid (${result.data.rawData.length} baris, ${tasks} tugas, chart=${result.data.chartConfig?.type ?? "bar"})`
    );
  }
}

if (failed > 0) {
  console.error(`\n${failed} dataset GAGAL validasi. Pipeline ditolak.`);
  process.exit(1);
}

console.log("\nSemua dataset valid sesuai StatsLab Dataset Schema.");
