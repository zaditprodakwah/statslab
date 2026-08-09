import React from "react";
import { Trophy, Medal, Timer } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  timeMs: number;
}

const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "Aisyah Zahra", score: 16, timeMs: 450000 },
  { id: "2", name: "Budi Santoso", score: 15, timeMs: 510000 },
  { id: "3", name: "Fatimah Nur", score: 14, timeMs: 480000 },
];

export default function Leaderboard() {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${Number(seconds) < 10 ? "0" : ""}${seconds}s`;
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", marginTop: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <Trophy size={28} color="var(--color-amber-500)" />
        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", margin: 0 }}>Leaderboard Top 5</h2>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {DUMMY_LEADERBOARD.map((entry, index) => (
          <div 
            key={entry.id}
            style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              backgroundColor: index === 0 ? "var(--color-amber-50)" : "var(--bg-surface)",
              border: index === 0 ? "1px solid var(--color-amber-200)" : "1px solid var(--color-slate-200)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <strong style={{ fontSize: "1.2rem", color: index === 0 ? "var(--color-amber-600)" : "var(--text-secondary)" }}>
                #{index + 1}
              </strong>
              <div>
                <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.1rem" }}>{entry.name}</h4>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Timer size={14} /> Waktu: {formatTime(entry.timeMs)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-emerald-600)" }}>
                {entry.score} XP
              </strong>
              {index === 0 && (
                <div style={{ fontSize: "0.8rem", color: "var(--color-amber-600)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Medal size={14} /> Master Data
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
