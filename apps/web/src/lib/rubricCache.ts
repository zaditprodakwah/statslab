"use client";

export interface RubricSummary {
  watsonLevel: number;
  keywords: string[];
}

let cache: Map<number, string[]> | null = null;
let inflight: Promise<Map<number, string[]>> | null = null;

async function fetchRubrics(): Promise<Map<number, string[]>> {
  try {
    const res = await fetch("/api/rubrics", { cache: "no-store" });
    if (!res.ok) return new Map();
    const json = await res.json();
    const map = new Map<number, string[]>();
    if (json.success && Array.isArray(json.data)) {
      for (const r of json.data as RubricSummary[]) {
        map.set(r.watsonLevel, r.keywords || []);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function getRubricKeywords(watsonLevel: number): Promise<string[]> {
  if (!cache) {
    inflight = inflight || fetchRubrics();
    cache = await inflight;
    inflight = null;
  }
  return cache.get(watsonLevel) || [];
}
