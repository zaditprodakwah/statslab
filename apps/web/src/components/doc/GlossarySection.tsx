'use client';

import React, { useState } from 'react';
import { BookA, Search } from 'lucide-react';
import { GLOSSARY_DATA } from '@/lib/research/data';

export default function GlossarySection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Statistika', 'Keislaman', 'Psikometri', 'Media'];

  const filtered = GLOSSARY_DATA.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchText = !searchTerm ||
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relevance.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
              <BookA className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Glosarium Konsep & Istilah Utama
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                Kamus operasional istilah statistika data, metodologi psikometri, dan konsep etika keislaman yang digunakan dalam skripsi.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari istilah glosarium..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-800"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition border ${
                selectedCategory === cat
                  ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'Semua Bidang' : cat}
            </button>
          ))}
        </div>

        {/* Glossary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {item.term}
                  </h3>
                  {item.arabic && (
                    <span className="text-xs font-serif text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950">
                      {item.arabic}
                    </span>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                  {item.category}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-indigo-900 dark:text-indigo-300">Relevansi Skripsi:</strong> {item.relevance}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
