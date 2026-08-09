"use client";

import React, { useState } from "react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { CheckCircle2, Award, FileSpreadsheet } from "lucide-react";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  taskNumber: number;
  watsonLevel: number;
  indicator: string;
  prompt: string;
}

export default function EmbeddedTasksPanel({ tasks }: { tasks: Task[] }) {
  const { taskResponses, submitTaskAnswer, currentLevel, totalScore, badges } = useStatsLabStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleTextChange = (taskId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [taskId]: text }));
  };

  const handleSubmit = (task: Task) => {
    const text = answers[task.id] || "";
    if (!text.trim()) return;

    // Automated Scoring Logic (Politomi 0, 1, 2) based on keyword heuristics
    let score = 1; // Default partial credit
    if (text.length > 20 && (text.toLowerCase().includes("nol") || text.toLowerCase().includes("tabayyun") || text.toLowerCase().includes("tawazun") || text.toLowerCase().includes("zakat"))) {
      score = 2; // Full credit
    }

    submitTaskAnswer(task.id, text, score);

    // Trigger celebration confetti if Watson Level 6 reached
    if (currentLevel >= 5 && score === 2) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
      {/* Task Header & Gamification Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
            Tugas Literasi Data (Watson-Callingham)
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Jawab 8 tugas berjenjang untuk menguji kemampuan membaca dan mengevaluasi data.
          </p>
        </div>

        {/* Level & Certificate Status Badge */}
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
            <Award style={{ color: "var(--color-amber-500)" }} size={20} />
            <strong style={{ fontSize: "1.1rem", color: "var(--accent-primary)" }}>
              Level {currentLevel}: Watson-Callingham
            </strong>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Skor Total: <strong>{totalScore} / 16</strong> | Badge: <strong>{badges.join(", ")}</strong>
          </span>
        </div>
      </div>

      {/* List of Tasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tasks.map((task) => {
          const response = taskResponses[task.id];
          const isSubmitted = !!response;

          return (
            <div
              key={task.id}
              style={{
                border: "1px solid var(--color-slate-200)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                backgroundColor: isSubmitted ? "var(--color-emerald-50)" : "var(--bg-surface)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--accent-primary)" }}>
                  Tugas #{task.taskNumber} — Watson Level {task.watsonLevel} ({task.indicator})
                </span>
                {isSubmitted && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-emerald-700)", fontSize: "0.85rem", fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Skor: {response.score} / 2
                  </span>
                )}
              </div>

              <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "12px" }}>
                {task.prompt}
              </p>

              {/* Text Input & Submit */}
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  placeholder={isSubmitted ? response.answerText : "Tulis analisis data Anda di sini..."}
                  disabled={isSubmitted}
                  value={answers[task.id] || ""}
                  onChange={(e) => handleTextChange(task.id, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-slate-200)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem"
                  }}
                />
                <button
                  onClick={() => handleSubmit(task)}
                  disabled={isSubmitted}
                  className="btn-premium"
                  style={{
                    opacity: isSubmitted ? 0.6 : 1,
                    cursor: isSubmitted ? "default" : "pointer"
                  }}
                >
                  {isSubmitted ? "Tersimpan" : "Kirim Jawaban"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unlock Certificate Banner at Level 6 */}
      {currentLevel >= 6 && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, var(--color-emerald-700), var(--color-slate-900))",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px", color: "#fff" }}>
              🎉 Selamat! Anda Membuka Sertifikat Kelulusan Literasi Data
            </h4>
            <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>
              Anda telah menyelesaikan seluruh tugas dengan penalaran kritis berprinsip Keislaman.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-amber-500)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Cetak Sertifikat
          </button>
        </div>
      )}
    </div>
  );
}
