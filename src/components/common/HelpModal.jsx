import { 
  X, Book, Target, Award, Shield, 
  BarChart2, PieChart, LineChart, Hash,
  ChevronRight, Lightbulb, Info
} from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function HelpModal({ isOpen, onClose }) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-zoom-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
              <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {t('help.title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('help.subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          
          {/* Theory Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-sm">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight italic">
                {t('help.theoryTitle')}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mean */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> {t('help.meanTitle')}
                </h4>
                <div className="bg-white/80 dark:bg-black/20 p-3 rounded-xl font-mono text-[10px] mb-3 text-center border border-blue-100/50 dark:border-blue-800/50">
                  {t('help.meanFormula')}
                </div>
                <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-400/80">
                  {t('help.meanDesc')}
                </p>
              </div>

              {/* Median */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> {t('help.medianTitle')}
                </h4>
                <div className="bg-white/80 dark:bg-black/20 p-3 rounded-xl font-mono text-[10px] mb-3 text-center border border-amber-100/50 dark:border-amber-800/50">
                  {t('help.medianFormula')}
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700/80 dark:text-amber-400/80">
                  {t('help.medianDesc')}
                </p>
              </div>

              {/* Tabayyun */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 md:col-span-2">
                <h4 className="font-bold text-rose-800 dark:text-rose-300 text-sm mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> {t('help.tabayyunTitle')}
                </h4>
                <div className="bg-white/80 dark:bg-black/20 p-3 rounded-xl font-mono text-[10px] mb-3 text-center border border-rose-100/50 dark:border-rose-800/50">
                  {t('help.tabayyunFormula')}
                </div>
                <p className="text-[11px] leading-relaxed text-rose-700/80 dark:text-rose-400/80">
                  {t('help.tabayyunDesc')}
                </p>
              </div>
            </div>
          </section>

          {/* Guide Section */}
          <section className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-sm">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight italic">
                {t('help.gamifyTitle')}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t('help.gamifyDesc')}
            </p>
            
            <div className="space-y-3">
              {(t('help.steps') || []).map((step) => (
                <div key={step.lvl} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 border-2 border-slate-200 dark:border-slate-700">
                    {step.lvl}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{step.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Tips Section */}
          <section className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-300 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight italic">
                Tips Penggunaan Mobile
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <BarChart2 className="w-4 h-4 text-violet-500" />
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                   <strong>Card View:</strong> Pada layar kecil, tabel akan berubah menjadi kartu. Tap pada angka untuk langsung mengedit.
                </p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <X className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                   <strong>Header Grid:</strong> Gunakan tombol grid di pojok kanan atas untuk mengakses semua modul dan pengaturan sistem.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-widest active:scale-95"
          >
            {t('help.footerBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
