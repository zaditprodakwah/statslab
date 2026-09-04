'use client';

import React from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';

interface AutoSaveToastProps {
  status: 'idle' | 'saving' | 'saved';
  lastSavedTime?: string;
  className?: string;
}

export default function AutoSaveToast({ status, lastSavedTime, className = '' }: AutoSaveToastProps) {
  if (status === 'idle') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100 ${className}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs shadow-xl border border-slate-700/60">
        {status === 'saving' ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span className="font-medium text-slate-200">Menyimpan perubahan...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-emerald-300">Tersimpan Otomatis</span>
              {lastSavedTime && (
                <span className="text-[10px] text-slate-400 font-mono">
                  ({lastSavedTime})
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
