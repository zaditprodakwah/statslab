"use client";

import React, { useMemo, useState } from "react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { scoreAnswer, isChoiceCorrect, getCorrectChoiceText } from "@/lib/scoring";
import type { TaskOptions } from "@/lib/scoring";
import { isPrerequisiteLocked, MODULE_LABELS } from "@/lib/taskPrereq";
import { getRubricKeywords } from "@/lib/rubricCache";
import {
  CheckCircle2,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MousePointer,
  Sparkles,
  Lock,
  AlertTriangle,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
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
  inputType?: string; // "text" | "voice" | "chart" | "choice"
  options?: TaskOptions | null;
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

const normalize = (s: string) => (s || "").trim().toLowerCase();

export default function EmbeddedTasksPanel({
  tasks,
  onOpenCertificate,
  onSelectTaskForChart,
  activePblTaskId,
  chartSelection,
  onClearChartSelection,
  onTabayyunTrigger,
}: EmbeddedTasksPanelProps) {
  const {
    taskResponses,
    submitTaskAnswer,
    currentLevel,
    totalScore,
    maxTotalScore,
    badges,
    sessionId,
    sessionToken,
    amanahZeroScale,
    tabayyunThreshold,
    tawazunConfirmed,
    chartTypeUsed,
  } = useStatsLabStore();

  const [selections, setSelections] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [openClues, setOpenClues] = useState<Record<string, boolean>>({});
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [eduModal, setEduModal] = useState<{ task: Task; explanation: string } | null>(null);

  const moduleState = { amanahZeroScale, tabayyunThreshold, tawazunConfirmed, chartTypeUsed };
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.taskNumber - b.taskNumber),
    [tasks]
  );
  const answeredIds = useMemo(
    () =>
      new Set(
        Object.entries(taskResponses)
          .filter(([, r]) => r.score > 0)
          .map(([id]) => id)
      ),
    [taskResponses]
  );

  const isLocked = (task: Task) =>
    task.options?.prerequisite
      ? isPrerequisiteLocked(task.options.prerequisite, moduleState)
      : false;

  // Wizard: satu tugas aktif pada satu waktu (tugas belum dijawab & tidak terkunci).
  const currentTask =
    (currentTaskId
      ? sortedTasks.find((t) => t.id === currentTaskId && !answeredIds.has(t.id) && !isLocked(t))
      : null) ??
    sortedTasks.find((t) => !answeredIds.has(t.id) && !isLocked(t)) ??
    null;

  const allDone = sortedTasks.length > 0 && !currentTask;

  const autoMatchedIndex = (task: Task): number | null => {
    if (
      !task.options?.chartClickAnswer ||
      chartSelection?.taskId !== task.id
    ) {
      return null;
    }
    const idx = task.options.choices.findIndex(
      (c) => normalize(c) === normalize(task.options?.chartClickAnswer)
    );
    return idx >= 0 ? idx : null;
  };

  const selectChoice = (taskId: string, index: number) => {
    setSelections((prev) => ({ ...prev, [taskId]: prev[taskId] === index ? -1 : index }));
  };

  const toggleClue = (taskId: string) => {
    setOpenClues((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleSubmitChoice = async (task: Task) => {
    if (!task.options) return;
    const matchedIndex = autoMatchedIndex(task);
    const selectedIndex = matchedIndex ?? selections[task.id];

    if (typeof selectedIndex !== "number" || selectedIndex < 0) return;

    const choiceText = task.options.choices[selectedIndex] ?? "";
    const correct = isChoiceCorrect(task.options, selectedIndex, choiceText);

    // Multiple Attempts + Overlay Edukasi: jawaban salah → tampilkan penjelasan, boleh coba lagi.
    if (!correct) {
      setEduModal({
        task,
        explanation:
          task.options.explanation ??
          "Belum tepat. Perhatikan kembali pola data dan petunjuk modul pada dasbor.",
      });
      return;
    }

    // Trigger Tabayyun modal sebelum menyelesaikan tugas level tinggi.
    if (task.watsonLevel >= 6 && onTabayyunTrigger) {
      onTabayyunTrigger();
    }

    let finalScore = 2;
    let finalLevel = currentLevel;

    if (sessionId && sessionToken) {
      try {
        const res = await fetch("/api/task-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            sessionToken,
            taskId: task.id,
            answerText: choiceText,
            answerIndex: selectedIndex,
            moduleState,
            interactionLog: {
              timestamp: new Date().toISOString(),
              inputType: task.inputType || "choice",
              answerIndex: selectedIndex,
            },
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            finalScore = json.data.score ?? finalScore;
            finalLevel = json.data.currentLevel ?? finalLevel;
          }
        }
      } catch (err) {
        console.error("Failed to sync task response to DB:", err);
      }
    }

    if (chartSelection?.taskId === task.id && onClearChartSelection) onClearChartSelection();

    // Persist hanya jawaban benar (exact match) — gembok terbuka, wizard maju.
    submitTaskAnswer(task.id, choiceText, finalScore);
    setCurrentTaskId(null);

    if (finalLevel >= 5 && finalScore === 2) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleSubmitText = async (task: Task) => {
    const text = textAnswers[task.id] || "";
    if (!text.trim()) return;

    const rubricKeywords = await getRubricKeywords(task.watsonLevel);
    let finalScore = scoreAnswer(text, task.modelAnswer, rubricKeywords);
    let finalLevel = currentLevel;

    if (sessionId && sessionToken) {
      try {
        const res = await fetch("/api/task-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            sessionToken,
            taskId: task.id,
            answerText: text,
            interactionLog: { timestamp: new Date().toISOString(), inputType: "text" },
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            finalScore = json.data.score;
            finalLevel = json.data.currentLevel;
          }
        }
      } catch (err) {
        console.error("Failed to sync task response to DB:", err);
      }
    }

    submitTaskAnswer(task.id, text, finalScore);

    if (finalLevel >= 5 && finalScore === 2) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const renderTaskCard = (task: Task) => {
    const isAnswered = answeredIds.has(task.id);
    const locked = isLocked(task);
    const isChartTask = task.inputType === "chart";
    const selectedIndex = autoMatchedIndex(task) ?? selections[task.id];
    const correctText = getCorrectChoiceText(task.options);
    const response = taskResponses[task.id];

    return (
      <div
        key={task.id}
        style={{
          border: "1px solid var(--color-slate-200)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          backgroundColor: isAnswered
            ? "var(--color-emerald-50)"
            : "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--accent-primary)" }}>
            Tugas #{task.taskNumber} — Watson Level {task.watsonLevel} ({task.indicator})
          </span>
          {isAnswered && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--color-emerald-700)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} /> Skor: {response?.score ?? 2} / 2
            </span>
          )}
        </div>

        <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "12px" }}>
          {task.prompt}
        </p>

        {/* Gembok Prasyarat 🔒 */}
        {locked && task.options?.prerequisite && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-slate-100)",
              border: "1px dashed var(--color-slate-300)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
            }}
          >
            <Lock size={18} color="var(--color-amber-600)" />
            <span>
              <strong>Soal Terkunci.</strong> Operasikan{" "}
              <strong>{MODULE_LABELS[task.options.prerequisite]}</strong> di dasbor untuk
              membukanya.
            </span>
          </div>
        )}

        {/* Clue / Petunjuk */}
        {task.clue && !locked && (
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
                padding: 0,
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
                  color: "var(--color-slate-800)",
                }}
              >
                💡 <strong>Clue Tabayyun:</strong> {task.clue}
              </div>
            )}
          </div>
        )}

        {!locked && isAnswered ? (
          /* Ringkasan jawaban benar */
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-emerald-100)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
              color: "var(--color-emerald-800)",
            }}
          >
            <Check size={18} />
            <span>
              Jawaban benar: <strong>{response?.answerText || correctText}</strong>
            </span>
          </div>
        ) : !locked && task.options ? (
          /* Smart Choice Cards (MCQ) */
          <>
            {isChartTask && (
              <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectTaskForChart && onSelectTaskForChart(activePblTaskId === task.id ? null : task.id)
                  }
                  className="btn-premium"
                  style={{
                    backgroundColor: activePblTaskId === task.id ? "var(--color-amber-500)" : "var(--color-emerald-700)",
                    fontSize: "0.85rem",
                    padding: "8px 14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MousePointer size={16} />
                  {activePblTaskId === task.id
                    ? "Sedang Menunggu Klik pada Grafik..."
                    : "Jawab Lewat Klik Grafik"}
                </button>
                {chartSelection?.taskId === task.id && (
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-emerald-700)",
                      backgroundColor: "var(--color-emerald-50)",
                      padding: "6px 12px",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    ✅ Titik terpilih: {chartSelection.label.replace("[Grafik] ", "")}
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginBottom: "14px" }}>
              {task.options.choices.map((choice, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectChoice(task.id, idx)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected
                        ? "2px solid var(--color-emerald-600)"
                        : "1px solid var(--color-slate-200)",
                      backgroundColor: isSelected ? "var(--color-emerald-50)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontFamily: "var(--font-inter)",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? "var(--color-emerald-600)" : "var(--color-slate-300)"}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: isSelected ? "var(--color-emerald-700)" : "var(--text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {choice}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSubmitChoice(task)}
              disabled={typeof selectedIndex !== "number" || selectedIndex < 0}
              className="btn-premium"
              style={{
                opacity: typeof selectedIndex !== "number" || selectedIndex < 0 ? 0.5 : 1,
                cursor: typeof selectedIndex !== "number" || selectedIndex < 0 ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowRight size={16} /> Kirim Pilihan
            </button>
          </>
        ) : !locked ? (
          /* Fallback: tugas isian teks / suara (skenario lama) */
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Tulis analisis data Anda di sini..."
              value={textAnswers[task.id] ?? ""}
              onChange={(e) => setTextAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-slate-200)",
                fontFamily: "var(--font-inter)",
                fontSize: "0.9rem",
              }}
            />
            <VoiceInput onResult={(transcript) => setTextAnswers((prev) => ({ ...prev, [task.id]: `${prev[task.id] ?? ""} ${transcript}`.trim() }))} />
            <button onClick={() => handleSubmitText(task)} className="btn-premium">
              Kirim Jawaban
            </button>
          </div>
        ) : null}
      </div>
    );
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
            Jawab tugas berjenjang pada modul ini. Soal terkunci (🔒) terbuka setelah modul dasbor dioperasikan.
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
            Skor Total: <strong>{totalScore} / {maxTotalScore}</strong> | Badge: <strong>{badges.join(", ")}</strong>
          </span>
        </div>
      </div>

      {/* Wizard Progress Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {sortedTasks.map((t) => {
          const done = answeredIds.has(t.id);
          const locked = isLocked(t);
          const isCurrent = currentTask?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                if (done || !locked) setCurrentTaskId(t.id);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                border: isCurrent
                  ? "2px solid var(--color-amber-500)"
                  : done
                  ? "1px solid var(--color-emerald-600)"
                  : "1px solid var(--color-slate-300)",
                backgroundColor: isCurrent
                  ? "var(--color-amber-50)"
                  : done
                  ? "var(--color-emerald-50)"
                  : "var(--bg-surface)",
                color: isCurrent
                  ? "var(--color-amber-700)"
                  : done
                  ? "var(--color-emerald-700)"
                  : locked
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
                cursor: done || !locked ? "pointer" : "default",
                opacity: locked ? 0.7 : 1,
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {done ? <Check size={12} /> : locked ? <Lock size={12} /> : null}
              T{t.taskNumber}
            </button>
          );
        })}
      </div>

      {/* Wizard Body */}
      {currentTask ? (
        renderTaskCard(currentTask)
      ) : allDone ? (
        <div
          style={{
            padding: "24px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-emerald-50)",
            border: "1px solid var(--color-emerald-200)",
            textAlign: "center",
          }}
        >
          <h4 style={{ fontSize: "1.1rem", color: "var(--color-emerald-800)", marginBottom: "6px" }}>
            🎉 Semua tugas pada modul ini telah selesai!
          </h4>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Lanjutkan ke modul dataset lain atau lihat Ringkasan Capaian & Sertifikat.
          </p>
        </div>
      ) : (
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Tidak ada tugas pada modul ini.
        </p>
      )}

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
            alignItems: "center",
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
              cursor: "pointer",
            }}
          >
            Lihat & Unduh Sertifikat
          </button>
        </div>
      )}

      {/* Overlay Edukasi — Multiple Attempts (jawaban salah → penjelasan + coba lagi) */}
      {eduModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div className="glass-panel" style={{ width: "100%", maxWidth: "480px", padding: "24px", position: "relative" }}>
            <button
              onClick={() => setEduModal(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <X size={20} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
                color: "var(--color-amber-600)",
              }}
            >
              <AlertTriangle size={22} />
              <h4 style={{ fontSize: "1.15rem", margin: 0, color: "var(--color-amber-700)" }}>
                Belum Tepat — Coba Lagi (Tugas #{eduModal.task.taskNumber})
              </h4>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.6 }}>
              {eduModal.explanation}
            </p>
            <button
              onClick={() => setEduModal(null)}
              className="btn-premium btn-emerald w-full"
              style={{ padding: "10px", width: "100%" }}
            >
              Saya Mengerti — Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
