// ============================================================
// Header — App navigation bar
// Contains: Brand, SUS Eval (desktop only), Dark/Light, ID|EN
// Mobile: compact — logo + lang toggle + dark toggle only
// Navigation on mobile handled by BottomNav
// ============================================================
import { useState, useRef } from 'react'
import { Moon, Sun, Globe, ClipboardList, HelpCircle, BookOpen } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function Header({ isDark, onToggleDark, onOpenSUS, onOpenHelp, onOpenKnowledgeBase, onMagicEntry }) {
  const { t, lang, setLang } = useLanguage()
  
  // Magic Entry Logic (5x logo clicks in 2s)
  const clickCount = useRef(0)
  const lastClickTime = useRef(0)
  
  const handleLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTime.current > 2000) {
      clickCount.current = 1
    } else {
      clickCount.current += 1
    }
    
    lastClickTime.current = now
    
    if (clickCount.current === 5) {
      clickCount.current = 0
      onMagicEntry?.()
    }
  }

  return (
    <header className="glass sticky top-0 z-30 px-3 sm:px-6 h-14 flex items-center justify-between no-print">
      {/* Brand - Magic Entry Target */}
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={handleLogoClick}
        title="StatsLab Dashboard"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
          <span className="text-white text-xs font-extrabold tracking-tighter">SL</span>
        </div>
        <div>
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm tracking-wide">
            STATSLAB
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 text-xs ml-1.5">
            — Dasbor Statistika Interaktif
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5">
        {/* Academic Knowledge Base Button */}
        <button
          onClick={onOpenKnowledgeBase}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <BookOpen className="w-3 h-3" />
          <span className="hidden xs:inline">TOR & Legal</span>
        </button>

        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <HelpCircle className="w-3 h-3" />
          <span className="hidden xs:inline">{t('nav.help')}</span>
        </button>

        {/* SUS Evaluation Button — desktop only (mobile uses BottomNav) */}
        <button
          onClick={onOpenSUS}
          id="sus-eval-btn"
          aria-label={t('nav.evalSUS')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <ClipboardList className="w-3 h-3" />
          {t('nav.evalSUS')}
        </button>

        {/* Language switcher: ID | EN */}
        <div className="flex items-center bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <Globe className="w-3 h-3 text-slate-400 mx-1.5 flex-shrink-0" />
          {['id', 'en'].map((l, i) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1.5 text-xs font-bold transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-emerald-400 ${
                i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''
              } ${
                lang === l
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              tabIndex={0}
              id={`lang-btn-${l}`}
              aria-label={`Switch to ${l.toUpperCase()}`}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          tabIndex={0}
          id="dark-mode-toggle"
          aria-label={isDark ? t('ui.lightMode') : t('ui.darkMode')}
          title={isDark ? t('ui.lightMode') : t('ui.darkMode')}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}
