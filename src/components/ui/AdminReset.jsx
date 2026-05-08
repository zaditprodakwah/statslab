// ============================================================
// AdminReset — Hidden reset button in footer
// Runs: localStorage.clear() then window.location.reload()
// Crucial for multi-user device testing (SUS evaluation)
// ============================================================
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function AdminReset({ onReset }) {
  const { t } = useLanguage()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = () => {
    if (onReset) onReset()
    else {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="relative">
      {/* Invisible-ish trigger — small text in footer */}
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs text-slate-300 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-500 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1"
        tabIndex={0}
        id="admin-reset-trigger"
        aria-label={t('ui.adminReset')}
        title={t('ui.adminReset')}
      >
        ⟳
      </button>

      {/* Confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t('ui.adminReset')}
        >
          <div className="glass-card p-6 max-w-sm mx-4 animate-bounce-soft">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {t('ui.adminReset')}
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {t('ui.adminResetConfirm')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1 text-sm"
                tabIndex={0}
                id="admin-reset-cancel"
              >
                {t('ui.cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                tabIndex={0}
                id="admin-reset-confirm"
              >
                {t('ui.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
