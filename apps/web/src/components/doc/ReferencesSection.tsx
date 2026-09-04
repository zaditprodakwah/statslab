'use client';

import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Copy, 
  Check
} from 'lucide-react';
import { REFERENCES_DATA } from '@/lib/research/data';
import { ReferenceItem } from '@/lib/research/types';

export default function ReferencesSection() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'Metodologi', 'Statistika', 'Pendidikan Islam', 'Cognitive Load'];

  const filtered = REFERENCES_DATA.filter(ref => {
    const matchCategory = selectedCategory === 'all' || ref.category === selectedCategory;
    const matchQuery = !filterQuery || 
      ref.plainText.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ref.tag.toLowerCase().includes(filterQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCopy = (ref: ReferenceItem) => {
    navigator.clipboard.writeText(ref.plainText);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              <Bookmark className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Daftar Pustaka Acuan Skripsi (Standar APA 7th Edition)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                Rujukan ilmiah utama pengembangan instrumen, metodologi psikometri, integrasi nilai Islam, dan teknologi media pembelajaran.
              </p>
            </div>
          </div>

          {/* Search within references */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Cari rujukan pustaka..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-800"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
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
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* References List */}
        <div className="space-y-3 pt-2">
          {filtered.map(ref => (
            <div
              key={ref.id}
              className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs transition hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div 
                className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: ref.formattedHtml }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono text-[10px] font-bold">
                    {ref.tag}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                    {ref.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(ref)}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[11px] flex items-center gap-1.5 transition shadow-2xs"
                >
                  {copiedId === ref.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Sitasi APA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Tidak ditemukan referensi untuk pencarian &quot;{filterQuery}&quot;.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
