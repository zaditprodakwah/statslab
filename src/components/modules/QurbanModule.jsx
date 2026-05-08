// ============================================================
// QurbanModule — Grouped Bar Chart, Focus: Modus
// Shows Qurban distribution target vs realization
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
import { PRESET_QURBAN } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'desa', type: 'text', labelKey: 'desa' },
  { field: 'target', type: 'number', labelKey: 'target' },
  { field: 'realisasi', type: 'number', labelKey: 'realisasi' },
]

export function QurbanModule({ onEdit, onStatView, onAmanah }) {
  const { t } = useLanguage()
  const [data, setData] = useState(PRESET_QURBAN)
  const { isAmanah, toggleAmanah, yMin } = useAmanah(true)

  const realisasiValues = useMemo(() => data.map((r) => r.realisasi), [data])
  const stats = useStats(realisasiValues)

  const chartData = {
    labels: data.map((r) => r.desa),
    datasets: [
      {
        label: t('table.target'),
        data: data.map((r) => r.target),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: t('table.realisasi'),
        data: data.map((r) => r.realisasi),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11, family: 'Inter' } } },
    },
    scales: {
      y: {
        min: yMin,
        beginAtZero: isAmanah,
        ticks: { font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          🐄 {t('modules.qurban.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.qurban.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
            📊 {t('modules.qurban.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            📊 {t('modules.qurban.chartType')}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{t('modules.qurban.context')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="qurban"
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
