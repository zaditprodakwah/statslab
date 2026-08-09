/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import dotenv from "dotenv";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Seed Datasets
  const zakatDataset = await prisma.dataset.upsert({
    where: { slug: "zakat-infak" },
    update: {},
    create: {
      slug: "zakat-infak",
      title: "Distribusi Zakat & Infak Lembaga Ziswaf",
      category: "Statistika Deskriptif & Distribusi",
      islamicValue: "Amanah",
      description: "Data penyaluran zakat dan infak pada 5 wilayah madrasah binaan untuk menguji transparansi dan ketepatan alokasi.",
      rawData: [
        { wilayah: "Madrasah A", zakat: 45000000, infak: 12000000 },
        { wilayah: "Madrasah B", zakat: 38000000, infak: 9500000 },
        { wilayah: "Madrasah C", zakat: 62000000, infak: 18000000 },
        { wilayah: "Madrasah D", zakat: 29000000, infak: 7000000 },
        { wilayah: "Madrasah E", zakat: 51000000, infak: 14500000 }
      ],
      chartConfig: {
        type: "bar",
        xAxis: "wilayah",
        dataKeys: ["zakat", "infak"]
      }
    }
  });

  const perpusDataset = await prisma.dataset.upsert({
    where: { slug: "perpus-madrasah" },
    update: {},
    create: {
      slug: "perpus-madrasah",
      title: "Sirkulasi Peminjaman Buku Perpustakaan",
      category: "Literasi Data & Frekuensi",
      islamicValue: "Tabayyun",
      description: "Statistik peminjaman buku ensiklopedia Islam dan sains di perpustakaan madrasah selama 1 semester.",
      rawData: [
        { bulan: "Januari", peminjaman: 120 },
        { bulan: "Februari", peminjaman: 145 },
        { bulan: "Maret", peminjaman: 310 }, // Outlier untuk pengujian Tabayyun
        { bulan: "April", peminjaman: 135 },
        { bulan: "Mei", peminjaman: 150 }
      ],
      chartConfig: {
        type: "line",
        xAxis: "bulan",
        dataKeys: ["peminjaman"]
      }
    }
  });

  console.log("✅ Datasets Seeded:", zakatDataset.title, "|", perpusDataset.title);

  // 2. Seed 8 Tasks (Embedded Tasks Watson-Callingham Level 4-6)
  const tasksData = [
    {
      datasetId: zakatDataset.id,
      taskNumber: 1,
      watsonLevel: 4,
      indicator: "Reading Data",
      prompt: "Berdasarkan grafik distribusi, wilayah manakah yang menerima alokasi zakat paling tinggi?"
    },
    {
      datasetId: zakatDataset.id,
      taskNumber: 2,
      watsonLevel: 4,
      indicator: "Reading Between Data",
      prompt: "Berapa selisih antara penyaluran zakat tertinggi dan terendah pada data tersebut?"
    },
    {
      datasetId: zakatDataset.id,
      taskNumber: 3,
      watsonLevel: 5,
      indicator: "Reading Beyond Data",
      prompt: "Jika rata-rata infak naik 15% bulan depan, buatlah estimasi total infak yang terkumpul."
    },
    {
      datasetId: zakatDataset.id,
      taskNumber: 4,
      watsonLevel: 5,
      indicator: "Amanah Scale Audit",
      prompt: "Aktifkan sakelar Pilar Amanah. Jelaskan perbedaan impresi visual ketika sumbu Y dimulai dari nol vs dipotong."
    },
    {
      datasetId: perpusDataset.id,
      taskNumber: 5,
      watsonLevel: 5,
      indicator: "Tabayyun Outlier Detection",
      prompt: "Gunakan modul Tabayyun untuk mendeteksi lonjakan data pada bulan Maret. Apakah data ini tepercaya atau merupakan pencatatan ganda?"
    },
    {
      datasetId: perpusDataset.id,
      taskNumber: 6,
      watsonLevel: 6,
      indicator: "Tawazun Distribution Analysis",
      prompt: "Bandingkan nilai Mean dan Median peminjaman buku. Apakah distribusi data seimbang (Tawazun) atau miring?"
    },
    {
      datasetId: perpusDataset.id,
      taskNumber: 7,
      watsonLevel: 6,
      indicator: "Critical Mathematical Reasoning",
      prompt: "Evaluasi kesimpulan: 'Perpustakaan paling ramai di bulan Maret'. Berikan kritik statistik berbasis konteks kegiatan madrasah."
    },
    {
      datasetId: perpusDataset.id,
      taskNumber: 8,
      watsonLevel: 6,
      indicator: "Data-Driven Decision Making",
      prompt: "Rumuskan rekomendasi pengadaan buku berbasis data kuartil yang telah dianalisis secara tabayyun."
    }
  ];

  for (const t of tasksData) {
    const existingTask = await prisma.task.findFirst({
      where: { datasetId: t.datasetId, taskNumber: t.taskNumber }
    });

    if (!existingTask) {
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
    await pool.end();
  });
