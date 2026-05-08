// Standard 10-item System Usability Scale (SUS) — Bilingual ID/EN
// parity: 'odd' = positive statement (score - 1), 'even' = negative statement (5 - score)

export const SUS_QUESTIONS = [
  {
    id: 1,
    parity: 'odd',
    id_text: 'Saya rasa saya akan sering menggunakan aplikasi StatsLab ini.',
    en_text: 'I think that I would like to use StatsLab frequently.',
  },
  {
    id: 2,
    parity: 'even',
    id_text: 'Saya merasa aplikasi ini terlalu rumit tanpa perlu.',
    en_text: 'I found StatsLab unnecessarily complex.',
  },
  {
    id: 3,
    parity: 'odd',
    id_text: 'Saya pikir aplikasi ini mudah untuk digunakan.',
    en_text: 'I thought StatsLab was easy to use.',
  },
  {
    id: 4,
    parity: 'even',
    id_text: 'Saya rasa saya membutuhkan bantuan orang lain (teknisi) untuk menggunakan aplikasi ini.',
    en_text: 'I think that I would need the support of a technical person to use StatsLab.',
  },
  {
    id: 5,
    parity: 'odd',
    id_text: 'Saya menemukan berbagai fitur dalam aplikasi ini terintegrasi dengan baik.',
    en_text: 'I found the various functions in StatsLab were well integrated.',
  },
  {
    id: 6,
    parity: 'even',
    id_text: 'Saya pikir terdapat terlalu banyak ketidakkonsistenan dalam aplikasi ini.',
    en_text: 'I thought there was too much inconsistency in StatsLab.',
  },
  {
    id: 7,
    parity: 'odd',
    id_text: 'Saya bayangkan kebanyakan orang akan sangat mudah mempelajari aplikasi ini.',
    en_text: 'I would imagine that most people would learn to use StatsLab very quickly.',
  },
  {
    id: 8,
    parity: 'even',
    id_text: 'Saya merasa aplikasi ini sangat tidak praktis (kaku/berat) untuk digunakan.',
    en_text: 'I found StatsLab very cumbersome to use.',
  },
  {
    id: 9,
    parity: 'odd',
    id_text: 'Saya merasa sangat percaya diri saat menggunakan aplikasi ini.',
    en_text: 'I felt very confident using StatsLab.',
  },
  {
    id: 10,
    parity: 'even',
    id_text: 'Saya perlu mempelajari banyak hal terlebih dahulu sebelum bisa menggunakan aplikasi ini dengan lancar.',
    en_text: 'I needed to learn a lot of things before I could get going with StatsLab.',
  },
]

// SUS Score Calculation (standard formula)
// Odd items: score - 1 (raw 1-5 → contribution 0-4)
// Even items: 5 - score (raw 1-5 → contribution 0-4)
// Total: sum of all contributions × 2.5 → range 0–100
export function calculateSUS(answers) {
  // answers = { 1: score, 2: score, ... 10: score } where score is 1-5
  let totalOdd = 0  // sum of raw odd scores
  let totalEven = 0 // sum of raw even scores

  SUS_QUESTIONS.forEach(({ id, parity }) => {
    const score = answers[id] ?? 0
    if (parity === 'odd') totalOdd += score
    else totalEven += score
  })

  // ((sumOdd - 5) + (25 - sumEven)) × 2.5
  return ((totalOdd - 5) + (25 - totalEven)) * 2.5
}

export function getSUSGrade(score) {
  if (score >= 85) return { grade: 'A', label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
  if (score >= 71) return { grade: 'B', label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
  if (score >= 58) return { grade: 'C', label: 'OK', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' }
  if (score >= 51) return { grade: 'D', label: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' }
  return { grade: 'F', label: 'Awful', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' }
}

export const SCALE_LABELS_ID = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Ragu-ragu', 'Setuju', 'Sangat Setuju']
export const SCALE_LABELS_EN = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']

// Secure Endpoints via Environment Variables (Vite standard)
// Fallback to current research endpoints if .env is not present
export const SHEETDB_POST  = import.meta.env.VITE_SHEETDB_API_URL || 'https://sheetdb.io/api/v1/r5zrljdn1fhbd'
export const SHEETDB_PURGE = import.meta.env.VITE_SHEETDB_PURGE_URL || 'https://sheetdb.io/api/v1/r5zrljdn1fhbd/cache/purge/d78f88d7'
