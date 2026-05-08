// ============================================================
// AmanahToggle — Y-Axis Visual Integrity Switch
// Fires Lvl6 unlock on first toggle
// ============================================================
import { useRef, useState, useEffect } from 'react'
import { Eye, EyeOff, Info, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function AmanahToggle({ isAmanah, onToggle, gamify }) {
  const { t } = useLanguage()
  const [showInfo, setShowInfo] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Requirement: Must be at least Level 5 to unlock Level 6
  const isLocked = gamify && gamify.level < 5
  const canUnlockNow = gamify && gamify.canUnlock(6)

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleToggle = () => {
    onToggle()
    const newState = !isAmanah
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
            {isLocked && (
              <span className="block mt-1 text-[10px] font-bold italic opacity-75 text-amber-600 dark:text-amber-400">
                🔒 Selesaikan Level 5 (Tabayyun) untuk membuka fitur ini.
              </span>
            )}
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
            onClick={() => !isLocked && handleToggle()}
            role="switch"
            aria-checked={isAmanah}
            disabled={isLocked}
            tabIndex={0}
            id="amanah-toggle-btn"
            aria-label={t('amanah.toggleLabel')}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isLocked
                ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed grayscale'
                : isAmanah
                ? 'bg-emerald-500 shadow-emerald-500/40 shadow-lg'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                isAmanah && !isLocked ? 'left-6' : 'left-0.5'
              }`}
            >
              {isLocked 
                ? <span className="text-[10px]">🔒</span>
                : isAmanah
                ? <Eye className="w-2.5 h-2.5 text-emerald-600" />
                : <EyeOff className="w-2.5 h-2.5 text-slate-400" />
              }
            </span>
          </button>
          <span className={`text-xs font-medium ${isLocked ? 'text-slate-400' : isAmanah ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {isLocked ? 'Terkunci' : isAmanah ? t('amanah.onLabel') : t('amanah.offLabel')}
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
