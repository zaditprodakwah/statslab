import React, { useEffect, useState } from 'react'
import { Trophy, Star, Sparkles, ChevronRight, X } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function LevelUpOverlay({ notification, onDismiss }) {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)

  // Only show if it's a level up notification (has level property)
  const isLevelUp = notification && notification.level !== undefined

  useEffect(() => {
    if (isLevelUp) {
      setShow(true)
      // Play a sound if possible (optional)
    } else {
      setShow(false)
    }
  }, [isLevelUp])

  if (!isLevelUp || !show) return null

  const { level, points, badge } = notification
  const rankName = t(`gamify.levels.${level}`)
  const badgeTitle = t(`gamify.badges.lvl${level}`)
  const academicTitle = t(`gamify.watsonCallingham.lvl${level}Name`)
  const academicDesc = t(`gamify.watsonCallingham.lvl${level}Desc`)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
        onClick={onDismiss}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-lg glass-card p-8 text-center border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pop-in">
        
        {/* Celebration Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 animate-bounce delay-100">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 opacity-50" />
            </div>
            <div className="absolute bottom-20 right-10 animate-bounce delay-300">
                <Sparkles className="w-8 h-8 text-emerald-400 opacity-50" />
            </div>
            <div className="absolute top-40 right-20 animate-pulse">
                <Star className="w-4 h-4 text-blue-400 fill-blue-400 opacity-50" />
            </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Circle */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center shadow-2xl rotate-6 transform hover:rotate-0 transition-transform duration-500">
            <span className="text-4xl font-black text-white italic drop-shadow-md">Lvl {level}</span>
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">
              LEVEL UP UNLOCKED!
            </h2>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {badge?.icon} {badgeTitle}
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
             <span className="text-[10px] font-black uppercase tracking-wider">TEORI AKADEMIK:</span>
             <span className="text-sm font-bold italic">{academicTitle}</span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            "{academicDesc}"
          </p>

          <div className="pt-6">
            <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6">
              <div className="h-px w-8 bg-current opacity-30" />
              <span className="text-xs font-black uppercase tracking-widest">+ {points} POINTS EARNED</span>
              <div className="h-px w-8 bg-current opacity-30" />
            </div>

            <button 
              onClick={onDismiss}
              className="group relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-[1.02] transition-all shadow-xl active:scale-95"
            >
              Lanjutkan Eksplorasi
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
