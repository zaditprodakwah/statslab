'use client';

import React, { useState, useEffect } from 'react';
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
      
      {/* Sidebar */}
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

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
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
