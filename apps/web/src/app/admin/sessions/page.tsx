/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Download } from "lucide-react";

export default function AdminSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      if (res.status === 401 || res.status === 403) {
        router.replace("/login?redirect=/admin/sessions");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setSessions(json.data.sessions);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    async function init() {
      try {
        const me = await fetch("/api/auth/me");
        const meJson = await me.json();
        const current = meJson.data?.user;
        if (!current || (current.role !== "PENELITI" && current.role !== "ADMIN")) {
          router.replace("/login?redirect=/admin/sessions");
          return;
        }
      } catch {
        router.replace("/login?redirect=/admin/sessions");
        return;
      }
      fetchSessions();
    }
    init();
  }, [router, fetchSessions]);

  const exportCsv = () => {
    const header = ["Nama Siswa", "Sekolah", "Kelas", "Skor Total", "Level", "Jawaban", "Skor SUS"];
    const rows = sessions.map((s) => [
      s.studentName || "Anonim",
      s.schoolName || "-",
      s.studentClass || "-",
      String(s.totalScore),
      String(s.currentLevel),
      String(s.taskResponses?.length || 0),
      s.susResponse ? `${s.susResponse.totalScore} (${s.susResponse.adjectiveRating})` : "-",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statslab-sessions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/admin/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--color-emerald-700)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={18} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>Kelola Sesi Siswa</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Daftar responden siswa beserta hasil tugas dan skor SUS.
          </p>
        </div>

        <button type="button"
          onClick={exportCsv}
          disabled={sessions.length === 0}
          className="btn-premium btn-emerald flex-center"
          style={{ padding: "10px 18px" }}
        >
          <Download size={18} style={{ marginRight: "8px" }} /> Ekspor CSV
        </button>
      </div>

      {/* Sessions Data Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users size={18} color="var(--color-emerald-700)" /> Data Responden Siswa (
          {sessions.length})
        </h3>

        {loading ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memuat data sesi...</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Belum ada siswa yang mendaftar sesi.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-slate-200)", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Nama Siswa</th>
                  <th style={{ padding: "10px" }}>Sekolah</th>
                  <th style={{ padding: "10px" }}>Kelas</th>
                  <th style={{ padding: "10px" }}>Skor Total</th>
                  <th style={{ padding: "10px" }}>Level</th>
                  <th style={{ padding: "10px" }}>Jawaban</th>
                  <th style={{ padding: "10px" }}>Skor SUS</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--color-slate-100)" }}>
                    <td style={{ padding: "10px", fontWeight: 600 }}>
                      {s.studentName || "Anonim"}
                    </td>
                    <td style={{ padding: "10px" }}>{s.schoolName || "-"}</td>
                    <td style={{ padding: "10px" }}>{s.studentClass || "-"}</td>
                    <td
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                        color: "var(--color-emerald-700)",
                      }}
                    >
                      {s.totalScore} / 16
                    </td>
                    <td style={{ padding: "10px" }}>Level {s.currentLevel}</td>
                    <td style={{ padding: "10px" }}>{s.taskResponses?.length || 0} / 8</td>
                    <td style={{ padding: "10px" }}>
                      {s.susResponse
                        ? `${s.susResponse.totalScore} (${s.susResponse.adjectiveRating})`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
