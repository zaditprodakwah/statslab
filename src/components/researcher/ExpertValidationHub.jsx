import { useState, useEffect, Fragment } from 'react'
import { Printer, Save, FileCheck, Info, ShieldCheck, Target, ChevronUp, AlertCircle } from 'lucide-react'
import { EXPERT_INDICATORS } from '../../data/expertIndicators'
import { useLanguage } from '../../hooks/useLanguage'

export function ExpertValidationHub({ gamify = { level: 1 } }) {
  const { t, language } = useLanguage()
  const [activeType, setActiveType] = useState('materi') // 'materi', 'media', 'agama'
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('validator_draft_scores')
    return saved ? JSON.parse(saved) : {}
  })
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('validator_draft_notes')
    return saved ? JSON.parse(saved) : {}
  })

  // Persist drafts
  useEffect(() => {
    localStorage.setItem('validator_draft_scores', JSON.stringify(scores))
  }, [scores])

  useEffect(() => {
    localStorage.setItem('validator_draft_notes', JSON.stringify(notes))
  }, [notes])

  const handleScoreChange = (type, indicatorId, value) => {
    setScores(prev => ({
      ...prev,
      [`${type}_${indicatorId}`]: value
    }))
  }

  const handleNoteChange = (type, categoryId, value) => {
    setNotes(prev => ({
      ...prev,
      [`${type}_${categoryId}`]: value
    }))
  }

  const currentIndicators = EXPERT_INDICATORS[activeType] || EXPERT_INDICATORS.materi

  const handlePrint = () => {
    window.print()
  }

  const [saveStatus, setSaveStatus] = useState('idle') // 'idle', 'saving', 'saved'

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      console.log('Validation results saved to local storage:', { scores, notes })
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 1000)
  }

  const isSaving = saveStatus === 'saving'
  const progress = (Object.keys(scores).filter(k => k.startsWith(activeType)).length / 
                   currentIndicators.categories.reduce((acc, c) => acc + c.indicators.length, 0)) * 100

  return (
    <>
    {/* ── Web View Template ────────────────────────────────── */}
    <div className="space-y-10 animate-fade-in pb-32 print:hidden">
      {/* Header Info for Validator */}
      <div className="glass-card p-10 border-emerald-500/40 bg-slate-900/40 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck className="w-40 h-40 text-emerald-500" />
        </div>
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-emerald-500/30">
            <Info className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white leading-tight tracking-tight uppercase italic flex items-center gap-3">
              {t('researcher.hubTitle')}
              <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black rounded-lg not-italic tracking-widest">
                {t('researcher.hubBadge')}
              </span>
            </h2>
            <div className="text-slate-200 text-lg leading-relaxed font-medium max-w-3xl">
               {t('researcher.hubDesc')}
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING STATUS BAR (NEW) ────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
        {/* Saving Indicator */}
        {isSaving && (
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-3 animate-slide-up pointer-events-auto">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-black tracking-widest text-slate-600 dark:text-slate-400 uppercase">
              {t('researcher.saveProcessing')}
            </span>
          </div>
        )}

        {/* Progress Floating Card */}
        <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl text-white dark:text-slate-900 shadow-2xl rounded-2xl p-4 min-w-[240px] border border-white/10 dark:border-slate-200 animate-slide-up pointer-events-auto">
          
          {/* ACTIVE MISSION CLUE */}
          <div className="mb-4 bg-black/20 rounded-2xl p-3 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg animate-bounce-slow">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5">
                  MISI AKTIF (LVL {gamify.level})
                </span>
                <p className="text-white text-xs font-bold truncate animate-pulse">
                  {t(`missions.lvl${gamify.level}`)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                {t('researcher.progressLabel')}
              </span>
              <span className="text-lg font-black leading-none">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
              <FileCheck className={`w-6 h-6 ${progress === 100 ? 'text-emerald-400 dark:text-emerald-600' : 'text-white/20 dark:text-slate-900/20'}`} />
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 dark:bg-slate-900/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 ${saveStatus === 'saved' ? 'bg-blue-500' : 'bg-emerald-500'} hover:opacity-90 disabled:opacity-50 text-slate-900 font-black text-[10px] py-2 rounded-lg uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2`}
            >
              {saveStatus === 'saved' ? (
                <>
                  <FileCheck className="w-3 h-3" />
                  {t('researcher.saveSuccess')}
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  {isSaving ? t('researcher.saveProcessing') : t('researcher.btnSave')}
                </>
              )}
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 rounded-lg transition-all"
              title="Ke Atas"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 rounded-lg transition-all"
              title={t('researcher.btnPrint')}
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-4 no-print bg-slate-900/50 p-2 rounded-[2.5rem] border border-slate-800">
        {Object.keys(EXPERT_INDICATORS).map((key) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`px-10 py-5 rounded-[2rem] font-black text-sm transition-all border-2 ${
              activeType === key
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-2xl shadow-emerald-900/60 translate-y-[-4px]'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {EXPERT_INDICATORS[key].title[language].toUpperCase()}
          </button>
        ))}
      </div>

      {/* Validation Form */}
      <div className="space-y-16">
        <div className="border-b-4 border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">{currentIndicators.title[language]}</h1>
            <p className="text-slate-200 text-xl mt-3 font-bold max-w-2xl drop-shadow-sm">{currentIndicators.description[language]}</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-3xl border border-slate-800 no-print">
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('researcher.progressLabel')}</p>
              <p className="text-white font-black text-lg">
                {Math.round((Object.keys(scores).filter(k => k.startsWith(activeType)).length / 
                currentIndicators.categories.reduce((acc, c) => acc + c.indicators.length, 0)) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {currentIndicators.categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-10 group break-inside-avoid-page">
            <div className="flex items-center gap-5">
              <div className="h-10 w-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h3 className="text-white font-black uppercase tracking-[0.3em] text-lg italic">
                {t('researcher.aspekLabel')}: {cat.name[language]}
              </h3>
            </div>
            
            <div className="grid gap-8">
              {cat.indicators.map((ind) => {
                const scoreKey = `${activeType}_${ind.id}`
                const currentScore = scores[scoreKey] || 0

                return (
                  <div key={ind.id} className={`glass-card-dark p-10 border-2 transition-all duration-300 ${currentScore > 0 ? 'border-emerald-500/50 bg-emerald-900/20 shadow-emerald-900/40' : 'border-slate-600 hover:border-slate-500 bg-slate-800/80 shadow-lg'}`}>
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                      <div className="flex gap-8 flex-1">
                        <span className={`font-black text-4xl transition-colors shrink-0 ${currentScore > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {String(ind.id).padStart(2, '0')}
                        </span>
                        <p className="text-white text-xl font-black leading-relaxed portal-text-crisp drop-shadow-md">{ind.text[language]}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 no-print">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(activeType, ind.id, val)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all border-2 ${
                              currentScore === val
                                ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-white'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Suggestions Textarea */}
            <div className="space-y-6 pt-6 bg-slate-800/50 p-10 rounded-[3rem] border-2 border-slate-500 border-dashed group-hover:border-slate-400 transition-colors no-print">
              <label className="text-sm font-black text-slate-200 uppercase tracking-widest flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                {t('researcher.notesLabel')} ({cat.name[language]}):
              </label>
              <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <label className="block text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em] mb-2 px-1">
                   {t('researcher.notesLabel')}
                </label>
                <textarea
                  value={notes[`${activeType}_${cat.id}`] || ''}
                  onChange={(e) => handleNoteChange(activeType, cat.id, e.target.value)}
                  placeholder={t('researcher.notesPlaceholder')}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all min-h-[100px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* ── Print View Template (Visible only on Print) ────────────────── */}
      <div className="hidden print:block bg-white text-black font-serif w-full max-w-full">
        <div className="text-center mb-10 border-b-[6px] border-double border-black pb-8">
          <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight">{t('researcher.printHeader')}</h1>
          <h2 className="text-2xl font-bold uppercase mt-2">{t('researcher.printSubheader')}</h2>
          <p className="text-sm mt-5 italic text-gray-700">{t('researcher.printMethod')}</p>
        </div>

        <div className="mb-8 p-6 border-2 border-black rounded-lg">
          <table className="w-full text-base border-separate border-spacing-y-2">
            <tbody>
              <tr><td className="w-40 font-bold">{t('researcher.printExpertName')}</td><td>: _________________________________________________</td></tr>
              <tr><td className="w-40 font-bold">{t('researcher.printInstansi')}</td><td>: _________________________________________________</td></tr>
              <tr><td className="w-40 font-bold">{t('researcher.printField')}</td><td>: <span className="uppercase font-black">{currentIndicators.title[language].replace('Validasi ', '').replace('Validation', '')}</span></td></tr>
              <tr><td className="w-40 font-bold">{t('researcher.printDate')}</td><td>: _________________________________________________</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8 p-5 bg-gray-50 border border-gray-300 text-[10px] leading-relaxed italic">
          {t('researcher.printInstruction')}
        </div>

        <table className="w-full border-collapse border-[2.5px] border-black text-[10px] mb-12">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-[2px] border-black p-4 w-12 text-center uppercase font-bold">{t('researcher.printTableNo')}</th>
              <th className="border-[2px] border-black p-4 text-left uppercase font-bold">{t('researcher.printTableInd')}</th>
              <th className="border-[2px] border-black p-4 w-20 text-center uppercase font-bold">{t('researcher.printTableScore')}</th>
            </tr>
          </thead>
          <tbody>
            {currentIndicators.categories.map((cat, cIdx) => (
              <Fragment key={`print-cat-group-${cIdx}`}>
                <tr className="bg-gray-200 break-after-avoid">
                  <td className="border-[2px] border-black p-3 font-bold text-center">{String.fromCharCode(65 + cIdx)}</td>
                  <td colSpan={2} className="border-[2px] border-black p-3 font-bold uppercase tracking-wider">{cat.name[language]}</td>
                </tr>
                {cat.indicators.map((ind) => (
                  <tr key={`print-ind-${ind.id}`} className="break-inside-avoid">
                    <td className="border-[2px] border-black p-3 text-center">{ind.id}</td>
                    <td className="border-[2px] border-black p-3 leading-relaxed">{ind.text[language]}</td>
                    <td className="border-[2px] border-black p-3 text-center font-bold text-lg bg-gray-50/50">
                      {scores[`${activeType}_${ind.id}`] || '_____'}
                    </td>
                  </tr>
                ))}
                <tr className="break-inside-avoid">
                  <td colSpan={3} className="border-[2px] border-black p-4 bg-white">
                    <div className="font-bold mb-2 uppercase text-[9px] tracking-widest text-gray-600">
                      {t('researcher.printNoteTitle')} {cat.name[language]}:
                    </div>
                    <div className="italic text-gray-800 min-h-[60px] whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-2">
                      {notes[`${activeType}_${cat.id}`] || '............................................................................................................................................................................................................................................................................................................'}
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>

        <div className="mt-16 flex justify-between px-10 break-inside-avoid pt-10">
          <div className="text-center">
            <p className="mb-20 text-[11px] uppercase tracking-widest font-bold">{t('researcher.printSignKnow')} <br/> {t('researcher.printSignResearcher')}</p>
            <div className="w-48 h-px bg-black mx-auto mb-2" />
            <p className="font-bold text-xs uppercase tracking-wider">{t('researcher.unitName')} Lead Researcher</p>
          </div>
          <div className="text-center w-80">
            <p className="mb-4 text-xs font-serif italic">________________, ________________ 2026</p>
            <p className="mb-20 font-bold uppercase tracking-widest text-[11px]">{t('researcher.printSignExpert')}</p>
            <p className="text-base font-bold leading-none">( ___________________________________ )</p>
            <p className="text-[10px] mt-3 italic text-gray-500">{t('researcher.printSignId')}: ......................................................</p>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200 text-center text-[10px] text-gray-400 uppercase tracking-[0.5em] break-inside-avoid">
          {t('researcher.printFooter')}
        </div>
      </div>
    </>
  )
}
