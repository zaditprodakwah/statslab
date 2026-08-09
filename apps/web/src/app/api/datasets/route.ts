import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

let prisma: PrismaClient;

export async function GET() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" }
        }
      }
    });

    // If database is empty, return initial fallback dataset structure
    if (datasets.length === 0) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: "fallback-1",
            slug: "zakat-infak-2026",
            title: "Potensi & Penghimpunan Zakat Provinsi",
            category: "Zakat",
            islamicValue: "Amanah",
            rawData: [
              { wilayah: "DKI Jakarta", zakat: 2500, potensi: 40000 },
              { wilayah: "Jawa Barat", zakat: 1500, potensi: 30000 },
              { wilayah: "Jawa Timur", zakat: 1200, potensi: 25000 },
              { wilayah: "Jawa Tengah", zakat: 950, potensi: 22000 },
              { wilayah: "Banten", zakat: 750, potensi: 15000 }
            ],
            chartConfig: { type: "bar", xAxis: "wilayah", dataKeys: ["zakat", "potensi"] },
            tasks: [
              {
                id: "t1",
                taskNumber: 1,
                watsonLevel: 1,
                indicator: "Information Reading",
                prompt: "Tuliskan nilai penghimpunan zakat di provinsi DKI Jakarta berdasarkan data di atas.",
                clue: "Perhatikan batang grafik berwarna hijau untuk wilayah DKI Jakarta.",
                inputType: "chart"
              },
              {
                id: "t2",
                taskNumber: 2,
                watsonLevel: 2,
                indicator: "Data Comparison",
                prompt: "Bandingkan penghimpunan zakat antara Jawa Barat dan Jawa Timur. Manakah yang lebih tinggi?",
                clue: "Bandingkan tinggi batang Jawa Barat (1500) dan Jawa Timur (1200).",
                inputType: "voice"
              },
              {
                id: "t3",
                taskNumber: 3,
                watsonLevel: 3,
                indicator: "Outlier Detection (Tabayyun)",
                prompt: "Apakah ada nilai ekstrem pada potensi zakat? Mengapa DKI Jakarta jauh lebih tinggi?",
                clue: "Prinsip Tabayyun: Verifikasi faktor kepadatan penduduk dan pusat ekonomi.",
                inputType: "text"
              },
              {
                id: "t4",
                taskNumber: 4,
                watsonLevel: 4,
                indicator: "Scale Integrity (Amanah)",
                prompt: "Bila sumbu Y dipotong tidak dari nol, apa dampak visualnya terhadap persepsi publik?",
                clue: "Prinsip Amanah: Sumbu Y dipotong membuat selisih kecil terlihat sangat dramatis.",
                inputType: "text"
              },
              {
                id: "t5",
                taskNumber: 5,
                watsonLevel: 5,
                indicator: "Consistent Reasoning",
                prompt: "Evaluasi rasio antara potensi dan penghimpunan aktual zakat secara nasional.",
                clue: "Penghimpunan masih jauh di bawah potensi maksimal.",
                inputType: "text"
              },
              {
                id: "t6",
                taskNumber: 6,
                watsonLevel: 6,
                indicator: "Critical Evaluation",
                prompt: "Buat usulan kebijakan redistribusi zakat berlandaskan prinsip Tawazun (keseimbangan).",
                clue: "Redistribusi dari wilayah surplus ke wilayah yang membutuhkan.",
                inputType: "text"
              }
            ]
          }
        ]
      });
    }

    return NextResponse.json({ success: true, data: datasets });
  } catch (error) {
    console.error("GET /api/datasets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data modul dataset" },
      { status: 500 }
    );
  }
}
