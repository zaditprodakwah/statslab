import { create } from "zustand";

interface TaskResponse {
  taskId: string;
  answerText: string;
  score: number;
}

interface StatsLabState {
  // Session & Student Info
  sessionId: string | null;
  studentName: string;
  studentClass: string;
  schoolName: string;
  testPhase: "small_scale" | "large_scale" | "think_aloud";
  
  // Gamification & Watson-Callingham Level
  xp: number;
  currentLevel: number;
  badges: string[];
  
  // 3 Pilar Islam Toggles & States
  amanahZeroScale: boolean; // true = Zero-based scale (QS. Al-Mutaffifin)
  tabayyunThreshold: number; // 20% outlier detection (QS. Al-Hujurat)
  tawazunConfirmed: boolean; // Mean vs Median distribution (QS. Al-Infitar)
  
  // Task Progress
  taskResponses: Record<string, TaskResponse>;
  totalScore: number; // Max 16
  
  // Actions
  setStudentInfo: (info: { studentName: string; studentClass: string; schoolName: string; sessionId?: string }) => void;
  toggleAmanahScale: () => void;
  confirmTawazun: () => void;
  submitTaskAnswer: (taskId: string, answerText: string, score: number) => void;
  addXP: (amount: number, badge?: string) => void;
}

export const useStatsLabStore = create<StatsLabState>((set) => ({
  sessionId: null,
  studentName: "",
  studentClass: "",
  schoolName: "",
  testPhase: "large_scale",
  
  xp: 0,
  currentLevel: 1,
  badges: ["Pencari Data"],
  
  amanahZeroScale: true,
  tabayyunThreshold: 0.2,
  tawazunConfirmed: false,
  
  taskResponses: {},
  totalScore: 0,
  
  setStudentInfo: (info) => set((state) => ({ ...state, ...info })),
  
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
      const newTotalScore = state.totalScore - oldScore + score;
      
      // Calculate Watson Level based on completed tasks
      const completedCount = Object.keys({ ...state.taskResponses, [taskId]: { taskId, answerText, score } }).length;
      let newLevel = 1;
      if (completedCount >= 8) newLevel = 6;
      else if (completedCount >= 6) newLevel = 5;
      else if (completedCount >= 4) newLevel = 4;
      else if (completedCount >= 2) newLevel = 3;
      else if (completedCount >= 1) newLevel = 2;

      return {
        taskResponses: {
          ...state.taskResponses,
          [taskId]: { taskId, answerText, score }
        },
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
