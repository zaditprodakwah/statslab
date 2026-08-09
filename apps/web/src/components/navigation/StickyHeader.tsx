"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { LogOut, Type, Eye, ShieldCheck } from "lucide-react";

export default function StickyHeader() {
  const { studentName, schoolName, currentLevel, xp, totalScore } = useStatsLabStore();
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // 0: Normal, 1: Besar, 2: Ultra
  const [projectorMode, setProjectorMode] = useState(false);

  useEffect(() => {
    // Apply font size adjustment to root html
    const root = document.documentElement;
    if (fontSizeLevel === 1) {
      root.style.fontSize = "18px";
    } else if (fontSizeLevel === 2) {
      root.style.fontSize = "20px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [fontSizeLevel]);

  const toggleFontSize = () => {
    setFontSizeLevel((prev) => (prev + 1) % 3);
  };

  const toggleProjectorMode = () => {
    setProjectorMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("projector-mode");
      } else {
        document.body.classList.remove("projector-mode");
      }
      return next;
    });
  };

  return (
    <header className="header-sticky">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="header-brand">
          <Link href="/" className="brand-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck style={{ color: "var(--color-emerald-700)" }} size={24} />
            <span>StatsLab</span>
          </Link>
        </div>

        {/* Watson-Callingham Level & Progress */}
        <div className="progress-indicator">
          <div className="progress-labels">
            <span className="progress-title">Watson-Callingham Level {currentLevel}</span>
            <span className="progress-status">Skor: {totalScore} / 16 ({xp} XP)</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min((totalScore / 16) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Accessibility & Controls */}
        <div className="header-controls">
          {/* Font Size Toggle */}
          <button
            onClick={toggleFontSize}
            className="control-btn"
            title={`Ukuran Teks: ${fontSizeLevel === 0 ? "Normal" : fontSizeLevel === 1 ? "Besar" : "Sangat Besar"}`}
          >
            <Type size={18} />
          </button>

          {/* Projector High Contrast Toggle */}
          <button
            onClick={toggleProjectorMode}
            className="control-btn"
            title={projectorMode ? "Matikan Mode Kontras Proyektor" : "Mode Kontras Proyektor Kelas (High Contrast)"}
            style={{ color: projectorMode ? "var(--color-amber-500)" : "inherit" }}
          >
            <Eye size={18} />
          </button>

          {/* Student Profile Widget */}
          {studentName && (
            <div className="session-control">
              <span className="session-id">
                👤 <strong>{studentName}</strong> ({schoolName || "Siswa"})
              </span>
              <button
                onClick={() => window.location.reload()}
                className="btn-logout"
                title="Keluar / Ganti Sesi"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
