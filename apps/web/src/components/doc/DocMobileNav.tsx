'use client';

import React from 'react';
import { 
  FileText, 
  ListCheck, 
  Calculator, 
  Sliders, 
  Menu
} from 'lucide-react';
import { TabType } from '@/lib/research/types';

interface MobileNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenMoreMenu: () => void;
}

export default function MobileNav({
  activeTab,
  onSelectTab,
  onOpenMoreMenu
}: MobileNavProps) {
  const primaryTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Produk', icon: FileText },
    { id: 'tasks', label: 'Tugas', icon: ListCheck },
    { id: 'validation', label: "Aiken's V", icon: Calculator },
    { id: 'sus', label: 'SUS', icon: Sliders },
  ];

  const isMoreTabActive = ['psychometrics', 'references', 'glossary', 'guide'].includes(activeTab);

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)] transition-colors"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {primaryTabs.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-900 dark:text-indigo-300 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              style={{ minWidth: '60px', minHeight: '46px' }}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-indigo-900 dark:bg-indigo-400" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu / Drawer Trigger */}
        <button
          onClick={onOpenMoreMenu}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
            isMoreTabActive
              ? 'text-indigo-900 dark:text-indigo-300 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          style={{ minWidth: '60px', minHeight: '46px' }}
          aria-label="Menu Lengkap"
        >
          {isMoreTabActive && (
            <span className="absolute -top-1 w-6 h-1 rounded-full bg-indigo-900 dark:bg-indigo-400" />
          )}
          <Menu className={`w-5 h-5 ${isMoreTabActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {isMoreTabActive ? 'Lainnya' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
}
