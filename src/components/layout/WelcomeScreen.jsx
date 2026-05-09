// ============================================================
// WelcomeScreen — Onboarding Landing + Form (Gate to app)
// Collects: nama, kelas, sekolah, guru
// Enhanced: Educational landing with theory & how-it-works
// ============================================================
import { useState } from 'react'
import { BookOpen, User, School, GraduationCap, ChevronRight, Target, ShieldCheck, Award, BarChart3, Eye, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Info, Layers, ExternalLink, Scale, FileText, HelpCircle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { PremiumIcon } from '../ui/PremiumIcons'
import { FloatingAmanahOverlay } from '../ui/FloatingAmanahOverlay'

export function WelcomeScreen({ onSubmit, onOpenKnowledgeBase }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('landing') // 'landing' | 'form'
  const [form, setForm] = useState({ nama: '', kelas: '', sekolah: '', guru: '', freshStart: true })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [isAmanahOpen, setIsAmanahOpen] = useState(false)

  const fields = [
    { key: 'nama', icon: User, labelKey: 'onboarding.labelNama', placeholderKey: 'onboarding.placeholderNama', id: 'onboard-nama' },
    { key: 'kelas', icon: GraduationCap, labelKey: 'onboarding.labelKelas', placeholderKey: 'onboarding.placeholderKelas', id: 'onboard-kelas' },
    { key: 'sekolah', icon: School, labelKey: 'onboarding.labelSekolah', placeholderKey: 'onboarding.placeholderSekolah', id: 'onboard-sekolah' },
    { key: 'guru', icon: BookOpen, labelKey: 'onboarding.labelGuru', placeholderKey: 'onboarding.placeholderGuru', id: 'onboard-guru' },
  ]

  const validate = () => {
    const errs = {}
    fields.forEach(({ key }) => {
      if (!form[key].trim()) errs[key] = t('onboarding.required')
    })
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsSubmitting(true)
    setTimeout(() => onSubmit(form, form.freshStart), 300)
  }

  const levelSteps = [
    { lvl: 1, label: 'Pencari Data', theory: 'Idiosinkratik', action: 'Masuk & Lihat Data', icon: 'finder' },
    { lvl: 2, label: 'Pelapor Data', theory: 'Kolokuial', action: 'Input & Edit Tabel', icon: 'reporter' },
    { lvl: 3, label: 'Analis Junior', theory: 'Tidak Konsisten', action: 'Jelajahi 4 Modul', icon: 'analyst' },
    { lvl: 4, label: 'Detektif Data', theory: 'Konsisten Non-Kritis', action: 'Analisis Statistik', icon: 'detective' },
    { lvl: 5, label: 'Ahli Strategi', theory: 'Kritis', action: 'Verifikasi Tabayyun', icon: 'strategist' },
    { lvl: 6, label: 'Master Data', theory: 'Kritis Matematis', action: 'Integritas Amanah', icon: 'master' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {step === 'landing' ? (
        <div className="glass rounded-2xl p-6 sm:p-10 w-full max-w-4xl animate-slide-up relative z-10 border border-white/20 shadow-2xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-8 transform hover:rotate-6 transition-transform">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mb-4 leading-[1.1] tracking-tighter uppercase italic">
              {t('landing.heroTitle')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('landing.heroSubtitle')}
            </p>
            
            {/* CTA Main */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStep('form')}
                className="btn-primary flex items-center justify-center gap-3 px-10 py-5 text-xl font-black shadow-2xl shadow-emerald-500/30 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-tighter italic"
              >
                {t('landing.btnExplore')}
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 font-bold transition-colors text-sm px-4 py-2"
              >
                <HelpCircle className="w-5 h-5" />
                BAGAIMANA INI BEKERJA?
              </button>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="group bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight italic">{t('landing.feature1Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('landing.feature1Desc')}</p>
            </div>
            
            <div className="group bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight italic">{t('landing.feature2Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('landing.feature2Desc')}</p>
            </div>
            
            <div className="group bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 text-teal-600 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight italic">{t('landing.feature3Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('landing.feature3Desc')}</p>
            </div>
          </div>

          {/* Theory & Mechanism Accordion */}
          {showHowItWorks && (
            <div className="space-y-6 mb-10 animate-slide-up">
              {/* Dual Labeling Gamification Flow */}
              <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
                
                <h4 className="text-xl font-black mb-8 uppercase italic tracking-tighter flex items-center gap-3 relative z-10">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  Dual-Labeling System: Karir Statistika
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
                  {levelSteps.map((s) => (
                    <div key={s.lvl} className="flex flex-col p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all hover:scale-[1.02]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                          <PremiumIcon 
                            id={s.icon} 
                            size={28} 
                            className={
                              s.lvl === 1 ? 'text-emerald-400' :
                              s.lvl === 2 ? 'text-blue-400' :
                              s.lvl === 3 ? 'text-amber-400' :
                              s.lvl === 4 ? 'text-purple-400' :
                              s.lvl === 5 ? 'text-rose-400' :
                              'text-indigo-400'
                            }
                          />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 bg-white/10 rounded-lg text-slate-400">LVL {s.lvl}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-emerald-400 leading-none mb-1 truncate">{s.label}</p>
                        <p className="text-[9px] text-slate-400 font-medium italic mb-2 truncate">"{s.theory}"</p>
                        <p className="text-[8px] text-slate-500 leading-tight font-bold group-hover:text-slate-300 transition-colors uppercase tracking-tighter line-clamp-2 h-5">
                          {s.action}
                        </p>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${(s.lvl/6)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] text-slate-500 italic">
                    * Berdasarkan standar literasi statistik internasional <strong>Watson & Callingham (2003)</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sistem Akademik Terintegrasi</span>
                  </div>
                </div>
              </div>

              {/* Practical Knowledge Base Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-tight italic flex items-center gap-2">
                      <FileText className="w-5 h-5" /> {t('legal.knowledgeBaseTitle')}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed mb-4">
                      {t('legal.knowledgeBaseDesc')}
                    </p>
                  </div>
                  <button 
                    onClick={onOpenKnowledgeBase}
                    className="text-xs font-black text-blue-700 dark:text-blue-300 flex items-center gap-1 hover:gap-2 transition-all group"
                  >
                    BUKA PERPUSTAKAAN DIGITAL 
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                {/* Practical Amanah Test */}
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <h4 className="font-black text-emerald-800 dark:text-emerald-300 mb-2 uppercase tracking-tight italic flex items-center gap-2">
                    <Scale className="w-5 h-5" /> Uji Praktikalitas Amanah
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed mb-4">
                    Pelajari bagaimana sumbu-Y yang dipotong dapat memanipulasi persepsi publik terhadap data bantuan sosial.
                  </p>
                  <button 
                    onClick={() => setIsAmanahOpen(true)}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    COBA SIMULASI BIAS VISUAL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Legal */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('legal.tosTitle')}</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('legal.tosBody')}
              </p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('legal.disclaimerTitle')}</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('legal.disclaimerBody')}
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-[10px] text-slate-400 font-medium">
            StatsLab Research Team &copy; 2026 • Unit Pengembangan Teknologi Pendidikan
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 w-full max-w-md animate-slide-up relative z-10">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">
              {t('onboarding.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('onboarding.subtitle')}
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full tracking-wide">
              STATSLAB
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {fields.map(({ key, icon: Icon, labelKey, placeholderKey, id }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t(labelKey)}
                  <span className="text-rose-400 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id={id}
                    type="text"
                    autoFocus={key === 'nama'}
                    value={form[key]}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                      if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }))
                    }}
                    placeholder={t(placeholderKey)}
                    className={`input-field pl-9 text-sm sm:text-base ${errors[key] ? 'border-rose-400 focus:ring-rose-400' : ''}`}
                    tabIndex={0}
                    aria-required="true"
                    aria-invalid={!!errors[key]}
                    aria-describedby={errors[key] ? `${id}-error` : undefined}
                  />
                </div>
                {errors[key] && (
                  <p id={`${id}-error`} className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    ⚠ {errors[key]}
                  </p>
                )}
              </div>
            ))}

            {/* Fresh Start Option */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="fresh-start"
                checked={form.freshStart}
                onChange={(e) => setForm((p) => ({ ...p, freshStart: e.target.checked }))}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="fresh-start" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{t('onboarding.freshStart')}</span> – {t('onboarding.freshStartDesc')}
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3"
              disabled={isSubmitting}
              tabIndex={0}
              id="onboard-submit"
            >
              {isSubmitting ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <>
                  {t('onboarding.btnStart')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep('landing')}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-2 transition-colors"
            >
              {t('ui.back')}
            </button>
          </form>
        </div>
      )}
      <FloatingAmanahOverlay 
        isOpen={isAmanahOpen} 
        onClose={() => setIsAmanahOpen(false)} 
      />
    </div>
  )
}

