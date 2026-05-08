// ============================================================
// TahfizhModule — Line Chart, Focus: Median
// Shows monthly Quran memorization progress
// ============================================================
import { useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { useStats } from '../../hooks/useStats'
import { useAmanah } from '../../hooks/useAmanah'
import { AmanahToggle } from '../ui/AmanahToggle'
import { PRESET_TAHFIZH } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'bulan', type: 'text', labelKey: 'bulan' },
  { field: 'halaman', type: 'number', labelKey: 'halaman' },
]

export function TahfizhModule({ onEdit, onStatView, onAmanah }) {
  const { t } = useLanguage()
  const [data, setData] = useState(PRESET_TAHFIZH)
  const { isAmanah, toggleAmanah, yMin } = useAmanah(true)

  const values = useMemo(() => data.map((r) => r.halaman), [data])
  const stats = useStats(values)

  const chartData = {
    labels: data.map((r) => r.bulan),
    datasets: [{
      label: t('modules.tahfizh.focus'),
      data: values,
      borderColor: 'rgba(59, 130, 246, 0.9)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2.5,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointRadius: 5,
      pointHoverRadius: 8,
      tension: 0.4,
      fill: true,
    }, {
      label: `Median (${stats.median})`,
      data: data.map(() => stats.median),
      borderColor: 'rgba(245, 158, 11, 0.7)',
      borderWidth: 1.5,
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11, family: 'Inter' } } },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} halaman` },
      },
    },
    scales: {
      y: {
        min: yMin,
        ticks: { stepSize: 5, font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          📖 {t('modules.tahfizh.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.tahfizh.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            📊 {t('modules.tahfizh.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            📈 {t('modules.tahfizh.chartType')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="tahfizh"
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
