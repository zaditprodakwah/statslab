// ============================================================
// Sidebar — Module navigation + progress panel
// Active state: left border indicator (CSS: .sidebar-nav-item)
// ============================================================
import { BookOpen, TrendingUp, Users, Library, Award, BarChart3, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { LevelProgressBar } from '../gamification/LevelProgressBar'
import { BadgeGallery } from '../gamification/BadgeGallery'
import { AdminReset } from '../ui/AdminReset'

const MODULE_ITEMS = [
  { id: 'ziswaf',   icon: TrendingUp, navKey: 'nav.ziswaf',   color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'tahfizh',  icon: BookOpen,   navKey: 'nav.tahfizh',  color: 'text-blue-600 dark:text-blue-400' },
  { id: 'qurban',   icon: Users,      navKey: 'nav.qurban',   color: 'text-amber-600 dark:text-amber-400' },
  { id: 'literasi', icon: Library,    navKey: 'nav.literasi', color: 'text-violet-600 dark:text-violet-400' },
]

export function Sidebar({ activeModule, onModuleChange, profile, gamify }) {
  const { t } = useLanguage()

  return (
    <aside className="w-60 flex-shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto no-print">
      <div className="h-full flex flex-col py-4 px-3 gap-4">

        {/* Profile chip */}
        {profile && (
          <div className="glass-card px-3 py-2.5">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{profile.nama}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile.kelas} · {profile.sekolah}</p>
          </div>
        )}

        {/* Level progress */}
        <div className="glass-card px-3 py-3">
          <LevelProgressBar level={gamify.level} points={gamify.points} />
        </div>

        {/* Current Mission - Added for clarity */}
        <div className="px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            🚀 Misi Auditor
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
            {gamify.level === 1 && "Coba edit nominal di tabel data untuk menguji sistem!"}
            {gamify.level === 2 && "Buka modul lain di navigasi bawah untuk eksplorasi!"}
            {gamify.level === 3 && "Klik salah satu kartu statistik (Mean/Median/Modus)!"}
            {gamify.level === 4 && "Temukan anomali di tabel dan klik tombol konfirmasi!"}
            {gamify.level === 5 && "Gunakan saklar 'Skala Amanah' untuk verifikasi akhir!"}
            {gamify.level >= 6 && "Selamat! Anda telah menjadi Auditor Profesional."}
          </p>
        </div>

        {/* Modules nav */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
            {t('nav.modules')}
          </p>
          <nav aria-label="Modul pembelajaran">
            {MODULE_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeModule === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onModuleChange(item.id)}
                  className={`sidebar-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 mb-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    isActive
                      ? 'active bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                  tabIndex={0}
                  id={`nav-module-${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? item.color : 'text-slate-400'}`} />
                  <span className="truncate">{t(item.navKey)}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-emerald-500 flex-shrink-0" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Progress + Certificate nav */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
            {t('gamify.yourLevel')}
          </p>
          <button
            onClick={() => onModuleChange('certificate')}
            className={`sidebar-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeModule === 'certificate'
                ? 'active bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            } ${gamify.level < 6 ? 'opacity-60' : ''}`}
            tabIndex={0}
            id="nav-certificate"
            title={gamify.level < 6 ? t('gamify.certificateUnlock') : t('nav.certificate')}
          >
            <Award className={`w-4 h-4 flex-shrink-0 ${gamify.level >= 6 ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="truncate">{t('nav.certificate')}</span>
            {gamify.level >= 6 && <span className="ml-auto text-amber-500 text-xs">✓</span>}
          </button>
        </div>

        {/* Badges */}
        <div className="glass-card px-3 py-3">
          <BadgeGallery earnedBadges={gamify.badges} />
        </div>

        {/* Tawazun hint */}
        <div className="px-3 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            <span className="font-semibold">⚖️ Tawazun</span><br />
            Jangan hanya lihat Mean. Bandingkan dengan Median & Modus!
          </p>
        </div>

        {/* Spacer + Admin Reset */}
        <div className="mt-auto flex justify-center">
          <AdminReset />
        </div>
      </div>
    </aside>
  )
}
