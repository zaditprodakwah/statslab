"use client";

import React, { useEffect, useState } from "react";
import InteractiveChart from "@/components/InteractiveChart";
import EmbeddedTasksPanel from "@/components/EmbeddedTasksPanel";
import SusFormModal from "@/components/SusFormModal";
import { BookOpen, BarChart2, ShieldCheck, ClipboardCheck, Download } from "lucide-react";

export default function DashboardClient() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSusOpen, setIsSusOpen] = useState(false);
  const [susResult, setSusResult] = useState<{ score: number; adjective: string } | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await fetch("/api/datasets");
        const json = await res.json();
        if (json.success) {
          setDatasets(json.data);
        }
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
          Memuat Dasbor Statistika Interaktif & Data Modul Islami...
        </p>
      </div>
    );
  }

  // Extract all tasks from datasets
  const allTasks = datasets.flatMap((d) => d.tasks || []);

  return (
    <main className="page-enter" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Hero Banner Header */}
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
            marginBottom: "16px"
          }}
        >
          <ShieldCheck size={18} /> Media Pembelajaran R&D Terintegrasi Nilai Keislaman
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "12px", color: "var(--text-primary)" }}>
          StatsLab — Dasbor Statistika Interaktif
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "750px", margin: "0 auto", marginBottom: "20px" }}>
          Memfasilitasi Literasi Data Siswa melalui Eksplorasi Visualisasi Interaktif, 
          Analisis Outlier Tabayyun, dan Audit Skala Amanah.
        </p>

        {/* Action Buttons for SUS Instrument & Data Export */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            onClick={() => setIsSusOpen(true)}
            className="btn-premium"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--color-emerald-700)" }}
          >
            <ClipboardCheck size={18} /> Isikan Kuesioner SUS (14 Butir)
          </button>
          <a
            href="/api/export/rasch"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-slate-200)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            <Download size={18} /> Ekspor Data Rasch (CSV)
          </a>
        </div>

        {susResult && (
          <div style={{ marginTop: "16px", fontSize: "0.9rem", color: "var(--color-emerald-700)", fontWeight: 600 }}>
            ✅ Skor SUS Tersimpan: {susResult.score} / 100 ({susResult.adjective})
          </div>
        )}
      </header>

      {/* Grid of Interactive Charts */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart2 style={{ color: "var(--accent-primary)" }} /> Modul Visualisasi Dataset
        </h2>
        {datasets.map((dataset) => (
          <InteractiveChart
            key={dataset.id}
            title={dataset.title}
            islamicValue={dataset.islamicValue}
            type={dataset.chartConfig?.type || "bar"}
            xAxisKey={dataset.chartConfig?.xAxis || "wilayah"}
            dataKeys={dataset.chartConfig?.dataKeys || ["zakat"]}
            data={dataset.rawData}
          />
        ))}
      </section>

      {/* Embedded Tasks Watson-Callingham */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen style={{ color: "var(--accent-primary)" }} /> Modul Asesmen Literasi Data
        </h2>
        <EmbeddedTasksPanel tasks={allTasks} />
      </section>

      {/* Footer Info */}
      <footer
        style={{
          textAlign: "center",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-slate-200)",
          color: "var(--text-secondary)",
          fontSize: "0.875rem"
        }}
      >
        <p>© 2026 StatsLab R&D Open Source Ecosystem. Terintegrasi Nilai Keislaman & Standar Watson-Callingham.</p>
      </footer>

      {/* SUS Instrument Modal */}
      <SusFormModal
        isOpen={isSusOpen}
        onClose={() => setIsSusOpen(false)}
        onSubmitSuccess={(score, adjective) => setSusResult({ score, adjective })}
      />
    </main>
  );
}
