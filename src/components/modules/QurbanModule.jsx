// ============================================================
// QurbanModule — Grouped Bar Chart, Focus: Modus
// Shows Qurban distribution target vs realization
// Enhanced: Tabayyun + Educational theory panel
// ============================================================
import { useState, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { TabayyunAlert } from '../ui/TabayyunAlert'
import { useStats } from '../../hooks/useStats'
import { useTabayyun } from '../../hooks/useTabayyun'
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

export function QurbanModule({ 
  data, 
  isAmanah, 
  tabayyunConfirmed, 
  setData, 
  setAmanah, 
  setTabayyunConfirmed, 
  onEdit, 
  onStatView,
  gamify
}) {
  const { t } = useLanguage()

  const realisasiValues = useMemo(() => data.map((r) => r.realisasi), [data])
  const stats = useStats(realisasiValues)
  const tabayyun = useTabayyun(stats.mean, stats.median)

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
        min: isAmanah ? 0 : undefined,
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
            Bar Chart
          </span>
        </div>
      </div>

      {/* Educational Context */}
      <div className="px-4 py-3 rounded-xl bg-amber-50/60 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900 text-sm text-amber-800 dark:text-amber-300 leading-relaxed shadow-sm">
        <p className="font-semibold mb-1">💡 Mengapa Modus penting di sini?</p>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Modus</strong> menunjukkan angka realisasi yang paling sering muncul antar desa. Jika modus rendah, berarti mayoritas desa menerima distribusi minimal — ini menandakan <strong>ketimpangan</strong>. Modus membantu kita melihat pola dominan yang mungkin tersembunyi di balik rata-rata yang "tampak baik". Dalam audit Qurban, kita mencari apakah ada desa yang ditinggalkan secara sistematis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Perbandingan Target vs Realisasi</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Data Distribusi Desa</h3>
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

      {/* Tabayyun Alert */}
      <TabayyunAlert
        isAnomalous={tabayyun.isAnomalous}
        mean={stats.mean}
        median={stats.median}
        diff={tabayyun.diff}
        threshold={tabayyun.threshold}
        severity={tabayyun.severity}
        onDetected={setTabayyunConfirmed}
        externalConfirmed={tabayyunConfirmed}
        gamify={gamify}
      />

      <AmanahToggle 
        isAmanah={isAmanah} 
        onToggle={() => setAmanah(!isAmanah)} 
        gamify={gamify}
      />

      {/* Tawazun hint */}
      <div className="px-4 py-3 rounded-xl bg-teal-50/60 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900 text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
        ⚖️ <strong>Tawazun:</strong> Bandingkan kolom Target vs Realisasi. Apakah distribusi sudah adil?
      </div>
    </div>
  )
}

