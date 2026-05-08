// ============================================================
// SUSForm.jsx — Integrated System Usability Scale Engine
// SheetDB → Google Sheets | canvas-confetti | Web Speech API
// sessionStorage persistence | a11y compliant | bilingual
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  SUS_QUESTIONS, calculateSUS, getSUSGrade,
  SCALE_LABELS_ID, SCALE_LABELS_EN,
  SHEETDB_POST, SHEETDB_PURGE,
} from '../../data/susQuestions'
import { useLanguage } from '../../hooks/useLanguage'
import { playPop, playChime } from '../../utils/susAudio'

const SESSION_KEY = 'statslab_sus_draft'

// ── Helper: restore draft from sessionStorage ──────────────
function loadDraft() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// ── TTS helper ─────────────────────────────────────────────
function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'id-ID'
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}

// ── Confetti burst ─────────────────────────────────────────
function fireConfetti() {
  const count = 180
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
  const randomInRange = (min, max) => Math.random() * (max - min) + min

  confetti({ ...defaults, particleCount: count * 0.3, origin: { x: randomInRange(0.1, 0.3), y: 0.6 }, colors: ['#10b981', '#059669', '#34d399'] })
  setTimeout(() => {
    confetti({ ...defaults, particleCount: count * 0.4, origin: { x: randomInRange(0.4, 0.6), y: 0.5 } })
  }, 120)
  setTimeout(() => {
    confetti({ ...defaults, particleCount: count * 0.3, origin: { x: randomInRange(0.7, 0.9), y: 0.6 }, colors: ['#f59e0b', '#fbbf24', '#6366f1'] })
  }, 250)
}

// ── Scale Option Button ────────────────────────────────────
function ScaleOption({ qId, value, label, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`Pertanyaan ${qId}: ${label}`}
      onClick={() => onSelect(qId, value)}
      className={`
        flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 transition-all duration-150
        flex-1 min-h-[60px] px-1 py-2 select-none
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
        active:scale-95
        ${selected
          ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
        }
      `}
    >
      <span className="text-sm font-extrabold">{value}</span>
      <span className="text-center leading-tight" style={{ fontSize: '0.55rem', maxWidth: '2.8rem' }}>
        {label}
      </span>
    </button>
  )
}

// ── Question Row ───────────────────────────────────────────
function QuestionRow({ q, answer, onSelect, lang, index }) {
  const text = lang === 'id' ? q.id_text : q.en_text
  const labels = lang === 'id' ? SCALE_LABELS_ID : SCALE_LABELS_EN
  const isAnswered = answer !== undefined

  return (
    <div
      className={`
        rounded-2xl border-2 transition-all duration-200 p-4
        ${isAnswered
          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-900/10'
          : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50'
        }
      `}
    >
      {/* Question header */}
      <div className="flex items-start gap-2 mb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center">
          {q.id}
        </span>
        <p
          className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug"
          aria-label={`Pertanyaan ${q.id}`}
        >
          {text}
        </p>
        {/* TTS Button */}
        <button
          type="button"
          onClick={() => speak(text)}
          aria-label={`Dengarkan pertanyaan ${q.id}`}
          title="Dengarkan pertanyaan"
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          🔊
        </button>
      </div>

      {/* Scale — 5 buttons full-width, labels embedded inside each button */}
      <div
        role="radiogroup"
        aria-label={`Skala untuk pertanyaan ${q.id}`}
        className="flex gap-1.5"
      >
        {[1, 2, 3, 4, 5].map((val, i) => (
          <ScaleOption
            key={val}
            qId={q.id}
            value={val}
            label={labels[i]}
            selected={answer === val}
            onSelect={onSelect}
          />
        ))}
      </div>
      {/* Range hint */}
      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{labels[0]}</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{labels[4]}</span>
      </div>
    </div>
  )
}

// ── Success Screen ─────────────────────────────────────────
function SuccessScreen({ susScore, profile, onBack, lang }) {
  const grade = getSUSGrade(susScore)
  const scoreLabel = grade.label

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in px-4">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
          {lang === 'id' ? 'Jazakallahu Khairan!' : 'Thank You!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          {lang === 'id'
            ? `Jawabanmu telah tersimpan. Skor SUS kamu adalah:`
            : `Your response has been saved. Your SUS Score is:`}
        </p>
      </div>

      {/* Score display */}
      <div className={`rounded-3xl border-2 px-10 py-6 ${grade.bg} border-current`}>
        <div className={`text-6xl font-black ${grade.color}`}>
          {susScore.toFixed(1)}
        </div>
        <div className={`text-xl font-bold mt-1 ${grade.color}`}>
          Grade {grade.grade} — {scoreLabel}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'id' ? 'Skor SUS (System Usability Scale)' : 'SUS Score (System Usability Scale)'}
        </div>
      </div>

      <div className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
        {lang === 'id'
          ? '✨ Data kamu sangat membantu penelitian untuk menyempurnakan StatsLab!'
          : '✨ Your data greatly helps improve StatsLab!'}
      </div>

      <button
        onClick={onBack}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
      >
        {lang === 'id' ? '← Kembali ke Dashboard' : '← Back to Dashboard'}
      </button>
    </div>
  )
}

// ── Main SUSForm ───────────────────────────────────────────
export function SUSForm({ profile, onBack }) {
  const { lang } = useLanguage()
  const [answers, setAnswers] = useState(() => loadDraft())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [finalScore, setFinalScore] = useState(null)
  const submittedOnce = useRef(false)

  // Persist answers to sessionStorage on each change
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(answers)) }
    catch { /* quota exceeded — fail silently */ }
  }, [answers])

  const handleSelect = useCallback((qId, value) => {
    playPop()
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }, [])

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === 10
  const progress = (answeredCount / 10) * 100

  const handleSubmit = useCallback(async () => {
    if (!allAnswered || submitting || submittedOnce.current) return
    submittedOnce.current = true
    setSubmitting(true)
    setError(null)

    try {
      const score = calculateSUS(answers)

      const payload = {
        data: [{
          timestamp: new Date().toISOString(),
          nama: profile?.nama || '—',
          kelas: profile?.kelas || '—',
          sus_score: score.toFixed(2),
          q1: answers[1], q2: answers[2], q3: answers[3],
          q4: answers[4], q5: answers[5], q6: answers[6],
          q7: answers[7], q8: answers[8], q9: answers[9], q10: answers[10],
        }],
      }

      // Step 1: POST to SheetDB
      const postRes = await fetch(SHEETDB_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!postRes.ok && postRes.status !== 201) {
        const txt = await postRes.text()
        throw new Error(`SheetDB POST gagal (${postRes.status}): ${txt}`)
      }

      // Step 2: Purge cache (fire-and-forget)
      fetch(SHEETDB_PURGE).catch(() => {})

      // Step 3: Clear draft
      sessionStorage.removeItem(SESSION_KEY)

      // Step 4: Show success
      setFinalScore(score)
      setSubmitted(true)
      playChime()
      fireConfetti()
    } catch (err) {
      submittedOnce.current = false
      setError(
        lang === 'id'
          ? `❌ Gagal mengirim: ${err.message}. Pastikan koneksi internet aktif dan coba lagi.`
          : `❌ Submission failed: ${err.message}. Please check your connection and try again.`
      )
    } finally {
      setSubmitting(false)
    }
  }, [answers, allAnswered, submitting, profile, lang])

  // Success state
  if (submitted) {
    return <SuccessScreen susScore={finalScore} profile={profile} onBack={onBack} lang={lang} />
  }

  const scaleLabels = lang === 'id' ? SCALE_LABELS_ID : SCALE_LABELS_EN

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in" style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}>

      {/* Header */}
      <div className="glass-card p-6 text-center space-y-3">
        <div className="text-4xl">📋</div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          {lang === 'id' ? 'Evaluasi Kegunaan (SUS)' : 'Usability Evaluation (SUS)'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          {lang === 'id'
            ? "Assalamu'alaikum, Generasi Tabayyun! 🌟 Alhamdulillah, kamu telah menyelesaikan petualangan literasi data di StatsLab. Jawabanmu di sini sangat berharga bagi Kakak (Peneliti) untuk menyempurnakan media ini. Tidak ada jawaban benar atau salah. Kami sangat menghargai kejujuranmu (Sikap Amanah) dalam menilai kemudahan aplikasi ini."
            : "Assalamu'alaikum, Generation Tabayyun! 🌟 Alhamdulillah, you've completed your data literacy journey on StatsLab. Your answers are precious for improving this tool. There are no right or wrong answers — please answer honestly (Amanah)."}
        </p>

        {/* Scale legend (desktop only) */}
        <div className="hidden sm:flex justify-center gap-2 flex-wrap pt-2">
          {[1,2,3,4,5].map((v, i) => (
            <span key={v} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">{v}</span>
              {scaleLabels[i]}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass-card px-5 py-3">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span>{lang === 'id' ? `${answeredCount} dari 10 pertanyaan dijawab` : `${answeredCount} of 10 answered`}</span>
          <span className="font-semibold text-emerald-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {SUS_QUESTIONS.map((q, i) => (
          <QuestionRow
            key={q.id}
            q={q}
            answer={answers[q.id]}
            onSelect={handleSelect}
            lang={lang}
            index={i}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Submit row */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
        >
          ← {lang === 'id' ? 'Kembali' : 'Back'}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          aria-disabled={!allAnswered || submitting}
          className={`
            flex-1 px-6 py-3 rounded-xl font-extrabold text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            ${allAnswered && !submitting
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {lang === 'id' ? 'Mengirim...' : 'Submitting...'}
            </span>
          ) : allAnswered
            ? (lang === 'id' ? '✅ Kirim Evaluasi' : '✅ Submit Evaluation')
            : (lang === 'id' ? `Jawab semua pertanyaan dulu (${10 - answeredCount} tersisa)` : `Answer all questions (${10 - answeredCount} remaining)`)
          }
        </button>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        🔒 {lang === 'id'
          ? 'Jawabanmu tersimpan otomatis. Refresh halaman ini aman.'
          : 'Your answers are auto-saved. Safe to refresh this page.'}
      </p>
    </div>
  )
}
