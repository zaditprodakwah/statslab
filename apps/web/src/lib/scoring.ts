import { SCORE_SCALE } from "@/lib/standards";

export function clampScore(score: number): number {
  return Math.max(SCORE_SCALE.min, Math.min(SCORE_SCALE.max, Math.floor(score)));
}

export function scoreAnswer(
  answerText: string,
  modelAnswer?: string | null,
  keywords?: string[]
): number {
  const text = (answerText || "").trim();
  if (!text) return 0;
  if (text.length <= 15) return 0;

  const lower = text.toLowerCase();
  const modelTokens = (modelAnswer || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const modelMatch = modelTokens.some((w) => lower.includes(w));
  const keywordMatch = (keywords || []).some((k) => lower.includes(k));

  return modelMatch || keywordMatch ? 2 : 1;
}

// Prasyarat modul (100% Klik & Klik) — soal terkunci sampai modul dioperasikan di dasbor.
export type PrerequisiteKey =
  "amanahZeroScale" | "tawazunConfirmed" | "tabayyunThreshold" | "chartType";

export interface TaskOptions {
  choices: string[];
  correctIndex: number;
  explanation?: string;
  chartClickAnswer?: string;
  prerequisite?: PrerequisiteKey | null;
}

const normalize = (s: string) => (s || "").trim().toLowerCase();

export function getCorrectChoiceText(options?: TaskOptions | null): string | null {
  if (!options || !Array.isArray(options.choices)) return null;
  const choice = options.choices[options.correctIndex];
  return typeof choice === "string" ? choice : null;
}

// Exact Match: skor 2 hanya jika indeks/tulisan pilihan sama persis dengan kunci jawaban.
export function scoreChoice(
  options: TaskOptions | null | undefined,
  answerIndex?: number | null,
  answerText?: string | null
): number {
  if (!options || !Array.isArray(options.choices)) {
    // Tanpa opsi → fallback scoring teks (skenario lama / tugas isian).
    return Number.isFinite(answerIndex as number) ? 2 : 1;
  }

  if (typeof answerIndex === "number") {
    return answerIndex === options.correctIndex ? 2 : 0;
  }

  const correct = getCorrectChoiceText(options);
  if (answerText && correct) {
    return normalize(answerText) === normalize(correct) ? 2 : 0;
  }

  return 0;
}

// True jika jawaban/pilihan siswa tepat (dipakai client untuk overlay edukasi).
export function isChoiceCorrect(
  options: TaskOptions | null | undefined,
  answerIndex?: number | null,
  answerText?: string | null
): boolean {
  return scoreChoice(options, answerIndex, answerText) === 2;
}
