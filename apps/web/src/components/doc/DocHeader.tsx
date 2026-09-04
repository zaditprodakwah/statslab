'use client';

import React from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Printer, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { TabType } from '@/lib/research/types';

interface HeaderProps {
  activeTab: TabType;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  fontSize: 'sm' | 'base' | 'lg';
  onChangeFontSize: (size: 'sm' | 'base' | 'lg') => void;
}

const TAB_TITLES: Record<TabType, { chapter: string; title: string }> = {
  overview: { chapter: 'Bab I', title: 'Ringkasan Produk & Media' },
  instruments: { chapter: 'Bab III', title: 'Bank Instrumen & Rubrik Lengkap Terperinci' },
  tasks: { chapter: 'Bab II', title: 'Task Studio Interaktif (T1 - T8)' },
  validation: { chapter: 'Bab III', title: "Uji Aiken's V Validation Lab" },
  sus: { chapter: 'Bab IV', title: 'Kepraktisan Usability SUS Tester' },
  psychometrics: { chapter: 'Bab V', title: 'Konstruk Rasch PCM & CFA LISREL' },
  downloads: { chapter: 'Pusat Berkas', title: 'Pusat Unduhan Naskah Skripsi & Publikasi' },
  references: { chapter: 'Referensi', title: 'Daftar Pustaka APA 7th' },
  glossary: { chapter: 'Glosarium', title: 'Glosarium Konsep & Istilah' },
  guide: { chapter: 'Panduan', title: 'Petunjuk Penggunaan & FAQ' }
};

export default function Header({
  activeTab,
  onOpenSidebar,
  onOpenSearch,
  isDark,
  onToggleDark,
  fontSize,
  onChangeFontSize
}: HeaderProps) {
  const current = TAB_TITLES[activeTab] || { chapter: 'Dokumentasi', title: 'Dasbor' };
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn('Print error:', e);
      } finally {
        setTimeout(() => setIsPrinting(false), 1500);
      }
    }, 100);
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors duration-200 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onOpenSidebar}
          aria-label="Buka Menu Navigasi"
          className="md:hidden p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-serif hidden sm:inline-flex items-center gap-1 font-medium text-indigo-900 dark:text-indigo-300">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>R&D Skripsi</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 hidden sm:inline text-slate-400 dark:text-slate-600" />
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
            {current.chapter}
          </span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-600" />
          <h1 className="text-slate-900 dark:text-slate-100 font-semibold text-xs sm:text-sm font-sans truncate max-w-[130px] sm:max-w-xs md:max-w-md">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Method Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            Rasch PCM & CFA LISREL
          </span>
        </div>

        {/* Global Search Bar Button */}
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
          title="Cari spesifikasi, tugas, atau referensi (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span className="hidden sm:inline">Pencarian Cepat</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Font Size Selector */}
        <div className="hidden sm:flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => onChangeFontSize('sm')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              fontSize === 'sm' 
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-400 font-bold shadow-2xs' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Ukuran teks standar"
          >
            A-
          </button>
          <button
            onClick={() => onChangeFontSize('base')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              fontSize === 'base' 
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-400 font-bold shadow-2xs' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Ukuran teks medium"
          >
            A
          </button>
          <button
            onClick={() => onChangeFontSize('lg')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              fontSize === 'lg' 
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-400 font-bold shadow-2xs' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Ukuran teks besar"
          >
            A+
          </button>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className={`p-2 rounded-lg transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 ${
            isPrinting
              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 animate-pulse'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isPrinting ? 'Membuka dialog cetak...' : 'Cetak / Unduh Dokumen (PDF)'}
          aria-label="Cetak Halaman Dokumen"
        >
          <Printer className={`w-4 h-4 ${isPrinting ? 'animate-bounce' : ''}`} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleDark}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
          title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
}
