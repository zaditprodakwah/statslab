import { CheckCircle, AlertTriangle, Info, Sparkles, Trophy, Target } from 'lucide-react'
import { locales } from '../../data/locales'

export function Toast({ notification, lang = 'id' }) {
  if (!notification) return null

  const t = (key) => {
    const keys = key.split('.')
    let result = locales[lang]
    for (const k of keys) {
      if (result) result = result[k]
    }
    return result || key
  }

  // Support for generic notifications
  const isLevel = !!notification.level
  const type = notification.type || (isLevel ? 'success' : 'info')
  
  const title = isLevel 
    ? `${t('gamify.level')} ${notification.level} ${lang === 'id' ? 'Terbuka' : 'Unlocked'}!` 
    : notification.title
    
  const sub = isLevel 
    ? t(`gamify.unlockMsg.${notification.level}`)
    : notification.message

  const nextMission = isLevel && notification.level < 6
    ? t(`gamify.missions.${notification.level}`)
    : null

  const themes = {
    success: 'border-emerald-500 bg-white/95 dark:bg-slate-900 shadow-emerald-500/40 text-emerald-800 dark:text-emerald-400',
    warning: 'border-amber-500 bg-white/95 dark:bg-slate-900 shadow-amber-500/40 text-amber-800 dark:text-amber-400',
    info: 'border-blue-500 bg-white/95 dark:bg-slate-900 shadow-blue-500/40 text-blue-800 dark:text-blue-400',
    saved: 'border-violet-500 bg-white/95 dark:bg-slate-900 shadow-violet-500/40 text-violet-800 dark:text-violet-400',
  }

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-slide-down pointer-events-none w-full px-4 flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div className={`border-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2rem] px-8 py-5 flex items-center gap-6 min-w-[360px] max-w-lg transition-all ${themes[type]} pointer-events-auto backdrop-blur-md`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce bg-white dark:bg-white/10 shadow-lg`}>
          {isLevel ? (
             notification.level === 6 ? <Trophy className="w-8 h-8 text-amber-500" /> : <Sparkles className="w-8 h-8 text-blue-500" />
          ) : type === 'success' ? (
            <CheckCircle className="w-7 h-7" />
          ) : type === 'warning' ? (
            <AlertTriangle className="w-7 h-7" />
          ) : (
            <Info className="w-7 h-7" />
          )}
        </div>
        
        <div className="flex-1 space-y-1">
          <p className="font-black text-lg leading-tight uppercase tracking-tight text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm font-bold opacity-90 leading-snug">
            {sub}
          </p>
          
          {nextMission && (
            <div className="mt-3 pt-3 border-t border-current/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <Target className="w-3 h-3" />
                {t('gamify.nextMission')}
              </div>
              <p className="text-xs font-black italic bg-white/40 dark:bg-black/20 px-3 py-2 rounded-xl border border-current/5">
                {nextMission}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
