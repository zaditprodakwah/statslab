// ============================================================
// QurbanModule — Grouped Bar Chart, Focus: Modus
// Shows Qurban distribution target vs realization
// Enhanced: Tabayyun + Educational theory panel
// ============================================================
import { useState, useMemo, useEffect } from 'react'
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
import { ScenarioSwitcher } from '../common/ScenarioSwitcher'
import { PRESET_QURBAN, PRESET_QURBAN_NORMAL } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'
import { Lightbulb } from 'lucide-react'

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
  gamify,
  scenario
}) {
  const { t } = useLanguage()


  const realisasiValues = useMemo(() => data.map((r) => r.realisasi), [data])
  const stats = useStats(realisasiValues)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  // Immediate notification on anomaly detection
  useEffect(() => {
    if (tabayyun.isAnomalous && !tabayyunConfirmed && gamify.notify) {
      gamify.notify(
        'Anomali Terdeteksi!', 
        'Distribusi hewan qurban antar desa tidak merata.', 
        'warning',
        'Cek panel Peringatan Anomali di bawah. Bandingkan Target vs Realisasi untuk menemukan desa yang terabaikan.'
      )
    }
  }, [tabayyun.isAnomalous, tabayyunConfirmed, gamify.notify])

  const chartData = useMemo(() => ({
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
  }), [data, t])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
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
  }), [isAmanah])


  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Module header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
            🐄 {t('modules.qurban.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">{t('modules.qurban.desc')}</p>
        </div>
        <div className="flex gap-2">
          <span className="stat-badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-black uppercase italic text-[10px]">
            📊 {t('modules.qurban.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase italic text-[10px]">
            Bar Chart
          </span>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION & DATA (CRITICAL TOP PRIORITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card p-6 border-2 border-slate-100 dark:border-slate-800/50">
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            Perbandingan Target vs Realisasi
          </h3>
          <div className="h-[300px] md:h-[400px] w-full relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card p-6 border-2 border-slate-100 dark:border-slate-800/50">
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            Data Distribusi Desa (Real-time Audit)
          </h3>
          <div className="max-h-[300px] overflow-y-auto">
            <DataTable
              data={data}
              setData={setData}
              columns={COLUMNS}
              onEdit={onEdit}
              moduleId="qurban"
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

      {/* 5. NARRATIVE & CONTEXT (Moved down) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          
          {scenario === 'normal' ? (
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-left">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                📖 Cerita Data: Distribusi Merata
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                Distribusi hewan Qurban berjalan sesuai target. Angka realisasi pada tiap desa sangat mendekati angka target yang direncanakan. Ini menunjukkan manajemen penyaluran yang amanah dan terencana dengan baik.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 animate-in slide-in-from-left">
              <h4 className="font-black text-amber-800 dark:text-amber-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                📖 Cerita Data: Over-realization (Anomali)
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                Perhatikan desa Sukarame! Target awal hanya 30, tetapi realisasinya mencapai 150 ekor hewan Qurban. Lonjakan drastis ini mungkin terjadi karena banyak pekurban mendadak memilih desa ini tanpa koordinasi. Tabayyun diperlukan!
              </p>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="font-black text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Mengapa Modus Penting?
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
            <strong>Modus</strong> menunjukkan angka realisasi yang paling sering muncul antar desa. Jika modus rendah, berarti mayoritas desa menerima distribusi minimal — ini menandakan <strong>ketimpangan</strong>. Modus membantu kita melihat pola dominan yang mungkin tersembunyi.
          </p>
          <div className="mt-4 px-3 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/50 dark:border-emerald-800 text-[10px] text-emerald-600 dark:text-emerald-400 italic">
            ⚖️ <strong>Tawazun:</strong> Bandingkan kolom Target vs Realisasi. Apakah distribusi sudah adil?
          </div>
        </div>
      </div>
    </div>
  )
}
