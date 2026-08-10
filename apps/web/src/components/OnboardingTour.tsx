"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { Step, EventHandler } from "react-joyride";

const Joyride = dynamic(() => import("react-joyride").then((mod) => mod.Joyride), {
  ssr: false,
});

const TOUR_STEPS: Step[] = [
  {
    target: ".header-sticky",
    title: "👋 Selamat Datang di StatsLab!",
    content:
      "Dasbor Statistika Interaktif terintegrasi nilai keislaman (Tabayyun, Amanah, Tawazun). Gunakan menu ini untuk berpindah modul, dan pantau identitas serta XP Anda di sini.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "#module-switcher-btn",
    title: "🔄 Ganti Modul Dataset",
    content:
      "Berpindahlah di antara 4 dataset: Zakat & Infak, Sirkulasi Perpustakaan, Tajwid Juz 30, dan Wakaf Produktif.",
    placement: "bottom",
  },
  {
    target: "#amanah-scale-toggle",
    title: "⚖️ Prinsip Amanah (Skala Jujur)",
    content:
      "Toggle ini mengaktifkan/menonaktifkan sumbu Y berbasis nol. QS. Al-Mutaffifin mengajarkan penyajian data yang jujur dan tidak menyesatkan.",
    placement: "right",
  },
  {
    target: "#chart-interactive",
    title: "📊 Grafik Interaktif",
    content:
      "Klik bar atau titik data untuk menjawab tugas (Klik & Klik). Titik ekstrem memicu verifikasi Tabayyun (QS. Al-Hujurat: 6); atur ambang slider dan ubah tipe grafik dari sini.",
    placement: "bottom",
  },
  {
    target: "#tasks-panel",
    title: "✏️ Tugas Literasi Data",
    content:
      "Wizard 16 soal berjenjang Watson-Callingham. Soal terkunci (🔒) terbuka setelah modul dasbor dioperasikan. Jawaban benar bernilai 2 poin.",
    placement: "top",
  },
  {
    target: ".progress-indicator",
    title: "🏆 Level & Sertifikat",
    content:
      "Tingkatkan Level Watson-Callingham (1–6) dan kumpulkan XP. Selesaikan semua tugas untuk membuka Sertifikat Kelulusan Literasi Data.",
    placement: "bottom",
  },
];

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function OnboardingTour({ run, onFinish }: OnboardingTourProps) {
  const handleEvent: EventHandler = (data) => {
    if (data.status === "finished" || data.status === "skipped") {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
        primaryColor: "#047857",
        textColor: "#1e293b",
        backgroundColor: "#ffffff",
        arrowColor: "#ffffff",
        overlayColor: "rgba(15, 23, 42, 0.55)",
        zIndex: 10000,
        spotlightPadding: 8,
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
          borderRadius: "14px",
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.35)",
          padding: "20px 24px",
          maxWidth: "380px",
        },
        tooltipTitle: {
          fontSize: "1.05rem",
          fontWeight: 700,
          marginBottom: "8px",
        },
        tooltipContent: {
          fontSize: "0.9rem",
          lineHeight: 1.65,
          paddingTop: "4px",
        },
        buttonPrimary: {
          backgroundColor: "#047857",
          borderRadius: "10px",
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
