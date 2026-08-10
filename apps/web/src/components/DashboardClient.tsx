/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import InteractiveChart from "@/components/InteractiveChart";
import EmbeddedTasksPanel from "@/components/EmbeddedTasksPanel";
import SusFormModal from "@/components/SusFormModal";
import EthicalModal from "@/components/EthicalModal";
import CertificateModal from "@/components/CertificateModal";
import { BookOpen, BarChart2, ShieldCheck, ClipboardCheck, Award } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { isPrerequisiteLocked } from "@/lib/taskPrereq";
import type { PrerequisiteKey, TaskOptions } from "@/lib/scoring";
import Link from "next/link";

interface DashboardTask {
  id: string;
  taskNumber: number;
  watsonLevel: number;
  indicator: string;
  prompt: string;
  clue?: string;
  inputType?: string;
  options?: TaskOptions | null;
}

interface DashboardDataset {
  id: string;
  slug: string;
  title: string;
  category: string;
  islamicValue: string;
  description?: string | null;
  rawData: unknown[];
  chartConfig?: { type?: "bar" | "line" | "pie"; xAxis?: string; dataKeys?: string[] } | null;
  tasks: DashboardTask[];
}

export default function DashboardClient() {
  const [datasets, setDatasets] = useState<DashboardDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSusOpen, setIsSusOpen] = useState(false);
  const [susResult, setSusResult] = useState<{ score: number; adjective: string } | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [activePblTaskId, setActivePblTaskId] = useState<string | null>(null);
  const [chartSelection, setChartSelection] = useState<{ taskId: string; label: string } | null>(
    null
  );
  const [ethicalModal, setEthicalModal] = useState<"tabayyun" | "amanah" | null>(null);

  const {
    currentLevel,
    sessionId,
    sessionToken,
    activeDataset,
    toggleAmanahScale,
    amanahZeroScale,
    tabayyunThreshold,
    tawazunConfirmed,
    chartTypeUsed,
    confirmTawazun,
    setAssessmentMeta,
    taskResponses,
  } = useStatsLabStore();

  // Fetch all datasets
  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await fetch("/api/datasets");
        const json = await res.json();
        if (json.success) setDatasets(json.data);
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  // Auto-start tour for first-time visitors
  // (OnboardingTour dihapus; langsung masuk ke konten agar fokus pada tugas asesmen)
  useEffect(() => {
    const tasks = (datasets || []).flatMap((d) => d.tasks || []);
    if (tasks.length === 0) return;
    setAssessmentMeta({
      maxTotalScore: tasks.length * 2,
      totalTasks: tasks.length,
      tasks: tasks.map((t) => ({ id: t.id, watsonLevel: t.watsonLevel })),
    });
  }, [datasets, setAssessmentMeta]);

  const handleChartClick = useCallback(
    (payload: any) => {
      if (!activePblTaskId) return;

      const pointData = payload?.activePayload ? payload.activePayload[0]?.payload : payload;
      const label = pointData ? JSON.stringify(pointData) : "Chart Element Clicked";

      // Gesture only: catat titik yang dipilih, siswa tetap harus menekan "Kirim Jawaban"
      setChartSelection({ taskId: activePblTaskId, label: `[Grafik] ${label}` });
      setActivePblTaskId(null);
    },
    [activePblTaskId]
  );

  const handleAmanahToggle = () => {
    setEthicalModal("amanah");
    toggleAmanahScale();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
          Memuat Dasbor Statistika Interaktif & Data Modul Islami...
        </p>
      </div>
    );
  }

  // Active dataset object
  const activeDs = datasets.find((d) => d.slug === activeDataset) ?? datasets[0];
  const activeTasks = activeDs?.tasks || [];

  // T4: Gembok prasyarat — tentukan modul yang sedang "ditugaskan" untuk di-highlight (glow).
  const moduleState = { amanahZeroScale, tabayyunThreshold, tawazunConfirmed, chartTypeUsed };
  const pendingPrereqTask = activeTasks.find(
    (t) =>
      t.options?.prerequisite &&
      !taskResponses[t.id] &&
      isPrerequisiteLocked(t.options.prerequisite, moduleState)
  );
  const highlightKey: PrerequisiteKey | null = pendingPrereqTask?.options?.prerequisite ?? null;
  const togglesHighlighted =
    highlightKey === "amanahZeroScale" || highlightKey === "tawazunConfirmed";

  return (
    <main
      className="page-enter"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}
    >
      {/* Ethical Modal */}
      <EthicalModal type={ethicalModal} onClose={() => setEthicalModal(null)} />

      {/* Hero Banner */}
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-emerald-50)",
            color: "var(--accent-primary)",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <ShieldCheck size={18} /> Media Pembelajaran R&D Terintegrasi Nilai Keislaman
        </div>
        <h1 className="hero-title">
          StatsLab — Dasbor Statistika Interaktif
        </h1>
        <p className="hero-subtitle">
          Memfasilitasi Literasi Data Siswa melalui Eksplorasi Visualisasi Interaktif, Analisis
          Outlier Tabayyun, dan Audit Skala Amanah.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/dashboard/summary"
            className="btn-premium btn-emerald flex-center"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Award size={18} /> Ringkasan Capaian & Sertifikat
          </Link>

          <button
            onClick={() => setIsSusOpen(true)}
            className="btn-premium"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--color-amber-500)",
            }}
          >
            <ClipboardCheck size={18} /> Evaluasi SUS (14 Butir)
          </button>
        </div>

        {susResult && (
          <div
            style={{
              marginTop: "16px",
              fontSize: "0.9rem",
              color: "var(--color-emerald-700)",
              fontWeight: 600,
            }}
          >
            ✅ Skor SUS Tersimpan: {susResult.score} / 100 ({susResult.adjective})
          </div>
        )}
      </header>

      {/* Pilar Amanah & Tawazun Toggles */}
      <div
        id="amanah-scale-toggle"
        className="glass-panel"
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          flexWrap: "wrap",
          gap: "12px",
          border: togglesHighlighted ? "2px solid var(--color-amber-500)" : undefined,
          boxShadow: togglesHighlighted
            ? "0 0 0 4px rgba(245,158,11,0.15)"
            : undefined,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div>
          <strong style={{ fontSize: "0.95rem" }}>
            {highlightKey === "amanahZeroScale"
              ? "✨ Tugas aktif: nyalakan/matikan sakelar ini"
              : "⚖️ Prinsip Amanah — Skala Sumbu Y"}
          </strong>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            {amanahZeroScale
              ? "Skala berbasis nol (Zero-based) — Jujur & Proporsional"
              : "⚠️ Skala Terpotong — Risiko Misleading"}
          </p>
          {highlightKey === "tawazunConfirmed" && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-amber-700)",
                backgroundColor: "var(--color-amber-50)",
                padding: "6px 10px",
                borderRadius: "var(--radius-md)",
              }}
            >
              🎯 Klik “Tampilkan Mean vs Median” untuk membuka Tugas Tawazun.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleAmanahToggle}
            className="btn-premium"
            style={{
              backgroundColor: amanahZeroScale ? "var(--color-emerald-700)" : "#dc2626",
              fontSize: "0.85rem",
              padding: "8px 16px",
            }}
          >
            {amanahZeroScale ? "✅ Skala Jujur Aktif" : "❌ Skala Terpotong"}
          </button>

          <button
            onClick={confirmTawazun}
            className="btn-premium"
            style={{
              backgroundColor: tawazunConfirmed
                ? "var(--color-purple-600)"
                : "var(--color-slate-400)",
              fontSize: "0.85rem",
              padding: "8px 16px",
            }}
            title="Prinsip Tawazun: bandingkan Mean vs Median untuk memahami bentuk distribusi data"
          >
            ⚖️ {tawazunConfirmed ? "Garis Mean & Median Aktif" : "Tampilkan Mean vs Median"}
          </button>
        </div>
      </div>

      {/* Active Dataset Chart */}
      <section id="chart-interactive" style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <BarChart2 style={{ color: "var(--accent-primary)" }} />
          {activeDs ? `📊 ${activeDs.title}` : "Modul Visualisasi Dataset"}
        </h2>

        {activeDs ? (
          <InteractiveChart
            key={activeDs.id}
            title={activeDs.title}
            islamicValue={activeDs.islamicValue}
            type={activeDs.chartConfig?.type || "bar"}
            xAxisKey={activeDs.chartConfig?.xAxis || "provinsi"}
            dataKeys={activeDs.chartConfig?.dataKeys || ["penghimpunan_miliar"]}
            data={activeDs.rawData}
            onChartClick={handleChartClick}
            highlightKey={highlightKey}
          />
        ) : (
          <div
            className="glass-panel"
            style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}
          >
            Dataset tidak ditemukan. Coba pilih modul lain di Header.
          </div>
        )}
      </section>

      {/* Tasks Panel */}
      <section id="tasks-panel" style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <BookOpen style={{ color: "var(--accent-primary)" }} /> Modul Asesmen Literasi Data
        </h2>
        <EmbeddedTasksPanel
          tasks={activeTasks}
          onOpenCertificate={() => setIsCertOpen(true)}
          onSelectTaskForChart={(taskId) => setActivePblTaskId(taskId)}
          activePblTaskId={activePblTaskId}
          chartSelection={chartSelection}
          onClearChartSelection={() => setChartSelection(null)}
          onTabayyunTrigger={() => setEthicalModal("tabayyun")}
        />
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-slate-200)",
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        <p>
          © 2026 StatsLab R&D Open Source Ecosystem. Terintegrasi Nilai Keislaman & Standar
          Watson-Callingham.
        </p>
        {currentLevel >= 6 && (
          <button
            onClick={() => setIsCertOpen(true)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "var(--color-amber-500)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Award size={16} /> Lihat Sertifikat
          </button>
        )}
      </footer>

      {/* Modals */}
      <SusFormModal
        isOpen={isSusOpen}
        onClose={() => setIsSusOpen(false)}
        onSubmitSuccess={(score, adjective) => setSusResult({ score, adjective })}
        sessionId={sessionId}
        sessionToken={sessionToken}
      />
      <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />
    </main>
  );
}
