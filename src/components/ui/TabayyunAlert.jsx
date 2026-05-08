// ============================================================
// TabayyunAlert — Anomaly Warning Banner
// Fires Lvl5 unlock on first appearance
// Has amber pulse animation (CSS: .tabayyun-alert)
// ============================================================
import { useEffect, useRef } from 'react'
import { AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function TabayyunAlert({ isAnomalous, mean, median, diff, threshold, severity, onDetected }) {
  const { t } = useLanguage()
  if (!isAnomalous) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm animate-fade-in">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span>{t('tabayyun.notFound')}</span>
      </div>
    )
  }

  const severityConfig = {
    mild: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-300 dark:border-yellow-700', text: 'text-yellow-800 dark:text-yellow-200', icon: Info },
    strong: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-400 dark:border-amber-600', text: 'text-amber-900 dark:text-amber-100', icon: AlertTriangle },
    extreme: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-400 dark:border-red-600', text: 'text-red-900 dark:text-red-100', icon: AlertTriangle },
  }
  const cfg = severityConfig[severity] || severityConfig.strong
  const Icon = cfg.icon

  return (
    <div className={`tabayyun-alert rounded-xl border ${cfg.bg} ${cfg.border} p-4 animate-bounce-soft`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${severity === 'extreme' ? 'bg-red-500' : 'bg-amber-500'} flex items-center justify-center flex-shrink-0 shadow`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h4 className={`font-bold text-sm ${cfg.text}`}>
              {t('tabayyun.title')}
            </h4>
            <button
              onClick={() => {
                if (onDetected) onDetected()
              }}
              className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm hover:scale-105 active:scale-95 transition-all border border-amber-200 dark:border-amber-900"
            >
              Konfirmasi Temuan
            </button>
          </div>
          <p className={`text-sm ${cfg.text} opacity-90 leading-relaxed`}>
            {t('tabayyun.body')}
          </p>
          {/* Formula Evidence */}
          <div className="mt-3 p-2.5 rounded-lg bg-white/60 dark:bg-black/20 font-mono text-xs space-y-1">
            <div className="text-slate-600 dark:text-slate-300">
              {t('tabayyun.formula')}
            </div>
            <div className="text-slate-700 dark:text-slate-200 font-semibold">
              |{mean?.toLocaleString('id-ID')} − {median?.toLocaleString('id-ID')}| = {diff?.toLocaleString('id-ID')} &gt; {threshold?.toLocaleString('id-ID')} ✓
            </div>
          </div>
          {/* Tabayyun badge */}
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            🔍 {t('tabayyun.badge')} {t('tabayyun.found')}
          </div>
        </div>
      </div>
    </div>
  )
}
