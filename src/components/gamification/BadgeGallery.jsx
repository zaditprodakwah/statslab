// ============================================================
// BadgeGallery — Locked/Unlocked badge display
// Unlocked badges have glow animation (CSS: .badge-unlocked)
// ============================================================
import { useLanguage } from '../../hooks/useLanguage'
import { Lock } from 'lucide-react'

const ALL_BADGES = [
  {
    id: 'detektif',
    icon: '🔍',
    nameKey: 'gamify.badgeDetektif',
    descKey: 'gamify.badgeDetektifDesc',
    level: 5,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'jujur',
    icon: '🏆',
    nameKey: 'gamify.badgeJujur',
    descKey: 'gamify.badgeJujurDesc',
    level: 6,
    color: 'from-emerald-400 to-teal-500',
  },
]

export function BadgeGallery({ earnedBadges = [] }) {
  const { t } = useLanguage()
  const earnedIds = earnedBadges.map((b) => b.id)

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {t('gamify.badges')}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {ALL_BADGES.map((badge) => {
          const isEarned = earnedIds.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`glass-card p-3 text-center transition-all duration-300 ${
                isEarned
                  ? 'badge-unlocked cursor-default'
                  : 'opacity-50 grayscale cursor-not-allowed'
              }`}
              title={isEarned ? t(badge.descKey) : `Level ${badge.level} diperlukan`}
            >
              {isEarned ? (
                <div className={`w-10 h-10 mx-auto mb-1.5 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-md text-xl`}>
                  {badge.icon}
                </div>
              ) : (
                <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                {t(badge.nameKey)}
              </p>
              {!isEarned && (
                <p className="text-[10px] text-slate-400 mt-0.5">Lvl {badge.level}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
