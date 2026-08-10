import { WATSON_BASE_LEVEL, WATSON_MIN_TASK_LEVEL, WATSON_MAX_TASK_LEVEL } from "@/lib/standards";

export { WATSON_BASE_LEVEL, WATSON_MIN_TASK_LEVEL, WATSON_MAX_TASK_LEVEL };

export function computeWatsonLevel(
  responses: Record<string, { score: number }>,
  tasks: { id: string; watsonLevel: number }[]
): number {
  const mastery: Record<number, number> = {};
  for (const t of tasks) {
    const r = responses[t.id];
    if (r && r.score > 0) {
      mastery[t.watsonLevel] = (mastery[t.watsonLevel] || 0) + 1;
    }
  }

  let level = WATSON_BASE_LEVEL;
  for (let lvl = WATSON_MIN_TASK_LEVEL; lvl <= WATSON_MAX_TASK_LEVEL; lvl++) {
    if ((mastery[lvl] || 0) >= 1) {
      level = lvl;
    } else {
      break;
    }
  }
  return level;
}
