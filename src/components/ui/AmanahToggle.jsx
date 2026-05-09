import { useRef, useState, useEffect } from 'react'
import { Eye, EyeOff, Info, ChevronDown, ChevronUp, CheckCircle, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function AmanahToggle({ isAmanah, onToggle, gamify, isMissionTarget }) {
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
    setFeedback(newState ? 'Integritas Sumbu-Y: Aktif ✓' : 'Sumbu-Y Terpotong: Bias Visual ✗')
  }

  return (
    <div className={`glass-card p-5 transition-all duration-500 ${isMissionTarget ? 'ring-4 ring-emerald-500/50 animate-pulse-slow shadow-[0_0_30px_rgba(16,185,129,0.4)] border-emerald-400' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className={`w-5 h-5 ${isAmanah ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className={`text-sm font-black uppercase tracking-tight transition-colors ${isMissionTarget ? 'text-emerald-700 dark:text-emerald-400 italic' : 'text-slate-700 dark:text-slate-200'}`}>
              {t('amanah.toggleLabel')}
              {isMissionTarget && ' (MISI LEVEL 6)'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-3">
            {t('amanah.description')}
          </p>
          
          {/* MISSION INSTRUCTION BOX */}
          <div className={`p-3 rounded-xl border-2 flex gap-3 items-center animate-fade-in ${
            isLocked 
              ? 'bg-slate-100/50 border-slate-200 text-slate-500 italic opacity-75' 
              : isAmanah 
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
              : 'bg-amber-50/50 border-amber-100 text-amber-800'
          }`}>
            <div className={`p-1.5 rounded-lg ${isLocked ? 'bg-slate-200' : isAmanah ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              <Info className={`w-3.5 h-3.5 ${isLocked ? 'text-slate-400' : isAmanah ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1">
              <span className="block text-[9px] font-black uppercase tracking-widest mb-0.5">
                {isLocked ? 'Misi Terkunci' : isMissionTarget ? 'Instruksi Misi' : 'Status Integritas'}
              </span>
              <span className="text-[11px] leading-tight block font-bold">
                {isLocked 
                  ? 'Verifikasi anomali (Level 5) untuk menguji integritas visual.' 
                  : !isAmanah 
                  ? 'Matikan saklar untuk melihat manipulasi data, lalu nyalakan lagi untuk sertifikat!'
                  : 'Sumbu-Y dimulai dari Nol (0). Laporan Anda kini memenuhi standar kejujuran data.'}
              </span>
            </div>
          </div>

          {feedback && (
            <div className="mt-3 text-xs font-black text-emerald-600 dark:text-emerald-400 animate-fade-in flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {feedback}
            </div>
          )}
        </div>

        {/* Toggle Switch Panel */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => !isLocked && handleToggle()}
            role="switch"
            aria-checked={isAmanah}
            disabled={isLocked}
            tabIndex={0}
            id="amanah-toggle-btn"
            aria-label={t('amanah.toggleLabel')}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isLocked
                ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed'
                : isAmanah
                ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                isAmanah && !isLocked ? 'left-8' : 'left-1'
              }`}
            >
              {isLocked 
                ? <span className="text-[10px]">🔒</span>
                : isAmanah
                ? <Eye className="w-3 h-3 text-emerald-600" />
                : <EyeOff className="w-3 h-3 text-slate-400" />
              }
            </span>
          </button>
          <span className={`text-[10px] font-black uppercase tracking-tighter ${isLocked ? 'text-slate-400' : isAmanah ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {isLocked ? 'Terkunci' : isAmanah ? 'Jujur' : 'Manipulasi'}
          </span>
          
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="mt-1 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Educational Information Accordion */}
      {showInfo && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/10 text-xs text-slate-700 dark:text-slate-300 border-2 border-emerald-100 dark:border-emerald-800/50 animate-fade-in shadow-xl">
          <p className="font-black mb-2 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
            <CheckCircle className="w-4 h-4" /> Mengapa Integritas Sumbu-Y Penting?
          </p>
          <p className="leading-relaxed opacity-90 font-medium">
            Memotong sumbu-Y (<em>Truncated Y-Axis</em>) adalah teknik manipulasi visual yang membuat perbedaan kecil antar data terlihat sangat drastis. 
            Ini sering digunakan untuk menyesatkan audiens (<strong>Misleading Charts</strong>). 
            Nilai <strong>Amanah</strong> menuntut kita untuk menyajikan data secara proporsional. Dengan memastikan skala dimulai dari angka nol, kita memberikan konteks yang jujur bagi pembaca data.
          </p>
        </div>
      )}
    </div>
  )
}

