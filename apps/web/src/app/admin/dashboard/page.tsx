"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Database, Download, LogOut, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/adminToken";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalSessions: 0, totalResponses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/sessions", { headers: getAdminAuthHeaders() });
        const json = await res.json();
        if (json.success) {
          setStats({
            totalSessions: json.data.sessions.length,
            totalResponses: json.data.sessions.reduce((acc: number, s: { taskResponses: unknown[] }) => acc + s.taskResponses.length, 0)
          });
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Header Admin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck style={{ color: "var(--color-emerald-700)" }} /> Panel Riset & Admin StatsLab
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Kelola data sesi siswa, instrumen soal, dan ekspor instrumen statistik (Rasch & CFA).
          </p>
        </div>

        <Link href="/" className="btn-premium" style={{ backgroundColor: "#ef4444", padding: "8px 16px", textDecoration: "none", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <LogOut size={16} /> Keluar Admin
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Total Sesi Siswa</span>
            <Users color="var(--color-emerald-600)" size={24} />
          </div>
          <h2 style={{ fontSize: "2.2rem", color: "var(--color-emerald-700)" }}>{loading ? "..." : stats.totalSessions}</h2>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Total Jawaban Tugas</span>
            <FileSpreadsheet color="var(--color-amber-500)" size={24} />
          </div>
          <h2 style={{ fontSize: "2.2rem", color: "var(--color-amber-600)" }}>{loading ? "..." : stats.totalResponses}</h2>
        </div>
      </div>

      {/* Quick Navigation Action Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={20} color="var(--color-emerald-700)" /> Kelola Sesi Siswa
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Lihat daftar lengkap responden siswa beserta hasil SUS dan rekap nilai.
          </p>
          <Link href="/admin/sessions" className="btn-premium btn-emerald flex-center" style={{ textDecoration: "none", width: "100%", padding: "10px" }}>
            Buka Tabel Sesi
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Database size={20} color="var(--color-amber-600)" /> CMS Dataset & Soal PBL
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Edit inline dataset, petunjuk soal (clue), kunci jawaban model, atau upload file dataset JSON baru.
          </p>
          <Link href="/admin/datasets" className="btn-premium flex-center" style={{ textDecoration: "none", width: "100%", padding: "10px", backgroundColor: "var(--color-amber-500)" }}>
            Kelola Dataset & Soal
          </Link>
        </div>
      </div>

      {/* R&D Export Box */}
      <div className="glass-panel" style={{ padding: "24px", background: "linear-gradient(135deg, var(--color-emerald-50), var(--bg-surface))" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", color: "var(--color-emerald-800)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Download size={20} /> Ekspor Data Analisis Statistika (R&D Research)
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Unduh instrumen data yang sudah siap dianalisis di software psikometri Winsteps (Model Rasch PCM) atau LISREL / R lavaan (CFA).
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a
            href="/api/export/rasch"
            download
            className="btn-premium btn-emerald flex-center"
            style={{ textDecoration: "none", padding: "10px 20px" }}
          >
            <Download size={18} style={{ marginRight: "8px" }} /> Ekspor Rasch PCM (.ctl Winsteps)
          </a>

          <a
            href="/api/export/cfa"
            download
            className="btn-premium flex-center"
            style={{ textDecoration: "none", padding: "10px 20px", backgroundColor: "#2563eb" }}
          >
            <Download size={18} style={{ marginRight: "8px" }} /> Ekspor CFA Dikotomis (.csv LISREL/R)
          </a>
        </div>
      </div>
    </div>
  );
}
