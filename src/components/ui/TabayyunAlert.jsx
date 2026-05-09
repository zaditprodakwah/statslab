// ============================================================
// TabayyunAlert — Anomaly Warning Banner
// Fires Lvl5 unlock on first appearance
// Has amber pulse animation (CSS: .tabayyun-alert)
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { VerificationModal } from './VerificationModal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
    mild: { bg: 'bg-yellow-50 dark:bg-yellow-900/40', border: 'border-yellow-300 dark:border-yellow-600', text: 'text-yellow-900 dark:text-yellow-100', icon: Info },
    strong: { bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-400 dark:border-amber-500', text: 'text-amber-950 dark:text-amber-50', icon: AlertTriangle },
    extreme: { bg: 'bg-red-50 dark:bg-red-900/40', border: 'border-red-400 dark:border-red-500', text: 'text-red-950 dark:text-red-50', icon: AlertTriangle },
  }
  const cfg = severityConfig[severity] || severityConfig.strong
  const Icon = cfg.icon

  const handleOpenModal = () => {
    if (!confirmed && !isLocked) {
      setIsModalOpen(true)
    }
  }

  const handleVerificationSuccess = () => {
    if (onDetected) {
      onDetected()
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <div className={`tabayyun-alert rounded-2xl border-2 transition-all duration-500 ${cfg.bg} ${cfg.border} p-5 ${isMissionTarget ? 'ring-4 ring-amber-500/50 animate-pulse-slow shadow-[0_0_30px_rgba(245,158,11,0.5)]' : !confirmed ? 'animate-pulse-slow shadow-[0_0_20px_rgba(245,158,11,0.3)]' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${severity === 'extreme' ? 'bg-red-500' : 'bg-amber-500'} flex items-center justify-center flex-shrink-0 shadow-xl animate-pulse`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
              <div className="flex flex-col">
                <h4 className={`font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] ${cfg.text}`}>
                  {t('tabayyun.title')}
                </h4>
                {!confirmed && !isLocked && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">
                      Audit Mandatori Diperlukan
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleOpenModal}
                disabled={confirmed || isLocked}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-lg transition-all border-2 ${
                  confirmed 
                    ? 'bg-emerald-500 text-white border-emerald-400 cursor-default shadow-emerald-500/20' 
                    : isLocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50'
                    : 'bg-white dark:bg-slate-800 text-amber-600 border-amber-500 hover:bg-amber-500 hover:text-white active:scale-95 hover:shadow-amber-500/40'
                }`}
              >
                {confirmed ? 'TERVERIFIKASI ✓' : isLocked ? '🔒 TERKUNCI' : 'TABAYYUN SEKARANG'}
              </button>
            </div>
            <p className={`text-sm ${cfg.text} opacity-90 leading-relaxed font-bold mb-4`}>
              {t('tabayyun.body')}
            </p>
            
            {/* MISSION CLUE PANEL */}
            <div className={`p-4 rounded-2xl border-2 flex gap-4 items-start animate-fade-in ${
              isLocked 
                ? 'bg-slate-100/50 border-slate-200 text-slate-500 italic' 
                : confirmed
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                : 'bg-white/80 border-amber-200 text-amber-800 shadow-sm ring-1 ring-amber-100'
            }`}>
              <div className={`p-2 rounded-xl ${isLocked ? 'bg-slate-200' : confirmed ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                {isLocked ? <Info className="w-4 h-4" /> : confirmed ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-amber-600" />}
              </div>
              <div className="flex-1">
                <span className="block text-[10px] font-black uppercase tracking-widest mb-1">
                  {isLocked ? 'Status Misi: Terkunci' : confirmed ? 'Status Misi: Selesai' : 'Instruksi Misi Level 4'}
                </span>
                <span className="text-xs leading-relaxed block font-medium">
                  {isLocked 
                    ? 'Selesaikan Level 1-3 dengan mengedit data dan mengeksplorasi modul untuk membuka fitur Tabayyun ini.' 
                    : !confirmed 
                    ? 'Klik tombol di atas untuk membuka MODAL VERIFIKASI. Anda harus menjawab tantangan analisis untuk mengonfirmasi anomali ini.'
                    : 'Anomali telah dikonfirmasi melalui proses Tabayyun yang valid. Anda telah menunjukkan integritas data.'}
                </span>
              </div>
            </div>

            {/* Evidence Formula */}
            <div className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-black/30 font-mono text-[11px] border border-black/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Bukti Matematis:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">ANOMALI TERDETEKSI</span>
              </div>
              <div className="text-slate-800 dark:text-slate-100 font-black">
                |Mean({mean?.toLocaleString('id-ID')}) − Median({median?.toLocaleString('id-ID')})| = {diff?.toLocaleString('id-ID')} &gt; {threshold?.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                🔍 {t('tabayyun.found')}
              </div>
              <button 
                onClick={() => setShowTheory(!showTheory)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 flex items-center gap-1 transition-all hover:translate-x-1"
              >
                <Info className="w-4 h-4" />
                Edukasi Statistika
                {showTheory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showTheory && (
              <div className="mt-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-300 border-2 border-emerald-100 dark:border-emerald-900/50 animate-fade-in shadow-xl">
                <p className="font-black mb-2 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4" /> Landasan Teori Tabayyun Data
                </p>
                <p className="leading-relaxed opacity-90 font-medium">
                  Dalam statistika, rata-rata (<strong>Mean</strong>) sangat dipengaruhi oleh nilai pencilan (<em>outliers</em>), sementara <strong>Median</strong> tetap stabil. 
                  Jika selisih keduanya melampaui <strong>Threshold</strong>, data tersebut dianggap "miring" atau tidak simetris. 
                  Secara etika (<strong>Tabayyun</strong>), ini menuntut kita untuk memverifikasi apakah angka tersebut benar-benar valid atau hasil dari kesalahan input/manipulasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleVerificationSuccess}
        anomalyDetails={{
          mean,
          median,
          diff,
          threshold
        }}
      />
    </>
  )
}

