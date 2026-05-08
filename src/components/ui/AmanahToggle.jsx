// ============================================================
// AmanahToggle — Y-Axis Visual Integrity Switch
// Fires Lvl6 unlock on first toggle
// ============================================================
import { useRef } from 'react'
import { Eye, EyeOff, Info } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function AmanahToggle({ isAmanah, onToggle, onFirstToggle }) {
  const { t } = useLanguage()
  const firedRef = useRef(false)
  const statesSeen = useRef(new Set())

  const handleToggle = () => {
    onToggle()
    
    // Add current state (after toggle) to the set
    // Note: onToggle is async in terms of state update, so we use the inverse of isAmanah
    const newState = !isAmanah
    statesSeen.current.add(newState ? 'amanah' : 'bias')

    if (statesSeen.current.size >= 2 && !firedRef.current) {
      firedRef.current = true
      if (onFirstToggle) onFirstToggle()
    }
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('amanah.toggleLabel')}
            </span>
            <span
              className="text-slate-400 cursor-help"
              title={t('amanah.tooltip')}
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('amanah.description')}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleToggle}
            role="switch"
            aria-checked={isAmanah}
            tabIndex={0}
            id="amanah-toggle-btn"
            aria-label={t('amanah.toggleLabel')}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isAmanah
                ? 'bg-emerald-500 shadow-emerald-500/40 shadow-lg'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                isAmanah ? 'left-6' : 'left-0.5'
              }`}
            >
              {isAmanah
                ? <Eye className="w-2.5 h-2.5 text-emerald-600" />
                : <EyeOff className="w-2.5 h-2.5 text-slate-400" />
              }
            </span>
          </button>
          <span className={`text-xs font-medium ${isAmanah ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {isAmanah ? t('amanah.onLabel') : t('amanah.offLabel')}
          </span>
        </div>
      </div>
    </div>
  )
}
