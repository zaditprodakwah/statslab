"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu,
  ChevronDown,
  Monitor,
  Type,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useStatsLabStore } from '@/store/useStatsLabStore';

export default function StickyHeader() {
  const { taskResponses, studentName, currentLevel, xp } = useStatsLabStore();
  const taskProgress = Object.keys(taskResponses || {}).length;
  const totalTasks = 8;
  const progressPercent = Math.min((taskProgress / totalTasks) * 100, 100);

  return (
    <header className="header-sticky">
      <div className="header-container">
        
        {/* Logos & Branding */}
        <div className="header-brand">
          <Link href="/" className="brand-logo">
            <span>StatsLab</span>
          </Link>
          <div className="brand-sponsor">
            <a 
              href="https://staialbahjah.ac.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="sponsor-link"
            >
              <Image 
                src="/logo-institut.jpg" 
                alt="STAI Al-Bahjah Logo" 
                width={24} 
                height={24} 
                className="sponsor-img"
              />
              <span className="sponsor-text">Sponsored by STAI Al-Bahjah</span>
            </a>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="mobile-toggle" aria-label="Toggle Menu">
          <Menu className="icon-md" />
        </button>

        <div className="header-nav">
          
          {/* Module Switcher */}
          <div className="module-switcher">
            <button className="module-btn">
              <span>Modul: Zakat</span>
              <ChevronDown className="icon-sm" />
            </button>
          </div>

          {/* Sticky Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-labels">
              <span className="progress-title">Tugas Literasi Data</span>
              <span className="progress-status">{taskProgress}/{totalTasks} Selesai</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Accessibility & Session Controls */}
          <nav className="header-controls">
            <button className="control-btn" aria-label="Toggle Font Size">
              <Type className="icon-sm" />
            </button>
            <button className="control-btn" aria-label="Toggle High Contrast">
              <Monitor className="icon-sm" />
            </button>
            <button className="control-btn" aria-label="Toggle Theme">
              <Moon className="icon-sm hidden dark-block" />
              <Sun className="icon-sm dark-hidden" />
            </button>
            
            <div className="session-control" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "12px" }}>
              <span className="session-id" style={{ fontWeight: "bold" }}>{studentName || "Siswa"}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-amber-600)" }}>Lvl {currentLevel} • {xp} XP</span>
            </div>
            <button className="btn-logout" aria-label="Keluar Sesi">
              <LogOut className="icon-sm" />
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}
