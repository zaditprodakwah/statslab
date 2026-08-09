"use client";

import React, { useState } from "react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import CertificateModal from "@/components/CertificateModal";
import SusFormModal from "@/components/SusFormModal";
import { Award, CheckCircle2, ClipboardCheck, ArrowLeft, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SummaryPage() {
  const { studentName, schoolName, totalScore, currentLevel, xp, badges, taskResponses } = useStatsLabStore();
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isSusOpen, setIsSusOpen] = useState(false);
  const [susSubmitted, setSusSubmitted] = useState<number | null>(null);

  const completedCount = Object.keys(taskResponses).length;

  const handleCertificateClose = () => {
    setIsCertOpen(false);
    // Auto trigger SUS form after closing certificate if not submitted yet
    if (!susSubmitted) {
      setTimeout(() => setIsSusOpen(true), 500);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }} className="page-enter">
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-emerald-700)", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeft size={18} /> Kembali ke Dasbor
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "36px", textAlign: "center", marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", padding: "16px", background: "var(--color-emerald-50)", color: "var(--color-emerald-600)", borderRadius: "50%", marginBottom: "16px" }}>
          <Sparkles size={40} />
        </div>

        <h1 style={{ fontSize: "2.2rem", color: "var(--color-emerald-700)", marginBottom: "8px" }}>
          🎉 Selamat, {studentName || "Siswa"}!
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Anda telah menyelesaikan Modul Literasi Data Terintegrasi Nilai Keislaman ({schoolName || "Instansi"}).
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--color-slate-200)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Watson Level</span>
            <h3 style={{ fontSize: "1.5rem", color: "var(--color-emerald-700)" }}>Level {currentLevel}</h3>
          </div>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--color-slate-200)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Skor Total</span>
            <h3 style={{ fontSize: "1.5rem", color: "var(--color-emerald-700)" }}>{totalScore} / 16</h3>
          </div>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--color-slate-200)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Experience Points</span>
            <h3 style={{ fontSize: "1.5rem", color: "var(--color-amber-600)" }}>{xp} XP</h3>
          </div>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--color-slate-200)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Tugas Selesai</span>
            <h3 style={{ fontSize: "1.5rem", color: "var(--color-emerald-700)" }}>{completedCount} / 8</h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => setIsCertOpen(true)}
            className="btn-premium btn-emerald flex-center"
            style={{ padding: "12px 24px", fontSize: "1rem" }}
          >
            <Award size={20} style={{ marginRight: "8px" }} />
            Lihat & Unduh Sertifikat
          </button>

          <button
            onClick={() => setIsSusOpen(true)}
            className="btn-premium flex-center"
            style={{ padding: "12px 24px", fontSize: "1rem", backgroundColor: "var(--color-amber-500)" }}
          >
            <ClipboardCheck size={20} style={{ marginRight: "8px" }} />
            {susSubmitted ? `Skor SUS: ${susSubmitted} / 100` : "Isi Kuesioner Evaluasi SUS (14 Butir)"}
          </button>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "var(--text-primary)" }}>
          Lencana Pencapaian (Badges)
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {badges.map((badge, idx) => (
            <div
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-emerald-50)",
                border: "1px solid var(--color-emerald-500)",
                color: "var(--color-emerald-700)",
                fontWeight: 600,
                fontSize: "0.9rem"
              }}
            >
              <CheckCircle2 size={16} /> {badge}
            </div>
          ))}
        </div>
      </div>

      <CertificateModal isOpen={isCertOpen} onClose={handleCertificateClose} />
      <SusFormModal
        isOpen={isSusOpen}
        onClose={() => setIsSusOpen(false)}
        onSubmitSuccess={(score) => setSusSubmitted(score)}
      />
    </div>
  );
}
