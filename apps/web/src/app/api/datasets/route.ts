import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {


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
              { provinsi: "DKI Jakarta", potensi_miliar: 40000, penghimpunan_miliar: 2500, penyaluran_miliar: 2350, pertumbuhan_persen: 18.5 },
              { provinsi: "Jawa Barat", potensi_miliar: 30000, penghimpunan_miliar: 1500, penyaluran_miliar: 1400, pertumbuhan_persen: 25.5 },
              { provinsi: "Jawa Timur", potensi_miliar: 25000, penghimpunan_miliar: 1200, penyaluran_miliar: 1150, pertumbuhan_persen: 22.0 },
              { provinsi: "Jawa Tengah", potensi_miliar: 22000, penghimpunan_miliar: 950, penyaluran_miliar: 900, pertumbuhan_persen: 15.3 },
              { provinsi: "Banten", potensi_miliar: 15000, penghimpunan_miliar: 750, penyaluran_miliar: 700, pertumbuhan_persen: 20.1 }
            ],
            chartConfig: { type: "bar", xAxis: "provinsi", dataKeys: ["penghimpunan_miliar", "penyaluran_miliar"] },
            tasks: [
              {
                id: "t1",
                taskNumber: 1,
                watsonLevel: 1,
                indicator: "Information Reading",
                prompt: "Tuliskan nilai penghimpunan zakat di provinsi DKI Jakarta berdasarkan data di atas.",
                clue: "Perhatikan batang grafik berwarna hijau untuk provinsi DKI Jakarta.",
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
                clue: "Redistribusi dari provinsi surplus ke wilayah yang membutuhkan.",
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
