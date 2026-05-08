// ============================================================
// useStats — Statistical Calculator (Pure Logic, useMemo)
// Sub-50ms reactivity: all computations are memoized
// ============================================================
import { useMemo } from 'react'

export function useStats(numericArray) {
  return useMemo(() => {
    const arr = (numericArray || []).filter(
      (n) => typeof n === 'number' && !isNaN(n)
    )

    if (arr.length === 0) {
      return { mean: 0, median: 0, modus: [], min: 0, max: 0, sum: 0, count: 0 }
    }

    // Mean
    const sum = arr.reduce((acc, n) => acc + n, 0)
    const mean = sum / arr.length

    // Median
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid]

    // Modus (can be multiple)
    const freq = {}
    let maxFreq = 0
    for (const n of arr) {
      freq[n] = (freq[n] || 0) + 1
      if (freq[n] > maxFreq) maxFreq = freq[n]
    }
    const modus = maxFreq > 1
      ? Object.entries(freq)
          .filter(([, f]) => f === maxFreq)
          .map(([v]) => Number(v))
      : [] // no modus if all unique

    return {
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      modus,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sum: parseFloat(sum.toFixed(2)),
      count: arr.length,
    }
  }, [numericArray])
}
