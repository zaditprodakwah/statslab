// ============================================================
// useTabayyun — Anomaly Detection Logic
// Trigger: Math.abs(mean - median) > median * 0.3
// Returns: { isAnomalous, severity, diff, threshold }
// ============================================================
import { useMemo } from 'react'

export function useTabayyun(mean, median) {
  return useMemo(() => {
    if (median === 0) return { isAnomalous: false, severity: 'none', diff: 0, threshold: 0 }

    const diff = Math.abs(mean - median)
    const threshold = median * 0.3
    const isAnomalous = diff > threshold

    // Severity: mild / strong / extreme
    let severity = 'none'
    if (isAnomalous) {
      const ratio = diff / median
      if (ratio < 0.6) severity = 'mild'
      else if (ratio < 1.5) severity = 'strong'
      else severity = 'extreme'
    }

    return {
      isAnomalous,
      severity,
      diff: parseFloat(diff.toFixed(2)),
      threshold: parseFloat(threshold.toFixed(2)),
    }
  }, [mean, median])
}
