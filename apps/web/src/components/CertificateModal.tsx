"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, X, Award } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const { studentName, schoolName, totalScore, currentLevel, xp } = useStatsLabStore();
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Sertifikat-StatsLab-${studentName}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh sertifikat:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sertifikat StatsLab",
          text: `Saya telah menyelesaikan modul literasi data StatsLab dan mencapai Level ${currentLevel} dengan ${xp} XP!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Gagal membagikan:", err);
      }
    } else {
      alert("Browser Anda tidak mendukung fitur Web Share API.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "20px"
      }}
    >
      <div className="glass-panel" style={{ width: "100%", maxWidth: "800px", position: "relative", padding: "24px" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)"
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "1.8rem", color: "var(--color-emerald-700)" }}>
          🎉 Selamat! Anda telah mencapai Level Master
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px", overflow: "auto" }}>
          {/* Certificate DOM to capture */}
          <div
            ref={certRef}
            style={{
              width: "700px",
              height: "500px",
              padding: "40px",
              backgroundColor: "#fff",
              border: "12px solid var(--color-emerald-700)",
              borderRadius: "8px",
              textAlign: "center",
              position: "relative",
              backgroundImage: "url('/pattern.png')",
              backgroundSize: "cover",
              color: "#1e293b",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <div style={{ position: "absolute", top: "20px", left: "20px" }}>
              <Award size={48} color="var(--color-amber-500)" />
            </div>
            
            <h1 style={{ fontSize: "2.5rem", color: "var(--color-emerald-800)", marginTop: "20px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Sertifikat Penghargaan
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "40px" }}>
              Diberikan dengan bangga kepada
            </p>
            
            <h2 style={{ fontSize: "3rem", color: "#0f172a", marginBottom: "16px", borderBottom: "2px solid var(--color-emerald-500)", display: "inline-block", paddingBottom: "8px" }}>
              {studentName || "Nama Siswa"}
            </h2>
            
            <p style={{ fontSize: "1.4rem", color: "#475569", marginBottom: "40px" }}>
              dari <strong style={{ color: "var(--color-emerald-700)" }}>{schoolName || "Instansi"}</strong>
            </p>
            
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6", maxWidth: "550px", margin: "0 auto", marginBottom: "40px" }}>
              Atas pencapaian luar biasa dalam menyelesaikan Modul Literasi Data Terintegrasi Nilai Keislaman, 
              mencapai <strong style={{ color: "var(--color-amber-600)" }}>Tingkat {currentLevel} (Critical Mathematical)</strong>.
            </p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px", padding: "0 40px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1rem", color: "#64748b", marginBottom: "8px" }}>Skor Total</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-emerald-700)" }}>{totalScore}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1rem", color: "#64748b", marginBottom: "8px" }}>Experience Points</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-amber-600)" }}>{xp} XP</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-premium btn-emerald flex-center"
            style={{ padding: "12px 24px" }}
          >
            <Download size={20} style={{ marginRight: "8px" }} />
            {downloading ? "Mengunduh..." : "Unduh Sertifikat"}
          </button>
          <button
            onClick={handleShare}
            className="btn-premium btn-purple flex-center"
            style={{ padding: "12px 24px" }}
          >
            <Share2 size={20} style={{ marginRight: "8px" }} />
            Bagikan
          </button>
        </div>
      </div>
    </div>
  );
}
