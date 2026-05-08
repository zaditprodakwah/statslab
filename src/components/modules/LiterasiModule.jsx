// ============================================================
// LiterasiModule — Horizontal Bar Chart, Focus: Modus + Freq
// Shows library book category distribution
// ============================================================
import { useState, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { useStats } from '../../hooks/useStats'
import { useAmanah } from '../../hooks/useAmanah'
import { AmanahToggle } from '../ui/AmanahToggle'
import { PRESET_LITERASI } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'kategori', type: 'text', labelKey: 'category' },
  { field: 'jumlah', type: 'number', labelKey: 'jumlah' },
]

export function LiterasiModule({ onEdit, onStatView, onAmanah }) {
  const { t } = useLanguage()
  const [data, setData] = useState(PRESET_LITERASI)
  const { isAmanah, toggleAmanah, yMin } = useAmanah(true)

  const jumlahValues = useMemo(() => data.map((r) => r.jumlah), [data])
  const stats = useStats(jumlahValues)

  // Max value category for Modus visual highlight
  const maxJumlah = Math.max(...jumlahValues)
  const backgroundColors = data.map((r) =>
    r.jumlah === maxJumlah
      ? 'rgba(168, 85, 247, 0.9)'
      : 'rgba(168, 85, 247, 0.4)'
  )

  const chartData = {
    labels: data.map((r) => r.kategori),
    datasets: [{
      label: t('table.jumlah'),
      data: jumlahValues,
      backgroundColor: backgroundColors,
      borderColor: 'rgba(168, 85, 247, 0.8)',
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  }

  const chartOptions = {
    indexAxis: 'y', // Horizontal bar
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.parsed.x} buku` },
      },
    },
    scales: {
      x: {
        min: isAmanah ? 0 : yMin,
        ticks: { font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: { ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          📚 {t('modules.literasi.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.literasi.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
            📊 {t('modules.literasi.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ↔ {t('modules.literasi.chartType')}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{t('modules.literasi.context')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-2">
            🟣 Warna lebih gelap = Kategori Terbanyak (Modus)
          </p>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="literasi"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {['mean', 'median', 'modus', 'min', 'max', 'count'].map((type) => (
          <StatCard
            key={type}
            type={type}
            value={stats[type]}
            onView={(tp) => { if (['mean','median','modus'].includes(tp)) onStatView?.() }}
          />
        ))}
      </div>

      <AmanahToggle isAmanah={isAmanah} onToggle={toggleAmanah} onFirstToggle={onAmanah} />
    </div>
  )
}
