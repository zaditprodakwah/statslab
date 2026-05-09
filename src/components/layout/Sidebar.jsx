import { TrendingUp, Users, Library, Award, ChevronRight, Target, ShieldCheck, Compass, Settings, BookOpen } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { LevelProgressBar } from '../gamification/LevelProgressBar'
import { BadgeGallery } from '../gamification/BadgeGallery'
import { AdminReset } from '../ui/AdminReset'
import { PremiumIcon } from '../ui/PremiumIcons'
import { Tooltip } from '../ui/Tooltip'

const MODULE_ITEMS = [
  { id: 'ziswaf',   icon: 'ziswaf',   navKey: 'nav.ziswaf' },
  { id: 'tahfizh',  icon: 'tahfizh',  navKey: 'nav.tahfizh' },
  { id: 'qurban',   icon: 'qurban',   navKey: 'nav.qurban' },
  { id: 'literasi', icon: 'literasi', navKey: 'nav.literasi' },
]

const LEVEL_LABELS = {
  1: { title: "Pencari Data", theory: "Idiosinkratik", icon: "finder", color: "from-emerald-400 to-emerald-600 shadow-emerald-500/20" },
  2: { title: "Pelapor Data", theory: "Kolokuial", icon: "reporter", color: "from-blue-400 to-blue-600 shadow-blue-500/20" },
  3: { title: "Analis Junior", theory: "Tidak Konsisten", icon: "analyst", color: "from-amber-400 to-amber-600 shadow-amber-500/20" },
  4: { title: "Detektif Data", theory: "Konsisten Non-Kritis", icon: "detective", color: "from-purple-400 to-purple-600 shadow-purple-500/20" },
  5: { title: "Ahli Strategi", theory: "Kritis", icon: "strategist", color: "from-rose-400 to-rose-600 shadow-rose-500/20" },
  6: { title: "Master Data", theory: "Kritis Matematis", icon: "master", color: "from-indigo-400 to-indigo-600 shadow-indigo-500/20" },
}

export function Sidebar({ activeModule, onModuleChange, profile, gamify }) {
  const { t } = useLanguage()
  const currentRank = LEVEL_LABELS[gamify.level] || LEVEL_LABELS[1]

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/50 dark:bg-slate-950/20 border-r border-slate-200 dark:border-slate-800/50 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 no-print overflow-y-auto custom-scrollbar">
      
      {/* 1. Identity Section */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Tooltip 
            title={currentRank.title} 
            content={t(`gamify.tooltips.lvl${gamify.level}`)}
          >
            <div className="relative cursor-help">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentRank.color} shadow-lg flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 transition-transform hover:scale-105 duration-500`}>
                <PremiumIcon id={currentRank.icon} size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </Tooltip>
          <div className="min-w-0">
            <h3 className="font-black text-slate-800 dark:text-white truncate uppercase italic tracking-tighter leading-none">{profile?.nama || 'Siswa'}</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1.5">{profile?.kelas || 'Kelas'}</p>
          </div>
        </div>

        {/* Level Stats Panel */}
        <div className="glass-card p-5 border-2 border-slate-100 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Peringkat Akademik</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black italic">L{gamify.level}</span>
          </div>
          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter italic mb-1">{currentRank.title}</h4>
          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-4">Tahap: {currentRank.theory}</p>
          <LevelProgressBar level={gamify.level} points={gamify.points} />
        </div>
      </div>

      {/* 2. Navigation */}
      <div className="flex-1 px-4 pb-6 space-y-6">
        
        {/* Module List */}
        <nav className="space-y-1">
          <h4 className="px-3 text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.3em] mb-4">Workspace</h4>
          {MODULE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeModule === item.id
                  ? 'bg-slate-900 text-white shadow-xl translate-x-1'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${activeModule === item.id ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50'}`}>
                <PremiumIcon 
                  id={item.icon} 
                  size={16} 
                  className={activeModule === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-300 group-hover:text-emerald-600'} 
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight italic flex-1 text-left">{t(item.navKey)}</span>
              {activeModule === item.id && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}
        </nav>

        {/* Badge Gallery */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 px-3">
             <h4 className="text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.3em]">Koleksi Gelar</h4>
             <Award className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <BadgeGallery earnedBadges={gamify.badges} compact />
        </div>

        {/* Quick Links */}
        <div className="space-y-1">
          <button onClick={() => onModuleChange('certificate')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeModule === 'certificate' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}>
            <Award className="w-4 h-4" /> Sertifikat
          </button>
        </div>

        {/* Admin Reset */}
        <div className="mt-10 opacity-50 hover:opacity-100 transition-opacity">
          <AdminReset />
        </div>
      </div>
    </aside>
  )
}
