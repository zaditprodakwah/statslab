// ============================================================
// ResearcherPortal.jsx — Expert Validation & Research Hub
// Hidden behind "Magic Entry" (5x Logo clicks)
// Features: Expert Validation Sheet (Materials, Media, Religion)
// ============================================================
import { useState } from 'react'
import { ShieldCheck, FileText, BarChart3, Printer, X, BookOpen, AlertCircle, Database, Zap, RefreshCcw } from 'lucide-react'
import { ExpertValidationHub } from './ExpertValidationHub'

export function ResearcherPortal({ onExit, profile, gamify }) {
  const [activeTab, setActiveTab] = useState('validation')
  const [isAuthorized, setIsAuthorized] = useState(false)

  const handleGodMode = () => {
    if (confirm('🚀 Aktifkan God Mode (Unlock Level 6)?\n\nIni akan membuka Sertifikat dan Form SUS secara instan untuk keperluan demonstrasi atau audit.')) {
      gamify.godMode()
      onExit()
    }
  }

  const handleNukeData = () => {
    if (confirm('⚠️ HAPUS SELURUH DATA PENELITIAN?\n\nTindakan ini akan menghapus draf validator, progres siswa, dan profil. Perangkat akan kembali ke kondisi awal (Fresh Start).')) {
      gamify.resetAll?.() || localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  const categories = [
    { id: 'validation', label: 'Validasi Ahli', icon: ShieldCheck },
    { id: 'monitoring', label: 'Monev SUS', icon: BarChart3 },
    { id: 'docs', label: 'Knowledge Base', icon: BookOpen },
    { id: 'admin', label: 'Admin Tools', icon: FileText }
  ]

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
            <p className="text-slate-300 text-sm leading-relaxed">
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
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fade-in overflow-hidden print:static print:overflow-visible print:bg-white print:z-auto">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase italic">Portal Peneliti</h1>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Research & Development Edition</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {/* Navigation Sidebar */}
        <aside className="w-72 border-r border-slate-800 bg-slate-900/30 p-6 hidden md:flex flex-col no-print print:hidden">
          <nav className="space-y-2 flex-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all border ${
                  activeTab === cat.id 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40 translate-x-2' 
                    : 'text-slate-500 border-transparent hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label.toUpperCase()}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto p-5 rounded-3xl bg-slate-800/30 border border-slate-800/50">
            <h3 className="text-slate-300 text-[10px] font-black mb-3 uppercase tracking-widest">Peneliti Aktif</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="text-emerald-500 font-black text-sm">{profile.nama?.charAt(0) || 'R'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">{profile.nama || 'Researcher'}</p>
                <p className="text-slate-300 text-[10px] truncate">{profile.sekolah || 'StatsLab Unit'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-slate-950 relative print:p-0 print:bg-white print:overflow-visible">
          {activeTab === 'validation' && <ExpertValidationHub />}

          {activeTab === 'monitoring' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Monitoring SUS Real-time</h2>
                <p className="text-slate-300">Data evaluasi kepraktisan media dari Google Sheets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Status API</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-white font-black">Connected</p>
                  </div>
                </div>
                <div className="glass-card p-6 border-purple-500/20 bg-purple-500/5">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Target N</p>
                  <p className="text-white font-black">30 Responden</p>
                </div>
                <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Platform</p>
                  <p className="text-white font-black">SheetDB Cloud</p>
                </div>
              </div>

              <div className="aspect-video bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sinkronisasi SheetDB</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
                  Skor System Usability Scale (SUS) dikalkulasi secara otomatis oleh aplikasi dan dikirim ke basis data terpusat untuk analisis validitas Aiken's V.
                </p>
                <a 
                  href="https://docs.google.com/spreadsheets/d/11Yf7ln0Lr3t_O7sUl3c8iJ2AsaVnnkDCNtZYWYI-QYs/edit"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  BUKA DATA SHEET <RefreshCcw className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Knowledge Base</h2>
                <p className="text-slate-400">Panduan operasional dan manajemen infrastruktur riset.</p>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    icon: Zap,
                    title: "Magic Entry Logic",
                    desc: "Sistem diamankan menggunakan 'Debounced Trigger' pada logo di Header. Akses portal ini terbuka setelah logo diklik sebanyak 5 kali dalam rentang waktu 2 detik."
                  },
                  {
                    icon: Database,
                    title: "Data Persistence & Integrity",
                    desc: "Aplikasi menggunakan arsitektur Offline-first. Profil siswa dan progres belajar disimpan di LocalStorage, sementara draf validator disimpan di SessionStorage untuk mencegah kehilangan data akibat refresh."
                  },
                  {
                    icon: RefreshCcw,
                    title: "Reset Protocol",
                    desc: "Sangat penting untuk menekan tombol 'NUKE DATA' di Admin Tools sebelum memberikan perangkat uji coba ke responden baru. Ini menghapus seluruh identitas, skor, dan progres level siswa agar data penelitian tidak tercampur.",
                    color: "red"
                  },
                  {
                    icon: ShieldCheck,
                    title: "God Mode (Unlock Level 6)",
                    desc: "Fitur ini memungkinkan auditor melompati modul pembelajaran (Level 1-5) untuk langsung menguji fungsionalitas Sertifikat dan Formulir SUS di Level 6 tanpa harus mengisi kuis/latihan secara manual."
                  }
                ].map((doc, i) => (
                  <div key={i} className={`glass-card p-6 border-slate-800 bg-slate-900/30 flex gap-6 items-start ${doc.color === 'red' ? 'border-red-500/20 bg-red-500/5' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${doc.color === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <doc.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className={`font-black text-lg ${doc.color === 'red' ? 'text-red-400' : 'text-white'}`}>{doc.title}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{doc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Admin Tools</h2>
                <p className="text-slate-400">Kendali tingkat tinggi untuk manajemen sesi penelitian.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={handleGodMode}
                  className="p-8 bg-amber-950/20 border border-amber-900/30 rounded-[2.5rem] text-left hover:bg-amber-950/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-20 h-20 text-amber-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                      <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase">God Mode</span>
                    </div>
                    <h4 className="text-amber-400 font-black text-xl mb-2">Unlock Level 6</h4>
                    <p className="text-amber-900 text-xs font-bold uppercase tracking-widest leading-relaxed">Instantly unlock Certificate & SUS Form</p>
                  </div>
                </button>

                <button 
                  onClick={handleNukeData}
                  className="p-8 bg-red-950/20 border border-red-900/30 rounded-[2.5rem] text-left hover:bg-red-950/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <RefreshCcw className="w-20 h-20 text-red-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                        <RefreshCcw className="w-6 h-6 text-red-500" />
                      </div>
                      <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase">Danger Zone</span>
                    </div>
                    <h4 className="text-red-400 font-black text-xl mb-2">Nuke Data</h4>
                    <p className="text-red-900 text-xs font-bold uppercase tracking-widest leading-relaxed">Clear LocalStorage for next respondent</p>
                  </div>
                </button>
              </div>

              <div className="glass-card p-8 border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h4 className="text-slate-300 font-black text-[10px] uppercase tracking-widest mb-1">Technical Audit Trail</h4>
                  <p className="text-slate-300 font-mono text-sm">Build: v1.0.0-RESEARCH-STABLE</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
