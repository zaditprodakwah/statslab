import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DatasetSeed {
  slug: string;
  title: string;
  category: string;
  islamicValue: string;
  description?: string;
  chartConfig?: unknown;
  rawData: unknown[];
}

const datasetsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../packages/datasets"
);

function loadDataset(file: string): DatasetSeed {
  const raw = readFileSync(path.join(datasetsDir, file), "utf8");
  return JSON.parse(raw) as DatasetSeed;
}

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Seed Datasets (single source of truth: packages/datasets/*.json)
  const datasetFiles = [
    "zakat-infak.json",
    "perpus-madrasah.json",
    "tajwid-juz-30.json",
    "wakaf-produktif.json"
  ];

  const datasetIds: Record<string, string> = {};
  console.log("✅ Datasets seeded:");
  for (const file of datasetFiles) {
    const data = loadDataset(file);
    const record = await prisma.dataset.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        category: data.category,
        islamicValue: data.islamicValue,
        description: data.description,
        rawData: data.rawData,
        chartConfig: data.chartConfig
      },
      create: {
        slug: data.slug,
        title: data.title,
        category: data.category,
        islamicValue: data.islamicValue,
        description: data.description,
        rawData: data.rawData,
        chartConfig: data.chartConfig
      }
    });
    datasetIds[data.slug] = record.id;
    console.log(`- ${record.title} (${record.slug})`);
  }

  // 2. Seed 8 Tasks (Embedded Tasks Watson-Callingham Level 4-6)
  const tasksData = [
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 1,
      watsonLevel: 4,
      indicator: "Reading Data",
      prompt: "Berdasarkan grafik distribusi, provinsi manakah yang penghimpunan zakatnya paling tinggi?"
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 2,
      watsonLevel: 4,
      indicator: "Reading Between Data",
      prompt: "Berapa selisih penghimpunan zakat antara provinsi tertinggi (DKI Jakarta) dan terendah (Banten)?"
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 3,
      watsonLevel: 5,
      indicator: "Reading Beyond Data",
      prompt: "Jika potensi zakat nasional (total 5 provinsi) meningkat 15% tahun depan, buatlah estimasi potensi zakat nasional."
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 4,
      watsonLevel: 5,
      indicator: "Amanah Scale Audit",
      prompt: "Aktifkan sakelar Pilar Amanah. Jelaskan perbedaan impresi visual ketika sumbu Y dimulai dari nol vs dipotong."
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 5,
      watsonLevel: 5,
      indicator: "Tabayyun Outlier Detection",
      prompt: "Gunakan modul Tabayyun untuk mendeteksi penurunan ekstrem jumlah pengunjung pada bulan April. Apakah penurunan ini wajar (konteks kegiatan madrasah) atau indikasi pencatatan ganda/kesalahan input?"
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 6,
      watsonLevel: 5,
      indicator: "Tawazun Distribution Analysis",
      prompt: "Bandingkan nilai Mean dan Median total pengunjung. Apakah distribusi data seimbang (Tawazun) atau miring?"
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 7,
      watsonLevel: 6,
      indicator: "Critical Mathematical Reasoning",
      prompt: "Evaluasi kesimpulan: 'Perpustakaan paling ramai di bulan Mei'. Berikan kritik statistik berbasis konteks kegiatan madrasah."
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 8,
      watsonLevel: 6,
      indicator: "Data-Driven Decision Making",
      prompt: "Rumuskan rekomendasi pengadaan buku berbasis data kuartil (misalnya kategori buku_fiksi yang paling tinggi) yang telah dianalisis secara tabayyun."
    }
  ];

  for (const t of tasksData) {
    const existingTask = await prisma.task.findFirst({
      where: { datasetId: t.datasetId, taskNumber: t.taskNumber }
    });

    if (existingTask) {
      await prisma.task.update({
        where: { id: existingTask.id },
        data: {
          watsonLevel: t.watsonLevel,
          indicator: t.indicator,
          prompt: t.prompt
        }
      });
    } else {
      await prisma.task.create({ data: t });
    }
  }

  console.log(`✅ ${tasksData.length} Embedded Tasks Seeded successfully.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
