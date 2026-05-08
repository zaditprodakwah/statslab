// ============================================================
// ZiswafModule — Pie Chart, Focus: Mean
// Tabayyun WILL trigger (Fisabilillah outlier intentional)
// AmanahToggle + Lvl5 + Lvl6 unlock here
// ============================================================
import { useState, useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { TabayyunAlert } from '../ui/TabayyunAlert'
import { AmanahToggle } from '../ui/AmanahToggle'
import { useStats } from '../../hooks/useStats'
import { useTabayyun } from '../../hooks/useTabayyun'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'kategori', type: 'text', labelKey: 'category' },
  { field: 'nominal', type: 'number', labelKey: 'nominal' },
]

const PIE_COLORS = [
  'rgba(16, 185, 129, 0.85)',
  'rgba(59, 130, 246, 0.85)',
  'rgba(239, 68, 68, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(168, 85, 247, 0.85)',
]

export function ZiswafModule({ 
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

  const nominals = useMemo(() => data.map((r) => r.nominal), [data])
  const stats = useStats(nominals)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  const chartData = {
    labels: data.map((r) => r.kategori),
    datasets: [{
      data: data.map((r) => r.nominal),
      backgroundColor: data.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.8)',
      hoverOffset: 8,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12, family: 'Inter' } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: Rp ${ctx.parsed.toLocaleString('id-ID')}`,
        },
      },
    },
  }

  const formatRp = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Module header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          📊 {t('modules.ziswaf.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.ziswaf.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            📈 {t('modules.ziswaf.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Pie Chart
          </span>
        </div>
      </div>

      {/* Educational Context */}
      <div className="px-4 py-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-900 text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
        <p className="font-semibold mb-1">💡 Mengapa Mean (Rata-rata) penting di sini?</p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          <strong>Mean</strong> menghitung total dana Ziswaf dibagi jumlah kategori penerima. Jika satu kategori (misal: Fisabilillah) menerima porsi jauh lebih besar, Mean akan terangkat melebihi Median. Ini mengindikasikan <strong>distribusi tidak merata</strong> — dan di sinilah auditor harus melakukan Tabayyun.
        </p>
      </div>

      {/* IMPACT ALERTS - MOVED UP FOR VISIBILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Amanah Toggle */}
        <AmanahToggle
          isAmanah={isAmanah}
          onToggle={() => setAmanah(!isAmanah)}
          gamify={gamify}
        />
      </div>

      {/* Chart + Table side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
            Proporsi Distribusi Dana
          </h3>
          <div className="max-w-xs mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
            Data Ziswaf (Editable)
          </h3>
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="ziswaf"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {['mean', 'median', 'modus', 'min', 'max', 'count'].map((type) => (
          <StatCard
            key={type}
            type={type}
            value={stats[type]}
            onView={(tp) => { if (['mean','median','modus'].includes(tp)) onStatView?.() }}
            formatter={['mean','median','min','max'].includes(type) ? formatRp : undefined}
          />
        ))}
      </div>

      {/* Tawazun hint */}
      <div className="px-4 py-3 rounded-xl bg-teal-50/60 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900 text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
        ⚖️ <strong>Tawazun:</strong> Keseimbangan dalam distribusi adalah kunci transparansi lembaga filantropi Islam.
      </div>
    </div>
  )
}

