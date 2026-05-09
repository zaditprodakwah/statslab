import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

/**
 * Tooltip — A premium, accessible tooltip component for scholarly labels.
 * Supports hover (desktop) and click-to-toggle (mobile).
 */
export function Tooltip({ children, content, title, position = 'top', className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTooltip = (e) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(!isVisible);
    }
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800',
  };

  return (
    <div 
      className={`relative inline-flex items-center group ${className}`}
      onMouseEnter={() => !isMobile && setIsVisible(true)}
      onMouseLeave={() => !isMobile && setIsVisible(false)}
      onClick={toggleTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`fixed md:absolute z-[110] w-[280px] sm:w-[320px] p-4 glass-panel-heavy rounded-2xl shadow-2xl border-2 border-emerald-500/30 animate-pop-in ${positions[position]} pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-500 rounded-lg">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {title}
                </h4>
              </div>
              {isMobile && (
                <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          )}
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {content}
          </p>
          
          {/* Arrow (hidden on mobile fixed position) */}
          <div className={`hidden md:block absolute w-0 h-0 border-[6px] border-transparent ${arrowPositions[position]}`} />
        </div>
      )}
    </div>
  );
}
