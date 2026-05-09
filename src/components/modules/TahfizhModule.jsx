// ============================================================
// TahfizhModule — Line Chart, Focus: Median
// Shows monthly Quran memorization progress
// Enhanced: Tabayyun + Educational theory panel
// ============================================================
import { useState, useMemo, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { TabayyunAlert } from '../ui/TabayyunAlert'
import { useStats } from '../../hooks/useStats'
import { useTabayyun } from '../../hooks/useTabayyun'
import { AmanahToggle } from '../ui/AmanahToggle'
import { ScenarioSwitcher } from '../common/ScenarioSwitcher'
import { PRESET_TAHFIZH, PRESET_TAHFIZH_NORMAL } from '../../data/presetData'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const COLUMNS = [
  { field: 'id', type: 'number', editable: false },
  { field: 'bulan', type: 'text', labelKey: 'bulan' },
  { field: 'halaman', type: 'number', labelKey: 'halaman' },
]

export function TahfizhModule({ 
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

  const [scenario, setScenario] = useState('anomali')

  const handleScenarioChange = (s) => {
    setScenario(s)
    if (s === 'normal') {
      setData(PRESET_TAHFIZH_NORMAL)
    } else {
      setData(PRESET_TAHFIZH)
    }
  }

  const values = useMemo(() => data.map((r) => r.halaman), [data])
  const stats = useStats(values)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  // Immediate notification on anomaly detection
  useEffect(() => {
    if (tabayyun.isAnomalous && !tabayyunConfirmed && gamify.notify) {
      gamify.notify(
        'Anomali Terdeteksi!', 
        'Median data hafalan bergeser. Ada ketidakkonsistenan data.', 
        'warning',
        'Scroll ke bawah ke panel "Peringatan Anomali" dan lakukan audit Tabayyun untuk menyeimbangkan data hafalan.'
      )
    }
  }, [tabayyun.isAnomalous, tabayyunConfirmed, gamify.notify])

  const chartData = {
    labels: data.map((r) => r.bulan),
    datasets: [{
      label: 'Halaman Hafalan',
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
        min: isAmanah ? 0 : undefined,
        ticks: { stepSize: 5, font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { ticks: { font: { size: 11 } } },
    },
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Module header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          📖 {t('modules.tahfizh.title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('modules.tahfizh.desc')}</p>
        <div className="flex gap-2 mt-2">
          <span className="stat-badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            🎯 {t('modules.tahfizh.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Line Chart
          </span>
        </div>
      </div>

      {/* Educational Context */}
      <div className="px-4 py-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
        <p className="font-semibold mb-1">💡 Mengapa Median (Nilai Tengah) penting di sini?</p>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Median</strong> mengurutkan data dan mengambil nilai tengahnya. Berbeda dengan Mean, Median <strong>kebal terhadap outlier</strong>. Jika ada satu bulan dimana hafalan melesat secara tidak wajar, Median tetap menggambarkan kemampuan hafalan rata-rata siswa yang sesungguhnya.
        </p>
      </div>

      {/* Scenario Switcher & Narrative */}
      <div className="space-y-3">
        <ScenarioSwitcher currentScenario={scenario} onChange={handleScenarioChange} />
        
        {scenario === 'normal' ? (
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-900/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-1">📖 Cerita Data: Kondisi Stabil</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Perkembangan hafalan siswa terlihat stabil dan konsisten. Nilai <strong>Mean</strong> dan <strong>Median</strong> sejalan. Ini adalah representasi data yang sehat dan tanpa bias.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 animate-in fade-in">
            <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">📖 Cerita Data: Bias Klaim Progres (Anomali)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Di bulan September, laporan hafalan mencapai angka fantastis (95 halaman). Nilai <strong>Mean</strong> tertarik naik sehingga memberikan ilusi bahwa rata-rata hafalan bulanan sangat tinggi. Namun, perhatikan nilai <strong>Median</strong>! Ia tetap diam di angka belasan. Tabayyun diperlukan untuk memeriksa keaslian data bulan September ini.
            </p>
          </div>
        )}
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
          isMissionTarget={gamify.level === 5}
        />

        <AmanahToggle 
          isAmanah={isAmanah} 
          onToggle={() => setAmanah(!isAmanah)} 
          gamify={gamify}
          isMissionTarget={gamify.level === 6}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Tren Progres Hafalan</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Data Bulanan</h3>
          <DataTable
            data={data}
            setData={setData}
            columns={COLUMNS}
            onEdit={onEdit}
            moduleId="tahfizh"
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
            isMissionTarget={gamify.level === 4 && ['mean','median','modus'].includes(type)}
          />
        ))}
      </div>

      {/* Tawazun hint */}
      <div className="px-4 py-3 rounded-xl bg-teal-50/60 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900 text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
        ⚖️ <strong>Tawazun:</strong> Perhatikan apakah garis Median (kuning) mendekati rata-rata titik data (biru). Jika jauh berbeda, data mungkin tidak seimbang.
      </div>
    </div>
  )
}

