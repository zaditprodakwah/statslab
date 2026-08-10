"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStatsLabStore, DatasetSlug } from "@/store/useStatsLabStore";
import { LogOut, Type, Eye, ShieldCheck, ChevronDown, Check } from "lucide-react";

const MODULES: { slug: DatasetSlug; label: string; emoji: string }[] = [
  { slug: "zakat-infak", label: "Distribusi Zakat & Infak", emoji: "🕌" },
  { slug: "perpus-madrasah", label: "Sirkulasi Perpustakaan", emoji: "📚" },
  { slug: "tajwid-juz-30", label: "Hukum Tajwid Juz 30", emoji: "📖" },
  { slug: "wakaf-produktif", label: "Wakaf Produktif", emoji: "🌿" },
];

export default function StickyHeader() {
  const { studentName, schoolName, currentLevel, xp, totalScore, maxTotalScore, activeDataset, setActiveDataset } = useStatsLabStore();
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // 0: Normal, 1: Besar, 2: Ultra
  const [projectorMode, setProjectorMode] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeLevel === 1) root.style.fontSize = "18px";
    else if (fontSizeLevel === 2) root.style.fontSize = "20px";
    else root.style.fontSize = "16px";
  }, [fontSizeLevel]);

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#module-switcher-btn")) setModuleOpen(false);
    };
    if (moduleOpen) document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [moduleOpen]);

  const toggleFontSize = () => setFontSizeLevel((prev) => (prev + 1) % 3);
  const toggleProjectorMode = () => {
    setProjectorMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("projector-mode", next);
      return next;
    });
  };

  const activeModule = MODULES.find((m) => m.slug === activeDataset) ?? MODULES[0];

  return (
    <header className="header-sticky" role="banner">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="header-brand">
          <Link href="/" className="brand-logo" aria-label="StatsLab — Kembali ke Beranda" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck style={{ color: "var(--color-emerald-700)" }} size={24} />
            <span>StatsLab</span>
          </Link>
        </div>

        {/* Module Switcher Dropdown */}
        <div style={{ position: "relative", marginRight: "auto", marginLeft: "16px" }}>
          <button
            id="module-switcher-btn"
            aria-haspopup="listbox"
            aria-expanded={moduleOpen}
            onClick={() => setModuleOpen((o) => !o)}
            className="module-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-slate-200)",
              backgroundColor: "var(--bg-surface)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>{activeModule.emoji} {activeModule.label}</span>
            <ChevronDown size={14} style={{ transform: moduleOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
          </button>

          {moduleOpen && (
            <ul
              role="listbox"
              aria-label="Pilih Modul Dataset"
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 100,
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--color-slate-200)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-hover)",
                padding: "4px",
                minWidth: "240px",
                listStyle: "none",
              }}
            >
              {MODULES.map((mod) => (
                <li
                  key={mod.slug}
                  role="option"
                  aria-selected={activeDataset === mod.slug}
                  onClick={() => { setActiveDataset(mod.slug); setModuleOpen(false); }}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setActiveDataset(mod.slug); setModuleOpen(false); } }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: activeDataset === mod.slug ? 600 : 400,
                    backgroundColor: activeDataset === mod.slug ? "var(--color-emerald-50)" : "transparent",
                    color: activeDataset === mod.slug ? "var(--color-emerald-700)" : "var(--text-primary)",
                    transition: "background 0.15s",
                  }}
                >
                  {mod.emoji} {mod.label}
                  {activeDataset === mod.slug && <Check size={14} style={{ marginLeft: "auto" }} />}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Watson-Callingham Level & Progress */}
        <div className="progress-indicator">
          <div className="progress-labels">
            <span className="progress-title">Watson Level {currentLevel}</span>
            <span className="progress-status">Skor: {totalScore} / {maxTotalScore} ({xp} XP)</span>
          </div>
          <div className="progress-bar-bg" role="progressbar" aria-valuenow={totalScore} aria-valuemin={0} aria-valuemax={maxTotalScore}>
            <div className="progress-bar-fill" style={{ width: `${Math.min((totalScore / maxTotalScore) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Accessibility & Controls */}
        <div className="header-controls">
          <button
            onClick={toggleFontSize}
            className="control-btn"
            aria-label={`Ukuran Teks: ${fontSizeLevel === 0 ? "Normal" : fontSizeLevel === 1 ? "Besar" : "Sangat Besar"}`}
            title={`Ukuran Teks: ${fontSizeLevel === 0 ? "Normal" : fontSizeLevel === 1 ? "Besar" : "Sangat Besar"}`}
          >
            <Type size={18} />
          </button>

          <button
            onClick={toggleProjectorMode}
            className="control-btn"
            aria-pressed={projectorMode}
            aria-label={projectorMode ? "Matikan Mode Proyektor" : "Mode Kontras Tinggi Proyektor"}
            title={projectorMode ? "Matikan Mode Proyektor" : "Mode Kontras Tinggi Proyektor"}
            style={{ color: projectorMode ? "var(--color-amber-500)" : "inherit" }}
          >
            <Eye size={18} />
          </button>

          {studentName && (
            <div className="session-control">
              <span className="session-id">
                👤 <strong>{studentName}</strong> ({schoolName || "Siswa"})
              </span>
              <button
                onClick={() => window.location.reload()}
                className="btn-logout"
                aria-label="Keluar dan Ganti Sesi"
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
