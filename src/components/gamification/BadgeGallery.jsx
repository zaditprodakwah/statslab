import { useLanguage } from '../../hooks/useLanguage'
import { Lock } from 'lucide-react'
import { PremiumIcon } from '../ui/PremiumIcons'
import { Tooltip } from '../ui/Tooltip'

const ALL_LEVELS = [
  { lvl: 1, icon: 'finder',     color: 'from-emerald-400 to-emerald-600' },
  { lvl: 2, icon: 'reporter',   color: 'from-blue-400 to-blue-600' },
  { lvl: 3, icon: 'analyst',    color: 'from-amber-400 to-amber-600' },
  { lvl: 4, icon: 'detective',  color: 'from-purple-400 to-purple-600' },
  { lvl: 5, icon: 'strategist', color: 'from-rose-400 to-rose-600' },
  { lvl: 6, icon: 'master',     color: 'from-indigo-400 to-indigo-600' },
]

export function BadgeGallery({ earnedBadges = [], compact = false }) {
  const { t } = useLanguage()
  const currentLevel = earnedBadges.length || 1

  return (
    <div className="space-y-3">
      {!compact && (
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          {t('gamify.badgesLabel')}
        </h4>
      )}
      
      <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
        {ALL_LEVELS.map((level) => {
          const isUnlocked = currentLevel >= level.lvl
          const badgeName = t(`gamify.badges.lvl${level.lvl}`)
          const theoryName = t(`gamify.levels.${level.lvl}`)
          const tooltipContent = t(`gamify.tooltips.lvl${level.lvl}`)

          const badgeCard = (
            <div
              className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-500 w-full ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-800 border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                : 'bg-slate-100/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
              }`}
            >
              {/* Icon Container */}
              <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform duration-500 ${isUnlocked ? 'bg-gradient-to-br ' + level.color + ' text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {isUnlocked ? (
                  <PremiumIcon id={level.icon} size={22} />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl bg-current opacity-20 blur-md animate-pulse" />
                )}
              </div>

              {!compact && (
                <div className="text-center">
                  <p className={`text-[9px] font-black uppercase leading-none truncate w-full ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}`}>
                    {badgeName}
                  </p>
                  <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-0.5 truncate w-full">
                    {theoryName}
                  </p>
                </div>
              )}
              
              <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[7px] font-black ${isUnlocked ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>
                L{level.lvl}
              </div>
            </div>
          )

          return (
            <Tooltip 
              key={level.lvl} 
              title={badgeName} 
              content={isUnlocked ? tooltipContent : "Selesaikan misi untuk membuka gelar ini."}
              className="w-full"
            >
              {badgeCard}
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
