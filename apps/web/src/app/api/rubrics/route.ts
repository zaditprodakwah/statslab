import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK_RUBRICS = [
  {
    watsonLevel: 1,
    indicators: [
      "Idiosyncratic — Klik Titik Data",
      "Idiosyncratic — Klik Irisan Pie",
      "Idiosyncratic — Klik Titik Tertinggi"
    ],
    keywords: [
      "klik", "batang", "titik", "irisan", "pie", "tertinggi", "terbesar",
      "terkecil", "terendah", "nilai", "angka", "provinsi", "zakat",
      "infak", "wakaf", "perpus", "tajwid", "bulan", "tahun"
    ]
  },
  {
    watsonLevel: 2,
    indicators: ["Informal — Identifikasi Pola Tren"],
    keywords: [
      "pola", "tren", "naik", "turun", "fluktuasi", "variasi", "beraturan",
      "tidak beraturan", "tipe", "bar", "line", "pie", "grafik", "perubahan",
      "kecenderungan", "konsisten"
    ]
  },
  {
    watsonLevel: 3,
    indicators: [
      "Tabayyun — Saring Data Ekstrem",
      "Tabayyun — Verifikasi Outlier"
    ],
    keywords: [
      "tabayyun", "outlier", "ekstrem", "ambang", "slider", "threshold",
      "verifikasi", "saring", "rata-rata", "mean", "jauh", "sumber",
      "periksa", "ulang", "valid", "data"
    ]
  },
  {
    watsonLevel: 4,
    indicators: ["Reading Data", "Reading Between Data"],
    keywords: [
      "tertinggi", "terendah", "paling banyak", "terbanyak", "terbesar",
      "terkecil", "selisih", "jumlah", "total", "proporsi", "persen",
      "persentase", "nilai", "data", "grafik", "diagram", "tahun",
      "provinsi", "bacaan", "ikhfa", "idgham", "izhar", "wakaf", "zakat"
    ]
  },
  {
    watsonLevel: 5,
    indicators: [
      "Reading Beyond Data", "Tabayyun Outlier Detection",
      "Tabayyun Correlation Audit", "Tawazun Distribution Analysis"
    ],
    keywords: [
      "estimasi", "asumsi", "keterbatasan", "prediksi", "tren", "rata-rata",
      "mean", "median", "miring", "seimbang", "tawazun", "tabayyun",
      "outlier", "anomali", "ekstrem", "korelasi", "pola", "konteks",
      "sebab", "akibat", "tidak cukup", "belum cukup", "sampel"
    ]
  },
  {
    watsonLevel: 6,
    indicators: [
      "Amanah Scale Audit", "Critical Mathematical Reasoning",
      "Data-Driven Decision Making"
    ],
    keywords: [
      "amanah", "nol", "dipotong", "impresi", "visual", "menyesatkan",
      "skala", "valid", "tidak valid", "generalisasi", "kritik",
      "keputusan", "rekomendasi", "strategis", "alokasi", "kebijakan",
      "prioritas", "bukti", "data", "kesimpulan"
    ]
  }
];

export async function GET() {
  try {
    const rubrics = await prisma.rubric.findMany({
      where: { active: true },
      select: {
        watsonLevel: true,
        keywords: true,
        indicators: true,
      },
      orderBy: { watsonLevel: "asc" },
    });

    if (rubrics && rubrics.length > 0) {
      return NextResponse.json({ success: true, data: rubrics, source: "database" });
    }
  } catch {
    // Database connection silent fallback for offline / defense mode
  }

  return NextResponse.json({ success: true, data: FALLBACK_RUBRICS, source: "ssot_seed" });
}
