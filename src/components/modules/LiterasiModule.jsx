// ============================================================
// LiterasiModule — Horizontal Bar Chart, Focus: Modus + Freq
// Shows library book category distribution
// Enhanced: Tabayyun + Educational theory panel
// ============================================================
import { useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { TabayyunAlert } from '../ui/TabayyunAlert'
import { useStats } from '../../hooks/useStats'
import { useTabayyun } from '../../hooks/useTabayyun'
import { AmanahToggle } from '../ui/AmanahToggle'
import { PRESET_LITERASI } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'kategori', type: 'text', labelKey: 'category' },
  { field: 'jumlah', type: 'number', labelKey: 'jumlah' },
]

export function LiterasiModule({ 
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

  const realisasiValues = useMemo(() => data.map((r) => r.realisasi || r.jumlah), [data])
  const stats = useStats(realisasiValues)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  // Immediate notification on anomaly detection
  useEffect(() => {
    if (tabayyun.isAnomalous && !tabayyunConfirmed && gamify.notify) {
      gamify.notify(
        'Anomali Terdeteksi!', 
        'Data sirkulasi buku menunjukkan ketimpangan. Cek Outlier.', 
        'warning',
        5000
      )
    }
  }, [tabayyun.isAnomalous, tabayyunConfirmed, gamify.notify])

  const chartData = {
    labels: data.map((r) => r.lembaga || r.kategori),
    datasets: [
      {
        label: t('table.target'),
        data: data.map((r) => r.target || r.jumlah * 0.8),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: t('table.realisasi'),
        data: realisasiValues,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
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
          📚 {t('modules.literasi.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.literasi.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
            📊 {t('modules.literasi.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Line Chart
          </span>
        </div>
      </div>

      {/* Educational Context */}
      <div className="px-4 py-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-900 text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed shadow-sm">
        <p className="font-semibold mb-1">💡 Memahami Skewness (Kemiringan Data)</p>
        <p className="text-xs text-indigo-700 dark:text-indigo-400">
          Jika <strong>Mean</strong> jauh lebih besar dari <strong>Median</strong>, data kita "miring ke kanan" (positive skew). Ini artinya ada lembaga yang menerima bantuan sangat besar sementara mayoritas lainnya jauh di bawah rata-rata. Audit literasi bukan hanya soal total buku, tapi soal <strong>aksesibilitas yang merata</strong>. Tanpa membandingkan mean dan median, kita mungkin mengira literasi sudah baik padahal hanya terpusat di satu titik.
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
          isMissionTarget={gamify.level === 4}
        />

        <AmanahToggle 
          isAmanah={isAmanah} 
          onToggle={() => setAmanah(!isAmanah)} 
          gamify={gamify}
          isMissionTarget={gamify.level === 5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Tren Realisasi vs Target</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Audit Distribusi Buku</h3>
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="literasi"
            gamify={gamify}
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

      {/* Tawazun hint */}
      <div className="px-4 py-3 rounded-xl bg-teal-50/60 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900 text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
        ⚖️ <strong>Tawazun:</strong> Audit keadilan distribusi. Apakah satu lembaga mendominasi bantuan buku?
      </div>
    </div>
  )
}
