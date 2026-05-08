// ============================================================
// useAmanah — Visual Integrity / Chart Scale Controller
// Controls Chart.js options.scales.y.min
// isAmanah = true → y.min = 0 (honest scale)
// isAmanah = false → y.min = auto/undefined (truncated)
// ============================================================
import { useState, useCallback } from 'react'

export function useAmanah(initialState = true) {
  const [isAmanah, setIsAmanah] = useState(initialState)

  const toggleAmanah = useCallback(() => {
    setIsAmanah((prev) => !prev)
  }, [])

  // Returns the y-axis min value for Chart.js options
  const yMin = isAmanah ? 0 : undefined

  return { isAmanah, toggleAmanah, yMin }
}
