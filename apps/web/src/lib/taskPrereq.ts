import type { PrerequisiteKey } from "@/lib/scoring";

// Keadaan modul dasbor yang dikirim klien ke server (dan disimpan di Zustand).
export interface ModuleState {
  amanahZeroScale: boolean;
  tabayyunThreshold: number;
  tawazunConfirmed: boolean;
  chartTypeUsed: "bar" | "line" | "pie" | null;
}

export const MODULE_LABELS: Record<PrerequisiteKey, string> = {
  amanahZeroScale: "Sakelar Amanah (Skala Sumbu Y)",
  tawazunConfirmed: "Toggle Tawazun (Mean vs Median)",
  tabayyunThreshold: "Slider Tabayyun (Threshold Outlier)",
  chartType: "Chart Type Switcher (Bar/Line/Pie)",
};

export const MODULE_IDS: Record<PrerequisiteKey, string> = {
  amanahZeroScale: "amanah-scale-toggle",
  tawazunConfirmed: "amanah-scale-toggle",
  tabayyunThreshold: "chart-interactive",
  chartType: "chart-interactive",
};

// Gembok prasyarat 🔒: true = terkunci sampai modul dioperasikan.
export function isPrerequisiteLocked(
  prerequisite: PrerequisiteKey | null | undefined,
  state: ModuleState
): boolean {
  if (!prerequisite) return false;
  switch (prerequisite) {
    case "amanahZeroScale":
      return !state.amanahZeroScale;
    case "tawazunConfirmed":
      return !state.tawazunConfirmed;
    case "tabayyunThreshold":
      return state.tabayyunThreshold <= 0;
    case "chartType":
      return !state.chartTypeUsed;
    default:
      return false;
  }
}
