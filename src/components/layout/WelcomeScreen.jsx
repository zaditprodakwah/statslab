// ============================================================
// WelcomeScreen — Onboarding Form (Gate to app)
// Collects: nama, kelas, sekolah, guru
// Fires when no profile in localStorage
// ============================================================
import { useState } from 'react'
import { BookOpen, User, School, GraduationCap, ChevronRight, Target, ShieldCheck, Award } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function WelcomeScreen({ onSubmit }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('landing') // 'landing' | 'form'
  const [form, setForm] = useState({ nama: '', kelas: '', sekolah: '', guru: '', freshStart: true })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setTimeout(() => onSubmit(form), 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {step === 'landing' ? (
        <div className="glass rounded-2xl p-8 w-full max-w-2xl animate-slide-up relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto">
            {t('landing.heroSubtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
              <Target className="w-6 h-6 text-emerald-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature1Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('landing.feature1Desc')}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-teal-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature2Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('landing.feature2Desc')}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30 shadow-sm">
              <Award className="w-6 h-6 text-sky-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature3Title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('landing.feature3Desc')}</p>
            </div>
          </div>

          <button
            onClick={() => setStep('form')}
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300"
          >
            {t('landing.btnExplore')}
            <ChevronRight className="w-5 h-5" />
          </button>
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
                    value={form[key]}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                      if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }))
                    }}
                    placeholder={t(placeholderKey)}
                    className={`input-field pl-9 ${errors[key] ? 'border-rose-400 focus:ring-rose-400' : ''}`}
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
    </div>
  )
}

