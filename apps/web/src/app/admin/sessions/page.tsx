/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Plus, Users, Download, Loader2 } from "lucide-react";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionPins, setSessionPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      const json = await res.json();
      if (json.success) {
        setSessions(json.data.sessions);
        setSessionPins(json.data.sessionPins);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSessions();
  }, []);

  const handleCreatePin = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testPhase: "large_scale" })
      });
      const json = await res.json();
      if (json.success) {
        setSessionPins((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error("Error generating PIN:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-emerald-700)", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>Kelola Sesi Siswa & PIN Kelas</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Daftar responden siswa dan generator kode PIN sesi kelas.
          </p>
        </div>

        <button
          onClick={handleCreatePin}
          disabled={generating}
          className="btn-premium btn-emerald flex-center"
          style={{ padding: "10px 18px" }}
        >
          {generating ? <Loader2 size={18} className="spin" style={{ marginRight: "8px" }} /> : <Plus size={18} style={{ marginRight: "8px" }} />}
          {generating ? "Membuat..." : "Buat PIN Sesi Baru (AK-XX)"}
        </button>
      </div>

      {/* Active PIN List */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <KeyRound size={18} color="var(--color-amber-500)" /> Daftar Kode PIN Sesi Aktif
        </h3>
        {sessionPins.length === 0 ? (
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Belum ada PIN sesi. Klik tombol di atas untuk membuat PIN kelas baru.</p>
        ) : (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {sessionPins.map((pin) => (
              <div
                key={pin.id}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-amber-50)",
                  border: "1px solid var(--color-amber-400)",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "var(--color-amber-700)"
                }}
              >
                🔑 {pin.pinCode}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sessions Data Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={18} color="var(--color-emerald-700)" /> Data Responden Siswa ({sessions.length})
        </h3>

        {loading ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memuat data sesi...</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Belum ada siswa yang mendaftar sesi.</p>
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
                    <td style={{ padding: "10px", fontWeight: 600 }}>{s.studentName || "Anonim"}</td>
                    <td style={{ padding: "10px" }}>{s.schoolName || "-"}</td>
                    <td style={{ padding: "10px" }}>{s.studentClass || "-"}</td>
                    <td style={{ padding: "10px", fontWeight: "bold", color: "var(--color-emerald-700)" }}>{s.totalScore} / 16</td>
                    <td style={{ padding: "10px" }}>Level {s.currentLevel}</td>
                    <td style={{ padding: "10px" }}>{s.taskResponses?.length || 0} / 8</td>
                    <td style={{ padding: "10px" }}>{s.susResponse ? `${s.susResponse.totalScore} (${s.susResponse.adjectiveRating})` : "-"}</td>
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
