// ============================================================
// MainLayout — Responsive grid: sidebar (desktop) + content
// Mobile: full-width content + bottom padding for BottomNav
// ============================================================
import { User, Trophy, Star } from 'lucide-react'

export function MainLayout({ sidebar, children, profile, gamify, activeModule }) {
  const moduleTitles = {
    ziswaf: 'Ziswaf & Keadilan',
    tahfizh: 'Progres Tahfizh',
    qurban: 'Manajemen Qurban',
    literasi: 'Literasi Digital',
    sus: 'Evaluasi Sistem',
    certificate: 'Sertifikat Anda'
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-[calc(100vh-3.5rem)] bg-slate-50/60 dark:bg-slate-900/60">
      {/* ── MOBILE ONLY: Profile & Context Strip ── */}
      <div className="sm:hidden sticky top-14 z-20 glass-card mx-3 mt-3 px-4 py-2.5 flex items-center justify-between border-emerald-500/20 shadow-xl no-print bg-white/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none mb-0.5">
              {profile?.nama || 'Siswa'}
            </p>
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 leading-none">
              {moduleTitles[activeModule] || 'Dashboard'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
              Lvl {gamify.level}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300">
                {gamify.points}
              </span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
          <Trophy className={`w-5 h-5 ${gamify.level >= 6 ? 'text-amber-500 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`} />
        </div>
      </div>

      {/* Sidebar — desktop only (sm+) */}
      <div className="hidden sm:block border-r border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
        {sidebar}
      </div>

      {/* Content area — extra bottom padding on mobile for BottomNav */}
      <main
        className="flex-1 overflow-auto p-3 sm:p-6 pb-28 sm:pb-6"
        id="main-content"
        role="main"
      >
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
