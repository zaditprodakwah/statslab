'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ThumbsUp,
  Award,
  Layers,
  Copy,
  Download,
  Check,
  Info,
  Printer,
  FileDown,
  Save
} from 'lucide-react';
import { SUS_ITEMS } from '@/lib/research/data';
import { SUSItem } from '@/lib/research/types';
import MathFormula from './MathFormula';
import { exportSUSPdf } from '@/lib/research/pdfExport';
import AutoSaveToast from './AutoSaveToast';

const SUS_LOCAL_STORAGE_KEY = 'skripsi_sus_items_v2';

export default function SUSSection() {
  const [items, setItems] = useState<SUSItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SUS_LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === SUS_ITEMS.length) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to load SUS items from localStorage:', e);
      }
    }
    return SUS_ITEMS.map(it => ({ ...it }));
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(SUS_LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save SUS items to localStorage:', e);
    }
  }, [items]);

  const triggerAutoSaveFeedback = () => {
    setSaveStatus('saving');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 250);
  };

  const handleScoreChange = (id: number, val: number) => {
    triggerAutoSaveFeedback();
    setItems(prev => prev.map(item => item.id === id ? { ...item, score: val } : item));
  };

  // Compute SUS Score using Brooke's algorithm adapted for 14 items
  // Total raw score = sum(pos_items - 1) + sum(5 - neg_items)
  // Max possible raw = 14 * 4 = 56
  // Multiplier = 100 / 56 ≈ 1.7857 (or 2.5 for standard 10-item)
  const calculatedSUS = React.useMemo(() => {
    let rawScore = 0;
    items.forEach(item => {
      if (item.isPositive) {
        rawScore += (item.score - 1);
      } else {
        rawScore += (5 - item.score);
      }
    });
    // Scaled to 0-100 scale: (rawScore / 56) * 100
    const scaled = (rawScore / 56) * 100;
    return scaled.toFixed(1);
  }, [items]);

  const susNum = parseFloat(calculatedSUS);

  const gradeInfo = React.useMemo(() => {
    if (susNum >= 85) {
      return {
        grade: 'Grade A+',
        label: 'Exceptional (Sangat Unggul)',
        acceptability: 'Acceptable (Sangat Dapat Diterima)',
        color: 'text-emerald-800 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-emerald-600'
      };
    } else if (susNum >= 72) {
      return {
        grade: 'Grade B',
        label: 'Good (Baik & Praktis)',
        acceptability: 'Acceptable (Dapat Diterima)',
        color: 'text-indigo-800 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        barColor: 'bg-indigo-600'
      };
    } else if (susNum >= 50) {
      return {
        grade: 'Grade C',
        label: 'Okay / Marginal (Cukup)',
        acceptability: 'Marginal (Batas Toleransi)',
        color: 'text-amber-800 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        barColor: 'bg-amber-500'
      };
    } else {
      return {
        grade: 'Grade F',
        label: 'Poor (Kurang Praktis)',
        acceptability: 'Not Acceptable (Perlu Perombakan)',
        color: 'text-rose-800 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
        barColor: 'bg-rose-600'
      };
    }
  }, [susNum]);

  // Preset scenarios
  const applyPreset = (type: 'high' | 'avg' | 'low') => {
    if (type === 'high') {
      setItems(items.map(it => ({ ...it, score: it.isPositive ? 5 : 1 })));
    } else if (type === 'avg') {
      setItems(SUS_ITEMS.map(it => ({ ...it }))); // Default initial ~82.1
    } else {
      setItems(items.map(it => ({ ...it, score: it.isPositive ? 2 : 4 })));
    }
  };

  // Download file helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      navigator.clipboard.writeText(content);
    }
  };

  const copyAsCsv = () => {
    let csv = 'No,Dimensi,Butir_Pernyataan,Polaritas,Status_Butir,Skor\n';
    items.forEach(it => {
      csv += `${it.id},"${it.dimension}","${it.text.replace(/"/g, '""')}","${it.isPositive ? 'Positif' : 'Negatif'}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}",${it.score}\n`;
    });
    downloadFile(csv, 'kuesioner-sus-14-butir.csv', 'text/csv;charset=utf-8;');
    navigator.clipboard.writeText(csv);
    setCopied('csv');
    setTimeout(() => setCopied(null), 2500);
  };

  const copyAsText = () => {
    let text = `===========================================================\n`;
    text += `REKAP KUESIONER SYSTEM USABILITY SCALE (SUS) ADAPTIF 14 BUTIR\n`;
    text += `Skor SUS Terhitung: ${calculatedSUS} / 100 (${gradeInfo.grade} - ${gradeInfo.label})\n`;
    text += `Tingkat Keberterimaan: ${gradeInfo.acceptability}\n`;
    text += `===========================================================\n\n`;
    items.forEach(it => {
      const stat = it.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI';
      text += `${it.id}. [${stat}] (${it.isPositive ? 'Positif' : 'Negatif'}) - Skor: ${it.score}/5\n`;
      text += `   Dimensi: ${it.dimension}\n`;
      text += `   Pernyataan: ${it.text}\n\n`;
    });
    downloadFile(text, 'rekap-skor-sus-14-butir.txt', 'text/plain;charset=utf-8;');
    navigator.clipboard.writeText(text);
    setCopied('text');
    setTimeout(() => setCopied(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    exportSUSPdf({
      items,
      calculatedScore: calculatedSUS,
      grade: gradeInfo.grade,
      adjective: gradeInfo.label,
      acceptability: gradeInfo.acceptability
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Tabel 3.5: Kalkulator System Usability Scale (SUS) 14 Butir
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1.5 leading-relaxed">
              Instrumen pengujian kepraktisan & usabilitas oleh 125 siswa. Memadukan 10 butir standar Brooke (1996) dengan 4 butir adaptasi integrasi keislaman & visual interaktif.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('avg')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            >
              Preset Rerata
            </button>
            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Download Laporan Pengujian SUS Format PDF (jsPDF)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={copyAsCsv}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
              title="Download file CSV dan salin ke clipboard"
            >
              {copied === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copied === 'csv' ? 'CSV Diunduh & Tersalin!' : 'Download CSV'}</span>
            </button>
            <button
              onClick={copyAsText}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              title="Download teks ringkasan dan salin ke clipboard"
            >
              {copied === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied === 'text' ? 'Teks Diunduh & Tersalin!' : 'Download Teks'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-900 text-white hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center gap-1.5 shadow-xs"
              title="Cetak instrumen kuesioner SUS"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Kuesioner</span>
            </button>
          </div>
        </div>

        {/* Big Score Display */}
        <div className={`p-6 rounded-2xl border transition-all ${gradeInfo.bg}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Skor Usabilitas Terhitung (SUS Scale 0-100)
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl sm:text-5xl font-extrabold font-mono ${gradeInfo.color}`}>
                  {calculatedSUS}
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">/ 100</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white dark:bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-700 ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 pt-1">
                Kategori: <strong>{gradeInfo.label}</strong> &bull; Akseptabilitas: <strong>{gradeInfo.acceptability}</strong>
              </div>
            </div>

            {/* Quick Benchmark Comparison */}
            <div className="sm:text-right space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div>Standar Industri Rata-rata: <strong>68.0</strong></div>
              <div>Batas Kategori Unggul (A): <strong>80.3</strong></div>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                {susNum >= 68 ? `+${(susNum - 68).toFixed(1)} di atas rata-rata industri` : `${(68 - susNum).toFixed(1)} di bawah standar`}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full ${gradeInfo.barColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, susNum))}%` }}
            />
          </div>
        </div>

        {/* 14 Items List with Interactive Sliders */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
            <span>Daftar 14 Butir Pernyataan Kuesioner Siswa:</span>
            <span>Skala Likert (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju)</span>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => {
              const isRevision = item.status === 'usulan_revisi';
              return (
                <div 
                  key={item.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-colors ${
                    isRevision 
                      ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/60' 
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                          #{item.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.dimension}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.isPositive 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {item.isPositive ? 'Positif (+)' : 'Negatif (-)'}
                        </span>
                        {item.status === 'resmi_proposal' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            Resmi Proposal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-800">
                            Usulan Revisi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        &ldquo;{item.text}&rdquo;
                      </p>
                      {item.statusNote && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          {item.statusNote}
                        </p>
                      )}
                    </div>

                    {/* Numeric Score Selector */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleScoreChange(item.id, val)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                            item.score === val
                              ? 'bg-indigo-900 dark:bg-indigo-700 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Non-Intrusive Auto-Saving Indicator Toast */}
      <AutoSaveToast status={saveStatus} lastSavedTime={lastSavedTime} />
    </div>
  );
}
