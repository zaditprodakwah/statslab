// ============================================================
// WelcomeScreen — Onboarding Landing + Form (Gate to app)
// Collects: nama, kelas, sekolah, guru
// Enhanced: Educational landing with theory & how-it-works
// ============================================================
import { useState } from 'react'
import { BookOpen, User, School, GraduationCap, ChevronRight, Target, ShieldCheck, Award, BarChart3, Eye, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Info, Layers } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function WelcomeScreen({ onSubmit }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('landing') // 'landing' | 'form'
  const [form, setForm] = useState({ nama: '', kelas: '', sekolah: '', guru: '', freshStart: true })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

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

  const levelSteps = [
    { lvl: 1, label: 'Idiosinkratik', action: 'Masuk ke portal & lihat data awal', icon: '🔰' },
    { lvl: 2, label: 'Kolokuial', action: 'Edit angka pada tabel data', icon: '✏️' },
    { lvl: 3, label: 'Tidak Konsisten', action: 'Jelajahi modul berbeda (Tahfizh/Qurban/Literasi)', icon: '🧭' },
    { lvl: 4, label: 'Konsisten Non-Kritis', action: 'Klik kartu statistik (Mean/Median/Modus)', icon: '📊' },
    { lvl: 5, label: 'Kritis', action: 'Konfirmasi temuan anomali data (Tabayyun)', icon: '🔍' },
    { lvl: 6, label: 'Kritis Matematis', action: 'Toggle Skala Amanah & Bias (kedua arah)', icon: '🏆' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {step === 'landing' ? (
        <div className="glass rounded-2xl p-8 w-full max-w-3xl animate-slide-up relative z-10">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 leading-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 mb-2 max-w-xl mx-auto leading-relaxed">
              {t('landing.heroSubtitle')}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Aplikasi ini dirancang sebagai media pembelajaran interaktif untuk memahami konsep statistika deskriptif (Mean, Median, Modus) melalui konteks filantropi Islam yang nyata.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-left">
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
              <Target className="w-6 h-6 text-emerald-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature1Title')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('landing.feature1Desc')}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-teal-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature2Title')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('landing.feature2Desc')}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30 shadow-sm">
              <Award className="w-6 h-6 text-sky-500 mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t('landing.feature3Title')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('landing.feature3Desc')}</p>
            </div>
          </div>

          {/* How It Works Accordion */}
          <div className="mb-6">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-bold">Cara Kerja & Teori Statistika</span>
              </div>
              {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showHowItWorks && (
              <div className="mt-3 space-y-4 animate-fade-in">
                {/* Theory Section */}
                <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Teori Statistika Deskriptif
                  </h4>
                  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">📐 Mean (Rata-rata)</p>
                      <p>Rumus: <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-xs">x̄ = Σxᵢ / n</code></p>
                      <p className="mt-1 opacity-80">Menjumlahkan semua nilai lalu dibagi jumlah data. Sensitif terhadap nilai ekstrem (outlier).</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">📊 Median (Nilai Tengah)</p>
                      <p>Data diurutkan, lalu diambil nilai tengah. Jika data genap: <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-xs">Me = (x[n/2] + x[n/2+1]) / 2</code></p>
                      <p className="mt-1 opacity-80">Lebih kebal (robust) terhadap outlier dibanding Mean.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-50/80 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                      <p className="font-semibold text-violet-800 dark:text-violet-300 mb-1">📈 Modus (Nilai Terbanyak)</p>
                      <p>Nilai yang paling sering muncul dalam kumpulan data. Bisa lebih dari satu (bimodal/multimodal).</p>
                    </div>
                  </div>
                </div>

                {/* Detection Logic */}
                <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Deteksi Anomali Data (Tabayyun)
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                    <p>
                      Aplikasi ini secara otomatis mendeteksi <strong>anomali data</strong> menggunakan rumus perbandingan Mean dan Median:
                    </p>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 font-mono text-center border border-amber-200 dark:border-amber-800">
                      <span className="text-amber-800 dark:text-amber-200 font-bold text-base">|Mean − Median| &gt; Median × 0.3</span>
                    </div>
                    <p>
                      Jika kondisi di atas terpenuhi, berarti terdapat nilai pencilan (<em>outlier</em>) yang menyebabkan distribusi data menjadi miring (<em>skewed</em>). Konsep <strong>Tabayyun</strong> (QS. Al-Hujurat: 6) mengajarkan kita untuk memverifikasi informasi sebelum menyimpulkan.
                    </p>
                  </div>
                </div>

                {/* Visual Integrity */}
                <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-500" />
                    Integritas Visual (Amanah)
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                    <p>
                      Grafik yang sumbu-Y nya tidak dimulai dari nol dapat menciptakan <strong>ilusi perbedaan besar</strong> padahal sebenarnya kecil. Ini disebut <em>Misleading Graph</em> atau <em>Truncated Y-Axis</em>.
                    </p>
                    <p>
                      Fitur <strong>Skala Amanah</strong> memungkinkan pengguna membuktikan sendiri efek manipulasi visual ini dengan menyalakan/mematikan skala Y dari nol. Konsep Amanah mengajarkan kejujuran dalam penyajian data.
                    </p>
                  </div>
                </div>

                {/* Level Progression */}
                <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Alur Gamifikasi (6 Level Sekuensial)
                  </h4>
                  <div className="space-y-2">
                    {levelSteps.map((s) => (
                      <div key={s.lvl} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-black shadow">
                          {s.lvl}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {s.icon} {s.label}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{s.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
                    Setiap level harus dicapai secara berurutan. Sertifikat digital hanya dapat dicetak setelah menyelesaikan seluruh 6 level.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setStep('form')}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              {t('landing.btnExplore')}
              <ChevronRight className="w-5 h-5" />
            </button>
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

