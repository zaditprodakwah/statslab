// ============================================================
// LevelProgressBar — Visual 6-level progression indicator
// Animated fill: CSS transition 800ms cubic-bezier
// ============================================================
import { useLanguage } from '../../hooks/useLanguage'

const LEVEL_COLORS = [
  'bg-slate-400',
  'bg-blue-400',
  'bg-cyan-400',
  'bg-amber-400',
  'bg-orange-500',
  'bg-emerald-500',
]

export function LevelProgressBar({ level, points, maxPoints = 150 }) {
  const { t } = useLanguage()
  const pct = Math.min((points / maxPoints) * 100, 100)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {t('gamify.yourLevel')}
        </span>
        <span className="level-chip text-emerald-700 dark:text-emerald-300">
          Lvl {level} · {points} Poin
        </span>
      </div>

      {/* Level name */}
      <div className="text-center">
        <span className="text-base font-bold text-slate-700 dark:text-slate-200">
          {t(`gamify.levels.${level}`)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full level-bar-fill rounded-full"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={points}
          aria-valuemin={0}
          aria-valuemax={maxPoints}
          aria-label={`${points} dari ${maxPoints} poin`}
        />
      </div>

      {/* Level steps */}
      <div className="flex items-center justify-between px-0.5">
        {[1, 2, 3, 4, 5, 6].map((lvl) => (
          <div key={lvl} className="flex flex-col items-center gap-0.5">
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 ${
                lvl <= level
                  ? `${LEVEL_COLORS[lvl - 1]} border-transparent shadow-sm`
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
              }`}
              title={t(`gamify.levels.${lvl}`)}
            />
            <span className={`text-[9px] font-medium ${lvl <= level ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {lvl}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
