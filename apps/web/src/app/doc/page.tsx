'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TabType } from '@/lib/research/types';
import DocHeader from '@/components/doc/DocHeader';
import DocSidebar from '@/components/doc/DocSidebar';
import DocSearchModal from '@/components/doc/DocSearchModal';
import OverviewSection from '@/components/doc/OverviewSection';
import TaskStudioSection from '@/components/doc/TaskStudioSection';
import ValidationSection from '@/components/doc/ValidationSection';
import SUSSection from '@/components/doc/SUSSection';
import PsychometricsSection from '@/components/doc/PsychometricsSection';
import ReferencesSection from '@/components/doc/ReferencesSection';
import GlossarySection from '@/components/doc/GlossarySection';
import GuideSection from '@/components/doc/GuideSection';
import MasterInstrumentsSection from '@/components/doc/MasterInstrumentsSection';
import DownloadsSection from '@/components/doc/DownloadsSection';
import DocMobileNav from '@/components/doc/DocMobileNav';
import { ArrowLeft, Presentation, ShieldCheck } from 'lucide-react';

export default function DocHomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [taskIndex, setTaskIndex] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Sync DOM with isDark state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut for Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavigate = (tab: TabType, extraIndex?: number) => {
    setActiveTab(tab);
    if (extraIndex !== undefined) {
      setTaskIndex(extraIndex);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'sm') return 'text-[13px]';
    if (fontSize === 'lg') return 'text-[17px]';
    return 'text-[15px]';
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 flex flex-col md:flex-row transition-colors duration-200 ${getFontSizeClass()}`}>
      
      {/* Top Banner for Quick Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-emerald-800/60 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="font-semibold tracking-wide">StatsLab Research Suite</span>
          <span className="hidden sm:inline text-emerald-400">• Portal Instrumen & Evaluasi Skripsi</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors text-[11px] font-medium bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/50"
          >
            <ArrowLeft size={12} /> Dasbor Siswa
          </Link>
          <Link
            href="/sidang"
            className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors text-[11px] font-medium bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50"
          >
            <Presentation size={12} /> Salindia Sidang (17 Slide)
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <div className="pt-8 md:pt-0">
        <DocSidebar
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-7 md:pt-0">
        
        {/* Sticky Header */}
        <DocHeader
          activeTab={activeTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          isDark={isDark}
          onToggleDark={toggleTheme}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
        />

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {activeTab === 'overview' && (
            <OverviewSection onNavigate={handleNavigate} />
          )}

          {activeTab === 'instruments' && (
            <MasterInstrumentsSection />
          )}

          {activeTab === 'tasks' && (
            <TaskStudioSection 
              key={`task-${taskIndex}`}
              initialTaskIndex={taskIndex} 
            />
          )}

          {activeTab === 'validation' && (
            <ValidationSection />
          )}

          {activeTab === 'sus' && (
            <SUSSection />
          )}

          {activeTab === 'psychometrics' && (
            <PsychometricsSection />
          )}

          {activeTab === 'downloads' && (
            <DownloadsSection />
          )}

          {activeTab === 'references' && (
            <ReferencesSection />
          )}

          {activeTab === 'glossary' && (
            <GlossarySection />
          )}

          {activeTab === 'guide' && (
            <GuideSection />
          )}
        </main>

        {/* Academic Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 mb-16 md:mb-0 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs space-y-1">
          <div className="font-serif font-semibold text-slate-700 dark:text-slate-300">
            Dasbor Spesifikasi & Validasi Media Literasi Data Berbasis Nilai Keislaman
          </div>
          <div className="font-mono text-[11px]">
            Muhammad Khoiruzzadittaqwa (NIM: 2220020002) • Tadris Matematika STAI Al-Bahjah Cirebon
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <DocMobileNav
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        onOpenMoreMenu={() => setSidebarOpen(true)}
      />

      {/* Search Modal */}
      <DocSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
