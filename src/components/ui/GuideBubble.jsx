import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ChevronUp, ChevronDown, Award, Target, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { PremiumIcon } from './PremiumIcons';

/**
 * GuideBubble — The Digital Companion (Chat-like interface).
 * Consolidates missions, alerts, and pedagogical clues.
 */
export function GuideBubble({ gamify, profile, activeModule }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  // Levels data for identity card
  const levelData = {
    1: { name: t('gamify.badges.lvl1'), theory: t('gamify.levels.1'), icon: 'finder' },
    2: { name: t('gamify.badges.lvl2'), theory: t('gamify.levels.2'), icon: 'reporter' },
    3: { name: t('gamify.badges.lvl3'), theory: t('gamify.levels.3'), icon: 'analyst' },
    4: { name: t('gamify.badges.lvl4'), theory: t('gamify.levels.4'), icon: 'detective' },
    5: { name: t('gamify.badges.lvl5'), theory: t('gamify.levels.5'), icon: 'strategist' },
    6: { name: t('gamify.badges.lvl6'), theory: t('gamify.levels.6'), icon: 'master' },
  };

  const currentLevel = levelData[gamify.level] || levelData[1];

  // Auto-open on level up or major alerts (simulation)
  useEffect(() => {
    if (gamify.level > 1) {
      setIsOpen(true);
      setShowPulse(false);
    }
  }, [gamify.level]);

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[150] flex flex-col items-end gap-4 no-print">
      
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="w-[85vw] sm:w-[380px] glass-panel-heavy rounded-[2.5rem] shadow-2xl border-2 border-emerald-500/20 overflow-hidden animate-pop-in flex flex-col max-h-[60vh] sm:max-h-[500px]">
          
          {/* Header: Identity Card */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <PremiumIcon id={currentLevel.icon} size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black uppercase italic tracking-tighter text-lg truncate">
                  {profile?.nama || 'Auditor Muda'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    LVL {gamify.level}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {currentLevel.name}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <Sparkles className="absolute right-4 top-4 w-12 h-12 text-emerald-500/10 pointer-events-none" />
          </div>

          {/* Content: Mission & Clues */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            
            {/* Active Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {t('gamify.currentMission')}
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{t(`gamify.missions.lvl${gamify.level}`)}"
                </p>
              </div>
            </div>

            {/* Context Clue (Dynamic based on module) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Wawasan Auditor
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeModule === 'ziswaf' && "Perhatikan Mean! Jika kamu menambahkan penerima dengan dana sangat besar, Mean akan naik tajam tapi Median tetap stabil. Itulah ciri Anomali Data."}
                  {activeModule === 'tahfizh' && "Konsistensi diukur dengan Median. Jika sebaran data seimbang, Mean dan Median akan berdekatan (Tawazun)."}
                  {activeModule === 'qurban' && "Modus menunjukkan wilayah mana yang paling padat penerima. Gunakan ini untuk pemerataan distribusi."}
                  {activeModule === 'literasi' && "Frekuensi buku menunjukkan minat literasi. Apakah ada kategori yang tidak pernah dipinjam? Itu juga temuan audit!"}
                  {!activeModule && "Gunakan menu di atas untuk berpindah modul. Setiap modul memiliki tantangan statistik yang unik."}
                </p>
              </div>
            </div>

            {/* Theory Progress */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teori Literasi</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{currentLevel.theory}</p>
              </div>
              <Award className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* Footer: Chat Input Placeholder */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-3">
            <div className="flex-1 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 flex items-center">
              <span className="text-[10px] font-bold text-slate-400 italic">Tanya Pemandu Digital...</span>
            </div>
            <button className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Bubble Toggle ── */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPulse(false);
        }}
        className={`relative w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group ${
          isOpen 
          ? 'bg-slate-900 text-white rotate-90' 
          : 'bg-emerald-600 text-white rotate-0'
        }`}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
        
        {/* Notification Badge / Pulse */}
        {!isOpen && showPulse && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 border-2 border-white dark:border-slate-900 items-center justify-center text-[10px] font-black text-white">1</span>
          </span>
        )}

        {/* Hover Label */}
        {!isOpen && (
          <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Pusat Bantuan
          </div>
        )}
      </button>
    </div>
  );
}
