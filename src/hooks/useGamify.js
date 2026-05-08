// ============================================================
// useGamify — Level & Points Manager
// Storage key: 'statslab_progress'
// Level 1-6, max 150 Points
// ============================================================
import { useState, useCallback, useEffect } from 'react'

const POINTS_TABLE = { 2: 10, 3: 20, 4: 20, 5: 50, 6: 50 }
const BADGES = {
  5: { id: 'detektif', key: 'gamify.badgeDetektif', descKey: 'gamify.badgeDetektifDesc', icon: '🔍' },
  6: { id: 'jujur', key: 'gamify.badgeJujur', descKey: 'gamify.badgeJujurDesc', icon: '🏆' },
}

const DEFAULT_STATE = {
  level: 1,
  points: 0,
  unlockedLevels: [1],
  badges: [],
  levelHistory: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('statslab_progress')
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function saveProgress(state) {
  localStorage.setItem('statslab_progress', JSON.stringify(state))
}

export function useGamify() {
  const [state, setState] = useState(loadProgress)
  const [notification, setNotification] = useState(null)

  // Sync to localStorage whenever state changes
  useEffect(() => {
    saveProgress(state)
  }, [state])

  const unlockLevel = useCallback((targetLevel) => {
    setState((prev) => {
      // 1. If already unlocked, skip
      if (prev.unlockedLevels.includes(targetLevel)) return prev

      // 2. Strict sequence enforcement (skip if not current + 1)
      if (targetLevel !== prev.level + 1) return prev

      const pts = POINTS_TABLE[targetLevel] ?? 0
      const newBadges = BADGES[targetLevel]
        ? [...prev.badges, BADGES[targetLevel]]
        : prev.badges
      const newUnlocked = [...prev.unlockedLevels, targetLevel]
      const newLevel = targetLevel
      const newPoints = Math.min(prev.points + pts, 150)
      const ts = new Date().toISOString()

      setNotification({
        level: targetLevel,
        points: pts,
        badge: BADGES[targetLevel] || null,
      })
      setTimeout(() => setNotification(null), 4000)

      return {
        ...prev,
        level: newLevel,
        points: newPoints,
        unlockedLevels: newUnlocked,
        badges: newBadges,
        levelHistory: { ...prev.levelHistory, [targetLevel]: ts },
      }
    })
  }, [])

  const canUnlock = useCallback((targetLevel) => {
    return state.level + 1 === targetLevel
  }, [state.level])

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  const godMode = useCallback(() => {
    const fullState = {
      level: 6,
      points: 150,
      unlockedLevels: [1, 2, 3, 4, 5, 6],
      badges: Object.values(BADGES),
      levelHistory: {
        1: new Date().toISOString(),
        2: new Date().toISOString(),
        3: new Date().toISOString(),
        4: new Date().toISOString(),
        5: new Date().toISOString(),
        6: new Date().toISOString(),
      },
    }
    setState(fullState)
    saveProgress(fullState)
  }, [])

  const addPoints = useCallback((pts) => {
    setState((prev) => ({
      ...prev,
      points: Math.min(prev.points + pts, 150),
    }))
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem('statslab_progress')
    localStorage.removeItem('statslab_profile')
    localStorage.removeItem('validator_draft_scores')
    localStorage.removeItem('validator_draft_notes')
    window.location.reload()
  }, [])

  const canPrintCertificate = state.level >= 6

  return {
    ...state,
    unlockLevel,
    canUnlock,
    godMode,
    addPoints,
    resetAll,
    resetProgress,
    notification,
    canPrintCertificate,
    BADGES,
  }
}
