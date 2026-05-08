// ============================================================
// StatCard — Displays statistical results (Mean/Median/Modus)
// Fires: Lvl4 unlock on first render/interaction
// ============================================================
import { useEffect } from 'react'
import { TrendingUp, BarChart2, Target, Hash, ArrowUp, ArrowDown } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

const ICONS = {
  mean: TrendingUp,
  median: BarChart2,
  modus: Target,
  count: Hash,
  min: ArrowDown,
  max: ArrowUp,
}

const COLORS = {
  mean: 'from-emerald-500 to-emerald-600',
  median: 'from-blue-500 to-blue-600',
  modus: 'from-violet-500 to-violet-600',
  count: 'from-amber-500 to-amber-600',
  min: 'from-slate-400 to-slate-500',
  max: 'from-rose-500 to-rose-600',
}

export function StatCard({ type, value, onView, formatter }) {
  const { t } = useLanguage()
  const Icon = ICONS[type] || Hash
  const gradient = COLORS[type] || COLORS.mean

  const handleView = () => {
    if (onView) onView(type)
  }

  const displayValue = formatter ? formatter(value) : value
  const label = t(`stats.${type}`)



  return (
    <div 
      onClick={handleView}
      className="glass-card p-4 flex items-center gap-4 animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group active:scale-95"
      title={t('stats.clickToLearn') || 'Klik untuk mempelajari wawasan ini'}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5 truncate">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate" title={String(displayValue)}>
          {displayValue}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
        {t('stats.learn') || 'Amati'}
      </div>
    </div>
  )
}
