// ============================================================
// CartesianAid — Scholarly Pedagogical Visual for X & Y Axes
// Upgraded with high-fidelity grid, tick-marks, and academic markers.
// ============================================================
import React from 'react'
import { ArrowRight, ArrowUp, Info, Microscope } from 'lucide-react'

export function CartesianAid({ xLabel = "Kategori (X)", yLabel = "Nilai (Y)", compact = false }) {
  return (
    <div className={`glass-card p-6 border-2 border-emerald-500/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-700 ${compact ? 'scale-90' : ''}`}>
      {/* Decorative Gradient Background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-600 shadow-sm border border-emerald-500/20">
            <Microscope size={18} className="group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-0.5">Academic Framework</h4>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight italic uppercase">Peta Koordinat Kartesius</h3>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Schema</span>
        </div>
      </div>

      <div className="relative h-72 w-full bg-white dark:bg-slate-950 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.3)] overflow-hidden mb-5">
        {/* Graph Paper Grid */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" 
             style={{ 
               backgroundImage: `
                 linear-gradient(#000 1px, transparent 1px), 
                 linear-gradient(90deg, #000 1px, transparent 1px),
                 linear-gradient(rgba(0,0,0,0.3) 0.5px, transparent 0.5px), 
                 linear-gradient(90deg, rgba(0,0,0,0.3) 0.5px, transparent 0.5px)
               `, 
               backgroundSize: '40px 40px, 40px 40px, 10px 10px, 10px 10px' 
             }} />

        {/* Major Axis Grid (Subtle Highlight) */}
        <div className="absolute left-[20%] inset-y-0 w-px bg-slate-200 dark:bg-slate-800/50" />
        <div className="absolute bottom-12 inset-x-0 h-px bg-slate-200 dark:bg-slate-800/50" />

        {/* Origin Marker */}
        <div className="absolute left-[20%] bottom-12 w-6 h-6 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-10">
          <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-full border-2 border-white dark:border-slate-900 shadow-lg" />
          <span className="absolute -left-6 -bottom-5 text-[9px] font-black text-slate-500 font-mono tracking-tighter">(0,0)</span>
        </div>

        {/* Y Axis (Dependent) */}
        <div className="absolute left-[20%] bottom-12 top-6 w-1.5 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
        <div className="absolute left-[20%] top-4 -translate-x-1/2 text-emerald-600 drop-shadow-sm">
          <ArrowUp size={18} strokeWidth={4} />
        </div>

        {/* X Axis (Independent) */}
        <div className="absolute left-[20%] bottom-12 right-6 h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400/20 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
        <div className="absolute right-4 bottom-12 translate-y-1/2 text-blue-600 drop-shadow-sm">
          <ArrowRight size={18} strokeWidth={4} />
        </div>

        {/* Scholarly Markings (Ticks & Scaled Numbers) */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <React.Fragment key={i}>
            {/* Y Ticks & Labels */}
            <div className="absolute left-[calc(20%-8px)] h-[1.5px] w-4 bg-emerald-500/60 rounded-full" style={{ bottom: `${48 + i * 36}px` }} />
            {/* Minor Ticks Y */}
            <div className="absolute left-[calc(20%-4px)] h-[1px] w-2 bg-slate-300 dark:bg-slate-700" style={{ bottom: `${48 + i * 36 - 18}px` }} />
            
            <span className="absolute left-[calc(20%-12px)] -translate-x-full text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono" style={{ bottom: `${44 + i * 36}px` }}>
              {String(i * 10).padStart(2, '0')}
            </span>
            
            {/* X Ticks & Labels */}
            <div className="absolute bottom-[calc(48px-8px)] w-[1.5px] h-4 bg-blue-500/60 rounded-full" style={{ left: `${20 + i * 12}%` }} />
            {/* Minor Ticks X */}
            <div className="absolute bottom-[calc(48px-4px)] w-[1px] h-2 bg-slate-300 dark:bg-slate-700" style={{ left: `${20 + i * 12 - 6}%` }} />

            <span className="absolute bottom-[24px] -translate-x-1/2 text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono" style={{ left: `${20 + i * 12}%` }}>
              {String(i * 5).padStart(2, '0')}
            </span>
          </React.Fragment>
        ))}

        {/* Quadrant Metadata */}
        <div className="absolute top-10 right-10 flex flex-col items-end opacity-20 dark:opacity-40 select-none">
          <span className="text-[32px] font-black text-slate-200 dark:text-slate-800 italic leading-none">KUADRAN I</span>
          <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 tracking-[0.4em] uppercase">(+,+) AREA</span>
        </div>

        {/* Pedagogical Labels */}
        <div className="absolute left-[18%] top-14 -translate-x-full pr-6 text-right group-hover:-translate-y-1 transition-transform duration-500">
          <div className="flex flex-col items-end">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[8px] font-black uppercase tracking-tighter mb-1.5 shadow-sm">Variabel Terikat</span>
            <p className="text-xs font-black text-slate-800 dark:text-white whitespace-nowrap uppercase tracking-widest leading-none drop-shadow-sm">{yLabel}</p>
          </div>
        </div>

        <div className="absolute right-12 bottom-6 text-right group-hover:translate-x-1 transition-transform duration-500">
          <div className="flex flex-col items-end">
            <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[8px] font-black uppercase tracking-tighter mb-1.5 shadow-sm">Variabel Bebas</span>
            <p className="text-xs font-black text-slate-800 dark:text-white whitespace-nowrap uppercase tracking-widest leading-none drop-shadow-sm">{xLabel}</p>
          </div>
        </div>

        {/* High-Fidelity Distribution Curve (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl">
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glowPath">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 120 230 C 180 200, 250 80, 450 100" 
            fill="none" 
            stroke="url(#curveGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            className="opacity-40"
            filter="url(#glowPath)"
          />
        </svg>

        {/* Observation Points (Statistical Scatter) */}
        {[
          { x: '35%', y: '160px', s: 'w-2 h-2', o: '0.4' },
          { x: '45%', y: '120px', s: 'w-3 h-3', o: '0.6' },
          { x: '55%', y: '100px', s: 'w-4 h-4', o: '0.8' },
          { x: '65%', y: '90px', s: 'w-2 h-2', o: '0.5' },
        ].map((pt, idx) => (
          <div 
            key={idx}
            className={`absolute rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-white dark:border-slate-900 shadow-lg ${pt.s}`}
            style={{ left: pt.x, bottom: pt.y, opacity: pt.o }}
          />
        ))}

        {/* Focus Data Point (Interactive Highlight) */}
        <div className="absolute left-[55%] bottom-[100px] w-8 h-8 -translate-x-1/2 translate-y-1/2 z-20 cursor-help">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-150" />
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full shadow-xl shadow-emerald-500/40 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform duration-500 flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          {/* Tooltip-style Coordinate */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap shadow-xl">
            SAMPLE_VAL: (28, 42)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">Korelasi</span>
          <span className="text-[14px] font-black text-slate-800 dark:text-slate-200">+0.84</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 italic">Signifikansi</span>
          <span className="text-[14px] font-black text-slate-800 dark:text-slate-200">p &lt; 0.05</span>
        </div>
      </div>

      {/* Decorative Formula Footer */}
      <div className="mt-4 flex justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-700">
        <code className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
           ŷ = β₀ + β₁x + ε 
        </code>
      </div>
    </div>
  )
}
