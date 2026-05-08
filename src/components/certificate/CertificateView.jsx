// ============================================================
// CertificateView — Bilingual A4 Certificate
// Print Area ID: #certificate-print-area
// Rendered only at Level 6
// ============================================================
import { useLanguage } from '../../hooks/useLanguage'

function formatDate(isoStr) {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export function CertificateView({ profile, gamify }) {
  const { t, lang } = useLanguage()
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const todayEn = new Date().toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const levelName = {
    id: gamify.level >= 6 ? 'Kritis Matematis (Level 6)' : `Level ${gamify.level}`,
    en: gamify.level >= 6 ? 'Critical Mathematical (Level 6)' : `Level ${gamify.level}`,
  }

  return (
    <div
      id="certificate-print-area"
      className="bg-white text-slate-900 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-double border-emerald-600 relative"
      style={{ aspectRatio: '210/297', fontFamily: 'Inter, serif' }}
    >
      {/* Decorative top strip */}
      <div className="h-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Content */}
      <div className="px-10 py-8 flex flex-col items-center text-center h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="text-4xl mb-2">🏅</div>
          <h1 className="text-3xl font-bold text-emerald-800 tracking-wide">
            {t('certificate.title')}
          </h1>
          <p className="text-base font-medium text-slate-500 italic mt-1">
            {t('certificate.subtitle')}
          </p>
          <div className="mt-3 h-0.5 w-24 bg-emerald-500 mx-auto rounded-full" />
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-1">{t('certificate.body')}</p>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{profile?.nama}</h2>
          <p className="text-sm text-slate-600">
            {t('certificate.class')}: <strong>{profile?.kelas}</strong>
          </p>
          <p className="text-sm text-slate-600">
            {t('certificate.school')}: <strong>{profile?.sekolah}</strong>
          </p>
        </div>

        {/* Achievement */}
        <div className="mb-6 px-6 py-4 bg-emerald-50 rounded-xl border border-emerald-200 w-full">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('certificate.achievement')}</p>
          <p className="font-bold text-emerald-800">{t('certificate.productName')}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <p className="text-slate-500">{t('certificate.levelAchieved')}</p>
              <p className="font-bold text-emerald-700">{levelName[lang === 'en' ? 'en' : 'id']}</p>
            </div>
            <div className="text-center border-x border-emerald-200">
              <p className="text-slate-500">{t('gamify.points')}</p>
              <p className="font-bold text-emerald-700">{gamify.points} / 150</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500">{t('certificate.badgesLabel')}</p>
              <p className="font-bold text-emerald-700">
                {gamify.badges.map((b) => b.icon).join(' ') || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 w-full mb-6">
          <div className="text-center">
            <div className="h-12 border-b border-slate-400 mb-1" />
            <p className="text-xs text-slate-600 font-medium">{profile?.guru}</p>
            <p className="text-xs text-slate-400">{t('certificate.signatureTeacher')}</p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-slate-400 mb-1" />
            <p className="text-xs text-slate-600 font-medium">Khoiruzzadittaqwa, M.</p>
            <p className="text-xs text-slate-400">{t('certificate.signatureAdmin')}</p>
          </div>
        </div>

        {/* Date & Citation */}
        <div className="mt-auto space-y-1">
          <p className="text-xs text-slate-500">
            {t('certificate.date')}: {lang === 'en' ? todayEn : today}
          </p>
          <p className="text-[10px] text-slate-400 font-arabic italic">
            Khoiruzzadittaqwa, M. (2026). StatsLab: Dasbor Statistika Interaktif (DSI) Terintegrasi Nilai Keislaman.
          </p>
        </div>
      </div>

      {/* Decorative bottom strip */}
      <div className="h-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />
    </div>
  )
}
