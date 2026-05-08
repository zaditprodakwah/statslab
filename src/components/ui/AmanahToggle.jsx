// ============================================================
// AmanahToggle — Y-Axis Visual Integrity Switch
// Fires Lvl6 unlock on first toggle
// ============================================================
import { useRef, useState, useEffect } from 'react'
import { Eye, EyeOff, Info, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function AmanahToggle({ isAmanah, onToggle, onFirstToggle }) {
  const { t } = useLanguage()
  const firedRef = useRef(false)
  const statesSeen = useRef(new Set())
  const [showInfo, setShowInfo] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

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
    
    // Set feedback text based on the new state
    setFeedback(newState ? 'Skala Integritas (Y=0) Aktif ✓' : 'Skala Bias Aktif ✗')
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('amanah.toggleLabel')}
            </span>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              title="Penjelasan Edukatif"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('amanah.description')}
          </p>
          
          {feedback && (
            <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
              {feedback}
            </div>
          )}
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

      {/* Educational Information Accordion */}
      {showInfo && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs text-slate-700 dark:text-slate-300 border border-emerald-100 dark:border-emerald-800 animate-fade-in shadow-inner">
          <p className="font-semibold mb-1 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Kenapa sumbu-Y harus dimulai dari Nol (0)?
          </p>
          <p className="leading-relaxed opacity-90">
            Dalam visualisasi data (seperti grafik batang), memotong sumbu-Y sehingga tidak dimulai dari angka nol adalah teknik yang sering disalahgunakan (<strong>Misleading Graphs</strong>). 
            Pemotongan sumbu-Y melebih-lebihkan perbedaan kecil antar kategori seolah-olah perbedaannya sangat besar dan dramatis. 
            Nilai <strong>Amanah</strong> menuntut kita untuk menyajikan data secara jujur, utuh, dan proporsional. Dengan menekan tombol ini, grafik akan diperbaiki ke skala yang sebenarnya, mengembalikan integritas visual agar audiens tidak tertipu oleh ilusi optik data.
          </p>
        </div>
      )}
    </div>
  )
}
