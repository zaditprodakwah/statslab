// ============================================================
// ResearcherPortal.jsx — Expert Validation & Research Hub
// Hidden behind "Magic Entry" (5x Logo clicks)
// Features: Expert Validation Sheet (Materials, Media, Religion)
// ============================================================
import { useState } from 'react'
import { ShieldCheck, FileText, BarChart3, Printer, X, Save } from 'lucide-react'

export function ResearcherPortal({ onExit, profile }) {
  const [activeTab, setActiveTab] = useState('validation')
  const [validationData, setValidationData] = useState({
    materi: Array(5).fill(''),
    media: Array(5).fill(''),
    agama: Array(5).fill('')
  })

  const [isAuthorized, setIsAuthorized] = useState(false)

  const categories = [
    { id: 'validation', label: 'Validasi Ahli', icon: ShieldCheck },
    { id: 'monitoring', label: 'Monev SUS', icon: BarChart3 },
    { id: 'admin', label: 'Admin Tools', icon: FileText }
  ]

  const handlePrint = () => {
    window.print()
  }

  // ── Route Shield Overlay ──────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[110] bg-slate-950 flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full glass-card p-8 border-emerald-500/30 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">RESEARCHER SHIELD</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Halaman ini bersifat eksklusif untuk <span className="text-emerald-400 font-bold">Peneliti Utama</span> dan <span className="text-emerald-400 font-bold">Validator Pakar</span>. 
              Lanjutkan untuk mengakses instrumen validasi?
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => setIsAuthorized(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
            >
              YA, SAYA PENELITI
            </button>
            <button 
              onClick={onExit}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-all"
            >
              KEMBALI KE DASHBOARD
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">PORTAL PENELITI</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">StatsLab Research & Development Hub</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 hidden md:block">
          <nav className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === cat.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-10 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <h3 className="text-white text-xs font-bold mb-2 uppercase opacity-50">Current Profile</h3>
            <p className="text-emerald-400 text-sm font-bold truncate">{profile.name}</p>
            <p className="text-slate-500 text-xs">{profile.school}</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-950">
          {activeTab === 'validation' && (
            <div className="max-w-4xl mx-auto space-y-8 no-print">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Lembar Validasi Digital</h2>
                  <p className="text-slate-400 text-sm">Instrumen penilaian untuk Ahli Materi, Media, dan Agama.</p>
                </div>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all border border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  Cetak PDF (A4)
                </button>
              </div>

              {/* Validation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Materi', 'Media', 'Agama'].map((type) => (
                  <div key={type} className="glass-card p-5 border-slate-700 hover:border-emerald-500/50 transition-colors">
                    <h3 className="text-emerald-400 font-black mb-4 uppercase tracking-wider text-xs">Validator {type}</h3>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i}>
                          <label className="text-[10px] text-slate-500 font-bold mb-1 block">Indikator 0{i}</label>
                          <select className="w-full bg-slate-900 border border-slate-700 rounded-md text-xs text-white p-2 focus:ring-emerald-500">
                            <option>Sangat Layak (5)</option>
                            <option>Layak (4)</option>
                            <option>Cukup (3)</option>
                            <option>Kurang (2)</option>
                            <option>Sangat Kurang (1)</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-900/40">
                  <Save className="w-5 h-5" />
                  SIMPAN HASIL VALIDASI
                </button>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-white">Monitoring SUS Real-time</h2>
              <div className="aspect-video bg-slate-900 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-10">
                <BarChart3 className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-slate-400 font-bold">SheetDB Data Integration</h3>
                <p className="text-slate-600 text-sm max-w-sm">Data evaluasi dari Google Sheets akan ditarik secara otomatis ke sini untuk analisis kepraktisan media.</p>
                <a 
                  href="https://docs.google.com/spreadsheets/d/11Yf7ln0Lr3t_O7sUl3c8iJ2AsaVnnkDCNtZYWYI-QYs/edit#gid=0"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 text-emerald-500 font-bold hover:underline text-sm"
                >
                  Buka Google Sheets Langsung →
                </a>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-white">Admin Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* God Mode Switch */}
                <button 
                  onClick={() => {
                    // Logic to force Level 6
                    localStorage.setItem('statslab_level', '6');
                    window.location.reload();
                  }}
                  className="p-6 bg-amber-950/30 border border-amber-900/50 rounded-2xl text-left hover:bg-amber-950/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-amber-400 font-bold">God Mode (Unlock Lvl 6)</h4>
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded">RAHASIA</span>
                  </div>
                  <p className="text-amber-900 text-xs font-medium group-hover:text-amber-700">Memaksa sistem membuka seluruh akses (Sertifikat & SUS) secara instan untuk kebutuhan demonstrasi.</p>
                </button>

                {/* Reset Progress */}
                <button 
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl text-left hover:bg-red-950/50 transition-all group"
                >
                  <h4 className="text-red-400 font-bold mb-1">Nuke All Progress</h4>
                  <p className="text-red-900 text-xs font-medium group-hover:text-red-700">Menghapus seluruh LocalStorage dan mereset profil siswa.</p>
                </button>
              </div>

              <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left">
                <h4 className="text-slate-400 font-bold mb-1">Build Identifier</h4>
                <p className="text-slate-600 text-xs font-mono uppercase">v1.0.0-research-stable</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Print View Only - Hidden on Screen */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-10 font-serif">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold uppercase">Lembar Validasi Instrumen Penelitian</h1>
          <p className="text-sm">Produk: StatsLab — Dasbor Statistika Interaktif</p>
        </div>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2">Indikator Penilaian</th>
              <th className="border border-black p-2 w-20">Skor</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <tr key={i}>
                <td className="border border-black p-2 text-center">{i}</td>
                <td className="border border-black p-2">Deskripsi indikator instrumen riset {i}...</td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-20 flex justify-end">
          <div className="text-center w-64">
            <p>Jakarta, ____________ 2026</p>
            <p className="mt-2 mb-20 font-bold">Validator Ahli,</p>
            <p>(___________________________)</p>
            <p className="text-xs">NIP/NIDN.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
