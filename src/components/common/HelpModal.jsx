import { X, Info, ShieldCheck, Database, Award, HelpCircle } from 'lucide-react'

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const steps = [
    {
      icon: Database,
      title: "Eksplorasi Data",
      desc: "Ubah angka pada tabel di bawah grafik untuk melihat perubahan visual secara langsung. Grafik akan merespons dalam waktu kurang dari 50ms (Antigravity Protocol)."
    },
    {
      icon: ShieldCheck,
      title: "Misi Utama: Integritas",
      desc: "Capai Level 6 dengan mendeteksi anomali data (Nilai tidak wajar) dan memastikan grafik jujur. Ingat: Nilai statistik yang benar tidak memanipulasi sumbu Y."
    },
    {
      icon: HelpCircle,
      title: "Tabayyun & Amanah",
      desc: "Tabayyun berarti mengecek kebenaran data sebelum menyimpulkan. Amanah berarti menyajikan data apa adanya tanpa manipulasi visual yang menyesatkan."
    },
    {
      icon: Award,
      title: "Sertifikat & Evaluasi",
      desc: "Sertifikat Digital dan Form Evaluasi (SUS) hanya dapat diakses setelah kamu menyelesaikan misi utama dan mencapai Level 6."
    }
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <HelpCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Panduan StatsLab</h2>
              <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase">Cara Bermain & Eksplorasi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="glass-card p-5 border-slate-800 hover:border-emerald-500/30 transition-all group">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex gap-4 items-start">
              <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Sistem ini menggunakan penyimpanan lokal (<span className="text-emerald-400">LocalStorage</span>). 
                Progres belajar kamu akan tetap tersimpan di perangkat ini selama cache browser tidak dibersihkan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
          >
            SIAP, MULAI BELAJAR!
          </button>
        </div>
      </div>
    </div>
  )
}
