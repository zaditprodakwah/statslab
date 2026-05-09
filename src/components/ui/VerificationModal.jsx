import React, { useState, useEffect } from 'react'
import { CheckCircle, ShieldAlert, X, HelpCircle, ArrowRight, MessageSquareQuote } from 'lucide-react'

export function VerificationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  moduleInfo, 
  anomalyDetails 
}) {
  const [step, setStep] = useState(1) // 1: Analysis, 2: Challenge, 3: Success
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setAnswer('')
      setIsCorrect(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => setStep(2)
  
  const checkAnswer = () => {
    // Basic educational challenge logic
    // For now, any thoughtful answer or just confirming works, 
    // but we can make it specific to the module's theory
    if (answer.length > 10) {
      setIsCorrect(true)
      setTimeout(() => setStep(3), 1500)
    } else {
      setIsCorrect(false)
    }
  }

  const handleFinish = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-in">
        
        {/* Header Decoration */}
        <div className={`h-2 w-full ${step === 3 ? 'bg-emerald-500' : 'bg-amber-500'} transition-colors duration-500`} />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10">
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tighter italic">
                    Proses Tabayyun
                  </h2>
                  <p className="text-amber-600 dark:text-amber-400 font-bold text-sm tracking-wide">
                    AUDIT VERIFIKASI DATA
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Temuan Anomali:</p>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-black">MEAN (RATA-RATA)</p>
                    <p className="text-lg font-black text-rose-500">{anomalyDetails.mean}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-slate-400 font-black">MEDIAN (TENGAH)</p>
                    <p className="text-lg font-black text-blue-500">{anomalyDetails.median}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 italic">
                  "Ada selisih sebesar <strong>{anomalyDetails.diff}</strong> dari ambang batas normal. Ini menunjukkan adanya data yang tidak wajar (Outlier)."
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                  Sebagai auditor, Anda harus memverifikasi apakah lonjakan data ini valid atau merupakan kesalahan input.
                </p>
                <button 
                  onClick={handleNext}
                  className="w-full py-4 bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 group transition-all active:scale-95 shadow-xl shadow-slate-900/20"
                >
                  MULAI ANALISIS
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tighter italic">
                    Tantangan Audit
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide">
                    LOGIKA STATISTIKA
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    "Mengapa perbedaan besar antara Mean dan Median dianggap sebagai sinyal anomali dalam audit distribusi dana?"
                  </p>
                </div>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Ketik analisis Anda di sini (min. 10 karakter)..."
                  className={`w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 transition-all focus:outline-none min-h-[120px] text-slate-700 dark:text-slate-200 font-medium ${
                    isCorrect === false ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
                
                {isCorrect === false && (
                  <p className="text-xs font-bold text-rose-500 animate-shake">
                    Analisis terlalu singkat! Berikan penjelasan yang lebih mendalam.
                  </p>
                )}

                <button 
                  onClick={checkAnswer}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-600/30"
                >
                  KONFIRMASI HASIL AUDIT
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 py-4 text-center animate-bounce-in">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                  Tabayyun Selesai!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Anda telah menerapkan nilai integritas dalam memproses data.
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-4 text-left">
                <MessageSquareQuote className="w-10 h-10 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold italic">
                  "Wahai orang-orang yang beriman, jika datang kepadamu orang fasik membawa suatu berita, maka periksalah dengan teliti (Tabayyun)..." (QS. Al-Hujurat: 6)
                </p>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-600/30"
              >
                LANJUTKAN MISI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
