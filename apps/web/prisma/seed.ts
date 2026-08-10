import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { readFileSync, existsSync } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { hashPassword } from "../src/lib/password";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartConfig?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawData: any;
}

interface RubricSeed {
  watsonLevel: number;
  indicators: string[];
  keywords: string[];
  criteria: Record<string, string>;
}

type SeedTaskInputType = "text" | "number" | "choice" | "chart" | "voice";

interface SeedTask {
  datasetId: string;
  taskNumber: number;
  watsonLevel: number;
  indicator: string;
  prompt: string;
  clue?: string;
  modelAnswer?: string;
  inputType: SeedTaskInputType;
  options?: {
    choices: string[];
    correctIndex: number;
    explanation?: string;
    chartClickAnswer?: string;
    prerequisite?:
      | "amanahZeroScale"
      | "tawazunConfirmed"
      | "tabayyunThreshold"
      | "chartType"
      | null;
  };
}

const datasetsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../packages/datasets"
);

const rubricsFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../packages/rubrics/rubrics.json"
);

function loadDataset(file: string): DatasetSeed {
  const raw = readFileSync(path.join(datasetsDir, file), "utf8");
  return JSON.parse(raw) as DatasetSeed;
}

function loadRubrics(): { rubrics: RubricSeed[] } {
  const raw = readFileSync(rubricsFile, "utf8");
  return JSON.parse(raw) as { rubrics: RubricSeed[] };
}

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 0. Seed Admin User (bootstrap: ADMIN_EMAIL + ADMIN_PASSWORD dari env)
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        name: "Admin StatsLab",
      },
      create: {
        email: adminEmail,
        passwordHash,
        name: "Admin StatsLab",
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    console.log(`✅ Admin user ensured: ${admin.email} (${admin.role})`);
  } else {
    console.log(
      "⚠️ ADMIN_EMAIL / ADMIN_PASSWORD tidak diset — lewati seed akun admin."
    );
  }

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

  // 2. Seed 16 Tasks (Pilihan Ganda Berskenario — Click & Click, Watson-Callingham Level 1-6)
  // Silsilah: setiap soal mengikat modul spesifik (chart click, amanah toggle, tabayyun threshold, tawazun).
  // options: { choices: string[], correctIndex, explanation, chartClickAnswer?, prerequisite? }
  const tasksData: SeedTask[] = [
    // ===== ZAKAT-INFAK (4 soal) =====
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 1,
      watsonLevel: 1,
      indicator: "Idiosyncratic — Klik Titik Data",
      prompt:
        "Klik batang grafik provinsi dengan penghimpunan zakat TERTINGGI pada grafik di atas. Lalu pilih jawaban yang sesuai.",
      inputType: "chart",
      options: {
        choices: ["DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah"],
        correctIndex: 0,
        explanation: "DKI Jakarta memiliki batang tertinggi — pusat ekonomi nasional.",
        chartClickAnswer: "DKI Jakarta",
      },
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 2,
      watsonLevel: 2,
      indicator: "Informal — Identifikasi Pola Tren",
      prompt:
        "Ubah tipe grafik menjadi Line (gunakan Chart Type Switcher) untuk melihat pola tren. Bagaimana pola penghimpunan zakat dari 5 provinsi?",
      inputType: "choice",
      options: {
        choices: [
          "Meningkat seiring provinsi",
          "Tidak beraturan — sangat bervariasi",
          "Semua sama rata",
          "Menurun drastis",
        ],
        correctIndex: 1,
        explanation: "Data penghimpunan zakat 5 provinsi sangat bervariasi, tidak mengikuti pola naik/turun beraturan.",
        prerequisite: "chartType",
      },
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 3,
      watsonLevel: 3,
      indicator: "Tabayyun — Saring Data Ekstrem",
      prompt:
        "Geser Tabayyun Threshold Slider untuk mendeteksi outlier. Provinsi mana yang TERLIHAT sebagai outlier (sangat tinggi) dan perlu verifikasi Tabayyun?",
      inputType: "choice",
      options: {
        choices: ["Banten", "DKI Jakarta", "Jawa Tengah", "Jawa Barat"],
        correctIndex: 1,
        explanation: "DKI Jakarta nilainya jauh di atas rata-rata — wajar karena pusat ekonomi, tapi tetap perlu verifikasi sumber data (Tabayyun).",
        prerequisite: "tabayyunThreshold",
      },
    },
    {
      datasetId: datasetIds["zakat-infak"],
      taskNumber: 4,
      watsonLevel: 4,
      indicator: "Amanah — Skala Sumbu Y",
      prompt:
        "Aktifkan sakelar Amanah (Zero-Based Scale). Bandingkan dengan skala terpotong. Pernyataan mana yang BENAR tentang perbedaan impresi visual?",
      inputType: "choice",
      options: {
        choices: [
          "Skala terpotong membuat perbedaan antar provinsi terlihat lebih kecil",
          "Skala terpotong membuat perbedaan terlihat lebih dramatis/exaggerated",
          "Tidak ada perbedaan visual",
          "Zero-based menyembunyikan data rendah",
        ],
        correctIndex: 1,
        explanation: "Sumbu Y yang dipotong (non-zero) mengexaggerasi perbedaan — prinsip Amanah: gunakan zero-based untuk kejujuran visual.",
        prerequisite: "amanahZeroScale",
      },
    },

    // ===== PERPUS-MADRASAH (4 soal) =====
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 5,
      watsonLevel: 1,
      indicator: "Idiosyncratic — Klik Titik Data",
      prompt:
        "Klik titik/batang pada grafik untuk bulan dengan jumlah pengunjung TERENDAH di perpustakaan madrasah.",
      inputType: "chart",
      options: {
        choices: ["Januari", "April", "Mei", "Juni"],
        correctIndex: 1,
        explanation: "April memiliki jumlah pengunjung terendah — perlu investigasi (libur? kegiatan khusus?).",
        chartClickAnswer: "April",
      },
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 6,
      watsonLevel: 3,
      indicator: "Tabayyun — Verifikasi Outlier",
      prompt:
        "Gunakan Tabayyun Threshold Slider. Penurunan pengunjung di April wajar atau indikasi kesalahan input data?",
      inputType: "choice",
      options: {
        choices: [
          "Wajar — kemungkinan libur/kgiatan khusus madrasah",
          "Pasti kesalahan input data",
          "Tidak perlu verifikasi (Tabayyun tidak relevan)",
          "Data harus dihapus langsung",
        ],
        correctIndex: 0,
        explanation: "Tabayyun: verifikasi konteks dulu. Penurunan musiman (libur Ramadhan/ujian) wajar, bukan otomatis kesalahan input.",
        prerequisite: "tabayyunThreshold",
      },
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 7,
      watsonLevel: 5,
      indicator: "Tawazun — Mean vs Median",
      prompt:
        "Aktifkan Tawazun Toggle untuk menampilkan garis Mean & Median. Apa yang dapat Anda amati tentang distribusi pengunjung?",
      inputType: "choice",
      options: {
        choices: [
          "Mean > Median → distribusi miring ke kanan (skewed)",
          "Mean = Median → distribusi seimbang (simetris)",
          "Mean < Median → miring ke kiri",
          "Mean & Median tidak relevan untuk data ini",
        ],
        correctIndex: 0,
        explanation: "Jika Mean lebih besar dari Median, distribusi miring ke kanan (ada nilai tinggi yang menarik rata-rata). Tawazun = seimbangkan interpretasi.",
        prerequisite: "tawazunConfirmed",
      },
    },
    {
      datasetId: datasetIds["perpus-madrasah"],
      taskNumber: 8,
      watsonLevel: 6,
      indicator: "Critical — Keputusan Berbasis Data",
      prompt:
        "Berdasarkan analisis data perpus madrasah (tren + Tabayyun + Tawazun), rekomendasi pengadaan buku terbaik adalah:",
      inputType: "choice",
      options: {
        choices: [
          "Tambah stok buku fiksi karena peminjam tertinggi",
          "Tunda pengadaan karena data tidak reliable",
          "Pengadaan berbasis kategori paling tinggi + verifikasi konteks musiman",
          "Belilah semua kategori secara merata",
        ],
        correctIndex: 2,
        explanation: "Keputusan kritis: gunakan kategori tertinggi setelah verifikasi Tabayyun (musiman) — gabungkan data + konteks.",
      },
    },

    // ===== TAJWID-JUZ-30 (4 soal) =====
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 9,
      watsonLevel: 1,
      indicator: "Idiosyncratic — Klik Irisan Pie",
      prompt:
        "Klik irisan diagram lingkaran (Pie) untuk hukum bacaan yang PALING BANYAK ditemukan pada 5 surat Juz 30.",
      inputType: "chart",
      options: {
        choices: ["Idgham", "Ikhfa", "Izhar", "Iqlab"],
        correctIndex: 0,
        explanation: "Idgham = 51 dari 115 bacaan — paling banyak.",
        chartClickAnswer: "Idgham",
      },
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 10,
      watsonLevel: 4,
      indicator: "Reading Between Data — Proporsi",
      prompt:
        "Total 115 bacaan, Ikhfa 45 bacaan. Berapa proporsi (persen) hukum Ikhfa terhadap total?",
      inputType: "choice",
      options: {
        choices: ["25,1%", "39,1%", "44,3%", "51,0%"],
        correctIndex: 1,
        explanation: "45 / 115 × 100 = 39,1% — Ikhfa hampir 2/5 dari total bacaan.",
      },
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 11,
      watsonLevel: 5,
      indicator: "Reading Beyond Data — Estimasi",
      prompt:
        "Data hanya 5 dari 37 surat Juz 30 (Izhar 15 bacaan). Estimasi total Izhar pada seluruh Juz 30 dan asumsinya:",
      inputType: "choice",
      options: {
        choices: [
          "±111 bacaan (asumsi seragam, sampel kecil)",
          "Pasti 111 bacaan (eksak)",
          "50 bacaan sampai 200 bacaan tidak dapat diestimasi",
          "15 bacaan (tidak berubah)",
        ],
        correctIndex: 0,
        explanation: "Estimasi: 15 × (37/5) ≈ 111. Asumsi seragam, keterbatasan: sampel kecil & panjang surat bervariasi.",
      },
    },
    {
      datasetId: datasetIds["tajwid-juz-30"],
      taskNumber: 12,
      watsonLevel: 6,
      indicator: "Critical — Validitas Kesimpulan",
      prompt:
        "Kesimpulan: 'An-Naba adalah surat dengan Ikhfa terbanyak di Juz 30'. Apakah valid berdasarkan data?",
      inputType: "choice",
      options: {
        choices: [
          "Tidak valid — sampel 5 surat, An-Nazi'at justru Ikhfa terbanyak (14 vs 12)",
          "Valid karena An-Naba surat awal Juz 30",
          "Tidak dapat dievaluasi",
          "Valid jika An-Naba surat terpanjang",
        ],
        correctIndex: 0,
        explanation: "Tidak valid: (1) An-Nazi'at 14 > An-Naba 12 pada sampel, (2) sampel 5 surat tak cukup generalisasi 37 surat.",
      },
    },

    // ===== WAKAF-PRODUKTIF (4 soal) =====
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 13,
      watsonLevel: 1,
      indicator: "Idiosyncratic — Klik Titik Tertinggi",
      prompt:
        "Klik titik pada grafik untuk tahun dengan persentase tanah wakaf produktif TERTINGGI.",
      inputType: "chart",
      options: {
        choices: ["2021", "2023", "2024", "2025"],
        correctIndex: 3,
        explanation: "2025 = 9,5% — tertinggi dalam tren 2021–2025.",
        chartClickAnswer: "2025",
      },
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 14,
      watsonLevel: 5,
      indicator: "Reading Beyond Data — Estimasi Tren",
      prompt:
        "Berdasarkan tren 2021–2025 (wakaf uang naik ±0,64 triliun/tahun), estimasi wakaf uang 2026:",
      inputType: "choice",
      options: {
        choices: ["±3,4 triliun", "±4,0 triliun", "±5,5 triliun", "±2,8 triliun"],
        correctIndex: 1,
        explanation: "3,4 + 0,64 ≈ 4,0 triliun — asumsi tren linear berlanjut.",
      },
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 15,
      watsonLevel: 5,
      indicator: "Tabayyun — Audit Korelasi",
      prompt:
        "Apakah pertumbuhan wakaf uang SELALU sejalan dengan peningkatan % tanah wakaf produktif?",
      inputType: "choice",
      options: {
        choices: [
          "Ya, keduanya identik (naik sama persis)",
          "Korelasi positif tapi tidak identik — tanah naik perlahan (6,8%→9,5%), wakaf uang 4× lipat",
          "Tidak ada hubungan sama sekali",
          "Tanah produktif menurun saat wakaf uang naik",
        ],
        correctIndex: 1,
        explanation: "Korelasi positif tapi tidak sebab-akibat. n=5 titik terlalu kecil; Tabayyun: verifikasi sebelum klaim kausalitas.",
        prerequisite: "tabayyunThreshold",
      },
    },
    {
      datasetId: datasetIds["wakaf-produktif"],
      taskNumber: 16,
      watsonLevel: 6,
      indicator: "Data-Driven Decision Making",
      prompt:
        "Berdasarkan data (wakaf uang tumbuh 4× lipat, tanah produktif <10%), keputusan strategis terbaik:",
      inputType: "choice",
      options: {
        choices: [
          "Alokasikan pertumbuhan wakaf uang untuk pengembangan/sertifikasi tanah wakaf produktif",
          "Hentikan kampanye wakaf uang, fokus tanah saja",
          "Tidak perlu intervensi",
          "Beli tanah baru tanpa sertifikasi",
        ],
        correctIndex: 0,
        explanation: "Strategi: gunakan momentum wakaf uang untuk sertifikasi tanah agar menjadi aset produktif (9,5% → target lebih tinggi).",
      },
    },
  ];

  for (const t of tasksData) {
    const existingTask = await prisma.task.findFirst({
      where: { datasetId: t.datasetId, taskNumber: t.taskNumber },
    });

    const modelAnswer =
      t.modelAnswer ??
      (t.options ? t.options.choices[t.options.correctIndex] : null);

    if (existingTask) {
      await prisma.task.update({
        where: { id: existingTask.id },
        data: {
          watsonLevel: t.watsonLevel,
          indicator: t.indicator,
          prompt: t.prompt,
          modelAnswer,
          clue: t.clue ?? null,
          inputType: t.inputType ?? "text",
          options: t.options ?? null,
        },
      });
    } else {
      await prisma.task.create({
        data: {
          datasetId: t.datasetId,
          taskNumber: t.taskNumber,
          watsonLevel: t.watsonLevel,
          indicator: t.indicator,
          prompt: t.prompt,
          modelAnswer,
          clue: t.clue ?? null,
          inputType: t.inputType ?? "text",
          options: t.options,
        },
      });
    }
  }

  console.log(`✅ ${tasksData.length} Embedded Tasks Seeded successfully.`);

  // 3. Seed Rubrics (single source of truth: packages/rubrics/rubrics.json)
  const { rubrics } = loadRubrics();
  console.log("✅ Rubrics seeded:");
  for (const r of rubrics) {
    await prisma.rubric.upsert({
      where: { watsonLevel: r.watsonLevel },
      update: {
        indicators: r.indicators,
        keywords: r.keywords,
        criteria: r.criteria,
        active: true,
      },
      create: {
        watsonLevel: r.watsonLevel,
        indicators: r.indicators,
        keywords: r.keywords,
        criteria: r.criteria,
      },
    });
    console.log(`- Level ${r.watsonLevel} (${r.indicators.length} indikator, ${r.keywords.length} keyword)`);
  }

  // 4. Seed Validators (single source of truth: packages/datasets/validators-seed.json)
  const validatorsFile = path.resolve(
    import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/datasets/validators-seed.json"
  );
  if (existsSync(validatorsFile)) {
    const { validators } = JSON.parse(readFileSync(validatorsFile, "utf8")) as {
      validators: { name: string; domain: string }[];
    };
    console.log("✅ Validators seeded:");
    for (const v of validators) {
      const existing = await prisma.validator.findFirst({ where: { name: v.name } });
      if (existing) {
        await prisma.validator.update({ where: { id: existing.id }, data: { domain: v.domain } });
      } else {
        await prisma.validator.create({ data: { name: v.name, domain: v.domain } });
        console.log(`- ${v.name} (${v.domain})`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
