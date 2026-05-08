// ============================================================
// BottomNav — Mobile-only native app bottom tab bar
// Shown only on screens < sm (640px) via sm:hidden
// 5 tabs: 4 Modules + Evaluasi SUS
// Blueprint-compliant: all 4 datasets accessible
// ============================================================
import { TrendingUp, BookOpen, Users, Library, ClipboardList } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

const TABS = [
  { id: 'ziswaf',   icon: TrendingUp,    labelId: 'Ziswaf',    labelEn: 'Ziswaf'   },
  { id: 'tahfizh',  icon: BookOpen,      labelId: 'Tahfizh',   labelEn: 'Tahfizh'  },
  { id: 'qurban',   icon: Users,         labelId: 'Qurban',    labelEn: 'Qurban'   },
  { id: 'literasi', icon: Library,       labelId: 'Literasi',  labelEn: 'Library'  },
  { id: 'sus',      icon: ClipboardList, labelId: 'Evaluasi',  labelEn: 'Evaluate' },
]

export function BottomNav({ activeModule, onModuleChange }) {
  const { lang } = useLanguage()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden no-print"
      aria-label="Navigasi utama"
      role="tablist"
    >
      {/* Safe-area aware frosted glass bar */}
      <div
        className="flex items-stretch justify-around border-t border-slate-200/80 dark:border-slate-700/80"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {TABS.map(({ id, icon: Icon, labelId, labelEn }) => {
          const isActive = activeModule === id
          const label = lang === 'id' ? labelId : labelEn
          const isSUS = id === 'sus'

          // Color scheme per tab
          const activeColor = isSUS
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-emerald-600 dark:text-emerald-400'
          const activeBg = isSUS
            ? 'bg-indigo-50 dark:bg-indigo-900/40'
            : 'bg-emerald-50 dark:bg-emerald-900/30'
          const activePill = isSUS ? 'bg-indigo-500' : 'bg-emerald-500'

          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              id={`bottom-nav-${id}`}
              onClick={() => onModuleChange(id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                min-h-[56px] pt-2 pb-1 px-0.5 relative
                transition-all duration-200 select-none
                focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400
                ${isActive ? activeColor : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              {/* Top indicator pill */}
              <span
                className={`
                  absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full
                  transition-all duration-300
                  ${isActive ? `${activePill} w-6` : 'w-0 bg-transparent'}
                `}
              />

              {/* Icon with active background pill */}
              <span
                className={`
                  p-1.5 rounded-xl transition-all duration-200
                  ${isActive ? activeBg : 'bg-transparent'}
                `}
              >
                <Icon
                  className={`w-[1.15rem] h-[1.15rem] transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </span>

              {/* Label */}
              <span
                className={`text-[9px] font-semibold leading-none tracking-tight transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
