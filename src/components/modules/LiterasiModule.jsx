import { useState, useMemo, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
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
import { ScenarioSwitcher } from '../common/ScenarioSwitcher'
import { PRESET_LITERASI, PRESET_LITERASI_NORMAL } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'
import { Lightbulb } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

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
  gamify,
  scenario
}) {
  const { t } = useLanguage()

  // Literasi uses 'jumlah' field from PRESET_LITERASI
  const values = useMemo(() => (data || []).map((r) => r.jumlah ?? 0), [data])
  const stats = useStats(values)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  useEffect(() => {
    if (tabayyun.isAnomalous && !tabayyunConfirmed && gamify.notify) {
      gamify.notify(
        'Anomali Sirkulasi!', 
        'Sistem mendeteksi lonjakan ekstrem pada kategori tertentu.', 
        'warning',
        'Cek data perpustakaan. Apakah ada "peminjaman fiktif" atau stok buku yang tidak wajar?'
      )
    }
  }, [tabayyun.isAnomalous, tabayyunConfirmed, gamify.notify])

  const chartData = useMemo(() => ({
    labels: data.map((r) => r.kategori),
    datasets: [
      {
        label: 'Sirkulasi Buku',
        data: values,
        backgroundColor: values.map(v => v > 150 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(16, 185, 129, 0.8)'),
        borderColor: values.map(v => v > 150 ? 'rgba(244, 63, 94, 1)' : 'rgba(16, 185, 129, 1)'),
        borderWidth: 2,
        borderRadius: 12,
        barThickness: 40,
      }
    ],
  }), [data, values])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: isAmanah,
        min: isAmanah ? 0 : Math.min(...values) * 0.8,
        ticks: { font: { size: 10, weight: 'bold' }, color: '#94a3b8' },
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
      },
      x: { 
        ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' },
        grid: { display: false }
      },
    },
  }), [isAmanah, values])


  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Module header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
            📚 {t('modules.literasi.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">{t('modules.literasi.desc')}</p>
        </div>
        <div className="flex gap-2">
          <span className="stat-badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-black uppercase italic text-[10px]">
            📊 Modus & Frekuensi
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase italic text-[10px]">
            Bar Chart
          </span>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION & DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-2 border-slate-100 dark:border-slate-800/50">
          <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            Perbandingan Sirkulasi per Kategori
          </h3>
          <div className="h-[300px] md:h-[400px] w-full relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-6 border-2 border-slate-100 dark:border-slate-800/50">
          <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            Log Inventaris Perpustakaan
          </h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
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
      </div>

      {/* 3. QUICK STATS */}
      <div className="stats-grid">
        {['mean', 'median', 'modus', 'min', 'max', 'count'].map((type) => (
          <StatCard
            key={type}
            type={type}
            value={stats[type]}
            onView={(tp) => { if (['mean','median','modus'].includes(tp)) onStatView?.() }}
            isMissionTarget={gamify.level === 4 && ['mean','median','modus'].includes(type)}
          />
        ))}
      </div>

      {/* 4. IMPACT ALERTS & VALIDATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          isMissionTarget={gamify.level === 5}
        />

        <AmanahToggle 
          isAmanah={isAmanah} 
          onToggle={() => setAmanah(!isAmanah)} 
          gamify={gamify}
          isMissionTarget={gamify.level === 6}
        />
      </div>

      {/* 5. NARRATIVE & CONTEXT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          
          {scenario === 'normal' ? (
            <div className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
              <h4 className="font-black text-emerald-800 dark:text-emerald-300 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                📖 Auditor Note: Distribusi Berimbang
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                Peminjaman buku stabil. Tidak ada kategori yang mendominasi secara tidak wajar. Mean dan Median berdekatan.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-rose-50/60 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
              <h4 className="font-black text-rose-800 dark:text-rose-300 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                📖 Auditor Note: Lonjakan Ekstrem!
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-medium">
                Kategori "Sains" melonjak 7x lipat dari kategori lain. Ini menarik Mean menjauhi Median. Selidiki sumber data!
              </p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group shadow-xl">
          <div className="relative z-10">
            <h4 className="font-black text-emerald-400 text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
              Esensi Statistik
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Jika <strong>Mean &gt; Median</strong>, data miring ke kanan (Positive Skew). Dalam audit perpustakaan, ini tanda adanya "Best Seller" yang tidak wajar atau kesalahan input stok.
            </p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-bold italic">
              ⚖️ Keadilan Literasi: Pastikan semua kategori buku mendapat atensi yang layak.
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Bar size={120} />
          </div>
        </div>
      </div>
    </div>
  )
}
