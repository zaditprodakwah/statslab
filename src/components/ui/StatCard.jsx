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

export function StatCard({ type, value, onView, formatter, isMissionTarget }) {
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
      className={`glass-card p-3 sm:p-4 flex items-center gap-3 animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group active:scale-95 overflow-hidden border-2 relative ${
        isMissionTarget 
          ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
          : 'border-slate-100 dark:border-slate-800/50'
      }`}
    >
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <p className="text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tight sm:tracking-widest leading-none mb-1.5 opacity-90">{label}</p>
        <p className="text-sm sm:text-base font-black text-slate-800 dark:text-white truncate leading-tight" title={String(displayValue)}>
          {displayValue}
        </p>
      </div>
      
      {/* Subtle indicator for interactive learning */}
      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
        <div className={`w-1 h-1 rounded-full ${isMissionTarget ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
      </div>
    </div>
  )
}
