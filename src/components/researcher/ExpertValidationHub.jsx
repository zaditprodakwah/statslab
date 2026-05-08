import { useState, useEffect, Fragment } from 'react'
import { Printer, Save, FileCheck, Info } from 'lucide-react'
import { EXPERT_INDICATORS } from '../../data/expertIndicators'

export function ExpertValidationHub() {
  const [activeType, setActiveType] = useState('materi') // 'materi', 'media', 'agama'
  const [scores, setScores] = useState(() => {
    const saved = sessionStorage.getItem('validator_draft_scores')
    return saved ? JSON.parse(saved) : {}
  })
  const [notes, setNotes] = useState(() => {
    const saved = sessionStorage.getItem('validator_draft_notes')
    return saved ? JSON.parse(saved) : {}
  })

  // Persist drafts
  useEffect(() => {
    sessionStorage.setItem('validator_draft_scores', JSON.stringify(scores))
  }, [scores])

  useEffect(() => {
    sessionStorage.setItem('validator_draft_notes', JSON.stringify(notes))
  }, [notes])

  const handleScoreChange = (type, indicatorId, value) => {
    setScores(prev => ({
      ...prev,
      [`${type}_${indicatorId}`]: value
    }))
  }

  const handleNoteChange = (type, categoryName, value) => {
    setNotes(prev => ({
      ...prev,
      [`${type}_${categoryName}`]: value
    }))
  }

  const currentIndicators = EXPERT_INDICATORS[activeType]

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    // Already saved via useEffect, but let's provide feedback
    alert('✅ Hasil validasi berhasil disimpan ke draf sesi ini.')
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Info for Validator */}
      <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white leading-tight">Panduan Validasi Ahli</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instrumen ini bertujuan untuk mengukur validitas media (Indeks Aiken's V) berdasarkan Model Pengembangan 4D. 
              Mohon berikan skor 1 (Sangat Kurang) hingga 5 (Sangat Layak) pada setiap indikator. 
              Draf Anda akan tersimpan secara otomatis jika halaman dimuat ulang.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 no-print">
        {Object.keys(EXPERT_INDICATORS).map((key) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all border-2 ${
              activeType === key
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
          >
            {EXPERT_INDICATORS[key].title.toUpperCase()}
          </button>
        ))}
        
        <div className="flex-1" />
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition-all border border-slate-600"
        >
          <Printer className="w-4 h-4" />
          CETAK PDF (A4)
        </button>
      </div>

      {/* Validation Form */}
      <div className="space-y-10">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-white">{currentIndicators.title}</h1>
          <p className="text-slate-500">{currentIndicators.description}</p>
        </div>

        {currentIndicators.categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Aspek: {cat.name}
            </h3>
            
            <div className="grid gap-4">
              {cat.indicators.map((ind) => {
                const scoreKey = `${activeType}_${ind.id}`
                const currentScore = scores[scoreKey] || 0

                return (
                  <div key={ind.id} className="glass-card-dark p-6 border-slate-800/50 hover:border-emerald-500/50 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex gap-4 flex-1">
                        <span className="text-emerald-500/30 font-black text-2xl group-hover:text-emerald-500 transition-colors">
                          {String(ind.id).padStart(2, '0')}
                        </span>
                        <p className="text-white text-base font-bold leading-relaxed">{ind.text}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 no-print">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(activeType, ind.id, val)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                              currentScore === val
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      
                      {/* Print-only score display */}
                      <div className="hidden print:block border-2 border-black w-10 h-10 flex items-center justify-center font-bold">
                        {currentScore || ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Suggestions Textarea */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Catatan / Saran Revisi ({cat.name}):</label>
              <textarea 
                value={notes[`${activeType}_${cat.name}`] || ''}
                onChange={(e) => handleNoteChange(activeType, cat.name, e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all min-h-[120px] shadow-inner"
                placeholder="Tuliskan masukan Anda di sini..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-10 no-print">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
        >
          <Save className="w-5 h-5" />
          SIMPAN HASIL VALIDASI
        </button>
      </div>

      {/* ── Print View Template (Hidden on Screen) ────────────────── */}
      <div id="validation-print-area" className="hidden print:block bg-white text-black font-serif">
        <div className="text-center mb-10 border-b-4 border-double border-black pb-6">
          <h1 className="text-2xl font-bold uppercase leading-tight">Lembar Validasi Instrumen Penelitian</h1>
          <h2 className="text-xl font-bold uppercase mt-1">StatsLab: Dasbor Statistika Interaktif</h2>
          <p className="text-sm mt-4 italic text-gray-600">Model Pengembangan 4D (Define, Design, Develop, Disseminate)</p>
        </div>

        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="w-32 font-bold py-1">Nama Ahli</td><td>: _________________________________________________</td></tr>
              <tr><td className="w-32 font-bold py-1">Bidang Keahlian</td><td>: {currentIndicators.title.replace('Validasi ', '')}</td></tr>
              <tr><td className="w-32 font-bold py-1">Tanggal</td><td>: _________________________________________________</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm mb-6 leading-relaxed">
          <strong>Petunjuk:</strong> Berikan tanda cek (✓) atau tuliskan angka skor (1-5) pada kolom skor sesuai dengan penilaian Anda terhadap indikator yang tersedia.
          (1: Sangat Kurang, 2: Kurang, 3: Cukup, 4: Layak, 5: Sangat Layak)
        </p>

        <table className="w-full border-collapse border-2 border-black text-xs mb-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-black p-3 w-10 text-center">No</th>
              <th className="border-2 border-black p-3 text-left">Indikator Penilaian</th>
              <th className="border-2 border-black p-3 w-16 text-center">Skor</th>
            </tr>
          </thead>
          <tbody>
            {currentIndicators.categories.map((cat, cIdx) => (
              <Fragment key={`print-cat-group-${cIdx}`}>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="border-2 border-black p-2 font-bold uppercase">{cat.name}</td>
                </tr>
                {cat.indicators.map((ind) => (
                  <tr key={`print-ind-${ind.id}`}>
                    <td className="border-2 border-black p-2 text-center">{ind.id}</td>
                    <td className="border-2 border-black p-2">{ind.text}</td>
                    <td className="border-2 border-black p-2 text-center font-bold">
                      {scores[`${activeType}_${ind.id}`] || ''}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="border-2 border-black p-2 min-h-[60px]">
                    <div className="font-bold mb-1">Catatan/Saran:</div>
                    <div className="italic text-gray-700">{notes[`${activeType}_${cat.name}`] || '—'}</div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>

        <div className="mt-20 flex justify-end">
          <div className="text-center w-80">
            <p className="mb-2">________________, ________________ 2026</p>
            <p className="mb-24 font-bold">Validator Ahli,</p>
            <div className="border-b-2 border-black w-full mb-2"></div>
            <p className="text-sm font-bold">(___________________________________)</p>
            <p className="text-xs mt-1 font-bold">NIP/NIDN: __________________________</p>
          </div>
        </div>
      </div>
    </div>
  )
}
