"use client";

import React, { useState } from "react";
import { useStatsLabStore } from "@/store/useStatsLabStore";

const SUS_QUESTIONS = [
  "Saya berpikir akan menggunakan aplikasi ini lagi secara rutin.",
  "Saya merasa sistem ini terlalu rumit padahal bisa lebih sederhana.",
  "Saya merasa sistem ini sangat mudah digunakan.",
  "Saya membutuhkan bantuan orang teknis untuk menggunakan sistem ini.",
  "Saya menemukan berbagai fungsi dalam sistem ini terintegrasi dengan baik.",
  "Saya merasa ada banyak hal yang tidak konsisten pada sistem ini.",
  "Saya membayangkan orang lain dapat mempelajari sistem ini dengan cepat.",
  "Saya merasa sistem ini sangat membingungkan saat digunakan.",
  "Saya merasa sangat percaya diri saat menggunakan sistem ini.",
  "Saya harus mempelajari banyak hal sebelum saya bisa menggunakan sistem ini.",
  "Nilai-nilai Keislaman (Amanah/Tabayyun) yang terintegrasi memperjelas pemahaman saya.",
  "Visualisasi grafik memberikan pemahaman yang tepercaya dan tidak menyesatkan.",
  "Tampilan antarmuka sangat responsif dan nyaman digunakan di perangkat mobile/tablet.",
  "Secara keseluruhan, media dasbor statistika ini sangat membantu literasi data saya."
];

export default function SusFormModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  sessionId,
  sessionToken
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (score: number, adjective: string) => void;
  sessionId?: string | null;
  sessionToken?: string | null;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const sessionStartedAt = useStatsLabStore((state) => state.sessionStartedAt);

  if (!isOpen) return null;

  const handleSelect = (questionIndex: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: val }));
  };

  /**
   * SUS-Extended StatsLab (14 Butir) — instrumen adaptasi Brooke (1996).
   *
   * Komposisi:
   *  - Item 1–10: SUS standar Brooke (1996), diterjemahkan ke Bahasa Indonesia
   *  - Item 11–14: tambahan domain-spesifik Islamic EdTech:
   *      Q11: Nilai Keislaman (Amanah/Tabayyun) memperjelas pemahaman
   *      Q12: Visualisasi grafik tepercaya dan tidak menyesatkan
   *      Q13: Responsivitas antarmuka di mobile/tablet
   *      Q14: Kepuasan keseluruhan media
   *
   * Formula Adaptif: totalScore = ((oddSum + evenSum) / (14 × 4)) × 100
   *  - oddSum  = Σ(score − 1) untuk item ganjil
   *  - evenSum = Σ(5 − score) untuk item genap
   * Adjective rating: Poor < 52 < Good < 72 < Excellent < 85 < Best Imaginable
   * (Bangor, Kortum & Miller, 2009)
   */
  const calculateSusScore = () => {
    let oddSum = 0;
    let evenSum = 0;

    for (let i = 1; i <= 14; i++) {
      const score = answers[i] || 3; // Default 3 if unanswered
      if (i % 2 !== 0) {
        oddSum += score - 1;
      } else {
        evenSum += 5 - score;
      }
    }

    // Formula Adaptif Brooke (14 Butir disesuaikan ke skala 0-100)
    const totalScore = ((oddSum + evenSum) / (14 * 4)) * 100;

    let adjective = "Ok";
    if (totalScore >= 85) adjective = "Best Imaginable";
    else if (totalScore >= 72) adjective = "Excellent";
    else if (totalScore >= 52) adjective = "Good";
    else adjective = "Poor";

    return { totalScore: Number(totalScore.toFixed(2)), adjective };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { totalScore, adjective } = calculateSusScore();

    try {
      const res = await fetch("/api/sus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          totalScore,
          adjectiveRating: adjective,
          sessionId,
          sessionToken
        })
      });

      // F1.8: Persist waktu pengerjaan & status selesai ke sesi
      if (res.ok && sessionId && sessionToken && sessionStartedAt) {
        const timeSpentMs = Date.now() - sessionStartedAt;
        await fetch("/api/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            sessionToken,
            timeSpentMs,
            completedAt: new Date().toISOString()
          })
        }).catch((e) => console.error("Gagal menyimpan waktu sesi:", e));
      }
    } catch (e) {
      console.error("Gagal mengirim SUS:", e);
    } finally {
      setSubmitting(false);
      onSubmitSuccess(totalScore, adjective);
      onClose();
    }
  };

  const isComplete = Object.keys(answers).length === 14;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px"
      }}
    >
      <div
        className="glass-panel"
        style={{
          backgroundColor: "var(--bg-surface)",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: "8px", color: "var(--text-primary)" }}>
          📋 Kuesioner Kepraktisan Media (System Usability Scale — 14 Butir)
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Mohon berikan penilaian objektif Anda terhadap pengalaman menggunakan Dasbor Statistika Interaktif ini (Skala 1 = Sangat Tidak Setuju, 5 = Sangat Setuju).
        </p>

        {/* Questions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {SUS_QUESTIONS.map((qText, idx) => {
            const qNum = idx + 1;
            const currentVal = answers[qNum];

            return (
              <div
                key={qNum}
                style={{
                  borderBottom: "1px stroke var(--color-slate-200)",
                  paddingBottom: "16px"
                }}
              >
                <p style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "10px", color: "var(--text-primary)" }}>
                  {qNum}. {qText}
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", maxWidth: "400px" }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label
                      key={val}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      <input
                        type="radio"
                        name={`q_${qNum}`}
                        value={val}
                        checked={currentVal === val}
                        onChange={() => handleSelect(qNum, val)}
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-slate-200)",
              backgroundColor: "transparent",
              cursor: "pointer"
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isComplete || submitting}
            className="btn-premium"
            style={{
              opacity: !isComplete || submitting ? 0.5 : 1,
              cursor: !isComplete || submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? "Mengirim..." : "Kirim Respon SUS"}
          </button>
        </div>
      </div>
    </div>
  );
}
