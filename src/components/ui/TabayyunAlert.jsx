// ============================================================
// TabayyunAlert — Anomaly Warning Banner
// Fires Lvl5 unlock on first appearance
// Has amber pulse animation (CSS: .tabayyun-alert)
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function TabayyunAlert({ 
  isAnomalous, 
  mean, 
  median, 
  diff, 
  threshold, 
  severity, 
  onDetected,
  externalConfirmed = false,
  gamify,
  isMissionTarget
}) {
  const { t } = useLanguage()
  const [showTheory, setShowTheory] = useState(false)
  
  // Requirement: Must be at least Level 4 to unlock Level 5
  const isLocked = gamify && gamify.level < 4
  const canUnlockNow = gamify && gamify.canUnlock(5)
  
  // Local confirmed state is synced with prop but allows immediate UI feedback
  const confirmed = externalConfirmed

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
    <div className={`tabayyun-alert rounded-xl border-2 transition-all duration-500 ${cfg.bg} ${cfg.border} p-4 ${isMissionTarget ? 'ring-4 ring-amber-500/50 animate-pulse-slow shadow-[0_0_25px_rgba(245,158,11,0.4)]' : !confirmed ? 'animate-pulse-slow shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${severity === 'extreme' ? 'bg-red-500' : 'bg-amber-500'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex flex-col">
              <h4 className={`font-black text-xs uppercase tracking-widest ${cfg.text}`}>
                {t('tabayyun.title')}
              </h4>
              {!confirmed && !isLocked && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                  ⚠️ BUTUH AUDIT SEGERA
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (!confirmed && onDetected && !isLocked) {
                  onDetected()
                }
              }}
              disabled={confirmed || isLocked}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-md transition-all border-2 ${
                confirmed 
                  ? 'bg-emerald-500 text-white border-emerald-400 cursor-default' 
                  : isLocked
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-white dark:bg-slate-800 text-amber-600 border-amber-500 hover:bg-amber-500 hover:text-white active:scale-95'
              }`}
            >
              {confirmed ? 'TERVERIFIKASI ✓' : isLocked ? '🔒 TERKUNCI' : 'TABAYYUN SEKARANG'}
            </button>
          </div>
          <p className={`text-sm ${cfg.text} opacity-90 leading-relaxed font-medium`}>
            {t('tabayyun.body')}
          </p>
          
          {/* EXPERT CLUE / MISSION HINT */}
          <div className={`mt-3 p-3 rounded-xl border flex gap-3 items-start animate-fade-in ${
            isLocked 
              ? 'bg-slate-100/50 border-slate-200 text-slate-500 italic' 
              : 'bg-white/80 border-amber-200 text-amber-800 shadow-sm'
          }`}>
            <div className={`p-1.5 rounded-lg ${isLocked ? 'bg-slate-200' : 'bg-amber-100'}`}>
              {isLocked ? <Info className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-widest mb-0.5">
                {isLocked ? 'Petunjuk Terkunci' : 'Instruksi Ahli (Level 4)'}
              </span>
              <span className="text-[11px] leading-tight block">
                {isLocked 
                  ? 'Selesaikan Level 1-4 dengan mengedit data dan mengeksplorasi modul untuk membuka fitur Konfirmasi Tabayyun ini.' 
                  : !confirmed 
                  ? 'Klik tombol "TABAYYUN SEKARANG" untuk memverifikasi anomali ini. Tindakan ini akan membuka Level 5 (Detektif Data).'
                  : 'Anomali telah dikonfirmasi. Anda telah memenuhi syarat integritas data sebagai Peneliti Ahli.'}
              </span>
            </div>
          </div>
          {/* Formula Evidence */}
          <div className="mt-3 p-2.5 rounded-lg bg-white/60 dark:bg-black/20 font-mono text-xs space-y-1">
            <div className="text-slate-600 dark:text-slate-300">
              {t('tabayyun.formula')}
            </div>
            <div className="text-slate-700 dark:text-slate-200 font-semibold">
              |{mean?.toLocaleString('id-ID')} − {median?.toLocaleString('id-ID')}| = {diff?.toLocaleString('id-ID')} &gt; {threshold?.toLocaleString('id-ID')} ✓
            </div>
          </div>
          {/* Tabayyun badge & Theory Toggle */}
          <div className="mt-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              🔍 {t('tabayyun.badge')} {t('tabayyun.found')}
            </div>
            <button 
              onClick={() => setShowTheory(!showTheory)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Edukasi Teori
              {showTheory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Theory Expanded Content */}
          {showTheory && (
            <div className="mt-3 p-3 rounded-lg bg-white/80 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-fade-in shadow-inner">
              <p className="font-semibold mb-1 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Kenapa kita pakai selisih Mean & Median?
              </p>
              <p className="leading-relaxed opacity-90">
                Dalam ilmu statistika deskriptif, rata-rata (<strong>Mean</strong>) sangat sensitif terhadap nilai ekstrem (<em>outlier</em>), sedangkan nilai tengah (<strong>Median</strong>) lebih kebal (<em>robust</em>). 
                Jika selisih absolut antara Mean dan Median sangat besar melebihi batas kewajaran (<strong>Threshold</strong>), itu adalah indikasi kuat adanya anomali atau data pencilan yang menarik kurva distribusi menjadi miring (<em>skewed</em>). 
                Konsep <strong>Tabayyun</strong> di sini mengajarkan auditor untuk tidak langsung percaya pada ringkasan data, melainkan meneliti kembali data mentah yang menyebabkan kemiringan tersebut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
