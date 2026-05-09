// ============================================================
// CertificateView — Premium Bilingual A4 Certificate
// Print Area ID: #certificate-print-area
// Features: Watson-Callingham Transcript & Researcher Notes
// ============================================================
import { useLanguage } from '../../hooks/useLanguage'

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

  const transcript = [
    { lvl: 1, name: t('gamify.watsonCallingham.lvl1Name'), desc: t('gamify.watsonCallingham.lvl1Desc') },
    { lvl: 2, name: t('gamify.watsonCallingham.lvl2Name'), desc: t('gamify.watsonCallingham.lvl2Desc') },
    { lvl: 3, name: t('gamify.watsonCallingham.lvl3Name'), desc: t('gamify.watsonCallingham.lvl3Desc') },
    { lvl: 4, name: t('gamify.watsonCallingham.lvl4Name'), desc: t('gamify.watsonCallingham.lvl4Desc') },
    { lvl: 5, name: t('gamify.watsonCallingham.lvl5Name'), desc: t('gamify.watsonCallingham.lvl5Desc') },
    { lvl: 6, name: t('gamify.watsonCallingham.lvl6Name'), desc: t('gamify.watsonCallingham.lvl6Desc') },
  ]

  return (
    <div id="certificate-print-area" className="flex flex-col gap-8 print:gap-0">
      {/* PAGE 1: MAIN CERTIFICATE */}
      <div
        className="bg-white text-slate-900 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-8 border-double border-emerald-600 relative p-1"
        style={{ aspectRatio: '210/297', fontFamily: 'Inter, serif' }}
      >
        {/* Background Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="text-[20rem] font-bold rotate-[-35deg] whitespace-nowrap select-none">
            STATSLAB STATSLAB STATSLAB
          </div>
        </div>

        <div className="border-2 border-emerald-100 h-full w-full rounded-xl flex flex-col items-center text-center px-10 py-12 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white text-4xl shadow-lg border-4 border-white mx-auto mb-4">
              🏆
            </div>
            <h1 className="text-4xl font-black text-emerald-900 tracking-tighter uppercase">
              {t('certificate.title')}
            </h1>
            <p className="text-lg font-medium text-slate-500 italic mt-2">
              {t('certificate.subtitle')}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-emerald-300" />
              <span className="text-[10px] text-emerald-600 font-bold tracking-[0.2em] uppercase">StatsLab Academic Research</span>
              <div className="h-[1px] w-12 bg-emerald-300" />
            </div>
          </div>

          {/* Recipient */}
          <div className="mb-10 space-y-2">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">{t('certificate.body')}</p>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight underline decoration-emerald-200 decoration-8 underline-offset-[-4px]">
              {profile?.nama}
            </h2>
            <div className="flex justify-center gap-6 mt-4 text-sm text-slate-600">
              <p><strong>{t('certificate.class')}:</strong> {profile?.kelas}</p>
              <div className="w-[1px] bg-slate-300" />
              <p><strong>{t('certificate.school')}:</strong> {profile?.sekolah}</p>
            </div>
          </div>

          {/* Achievement Details */}
          <div className="mb-10 w-full">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 shadow-sm">
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest mb-3">
                {t('certificate.achievement')}
              </p>
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {t('certificate.productName')}
              </h3>
              
              <div className="grid grid-cols-3 gap-4 border-t border-emerald-200/50 pt-5">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('certificate.levelAchieved')}</p>
                  <p className="text-sm font-black text-emerald-800">{levelName[lang === 'en' ? 'en' : 'id']}</p>
                </div>
                <div className="space-y-1 border-x border-emerald-200/50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('gamify.points')}</p>
                  <p className="text-sm font-black text-emerald-800">{gamify.points} / 150</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('certificate.badgesLabel')}</p>
                  <div className="flex justify-center gap-1 text-xl">
                    {gamify.badges.map((b) => (
                      <span key={b.id} title={t(b.key)}>{b.icon}</span>
                    )) || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-auto grid grid-cols-2 gap-16 w-full px-4">
            <div className="text-center">
              <div className="h-16 flex items-center justify-center">
                <p className="font-serif italic text-slate-300 text-sm opacity-50">E-Signature</p>
              </div>
              <div className="border-b-2 border-slate-900 mb-1" />
              <p className="text-sm font-bold text-slate-900">{profile?.guru}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('certificate.signatureTeacher')}</p>
            </div>
            <div className="text-center">
              <div className="h-16 flex items-center justify-center">
                <div className="relative">
                   <div className="absolute -top-6 -left-6 w-20 h-20 border-2 border-emerald-600/20 rounded-full flex items-center justify-center rotate-12 opacity-50">
                      <p className="text-[8px] font-bold text-emerald-700 leading-none">VALIDATED<br/>STATSLAB</p>
                   </div>
                   <p className="font-serif italic text-emerald-800 text-sm">Khoiruzzadittaqwa</p>
                </div>
              </div>
              <div className="border-b-2 border-slate-900 mb-1" />
              <p className="text-sm font-bold text-slate-900">Khoiruzzadittaqwa, M.</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t('certificate.signatureAdmin')}</p>
            </div>
          </div>

          {/* Footer Citation */}
          <div className="mt-12 text-[9px] text-slate-400 font-medium text-center">
             <p>{t('certificate.date')}: {lang === 'en' ? todayEn : today}</p>
             <p className="mt-1 opacity-60">© 2026 StatsLab Research Project. Licensed for Academic Purposes only.</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: TRANSCRIPT & ACADEMIC NOTES */}
      <div
        className="bg-white text-slate-900 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 relative p-8 flex flex-col break-before-page"
        style={{ aspectRatio: '210/297', fontFamily: 'Inter, sans-serif' }}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Academic Transcript</h3>
            <p className="text-sm text-slate-500">Transkrip Capaian Literasi Statistik</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-400">ID: SL-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
             <p className="text-[10px] font-bold text-slate-400">{profile?.nama}</p>
          </div>
        </div>

        {/* Watson-Callingham Table */}
        <div className="mb-10 flex-grow">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full" />
             {t('gamify.watsonCallingham.title')}
          </h4>
          <table className="w-full text-left border-collapse border border-slate-100 rounded-lg overflow-hidden">
             <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider">
                   <th className="p-3 border-b border-slate-100">Level</th>
                   <th className="p-3 border-b border-slate-100">Kompetensi (Competency)</th>
                   <th className="p-3 border-b border-slate-100 w-2/3">Deskripsi Kemampuan</th>
                </tr>
             </thead>
             <tbody>
                {transcript.map((item) => (
                   <tr key={item.lvl} className={`text-xs ${gamify.level === item.lvl ? 'bg-emerald-50 font-medium' : 'text-slate-600'}`}>
                      <td className="p-3 border-b border-slate-50">
                         <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${gamify.level === item.lvl ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {item.lvl}
                         </span>
                      </td>
                      <td className={`p-3 border-b border-slate-50 ${gamify.level === item.lvl ? 'text-emerald-900 font-bold' : ''}`}>
                         {item.name}
                      </td>
                      <td className="p-3 border-b border-slate-50 text-[10px] leading-relaxed italic">
                         {item.desc}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>

        {/* Researcher's Notes */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              📝 Researcher's Strategic Notes
           </h4>
           <div className="space-y-4 text-[11px] leading-relaxed text-slate-600">
              <p>
                 Siswa telah menunjukkan kemampuan luar biasa dalam menggunakan instrumen <strong>StatsLab</strong> untuk mengidentifikasi <em>anomali data</em> melalui prinsip <strong>Tabayyun</strong>. Capaian Level {gamify.level} mengindikasikan bahwa siswa tidak hanya mampu menghitung rata-rata (Mean) dan nilai tengah (Median), tetapi juga memiliki kesadaran kritis terhadap validitas visual (<strong>Amanah</strong>).
              </p>
              <p>
                 <strong>Rekomendasi Lanjutan:</strong> Untuk mempertahankan level <em>Critical Mathematical</em>, siswa disarankan untuk mengeksplorasi dataset dunia nyata yang lebih kompleks dan menggunakan nilai-nilai Islam (Tawazun) sebagai landasan dalam interpretasi data filantropi.
              </p>
           </div>
        </div>

        <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-100">
           <div className="text-[10px] text-slate-400">
              <p className="font-bold text-slate-500">StatsLab Research Ecosystem</p>
              <p>Khoiruzzadittaqwa, M. (2026). Dasbor Statistika Interaktif.</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-800">AUTHENTIC ACADEMIC RECORD</p>
              <p className="text-[9px] text-slate-400 italic">Terverifikasi secara digital oleh sistem StatsLab</p>
           </div>
        </div>
      </div>
    </div>
  )
}
