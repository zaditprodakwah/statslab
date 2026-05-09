// ============================================================
// PremiumIcons — High-Fidelity Custom SVG Suite for StatsLab
// Uniquely designed for academic rigor and premium feel.
// Includes layered gradients, geometric abstractions, and 
// glassmorphism-inspired effects.
// ============================================================
import React from 'react'
import { Tooltip } from './Tooltip'
import { useLanguage } from '../../hooks/useLanguage'

export const PremiumIcon = ({ id, className = "w-6 h-6", size = 24, tooltipId = null, showTooltip = false }) => {
  const { t } = useLanguage()
  
  const icons = {
    // ... (rest of icons object remains unchanged)
    // ── Gamification Levels (Scholarly Badge Style) ──────────
    
    // 🔰 Pencari Data (Level 1) - The Foundation (Stacked Prisms)
    finder: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <defs>
          <linearGradient id="finder-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="finder-g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#finder-g1)" />
        <path d="M2 12l10 5 10-5" stroke="url(#finder-g1)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 17l10 5 10-5" fill="url(#finder-g2)" stroke="url(#finder-g1)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1" fill="white" opacity="0.5" />
      </svg>
    ),

    // ✏️ Pelapor Data (Level 2) - The Scroll (Parchment & Ink)
    reporter: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <defs>
          <linearGradient id="reporter-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <path d="M4 4h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="url(#reporter-g1)" fillOpacity="0.1" stroke="url(#reporter-g1)" strokeWidth="1.5" />
        <path d="M6 8h8M6 12h8M6 16h5" stroke="url(#reporter-g1)" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 2l6 6-10 10-6 2 2-6L16 2z" fill="url(#reporter-g1)" />
        <circle cx="18" cy="6" r="1" fill="white" />
      </svg>
    ),

    // 🧭 Analis Junior (Level 3) - The Compass (Orbits & Direction)
    analyst: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <defs>
          <linearGradient id="analyst-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9" stroke="url(#analyst-g1)" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="5" fill="url(#analyst-g1)" fillOpacity="0.1" stroke="url(#analyst-g1)" strokeWidth="1" />
        <path d="M12 7l1.5 3.5 3.5 1.5-3.5 1.5L12 17l-1.5-3.5-3.5-1.5 3.5-1.5L12 7z" fill="url(#analyst-g1)" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
      </svg>
    ),

    // 📊 Detektif Data (Level 4) - The Lens (Grid Verification)
    detective: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <defs>
          <linearGradient id="detective-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="7" stroke="url(#detective-g1)" strokeWidth="2.5" />
        <path d="M11 8v6M8 11h6" stroke="url(#detective-g1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M11 11m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" fill="url(#detective-g1)" fillOpacity="0.1" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M11 5a6 6 0 016 6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),

    // 🔍 Ahli Strategi (Level 5) - The Shield (Hexagonal Protection)
    strategist: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <defs>
          <linearGradient id="strategist-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" fill="url(#strategist-g1)" fillOpacity="0.05" stroke="url(#strategist-g1)" strokeWidth="2" />
        <path d="M12 2v18M4 6.5l16 9M4 15.5l16-9" stroke="url(#strategist-g1)" strokeWidth="0.5" opacity="0.3" />
        <path d="M12 7l2.5 5h-5L12 7z" fill="url(#strategist-g1)" />
        <path d="M12 17l2.5-5h-5L12 17z" fill="url(#strategist-g1)" opacity="0.6" />
      </svg>
    ),

    // 🏆 Master Data (Level 6) - The Apex (Geometric Crown)
    master: (
      <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-xl">
        <defs>
          <linearGradient id="master-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path d="M12 3l3 4.5h-6L12 3z" fill="url(#master-g1)" filter="url(#glow)" />
        <path d="M3 10l9 2 9-2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" fill="url(#master-g1)" fillOpacity="0.1" stroke="url(#master-g1)" strokeWidth="1.5" />
        <path d="M3 10l4 4 5-1 5 1 4-4" stroke="url(#master-g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="2" fill="url(#master-g1)" />
        <path d="M12 11V7" stroke="url(#master-g1)" strokeWidth="1.5" strokeDasharray="1 1" />
      </svg>
    ),

    // ── Navigation & Modules ──────────────────────────────
    
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="8" height="8" rx="2.5" fill="currentColor" />
      </svg>
    ),

    ziswaf: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    tahfizh: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16v16H4V4z" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 4v16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),

    qurban: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 16.5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    literasi: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M12 18V6l4 3-4 3" fill="currentColor" />
        <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),

    certificate: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 15l-2 5 2 2 2-2-2-5z" fill="currentColor" />
        <circle cx="12" cy="8" r="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M9 8l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),

    user: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    settings: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 19l-1.5-1.5M5 5L3.5 3.5M19 5l-1.5 1.5M5 19l-1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    library: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    cartesian: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3l2 2m-2-2l-2 2M21 12l-2 2m2-2l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 8l-8 8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    )
  }

  const iconContent = (
    <div className={className} style={{ width: size, height: size }}>
      {icons[id] || icons.finder}
    </div>
  )

  if (showTooltip && tooltipId) {
    return (
      <Tooltip 
        title={t(`gamify.badges.${tooltipId}`)} 
        content={t(`gamify.tooltips.${tooltipId}`)}
      >
        {iconContent}
      </Tooltip>
    )
  }

  return iconContent
}
