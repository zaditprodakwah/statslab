"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Award, User } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  studentName: string | null;
  schoolName: string | null;
  totalScore: number;
  currentLevel: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setEntries(json.data);
        } else {
          // Fallback static demo data
          setEntries([
            { id: "1", studentName: "Ahmad Fauzi", schoolName: "MA Al-Bahjah Cirebon", totalScore: 16, currentLevel: 6 },
            { id: "2", studentName: "Siti Rahma", schoolName: "MAN 1 Cirebon", totalScore: 14, currentLevel: 5 },
            { id: "3", studentName: "Muhammad Aqil", schoolName: "SMA Islam Terpadu", totalScore: 12, currentLevel: 4 },
            { id: "4", studentName: "Fatimah Az-Zahra", schoolName: "MA Negeri 2", totalScore: 10, currentLevel: 3 }
          ]);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 0) return <Trophy color="#f59e0b" size={20} />;
    if (rank === 1) return <Medal color="#94a3b8" size={20} />;
    if (rank === 2) return <Award color="#b45309" size={20} />;
    return <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-secondary)" }}>#{rank + 1}</span>;
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", marginTop: "32px" }}>
      <h3 style={{ fontSize: "1.25rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--color-emerald-700)" }}>
        <Trophy size={24} color="var(--color-amber-500)" /> Papan Peringkat Literasi Data (Real-Time)
      </h3>

      {loading ? (
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memuat peringkat siswa...</p>
      ) : entries.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--color-slate-300)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-secondary)",
          }}
        >
          <User size={28} style={{ marginBottom: "8px", opacity: 0.6 }} />
          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            Belum Ada Data Peringkat
          </p>
          <p style={{ fontSize: "0.85rem" }}>
            Papan peringkat akan terisi setelah siswa mulai menyelesaikan tugas literasi data.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: index === 0 ? "var(--color-amber-50)" : "var(--bg-surface)",
                border: index === 0 ? "1px solid var(--color-amber-400)" : "1px solid var(--color-slate-200)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "30px", textAlign: "center" }}>{getRankBadge(index)}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    {entry.studentName || "Siswa Anonim"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {entry.schoolName || "Instansi"} • Level Watson {entry.currentLevel}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontWeight: "bold", fontSize: "1rem", color: "var(--color-emerald-700)" }}>
                  {entry.totalScore} Poin
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
