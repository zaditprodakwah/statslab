"use client";

import React from "react";
import { Joyride, STATUS, Step } from "react-joyride";

const TOUR_STEPS: Step[] = [
  {
    target: "#chart-interactive",
    title: "📊 Grafik Interaktif",
    content:
      "Ini adalah grafik utama dataset Anda. Klik bar atau titik data untuk menyeleksi nilai — hasilnya akan digunakan untuk menjawab tugas Watson-Callingham.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "#module-switcher-btn",
    title: "🔄 Ganti Modul Dataset",
    content:
      "Gunakan menu ini untuk berpindah antara 4 dataset: Zakat & Infak, Sirkulasi Perpustakaan, Tajwid Juz 30, dan Wakaf Produktif.",
    placement: "bottom",
  },
  {
    target: "#amanah-scale-toggle",
    title: "⚖️ Prinsip Amanah (Skala Jujur)",
    content:
      "Toggle ini mengaktifkan/menonaktifkan skala sumbu Y berbasis nol. QS. Al-Mutaffifin mengajarkan bahwa penyajian data harus jujur dan tidak menyesatkan.",
    placement: "right",
  },
  {
    target: "#tasks-panel",
    title: "✏️ Tugas Literasi Data",
    content:
      "Jawab 8 tugas berjenjang Watson-Callingham (Level 4–6). Anda bisa menjawab dengan tulisan atau suara. Setiap jawaban mendapat skor 0, 1, atau 2.",
    placement: "top",
  },
  {
    target: ".progress-bar-bg",
    title: "🏆 Kemajuan Watson-Callingham",
    content:
      "Bilah ini menunjukkan kemajuan Anda menuju Level 6. Selesaikan semua tugas untuk membuka Sertifikat Kelulusan Literasi Data.",
    placement: "bottom",
  },
];

interface GuidedTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function GuidedTour({ run, onFinish }: GuidedTourProps) {
  // Guard against SSR — react-joyride requires browser APIs
  if (typeof window === "undefined") return null;

  const handleCallback = (data: { status?: string }) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      onEvent={handleCallback}
      options={{
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
        primaryColor: "#047857",
        textColor: "#1e293b",
        backgroundColor: "#ffffff",
        arrowColor: "#ffffff",
        zIndex: 150,
      }}
      locale={{
        back: "Kembali",
        close: "Tutup",
        last: "Selesai",
        next: "Lanjut →",
        skip: "Lewati Tur",
      }}
      styles={{
        tooltip: {
          borderRadius: "12px",
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.3)",
          padding: "20px 24px",
          maxWidth: "360px",
        },
        tooltipTitle: {
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "8px",
        },
        tooltipContent: {
          fontSize: "0.9rem",
          lineHeight: 1.6,
          paddingTop: "4px",
        },
        buttonPrimary: {
          backgroundColor: "#047857",
          borderRadius: "8px",
          padding: "8px 18px",
          fontWeight: 600,
        },
        buttonBack: {
          color: "#64748b",
          marginRight: "8px",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontSize: "0.8rem",
        },
        beaconInner: {
          backgroundColor: "#047857",
        },
        beaconOuter: {
          borderColor: "#059669",
        },
      }}
    />
  );
}
