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
      if (prev.unlockedLevels.includes(targetLevel)) return prev

      const pts = POINTS_TABLE[targetLevel] ?? 0
      const newBadges = BADGES[targetLevel]
        ? [...prev.badges, BADGES[targetLevel]]
        : prev.badges
      const newUnlocked = [...prev.unlockedLevels, targetLevel]
      const newLevel = Math.max(prev.level, targetLevel)
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

  const addPoints = useCallback((pts) => {
    setState((prev) => ({
      ...prev,
      points: Math.min(prev.points + pts, 150),
    }))
  }, [])

  const resetAll = useCallback(() => {
    localStorage.clear()
    window.location.reload()
  }, [])

  const canPrintCertificate = state.level >= 6

  return {
    ...state,
    unlockLevel,
    addPoints,
    resetAll,
    notification,
    canPrintCertificate,
    BADGES,
  }
}
