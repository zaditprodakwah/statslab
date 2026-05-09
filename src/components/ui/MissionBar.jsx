import { Target, ChevronRight, Trophy, Sparkles } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function MissionBar({ gamify }) {
  const { t } = useLanguage()
  const { level, points, maxPoints } = gamify

  const missionText = t(`gamify.missions.lvl${level}`)
  const rankName = t(`gamify.levels.${level}`)
  const progress = (points / maxPoints) * 100

  return (
    <div className="fixed bottom-[4.5rem] sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4 animate-slide-up no-print">
      <div className="glass-card overflow-hidden shadow-2xl border-2 border-emerald-500/30 dark:border-emerald-400/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        {/* Progress Bar background */}
        <div className="absolute top-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full" />
        <div 
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
          style={{ width: `${progress}%` }}
        />

        <div className="p-3 sm:p-4 flex items-center gap-4">
          {/* Level Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center shadow-lg transform -rotate-3">
              <span className="text-[10px] font-black text-emerald-100 leading-none uppercase">{t('gamify.level')}</span>
              <span className="text-xl font-black text-white leading-none">{level}</span>
            </div>
            {level === 6 && (
              <Trophy className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-bounce drop-shadow-md" />
            )}
            {level < 6 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-md animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Mission Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {level === 6 ? t('gamify.missionComplete') : t('gamify.currentMission')}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {t('gamify.rank')}: {rankName}
              </span>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight flex items-center gap-1.5">
              <span>{t(`gamify.badges.lvl${level}`)}</span>
              <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold italic">{rankName}</span>
            </p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
              <span className="opacity-80">Misi: {missionText}</span>
            </p>
          </div>

          {/* Action Hint */}
          {level < 6 && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0 pl-4 border-l border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">PROGRES</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  {points} / {maxPoints} PTS
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 animate-pulse">
                <Target className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
