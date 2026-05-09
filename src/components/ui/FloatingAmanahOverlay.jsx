// ============================================================
// FloatingAmanahOverlay — Interactive Scale Manipulation Test
// Demonstrates Honesty (Amanah) vs Deception (Bias) in Charts
// ============================================================
import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { X, ShieldCheck, AlertTriangle, Eye, EyeOff, Info } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function FloatingAmanahOverlay({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [showBias, setShowBias] = useState(false)

  if (!isOpen) return null

  const dataHonest = {
    labels: ['Program A', 'Program B'],
    datasets: [{
      label: 'Distribusi Dana',
      data: [950000, 1000000],
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)', 
        'rgba(20, 184, 166, 0.7)'
      ],
      borderColor: [
        'rgb(16, 185, 129)', 
        'rgb(20, 184, 166)'
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  }

  const optionsHonest = {
    responsive: true,
    scales: { 
      y: { 
        min: 0, 
        max: 1200000, 
        ticks: { 
          callback: (v) => v / 1000 + 'k',
          color: '#94a3b8',
          font: { size: 10 }
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { display: false }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  }

  const optionsBiased = {
    responsive: true,
    scales: { 
      y: { 
        min: 940000, 
        max: 1010000, 
        ticks: { 
          callback: (v) => v / 1000 + 'k',
          color: '#94a3b8',
          font: { size: 10 }
        },
        grid: { color: 'rgba(239, 68, 68, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { display: false }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Integritas Visual (Amanah)</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Uji Manipulasi Skala Sumbu-Y</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <AlertTriangle className="w-3 h-3" /> Waspada Bias Visual
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight uppercase italic tracking-tighter">
                Bagaimana Grafik Bisa "Berdusta"?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Memotong sumbu-Y (<em>Truncated Y-Axis</em>) adalah teknik manipulasi visual di mana skala tidak dimulai dari nol. Hal ini menciptakan <strong>ilusi perbedaan yang dramatis</strong> padahal kenyataannya selisih datanya sangat kecil.
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <p className="text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300 italic font-medium leading-relaxed">
                  "Wahai orang-orang yang beriman, jadilah kamu penegak keadilan, menjadi saksi karena Allah biarpun terhadap dirimu sendiri..." (QS. An-Nisa: 135)
                </p>
              </div>
            </div>

            {/* Interactive Toggle Card */}
            <div className="glass-card p-6 border-2 border-emerald-500/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Info className="w-5 h-5 text-emerald-500/50" />
               </div>
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Eksperimen Interaktif:</h4>
               <div className="space-y-4">
                  <button 
                    onClick={() => setShowBias(!showBias)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${showBias ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${showBias ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {showBias ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-black uppercase tracking-widest ${showBias ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {showBias ? 'Mode: Skala Bias' : 'Mode: Skala Amanah'}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">{showBias ? 'Sumbu-Y dipotong (940k - 1010k)' : 'Sumbu-Y mulai dari NOL'}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${showBias ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${showBias ? 'left-5' : 'left-1'}`} />
                    </div>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center italic leading-relaxed">
                    Klik tombol di atas untuk melihat bagaimana "Program B" tampak jauh lebih besar daripada "Program A" padahal selisihnya hanya 5%.
                  </p>
               </div>
            </div>
          </div>

          {/* Graphs Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Tampilan Jujur (Sumbu-Y dari 0)
              </h4>
              <div className="h-56 sm:h-64 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <Bar data={dataHonest} options={optionsHonest} />
              </div>
              <p className="text-[10px] text-center text-slate-400">Selisih data terlihat proporsional & jujur.</p>
            </div>
            <div className={`space-y-3 transition-all duration-700 ${showBias ? 'opacity-100 scale-100' : 'opacity-20 scale-95 grayscale'}`}>
              <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                Tampilan Manipulasi (Sumbu-Y Dipotong)
              </h4>
              <div className="h-56 sm:h-64 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border-2 border-rose-100 dark:border-rose-900/30">
                <Bar data={dataHonest} options={optionsBiased} />
              </div>
              <p className="text-[10px] text-center text-rose-500 font-bold animate-pulse">Program B seolah-olah "menang mutlak"!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Prinsip Amanah dalam Penyajian Data Statistika</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all active:scale-95 shadow-xl shadow-emerald-900/20"
          >
            SAYA MENGERTI PRINSIP INI
          </button>
        </div>
      </div>
    </div>
  )
}
