import { CheckCircle, AlertTriangle, Info, Sparkles, Trophy, Target, Lightbulb, X } from 'lucide-react'
import { locales } from '../../data/locales'

export function Toast({ notification, lang = 'id', onDismiss }) {
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

  const instruction = notification.instruction

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
      className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] animate-slide-down pointer-events-none w-full max-w-2xl px-4 flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div className={`border-2 shadow-[0_30px_60px_rgba(0,0,0,0.25)] rounded-[2.5rem] px-8 py-6 flex items-start gap-6 w-full transition-all ${themes[type]} pointer-events-auto backdrop-blur-xl relative`}>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        )}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce bg-white dark:bg-white/10 shadow-xl border border-current/10 mt-1`}>
          {isLevel ? (
             notification.level === 6 ? <Trophy className="w-10 h-10 text-amber-500" /> : <Sparkles className="w-10 h-10 text-blue-500" />
          ) : type === 'success' ? (
            <CheckCircle className="w-9 h-9" />
          ) : type === 'warning' ? (
            <AlertTriangle className="w-9 h-9" />
          ) : type === 'saved' ? (
             <CheckCircle className="w-9 h-9 text-violet-500" />
          ) : (
            <Info className="w-9 h-9" />
          )}
        </div>
        
        <div className="flex-1 space-y-2 py-1 pr-6">
          <div className="flex items-center justify-between gap-2">
            <p className="font-black text-xl leading-tight uppercase tracking-tight text-slate-900 dark:text-white">
              {title}
            </p>
            {type === 'warning' && (
              <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap flex-shrink-0">
                ACTION REQUIRED
              </span>
            )}
          </div>
          
          <p className="text-base font-bold opacity-90 leading-snug">
            {sub}
          </p>
          
          {instruction && (
            <div className="mt-4 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-current/20 flex gap-3 items-start animate-fade-in">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Petunjuk Lanjut</p>
                <p className="text-sm font-bold leading-relaxed">{instruction}</p>
              </div>
            </div>
          )}

          {nextMission && (
            <div className="mt-4 pt-4 border-t border-current/10 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-60">
                <Target className="w-4 h-4" />
                Misi Berikutnya
              </div>
              <p className="text-sm font-black italic bg-white/60 dark:bg-black/30 px-4 py-3 rounded-2xl border border-current/10 shadow-sm">
                {nextMission}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
