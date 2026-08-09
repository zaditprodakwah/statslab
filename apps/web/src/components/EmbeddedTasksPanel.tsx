"use client";

import React, { useState } from "react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { CheckCircle2, Award, HelpCircle, ChevronDown, ChevronUp, MousePointer, Sparkles } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  taskNumber: number;
  watsonLevel: number;
  indicator: string;
  prompt: string;
  clue?: string;
  modelAnswer?: string;
  inputType?: string; // "text" | "voice" | "chart"
}

interface EmbeddedTasksPanelProps {
  tasks: Task[];
  onOpenCertificate?: () => void;
  onSelectTaskForChart?: (taskId: string | null) => void;
  activePblTaskId?: string | null;
  chartSelection?: { taskId: string; label: string } | null;
  onClearChartSelection?: () => void;
  onTabayyunTrigger?: () => void;
}

export default function EmbeddedTasksPanel({
  tasks,
  onOpenCertificate,
  onSelectTaskForChart,
  activePblTaskId,
  chartSelection,
  onClearChartSelection,
  onTabayyunTrigger,
}: EmbeddedTasksPanelProps) {
  const { taskResponses, submitTaskAnswer, currentLevel, totalScore, badges, sessionId } = useStatsLabStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openClues, setOpenClues] = useState<Record<string, boolean>>({});

  const handleTextChange = (taskId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [taskId]: text }));
  };

  const toggleClue = (taskId: string) => {
    setOpenClues((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleVoiceResult = (taskId: string, transcript: string) => {
    setAnswers((prev) => ({
      ...prev,
      [taskId]: prev[taskId] ? `${prev[taskId]} ${transcript}` : transcript
    }));
  };

  const handleSubmit = async (task: Task) => {
    const selection = chartSelection && chartSelection.taskId === task.id ? chartSelection.label : null;
    const text = selection || answers[task.id] || "";
    if (!text.trim()) return;

    // Trigger Tabayyun modal before submitting high-level tasks (Level 6: task 7 or 8)
    if (task.watsonLevel >= 6 && onTabayyunTrigger) {
      onTabayyunTrigger();
    }

    // Automated Scoring Logic (Politomi 0, 1, 2)
    let score = 1; // Default partial credit
    if (
      text.length > 15 &&
      (text.toLowerCase().includes("nol") ||
        text.toLowerCase().includes("tabayyun") ||
        text.toLowerCase().includes("tawazun") ||
        text.toLowerCase().includes("zakat") ||
        text.toLowerCase().includes("tertinggi") ||
        text.toLowerCase().includes("outlier"))
    ) {
      score = 2; // Full credit
    }

    if (selection && onClearChartSelection) onClearChartSelection();

    // Save to Zustand
    submitTaskAnswer(task.id, text, score);

    // Save to PostgreSQL database if sessionId exists
    if (sessionId) {
      try {
        await fetch("/api/task-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            taskId: task.id,
            answerText: text,
            score,
            interactionLog: { timestamp: new Date().toISOString(), inputType: task.inputType || "text" }
          })
        });
      } catch (err) {
        console.error("Failed to sync task response to DB:", err);
      }
    }

    // Trigger celebration confetti if Watson Level 6 reached
    if (currentLevel >= 5 && score === 2) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
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
            Jawab tugas berjenjang pada modul ini untuk menguji kemampuan membaca dan mengevaluasi data.
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
          const isChartTask = task.inputType === "chart";
          const isActivePbl = activePblTaskId === task.id;
          const selectedForTask = chartSelection && chartSelection.taskId === task.id ? chartSelection.label : null;

          return (
            <div
              key={task.id}
              style={{
                border: isActivePbl
                  ? "2px solid var(--color-amber-500)"
                  : "1px solid var(--color-slate-200)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                backgroundColor: isSubmitted
                  ? "var(--color-emerald-50)"
                  : isActivePbl
                  ? "var(--color-amber-50)"
                  : "var(--bg-surface)",
                transition: "all 0.3s ease"
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

              {/* Clue / Kunci Jawaban Toggle */}
              {task.clue && (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    onClick={() => toggleClue(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-amber-600)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0
                    }}
                  >
                    <HelpCircle size={14} />
                    {openClues[task.id] ? "Sembunyikan Clue" : "Lihat Clue / Petunjuk Soal"}
                    {openClues[task.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {openClues[task.id] && (
                    <div
                      style={{
                        marginTop: "6px",
                        padding: "10px 14px",
                        backgroundColor: "var(--color-amber-50)",
                        borderLeft: "3px solid var(--color-amber-500)",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        color: "var(--color-slate-800)"
                      }}
                    >
                      💡 <strong>Clue Tabayyun:</strong> {task.clue}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Chart Task Action */}
              {isChartTask && !isSubmitted && (
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => onSelectTaskForChart && onSelectTaskForChart(isActivePbl ? null : task.id)}
                    className="btn-premium"
                    style={{
                      backgroundColor: isActivePbl ? "var(--color-amber-500)" : "var(--color-emerald-700)",
                      fontSize: "0.85rem",
                      padding: "8px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <MousePointer size={16} />
                    {isActivePbl
                      ? "Sedang Menunggu Klik pada Grafik..."
                      : selectedForTask
                      ? "Ulangi Klik Grafik"
                      : "Jawab Lewat Klik Grafik"}
                  </button>

                  {selectedForTask && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-emerald-700)",
                        backgroundColor: "var(--color-emerald-50)",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      ✅ Titik terpilih: {selectedForTask.replace("[Grafik] ", "")}
                      <button
                        type="button"
                        onClick={onClearChartSelection}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-red-600)",
                          cursor: "pointer",
                          fontWeight: 600,
                          marginLeft: "8px",
                        }}
                      >
                        Batalkan
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Text / Voice Input & Submit */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder={isSubmitted ? response.answerText : "Tulis analisis data Anda di sini..."}
                  disabled={isSubmitted}
                  value={selectedForTask ?? answers[task.id] ?? ""}
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

                {!isSubmitted && (
                  <VoiceInput onResult={(transcript) => handleVoiceResult(task.id, transcript)} />
                )}

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
            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={20} color="var(--color-amber-500)" /> 🎉 Selamat! Anda Membuka Sertifikat Kelulusan Literasi Data
            </h4>
            <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>
              Anda telah menyelesaikan seluruh tugas dengan penalaran kritis berprinsip Keislaman.
            </p>
          </div>
          <button
            onClick={() => onOpenCertificate && onOpenCertificate()}
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
            Lihat & Unduh Sertifikat
          </button>
        </div>
      )}
    </div>
  );
}
