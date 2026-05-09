import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const POINTS_TABLE = { 2: 10, 3: 20, 4: 20, 5: 50, 6: 50 }
const BADGES = {
  1: { id: 'pencari', key: 'gamify.badges.lvl1', icon: '🔰', academic: 'Idiosinkratik' },
  2: { id: 'pelapor', key: 'gamify.badges.lvl2', icon: '✏️', academic: 'Kolokuial' },
  3: { id: 'analis', key: 'gamify.badges.lvl3', icon: '🧭', academic: 'Tidak Konsisten' },
  4: { id: 'detektif', key: 'gamify.badges.lvl4', icon: '📊', academic: 'Konsisten Non-Kritis' },
  5: { id: 'strategi', key: 'gamify.badges.lvl5', icon: '🔍', academic: 'Kritis' },
  6: { id: 'master', key: 'gamify.badges.lvl6', icon: '🏆', academic: 'Kritis Matematis' },
}

const DEFAULT_STATE = {
  level: 1,
  points: 0,
  unlockedLevels: [1],
  badges: [],
  levelHistory: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
}

const GamifyContext = createContext(null)

export function useGamify() {
  const context = useContext(GamifyContext)
  if (!context) {
    throw new Error('useGamify must be used within a GamifyProvider')
  }
  return context
}

export function GamifyProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem('statslab_progress')
      return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE
    } catch {
      return DEFAULT_STATE
    }
  })
  
  const [notification, setNotification] = useState(null)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('statslab_progress', JSON.stringify(state))
  }, [state])

  const unlockLevel = useCallback((targetLevel) => {
    setState((prev) => {
      if (prev.unlockedLevels.includes(targetLevel)) return prev
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
      setTimeout(() => setNotification(null), 8000)

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

  const notify = useCallback((title, message, type = 'info', instruction = null, duration = 8000) => {
    setNotification({ title, message, type, instruction })
    setTimeout(() => setNotification(null), duration)
  }, [])

  const canUnlock = useCallback((targetLevel) => {
    return state.level + 1 === targetLevel
  }, [state.level])

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE)
    localStorage.removeItem('statslab_progress')
  }, [])

  const godMode = useCallback(() => {
    const fullState = {
      level: 6,
      points: 150,
      unlockedLevels: [1, 2, 3, 4, 5, 6],
      badges: Object.values(BADGES),
      levelHistory: Object.keys(BADGES).reduce((acc, lvl) => ({ ...acc, [lvl]: new Date().toISOString() }), {}),
    }
    setState(fullState)
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
  const dismiss = useCallback(() => setNotification(null), [])

  const value = {
    ...state,
    unlockLevel,
    canUnlock,
    godMode,
    addPoints,
    resetAll,
    resetProgress,
    notification,
    notify,
    dismiss,
    canPrintCertificate,
    BADGES,
  }

  return (
    <GamifyContext.Provider value={value}>
      {children}
    </GamifyContext.Provider>
  )
}
