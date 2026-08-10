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
