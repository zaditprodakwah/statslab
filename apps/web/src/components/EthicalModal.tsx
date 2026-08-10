"use client";

import React from "react";
import { ShieldCheck, BookOpen, X } from "lucide-react";

interface EthicalModalProps {
  type: "tabayyun" | "amanah" | null;
  onClose: () => void;
}

const MODAL_CONTENT = {
  tabayyun: {
    icon: <ShieldCheck size={36} style={{ color: "#059669" }} />,
    title: "Tabayyun: Verifikasi Data",
    arabicAyat: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا",
    reference: "(QS. Al-Hujurat: 6)",
    message:
      "Sebelum menyimpulkan, seorang analis data yang beramanah wajib memverifikasi sumber, outlier, dan keterwakilan sampel. Apakah data yang Anda analisis sudah mewakili populasi dengan adil?",
    confirmText: "Ya, Saya Sudah Memverifikasi Data",
    color: "#059669",
    bg: "#ecfdf5",
  },
  amanah: {
    icon: <BookOpen size={36} style={{ color: "#2563eb" }} />,
    title: "Amanah: Kejujuran Visual",
    arabicAyat: "وَيْلٌ لِّلْمُطَفِّفِينَ",
    reference: "(QS. Al-Mutaffifin: 1)",
    message:
      "Grafik dengan sumbu Y yang terpotong dapat menyesatkan pembaca. Prinsip Amanah dalam penyajian data mengharuskan penggunaan skala berbasis nol (Zero-based axis) agar perbandingan bersifat jujur dan proporsional.",
    confirmText: "Saya Paham, Gunakan Skala Jujur",
    color: "#2563eb",
    bg: "#eff6ff",
  },
};

export default function EthicalModal({ type, onClose }: EthicalModalProps) {
  if (!type) return null;

  const content = MODAL_CONTENT[type];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ethical-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        padding: "16px",
        animation: "fadeInUp 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.4)",
          position: "relative",
          borderTop: `4px solid ${content.color}`,
        }}
      >
        {/* Close */}
        <button type="button"
          onClick={onClose}
          aria-label="Tutup Modal"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "4px",
          }}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "16px",
              borderRadius: "50%",
              backgroundColor: content.bg,
              marginBottom: "12px",
            }}
          >
            {content.icon}
          </div>
          <h2 id="ethical-modal-title" style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>
            {content.title}
          </h2>
        </div>

        {/* Arabic Ayat */}
        <div
          style={{
            backgroundColor: content.bg,
            border: `1px solid ${content.color}`,
            borderRadius: "var(--radius-md)",
            padding: "16px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "1.25rem",
              fontFamily: "serif",
              lineHeight: 2,
              direction: "rtl",
              marginBottom: "8px",
              color: content.color,
            }}
          >
            {content.arabicAyat}
          </p>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
            {content.reference}
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}
        >
          {content.message}
        </p>

        {/* Confirm Button */}
        <button type="button"
          onClick={onClose}
          className="btn-premium w-full"
          style={{
            backgroundColor: content.color,
            width: "100%",
            padding: "12px",
            fontSize: "0.95rem",
          }}
        >
          {content.confirmText}
        </button>
      </div>
    </div>
  );
}
