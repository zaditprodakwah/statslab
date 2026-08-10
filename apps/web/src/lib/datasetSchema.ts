import { z } from "zod";
import { WATSON_MIN_TASK_LEVEL, WATSON_MAX_TASK_LEVEL, INPUT_TYPES } from "@/lib/standards";

export const TaskSchema = z.object({
  taskNumber: z.number().int().positive(),
  watsonLevel: z.number().int().min(WATSON_MIN_TASK_LEVEL).max(WATSON_MAX_TASK_LEVEL),
  indicator: z.string().min(1),
  prompt: z.string().min(1),
  clue: z.string().optional().nullable(),
  modelAnswer: z.string().optional().nullable(),
  inputType: z.enum(INPUT_TYPES).default("text"),
});

export const ChartConfigSchema = z.object({
  type: z.enum(["bar", "line", "pie"]),
  xAxis: z.string().min(1),
  dataKeys: z.array(z.string().min(1)).min(1),
});

export const DatasetSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug hanya huruf kecil, angka, dan dash"),
  title: z.string().min(1),
  category: z.string().min(1),
  islamicValue: z.string().min(1),
  description: z.string().optional().default(""),
  chartConfig: ChartConfigSchema.optional(),
  rawData: z.array(z.record(z.string(), z.unknown())).min(1),
  tasks: z.array(TaskSchema).optional(),
});

export type DatasetSeed = z.infer<typeof DatasetSchema>;
export type TaskSeed = z.infer<typeof TaskSchema>;
export type ChartConfigSeed = z.infer<typeof ChartConfigSchema>;
