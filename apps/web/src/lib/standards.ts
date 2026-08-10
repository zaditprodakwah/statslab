export const WATSON_BASE_LEVEL = 1;
export const WATSON_MIN_TASK_LEVEL = 1;
export const WATSON_MAX_TASK_LEVEL = 6;
export const WATSON_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type WatsonTaskLevel = (typeof WATSON_LEVELS)[number];

export const SCORE_SCALE = {
  min: 0,
  max: 2,
  label: "Polytomous PCM 0-1-2",
} as const;

export const LEVEL_THRESHOLDS: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
};

export const INPUT_TYPES = ["text", "number", "choice", "chart", "voice"] as const;
export type InputType = (typeof INPUT_TYPES)[number];
