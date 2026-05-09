import { TrendingUp, BookOpen, Users, Library, Award, LayoutGrid } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { PremiumIcon } from '../ui/PremiumIcons'

const TABS = [
  { id: 'ziswaf',   icon: 'ziswaf',    label: 'Ziswaf' },
  { id: 'tahfizh',  icon: 'tahfizh',   label: 'Tahfizh' },
  { id: 'qurban',   icon: 'qurban',    label: 'Qurban' },
  { id: 'literasi', icon: 'literasi',  label: 'Library' },
  { id: 'certificate', icon: 'certificate', label: 'Award' },
]

export function BottomNav({ activeModule, onModuleChange }) {
  const { lang } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden no-print">
      {/* Container with rounded top and heavy glass effect */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/10 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-4 flex items-center justify-around h-20 pb-safe">
        {TABS.map((tab) => {
          const isActive = activeModule === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onModuleChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-500 ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {/* Active Indicator Bar */}
              <div className={`absolute top-0 w-8 h-1 rounded-full transition-all duration-500 ${
                isActive ? 'bg-emerald-500 opacity-100' : 'bg-transparent opacity-0'
              }`} />

              {/* Icon Container */}
              <div className={`relative p-2 rounded-2xl transition-all duration-500 ${
                isActive ? 'bg-emerald-500/10 scale-110' : 'bg-transparent'
              }`}>
                <PremiumIcon 
                  id={tab.icon} 
                  size={20} 
                  className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}
                />
              </div>

              {/* Label */}
              <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
