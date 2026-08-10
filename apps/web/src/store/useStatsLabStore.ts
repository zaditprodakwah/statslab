import { create } from "zustand";
import { computeWatsonLevel } from "@/lib/watsonLevel";

interface TaskResponse {
  taskId: string;
  answerText: string;
  score: number;
}

export type DatasetSlug = "zakat-infak" | "perpus-madrasah" | "tajwid-juz-30" | "wakaf-produktif";

export interface TaskMeta {
  id: string;
  watsonLevel: number;
}

export interface AssessmentMeta {
  maxTotalScore: number;
  totalTasks: number;
  tasks: TaskMeta[];
}

interface StatsLabState {
  // Session & Student Info
  sessionId: string | null;
  sessionToken: string | null;
  studentName: string;
  studentClass: string;
  schoolName: string;
  testPhase: "small_scale" | "large_scale" | "think_aloud";
  
  // Active Dataset (Module Switcher)
  activeDataset: DatasetSlug;

  // Gamification & Watson-Callingham Level
  xp: number;
  currentLevel: number;
  badges: string[];
  
  // Assessment Metadata (derived from active dataset tasks)
  maxTotalScore: number;
  totalTasks: number;
  tasksMeta: TaskMeta[];
  
  // Certificate
  certificateId: string | null;
  
  // 3 Pilar Islam Toggles & States
  amanahZeroScale: boolean; // true = Zero-based scale (QS. Al-Mutaffifin)
  tabayyunThreshold: number; // 20% outlier detection (QS. Al-Hujurat)
  tawazunConfirmed: boolean; // Mean vs Median distribution (QS. Al-Infitar)
  
  // Task Progress
  taskResponses: Record<string, TaskResponse>;
  totalScore: number;

  // F1.8: Waktu mulai sesi (untuk menghitung timeSpentMs saat selesai)
  sessionStartedAt: number | null;

  // Actions
  setStudentInfo: (info: { studentName: string; studentClass: string; schoolName: string; sessionId?: string; sessionToken?: string | null; testPhase?: StatsLabState["testPhase"] }) => void;
  setActiveDataset: (slug: DatasetSlug) => void;
  setAssessmentMeta: (meta: AssessmentMeta) => void;
  setCertificateId: (id: string) => void;
  startSessionTimer: () => void;
  toggleAmanahScale: () => void;
  confirmTawazun: () => void;
  submitTaskAnswer: (taskId: string, answerText: string, score: number) => void;
  addXP: (amount: number, badge?: string) => void;
}

export const useStatsLabStore = create<StatsLabState>((set) => ({
  sessionId: null,
  sessionToken: null,
  studentName: "",
  studentClass: "",
  schoolName: "",
  testPhase: "large_scale",
  
  activeDataset: "zakat-infak",

  xp: 0,
  currentLevel: 1,
  badges: ["Pencari Data"],
  
  maxTotalScore: 32,
  totalTasks: 16,
  tasksMeta: [],
  
  certificateId: null,
  
  amanahZeroScale: true,
  tabayyunThreshold: 0.2,
  tawazunConfirmed: false,
  
  taskResponses: {},
  totalScore: 0,

  sessionStartedAt: null,

  setStudentInfo: (info) => set((state) => ({ ...state, ...info })),
  setActiveDataset: (slug) => set({ activeDataset: slug }),
  setAssessmentMeta: (meta) =>
    set({
      maxTotalScore: meta.maxTotalScore,
      totalTasks: meta.totalTasks,
      tasksMeta: meta.tasks
    }),
  setCertificateId: (id) => set({ certificateId: id }),
  startSessionTimer: () => set({ sessionStartedAt: Date.now() }),
  
  toggleAmanahScale: () =>
    set((state) => {
      const newScale = !state.amanahZeroScale;
      // Award Master Amanah Badge if toggled & level upgrade check
      const newBadges = state.badges.includes("Master Amanah")
        ? state.badges
        : [...state.badges, "Master Amanah"];
      return {
        amanahZeroScale: newScale,
        badges: newBadges,
        xp: state.xp + 20
      };
    }),
    
  confirmTawazun: () =>
    set((state) => ({
      tawazunConfirmed: true,
      xp: state.xp + 30
    })),
    
  submitTaskAnswer: (taskId, answerText, score) =>
    set((state) => {
      const existing = state.taskResponses[taskId];
      const oldScore = existing ? existing.score : 0;
      const newTotalScore = Math.max(0, Math.min(state.maxTotalScore, state.totalScore - oldScore + score));

      const nextResponses = {
        ...state.taskResponses,
        [taskId]: { taskId, answerText, score }
      };

      // Watson-Callingham level berbasis mastery (F1.1)
      const newLevel = computeWatsonLevel(nextResponses, state.tasksMeta);

      return {
        taskResponses: nextResponses,
        totalScore: newTotalScore,
        currentLevel: newLevel,
        xp: state.xp + (score * 25)
      };
    }),
    
  addXP: (amount, badge) =>
    set((state) => ({
      xp: state.xp + amount,
      badges: badge && !state.badges.includes(badge) ? [...state.badges, badge] : state.badges
    }))
}));
