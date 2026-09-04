'use client';

import React from 'react';
import { 
  BookOpen, 
  Download,
  FileText, 
  ListCheck, 
  Calculator, 
  Sliders, 
  Bookmark, 
  HelpCircle, 
  Search, 
  X, 
  Building2, 
  BookA,
  BarChart3
} from 'lucide-react';
import { TabType } from '@/lib/research/types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenSearch
}: SidebarProps) {
  const handleNavClick = (tab: TabType) => {
    onSelectTab(tab);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 flex flex-col justify-between shrink-0 shadow-lg md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-900 dark:bg-indigo-700 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                  Dokumentasi Skripsi
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  DSI Spec & Validator v1.0
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Tutup sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Author & Institutional Card */}
          <div className="mx-3 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>M. Khoiruzzadittaqwa</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                Peneliti
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1.5">
              <span>NIM: 2220020002</span>
            </div>
            <div className="text-[10px] text-indigo-900 dark:text-indigo-300 font-medium pt-1.5 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-indigo-700 dark:text-indigo-400 shrink-0" />
              <span className="truncate">Tadris Matematika STAI Al-Bahjah</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-1 space-y-1 overflow-y-auto flex-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 my-1.5 font-mono">
              Bab I - Ringkasan Produk
            </div>
            <button
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Spesifikasi Produk & Media</span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Instrumen & Rubrik Skripsi
            </div>
            <button
              onClick={() => handleNavClick('instruments')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'instruments'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Bank Instrumen Lengkap</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-mono font-bold">
                Tabel 3.2-3.6
              </span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Bab II - Tugas Tersemat
            </div>
            <button
              onClick={() => handleNavClick('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'tasks'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ListCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Task Studio (T1 - T8)</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded font-mono font-bold">
                8 Task
              </span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Bab III - Validasi Ahli
            </div>
            <button
              onClick={() => handleNavClick('validation')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'validation'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Uji Aiken&apos;s V Lab</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-mono font-bold">
                30 Butir
              </span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Bab IV - Kepraktisan
            </div>
            <button
              onClick={() => handleNavClick('sus')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'sus'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>SUS Usability Tester</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-mono font-bold">
                15 Butir
              </span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Bab V - Psikometri
            </div>
            <button
              onClick={() => handleNavClick('psychometrics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'psychometrics'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Rasch PCM & CFA LISREL</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 rounded font-mono font-bold">
                Model
              </span>
            </button>


            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Pusat Unduhan Dokumen
            </div>
            <button
              onClick={() => handleNavClick('downloads')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'downloads'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pusat Berkas Skripsi</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-mono font-bold">
                9 Berkas
              </span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-3 pb-1 font-mono">
              Referensi & Bantuan
            </div>
            <button
              onClick={() => handleNavClick('references')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'references'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Daftar Pustaka APA 7th</span>
            </button>

            <button
              onClick={() => handleNavClick('glossary')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'glossary'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <BookA className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Glosarium Istilah</span>
            </button>

            <button
              onClick={() => handleNavClick('guide')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition ${
                activeTab === 'guide'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border-transparent'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Panduan & FAQ</span>
            </button>
          </nav>

          {/* Footer Search Quick Trigger */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Cari spesifikasi...</span>
              </div>
              <kbd className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
