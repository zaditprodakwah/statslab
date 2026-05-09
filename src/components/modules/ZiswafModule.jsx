// ============================================================
// ZiswafModule — Pie Chart, Focus: Mean
// Shows distribution of Zakat, Infaq, Shadaqah & Wakaf
// Enhanced: Tabayyun + Educational theory panel
// ============================================================
import { useState, useMemo, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js'
import { DataTable } from '../ui/DataTable'
import { StatCard } from '../ui/StatCard'
import { TabayyunAlert } from '../ui/TabayyunAlert'
import { AmanahToggle } from '../ui/AmanahToggle'
import { ScenarioSwitcher } from '../common/ScenarioSwitcher'
import { Info, AlertTriangle, Lightbulb, BarChart3, Database } from 'lucide-react'
import { useStats } from '../../hooks/useStats'
import { useTabayyun } from '../../hooks/useTabayyun'
import { useLanguage } from '../../hooks/useLanguage'
import { PRESET_ZISWAF, PRESET_ZISWAF_NORMAL } from '../../data/presetData'

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

  const [scenario, setScenario] = useState('anomali')

  const handleScenarioChange = (s) => {
    setScenario(s)
    if (s === 'normal') {
      setData(PRESET_ZISWAF_NORMAL)
    } else {
      setData(PRESET_ZISWAF)
    }
  }

  const nominals = useMemo(() => data.map((r) => r.nominal), [data])
  const stats = useStats(nominals)
  const tabayyun = useTabayyun(stats.mean, stats.median)

  // Immediate notification on anomaly detection
  useEffect(() => {
    if (tabayyun.isAnomalous && !tabayyunConfirmed && gamify.notify) {
      gamify.notify(
        'Anomali Terdeteksi!', 
        'Rata-rata bergeser tajam. Distribusi dana tidak merata.', 
        'warning',
        'Scroll ke bawah ke panel "Peringatan Anomali" dan klik tombol "TABAYYUN SEKARANG" untuk memverifikasi data ini.'
      )
    }
  }, [tabayyun.isAnomalous, tabayyunConfirmed, gamify.notify])

  const chartData = useMemo(() => ({
    labels: data.map((r) => r.kategori),
    datasets: [{
      data: data.map((r) => r.nominal),
      backgroundColor: data.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.8)',
      hoverOffset: 8,
    }],
  }), [data])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12, family: 'Inter' } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: Rp ${ctx.parsed.toLocaleString('id-ID')}`,
        },
      },
    },
  }), [])


  const formatRp = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Module header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
            📊 {t('modules.ziswaf.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{t('modules.ziswaf.desc')}</p>
        </div>
        <div className="flex gap-2">
          <span className="stat-badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-black uppercase italic text-[10px]">
            📈 {t('modules.ziswaf.focus')}
          </span>
          <span className="stat-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase italic text-[10px]">
            Pie Chart
          </span>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION & DATA (CRITICAL TOP PRIORITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card p-4 sm:p-6 border-2 border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
          <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 self-start">
            <BarChart3 className="w-4 h-4" /> Proporsi Distribusi Dana
          </h3>
          <div className="h-[300px] md:h-[400px] w-full relative flex items-center justify-center">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card p-6 border-2 border-slate-100 dark:border-slate-800/50">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Data Ziswaf (Real-time Audit)
          </h3>
          <div className="max-h-[300px] overflow-y-auto">
            <DataTable
              data={data}
              setData={setData}
              columns={COLUMNS}
              onEdit={onEdit}
              moduleId="ziswaf"
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
            formatter={['mean','median','min','max'].includes(type) ? formatRp : undefined}
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
          <ScenarioSwitcher currentScenario={scenario} onChange={handleScenarioChange} />
          
          {scenario === 'normal' ? (
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-left">
              <h4 className="font-black text-blue-800 dark:text-blue-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Kondisi Ideal
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                Distribusi dana zakat berjalan normal. Bantuan disalurkan secara proporsional. Perhatikan bagaimana nilai <strong>Mean</strong> dan <strong>Median</strong> berdekatan, menandakan tidak ada ketimpangan ekstrim.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 animate-in slide-in-from-left">
              <h4 className="font-black text-rose-800 dark:text-rose-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Realitas Lapangan (Anomali)
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-medium">
                Terjadi lonjakan pengeluaran pada satu pos (outlier). Lihat bagaimana nilai <strong>Mean</strong> melonjak tajam, sementara <strong>Median</strong> stabil. Tabayyun diperlukan segera!
              </p>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="font-black text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Mengapa Mean Penting?
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
            <strong>Mean</strong> menghitung total dana dibagi jumlah kategori. Jika satu kategori menerima porsi raksasa, Mean akan terangkat jauh di atas Median. Ini adalah sinyal <strong>distribusi tidak merata</strong> yang harus diaudit.
          </p>
          <div className="mt-4 px-3 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/50 dark:border-emerald-800 text-[10px] text-emerald-600 dark:text-emerald-400 italic">
            ⚖️ <strong>Tawazun:</strong> Keseimbangan dalam distribusi adalah kunci transparansi lembaga filantropi Islam.
          </div>
        </div>
      </div>
    </div>
  )
}
