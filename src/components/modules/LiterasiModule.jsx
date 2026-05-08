// ============================================================
// LiterasiModule — Horizontal Bar Chart, Focus: Modus + Freq
// Shows library book category distribution
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

export function LiterasiModule({ onEdit, onStatView, onTabayyun, onAmanah }) {
  const { t } = useLanguage()
  const [data, setData] = useState(PRESET_LITERASI)
  const { isAmanah, toggleAmanah, yMin } = useAmanah(true)

  const jumlahValues = useMemo(() => data.map((r) => r.jumlah), [data])
  const stats = useStats(jumlahValues)
  const tabayyun = useTabayyun(stats.mean, stats.median)

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
      </div>

      {/* Educational Context */}
      <div className="px-4 py-3 rounded-xl bg-violet-50/60 dark:bg-violet-900/15 border border-violet-100 dark:border-violet-900 text-sm text-violet-800 dark:text-violet-300 leading-relaxed">
        <p className="font-semibold mb-1">💡 Frekuensi & Modus dalam Literasi</p>
        <p className="text-xs text-violet-700 dark:text-violet-400">
          Dalam konteks perpustakaan, <strong>frekuensi peminjaman</strong> per kategori buku menunjukkan minat literasi siswa. <strong>Modus</strong> (kategori dengan frekuensi tertinggi) mengungkap kecenderungan baca yang dominan — informasi penting bagi pustakawan untuk mengalokasikan koleksi secara proporsional.
        </p>
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

      {/* Tabayyun Alert */}
      <TabayyunAlert
        isAnomalous={tabayyun.isAnomalous}
        mean={stats.mean}
        median={stats.median}
        diff={tabayyun.diff}
        threshold={tabayyun.threshold}
        severity={tabayyun.severity}
        onDetected={onTabayyun}
      />

      <AmanahToggle isAmanah={isAmanah} onToggle={toggleAmanah} onFirstToggle={onAmanah} />

      {/* Tawazun hint */}
      <div className="px-4 py-3 rounded-xl bg-teal-50/60 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900 text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
        ⚖️ <strong>Tawazun:</strong> Jika satu kategori buku sangat mendominasi, apakah itu positif atau justru menandakan minimnya keragaman literasi? Bandingkan Mean dan Modus untuk perspektif yang seimbang.
      </div>
    </div>
  )
}
