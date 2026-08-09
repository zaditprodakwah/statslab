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
    "wakaf-produktif.json",
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
        chartConfig: data.chartConfig,
      },
      create: {
        slug: data.slug,
        title: data.title,
        category: data.category,
        islamicValue: data.islamicValue,
        description: data.description,
        rawData: data.rawData,
        chartConfig: data.chartConfig,
      },
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
      prompt:
        "Berdasarkan grafik distribusi, provinsi manakah yang penghimpunan zakatnya paling tinggi?",
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 2,
      watsonLevel: 4,
      indicator: "Reading Between Data",
      prompt:
        "Berapa selisih penghimpunan zakat antara provinsi tertinggi (DKI Jakarta) dan terendah (Banten)?",
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 3,
      watsonLevel: 5,
      indicator: "Reading Beyond Data",
      prompt:
        "Jika potensi zakat nasional (total 5 provinsi) meningkat 15% tahun depan, buatlah estimasi potensi zakat nasional.",
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 4,
      watsonLevel: 5,
      indicator: "Amanah Scale Audit",
      prompt:
        "Aktifkan sakelar Pilar Amanah. Jelaskan perbedaan impresi visual ketika sumbu Y dimulai dari nol vs dipotong.",
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 5,
      watsonLevel: 5,
      indicator: "Tabayyun Outlier Detection",
      prompt:
        "Gunakan modul Tabayyun untuk mendeteksi penurunan ekstrem jumlah pengunjung pada bulan April. Apakah penurunan ini wajar (konteks kegiatan madrasah) atau indikasi pencatatan ganda/kesalahan input?",
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 6,
      watsonLevel: 5,
      indicator: "Tawazun Distribution Analysis",
      prompt:
        "Bandingkan nilai Mean dan Median total pengunjung. Apakah distribusi data seimbang (Tawazun) atau miring?",
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 7,
      watsonLevel: 6,
      indicator: "Critical Mathematical Reasoning",
      prompt:
        "Evaluasi kesimpulan: 'Perpustakaan paling ramai di bulan Mei'. Berikan kritik statistik berbasis konteks kegiatan madrasah.",
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 8,
      watsonLevel: 6,
      indicator: "Data-Driven Decision Making",
      prompt:
        "Rumuskan rekomendasi pengadaan buku berbasis data kuartil (misalnya kategori buku_fiksi yang paling tinggi) yang telah dianalisis secara tabayyun.",
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 9,
      watsonLevel: 4,
      indicator: "Reading Data",
      prompt:
        "Berdasarkan diagram lingkaran distribusi hukum bacaan pada 5 surat Juz 30, sebutkan hukum bacaan yang paling banyak ditemukan beserta jumlahnya.",
      modelAnswer: "Idgham, yaitu 51 dari total 115 bacaan.",
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 10,
      watsonLevel: 4,
      indicator: "Reading Between Data",
      prompt:
        "Hitunglah total seluruh hukum bacaan pada 5 surat tersebut, lalu tentukan berapa persen proporsi hukum bacaan Ikhfa terhadap total tersebut.",
      modelAnswer: "Total 115 bacaan; Ikhfa 45 dari 115 sehingga proporsinya sekitar 39,1%.",
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 11,
      watsonLevel: 5,
      indicator: "Reading Beyond Data",
      prompt:
        "Data hanya memuat 5 dari 37 surat Juz 30. Buatlah estimasi total hukum bacaan Izhar pada seluruh Juz 30, lalu jelaskan asumsi dan keterbatasan estimasimu.",
      modelAnswer:
        "Estimasi kasar: 15 bacaan pada 5 surat, maka ±15 × (37/5) ≈ 111 bacaan. Asumsinya pola kemunculan seragam; keterbatasannya ukuran sampel kecil dan panjang surat sangat bervariasi (8–46 ayat).",
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 12,
      watsonLevel: 6,
      indicator: "Critical Mathematical Reasoning",
      prompt:
        "Evaluasi kesimpulan: 'Surat An-Naba' adalah surat dengan hukum bacaan Ikhfa terbanyak di Juz 30'. Apakah kesimpulan ini valid berdasarkan data yang tersedia? Jelaskan.",
      modelAnswer:
        "Tidak valid. Dalam sampel ini, An-Nazi'at justru memiliki Ikhfa terbanyak (14) dibandingkan An-Naba' (12), dan sampel 5 surat tidak cukup untuk digeneralisasi ke seluruh Juz 30.",
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 13,
      watsonLevel: 4,
      indicator: "Reading Data",
      prompt:
        "Pada tahun berapa persentase tanah wakaf produktif mencapai nilai tertinggi? Sebutkan nilai persentasenya.",
      modelAnswer: "Tahun 2025, dengan nilai 9,5%.",
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 14,
      watsonLevel: 5,
      indicator: "Reading Beyond Data",
      prompt:
        "Berdasarkan tren 2021–2025, perkirakan nilai wakaf uang (dalam triliun rupiah) pada tahun 2026. Jelaskan metode estimasimu.",
      modelAnswer:
        "Rata-rata kenaikan per tahun ±0,64 triliun, sehingga estimasi 2026 sekitar 3,4 + 0,64 ≈ 4,0 triliun rupiah.",
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 15,
      watsonLevel: 5,
      indicator: "Tabayyun Correlation Audit",
      prompt:
        "Apakah pertumbuhan wakaf uang selalu sejalan dengan peningkatan persentase tanah wakaf produktif? Bandingkan pola kedua seri data sebelum menarik kesimpulan.",
      modelAnswer:
        "Keduanya naik bersama (korelasi positif), tetapi pertumbuhannya tidak identik: tanah produktif naik perlahan (6,8% → 9,5%) sementara wakaf uang tumbuh sekitar 4 kali lipat (0,85 → 3,4 triliun). Dengan n = 5 titik data, hubungan belum cukup kuat untuk disimpulkan sebagai sebab-akibat.",
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 16,
      watsonLevel: 6,
      indicator: "Data-Driven Decision Making",
      prompt:
        "Rumuskan satu keputusan strategis berbasis data untuk meningkatkan wakaf produktif di Indonesia.",
      modelAnswer:
        "Contoh: proporsi tanah produktif masih di bawah 10% (9,5% pada 2025) padahal wakaf uang tumbuh pesat — maka prioritaskan alokasi pertumbuhan wakaf uang untuk pengembangan dan sertifikasi tanah wakaf agar menjadi aset produktif.",
    },
  ];

  for (const t of tasksData) {
    const existingTask = await prisma.task.findFirst({
      where: { datasetId: t.datasetId, taskNumber: t.taskNumber },
    });

    if (existingTask) {
      await prisma.task.update({
        where: { id: existingTask.id },
        data: {
          watsonLevel: t.watsonLevel,
          indicator: t.indicator,
          prompt: t.prompt,
          modelAnswer: t.modelAnswer ?? null,
          clue: t.clue ?? null,
          inputType: t.inputType ?? "text",
        },
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
