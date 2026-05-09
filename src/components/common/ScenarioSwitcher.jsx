import { Layers, Activity } from 'lucide-react'

export function ScenarioSwitcher({ currentScenario, onChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          Konteks Data (Skenario)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pilih dataset yang ingin dianalisis untuk melihat bagaimana anomali mempengaruhi statistik.
        </p>
      </div>
      
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 w-full sm:w-auto">
        <button
          onClick={() => onChange('normal')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
            currentScenario === 'normal'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => onChange('anomali')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
            currentScenario === 'anomali'
              ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Ada Anomali
        </button>
      </div>
    </div>
  )
}
