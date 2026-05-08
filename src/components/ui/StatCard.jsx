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

  useEffect(() => {
    if (onView) onView(type)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const displayValue = formatter
    ? formatter(value)
    : Array.isArray(value)
    ? value.length > 0 ? value.join(', ') : '—'
    : typeof value === 'number'
    ? value.toLocaleString('id-ID')
    : value ?? '—'

  const label = t(`stats.${type}`)

  return (
    <div className="glass-card p-4 flex items-center gap-4 animate-fade-in hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5 truncate">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate" title={String(displayValue)}>
          {displayValue}
        </p>
      </div>
    </div>
  )
}
