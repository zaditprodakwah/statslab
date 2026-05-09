import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { 
  PRESET_ZISWAF, PRESET_ZISWAF_NORMAL, 
  PRESET_TAHFIZH, PRESET_TAHFIZH_NORMAL,
  PRESET_QURBAN, PRESET_QURBAN_NORMAL,
  PRESET_LITERASI, PRESET_LITERASI_NORMAL 
} from '../data/presetData'

const ModuleDataContext = createContext(null)

export function useModuleData() {
  const context = useContext(ModuleDataContext)
  if (!context) {
    throw new Error('useModuleData must be used within a ModuleDataProvider')
  }
  return context
}

export function ModuleDataProvider({ children }) {
  const [activeModule, setActiveModule] = useState('ziswaf')
  
  const [moduleData, setModuleData] = useState(() => {
    const defaultData = {
      ziswaf: { items: PRESET_ZISWAF, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false, scenario: 'anomali' },
      tahfizh: { items: PRESET_TAHFIZH, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false, scenario: 'anomali' },
      qurban: { items: PRESET_QURBAN, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false, scenario: 'anomali' },
      literasi: { items: PRESET_LITERASI, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false, scenario: 'anomali' },
    }
    try {
      const saved = localStorage.getItem('statslab_module_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        const keys = ['ziswaf', 'tahfizh', 'qurban', 'literasi']
        
        // Deep validation of each module structure
        const isValid = keys.every(k => {
          const mod = parsed[k];
          return (
            mod && 
            Array.isArray(mod.items) && 
            mod.items.length > 0 &&
            // Check if specific required fields exist in items (e.g., nominal for ziswaf, jumlah for literasi)
            (k !== 'ziswaf' || mod.items.every(i => 'nominal' in i)) &&
            (k !== 'literasi' || mod.items.every(i => 'jumlah' in i))
          );
        });

        if (isValid) return parsed;
        console.warn('Stale or invalid data structure detected in storage. Reverting to preset defaults.');
      }
    } catch (e) {
      console.error('Failed to load module data:', e)
    }
    return defaultData
  })

  // ── Debounced LocalStorage Sync (Phase 2) ──────────────────
  const timerRef = useRef(null)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      localStorage.setItem('statslab_module_data', JSON.stringify(moduleData))
    }, 500) // 500ms debounce
    return () => clearTimeout(timerRef.current)
  }, [moduleData])

  const updateModuleState = useCallback((id, updates) => {
    setModuleData(prev => {
      if (!prev[id]) return prev
      return {
        ...prev,
        [id]: { ...prev[id], ...updates }
      }
    })
  }, [])

  const handleScenarioChange = useCallback((id, scenario) => {
    setModuleData(prev => {
      if (!prev[id]) return prev
      let newItems = prev[id].items
      if (scenario === 'normal') {
        if (id === 'ziswaf') newItems = PRESET_ZISWAF_NORMAL
        if (id === 'tahfizh') newItems = PRESET_TAHFIZH_NORMAL
        if (id === 'qurban') newItems = PRESET_QURBAN_NORMAL
        if (id === 'literasi') newItems = PRESET_LITERASI_NORMAL
      } else {
        if (id === 'ziswaf') newItems = PRESET_ZISWAF
        if (id === 'tahfizh') newItems = PRESET_TAHFIZH
        if (id === 'qurban') newItems = PRESET_QURBAN
        if (id === 'literasi') newItems = PRESET_LITERASI
      }
      return {
        ...prev,
        [id]: { ...prev[id], scenario, items: newItems }
      }
    })
  }, [])

  const handleDataChange = useCallback((id, updater) => {
    setModuleData(prev => {
      if (!prev[id]) return prev
      const currentItems = prev[id]?.items || []
      const newItems = typeof updater === 'function' ? updater(currentItems) : updater
      return {
        ...prev,
        [id]: { ...prev[id], items: newItems }
      }
    })
  }, [])

  // Dynamic selector for active module state
  const activeState = moduleData[activeModule] || {}

  const value = {
    activeModule,
    setActiveModule,
    moduleData,
    activeState,
    updateModuleState,
    handleDataChange,
    handleScenarioChange
  }

  return (
    <ModuleDataContext.Provider value={value}>
      {children}
    </ModuleDataContext.Provider>
  )
}
