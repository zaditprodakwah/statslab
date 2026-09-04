'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  ListCheck, 
  Calculator, 
  Sliders, 
  Bookmark, 
  BookA, 
  ArrowRight
} from 'lucide-react';
import { TabType } from '@/lib/research/types';
import { TASKS_DATA, VALIDATION_DOMAINS, SUS_ITEMS, REFERENCES_DATA, GLOSSARY_DATA } from '@/lib/research/data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, extraIndex?: number) => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tab: TabType;
  taskIndex?: number;
  iconType: 'task' | 'validation' | 'sus' | 'ref' | 'glossary' | 'general';
}

export default function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Generate indexed items
  const results: SearchResultItem[] = React.useMemo(() => {
    if (!query.trim()) {
      // Default quick suggestions
      return [
        {
          id: 'sug-1',
          title: 'T1: Zakat Fitrah (Membaca Data Tersurat)',
          description: 'Watson-Callingham Level 3/4, Amanah Data, kalkulator selisih 800 kg',
          category: 'Task Studio',
          tab: 'tasks',
          taskIndex: 0,
          iconType: 'task'
        },
        {
          id: 'sug-2',
          title: 'T3: Outlier Perpustakaan Ramadan',
          description: 'Sensitivitas Mean vs Median saat ada pencilan nilai ekstrem',
          category: 'Task Studio',
          tab: 'tasks',
          taskIndex: 2,
          iconType: 'task'
        },
        {
          id: 'sug-3',
          title: "Aiken's V Validation Formula",
          description: 'Kalkulator V = ∑s / [n(c-1)] untuk 27 butir instrumen materi, media, & Islam',
          category: 'Validasi Ahli',
          tab: 'validation',
          iconType: 'validation'
        },
        {
          id: 'sug-4',
          title: 'SUS Usability Brooke Calculator',
          description: 'Skor System Usability Scale dengan formula standar Brooke (Target > 72)',
          category: 'Kepraktisan',
          tab: 'sus',
          iconType: 'sus'
        },
        {
          id: 'sug-5',
          title: 'Rasch PCM & CFA LISREL Model Fit',
          description: 'Validitas konstruk psikometri dengan Wright Map dan indeks Chi-Square/df',
          category: 'Psikometri',
          tab: 'psychometrics',
          iconType: 'general'
        },
        {
          id: 'sug-6',
          title: 'Amanah & Tabayyun Data',
          description: 'Prinsip verifikasi dan etika penyajian data tanpa manipulasi visual',
          category: 'Glosarium',
          tab: 'glossary',
          iconType: 'glossary'
        }
      ];
    }

    const q = query.toLowerCase();
    const items: SearchResultItem[] = [];

    // Search Tasks
    TASKS_DATA.forEach((task, idx) => {
      if (
        task.title.toLowerCase().includes(q) ||
        task.question.toLowerCase().includes(q) ||
        task.islamicValue.toLowerCase().includes(q) ||
        task.indicator.toLowerCase().includes(q) ||
        task.mathConcept.toLowerCase().includes(q) ||
        task.id.toLowerCase().includes(q)
      ) {
        items.push({
          id: `task-${task.id}`,
          title: `${task.id}: ${task.shortName} - ${task.title}`,
          description: `${task.watsonLevel} • Nilai: ${task.islamicValue} • ${task.indicator}`,
          category: 'Task Studio (T1-T8)',
          tab: 'tasks',
          taskIndex: idx,
          iconType: 'task'
        });
      }
    });

    // Search Validation
    Object.entries(VALIDATION_DOMAINS).forEach(([key, domain]) => {
      if (domain.title.toLowerCase().includes(q) || domain.desc.toLowerCase().includes(q)) {
        items.push({
          id: `val-dom-${key}`,
          title: domain.title,
          description: `${domain.items.length} butir instrumen evaluasi pakar • ${domain.desc}`,
          category: "Validasi Aiken's V",
          tab: 'validation',
          iconType: 'validation'
        });
      }
      domain.items.forEach(item => {
        if (item.statement.toLowerCase().includes(q) || item.indicator.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)) {
          items.push({
            id: `val-item-${item.id}`,
            title: `[${item.id}] ${item.indicator}`,
            description: item.statement,
            category: `Validasi ${domain.title}`,
            tab: 'validation',
            iconType: 'validation'
          });
        }
      });
    });

    // Search SUS
    SUS_ITEMS.forEach(item => {
      if (item.text.toLowerCase().includes(q) || item.dimension.toLowerCase().includes(q)) {
        items.push({
          id: `sus-${item.id}`,
          title: `SUS #${item.id} (${item.dimension})`,
          description: item.text,
          category: 'SUS Usability Scale',
          tab: 'sus',
          iconType: 'sus'
        });
      }
    });

    // Search References
    REFERENCES_DATA.forEach(ref => {
      if (ref.plainText.toLowerCase().includes(q) || ref.tag.toLowerCase().includes(q) || ref.category.toLowerCase().includes(q)) {
        items.push({
          id: `ref-${ref.id}`,
          title: ref.tag,
          description: ref.plainText,
          category: 'Daftar Pustaka APA 7th',
          tab: 'references',
          iconType: 'ref'
        });
      }
    });

    // Search Glossary
    GLOSSARY_DATA.forEach(gloss => {
      if (gloss.term.toLowerCase().includes(q) || gloss.definition.toLowerCase().includes(q) || gloss.relevance.toLowerCase().includes(q)) {
        items.push({
          id: `gloss-${gloss.term}`,
          title: `${gloss.term} ${gloss.arabic ? `(${gloss.arabic})` : ''}`,
          description: gloss.definition,
          category: `Glosarium (${gloss.category})`,
          tab: 'glossary',
          iconType: 'glossary'
        });
      }
    });

    return items;
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        const selected = results[selectedIndex];
        onNavigate(selected.tab, selected.taskIndex);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <ListCheck className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />;
      case 'validation':
        return <Calculator className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      case 'sus':
        return <Sliders className="w-4 h-4 text-amber-700 dark:text-amber-400" />;
      case 'ref':
        return <Bookmark className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
      case 'glossary':
        return <BookA className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700 dark:text-slate-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik kata kunci: zakat, tabayyun, aiken, outlier, sus, lisrel..."
            className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base w-full font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
            {query.trim() ? `Hasil Pencarian (${results.length})` : 'Pilihan Cepat Terpopuler'}
          </div>

          {results.map((res, idx) => (
            <div
              key={res.id}
              onClick={() => {
                onNavigate(res.tab, res.taskIndex);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`p-3 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 text-xs ${
                selectedIndex === idx
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 shadow-2xs">
                  {renderIcon(res.iconType)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                      {res.title}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                    {res.description}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
                  {res.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400 opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tidak ditemukan hasil untuk &quot;{query}&quot;
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coba gunakan kata kunci lain seperti zakat, aiken, sus, murajaah, atau tabayyun.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑</kbd> <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↓</kbd> Navigasi</span>
            <span><kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↵</kbd> Buka</span>
          </div>
          <span>Tekan <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</kbd> untuk menutup</span>
        </div>
      </div>
    </div>
  );
}
