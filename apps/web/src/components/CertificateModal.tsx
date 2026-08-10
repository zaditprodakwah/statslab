"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, X, Award, Check, Minus } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Idiosyncratic (Klik Titik Data)",
  2: "Informal (Tipe Grafik)",
  3: "Inconsistent (Tabayyun Slider)",
  4: "Non-critical (Amanah Scale)",
  5: "Critical (Tawazun & Verifikasi)",
  6: "Critical-Math (Keputusan Data)",
};

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const {
    studentName,
    schoolName,
    totalScore,
    maxTotalScore,
    currentLevel,
    xp,
    sessionId,
    sessionToken,
    certificateId,
    setCertificateId,
    taskResponses,
    tasksMeta,
  } = useStatsLabStore();
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // T6: Lencana eksperimen per level — dimiliki jika ≥1 tugas level itu dijawab benar.
  const masteryByLevel = useMemo(() => {
    const m: Record<number, boolean> = {};
    for (const tm of tasksMeta) {
      const r = taskResponses[tm.id];
      if (r && r.score > 0) m[tm.watsonLevel] = true;
    }
    return m;
  }, [tasksMeta, taskResponses]);

  const today = new Date();
  const issuedDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const certificateNo =
    certificateId ||
    `STATSLAB-${today.getFullYear()}-${(sessionId || "guest").slice(0, 8).toUpperCase()}`;

  useEffect(() => {
    if (isOpen && !certificateId) {
      setCertificateId(certificateNo);
      // F1.8: Persist nomor sertifikat ke sesi database
      if (sessionId && sessionToken) {
        fetch("/api/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, sessionToken, certificateId: certificateNo }),
        }).catch((err) => console.error("Gagal menyimpan nomor sertifikat:", err));
      }
    }
  }, [isOpen, certificateId, certificateNo, sessionId, sessionToken, setCertificateId]);

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
          title: "Sertifikat Literasi Data StatsLab",
          text: `Saya telah menyelesaikan modul literasi data StatsLab (No. ${certificateNo}) dan mencapai Tingkat ${currentLevel} dengan ${xp} XP!`,
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
        padding: "20px",
      }}
    >
      <div
        className="glass-panel"
        style={{ width: "100%", maxWidth: "800px", position: "relative", padding: "24px" }}
      >
        <button type="button"
          onClick={onClose}
          aria-label="Tutup Sertifikat"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <X size={24} />
        </button>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "1.8rem",
            color: "var(--accent-primary)",
          }}
        >
          🎉 Selamat, {studentName || "Siswa"}! Sertifikat Anda Siap
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
            overflow: "auto",
          }}
        >
          {/* Certificate DOM to capture */}
            <div
              ref={certRef}
              style={{
                width: "700px",
                height: "560px",
                padding: "40px",
                backgroundColor: "var(--bg-surface)",
                border: "12px solid var(--color-emerald-700)",
                borderRadius: "8px",
                textAlign: "center",
                position: "relative",
                backgroundImage: "url('/pattern.svg')",
                backgroundSize: "140px",
                backgroundRepeat: "repeat",
                color: "var(--text-primary)",
                fontFamily: "'Inter', sans-serif"
              }}
            >
            <div style={{ position: "absolute", top: "20px", left: "20px" }}>
              <Award size={48} color="var(--color-amber-500)" />
            </div>

            <h1
              style={{
                fontSize: "2.5rem",
                color: "var(--accent-primary)",
                marginTop: "20px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Sertifikat Penghargaan
            </h1>
            <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "40px" }}>
              Diberikan dengan bangga kepada
            </p>

            <h2
              style={{
                fontSize: "3rem",
                color: "var(--text-primary)",
                marginBottom: "16px",
                borderBottom: "2px solid var(--color-emerald-500)",
                display: "inline-block",
                paddingBottom: "8px",
              }}
            >
              {studentName || "Nama Siswa"}
            </h2>

            <p style={{ fontSize: "1.4rem", color: "var(--text-secondary)", marginBottom: "40px" }}>
              dari{" "}
              <strong style={{ color: "var(--accent-primary)" }}>
                {schoolName || "Instansi"}
              </strong>
            </p>

            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: "1.6",
                maxWidth: "550px",
                margin: "0 auto",
                marginBottom: "32px",
              }}
            >
              Atas pencapaian luar biasa dalam menyelesaikan Modul Literasi Data Terintegrasi Nilai
              Keislaman, mencapai{" "}
              <strong style={{ color: "var(--color-amber-600)" }}>Tingkat {currentLevel}</strong>{" "}
              pada Asesmen Literasi Data (Watson-Callingham).
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "8px",
                padding: "0 40px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Skor Total
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--accent-primary)",
                  }}
                >
                  {totalScore} / {maxTotalScore}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Experience Points
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--color-amber-600)",
                  }}
                >
                  {xp} XP
                </p>
              </div>
            </div>

            {/* T6: Lencana eksperimen 6 Level Watson */}
            <div
              style={{
                marginTop: "20px",
                padding: "14px 18px",
                backgroundColor: "var(--bg-primary)",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-secondary)",
                  marginBottom: "10px",
                  fontWeight: 600,
                }}
              >
                Rekam Jejak Eksperimen (Watson-Callingham)
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((lvl) => {
                  const earned = !!masteryByLevel[lvl];
                  return (
                    <div
                      key={lvl}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        backgroundColor: earned ? "#ecfdf5" : "#f1f5f9",
                        border: `1px solid ${earned ? "#a7f3d0" : "#e2e8f0"}`,
                        fontSize: "0.72rem",
                        color: earned ? "#047857" : "#94a3b8",
                        textAlign: "left",
                      }}
                    >
                      {earned ? (
                        <Check size={12} color="#059669" />
                      ) : (
                        <Minus size={12} color="#94a3b8" />
                      )}
                      <span style={{ lineHeight: 1.3 }}>
                        L{lvl}: {LEVEL_LABELS[lvl]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "18px",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                padding: "0 40px",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
              }}
            >
              <span>No. Sertifikat: {certificateNo}</span>
              <span>Diterbitkan: {issuedDate}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <button type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-premium btn-emerald flex-center"
            style={{ padding: "12px 24px" }}
          >
            <Download size={20} style={{ marginRight: "8px" }} />
            {downloading ? "Mengunduh..." : "Unduh Sertifikat"}
          </button>
          <button type="button"
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
