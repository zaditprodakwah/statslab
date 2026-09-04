'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Info,
  Check,
  Printer,
  FileCheck,
  FileDown,
  Eye,
  CheckSquare,
  Save
} from 'lucide-react';
import { VALIDATION_DOMAINS } from '@/lib/research/data';
import { ValidationItem } from '@/lib/research/types';
import MathFormula from './MathFormula';
import PrintableValidationSheetModal from './PrintableValidationSheetModal';
import ValidationExportPreviewModal from './ValidationExportPreviewModal';
import LikertDistributionChart from './LikertDistributionChart';
import AikensCalculator from './AikensCalculator';
import AutoSaveToast from './AutoSaveToast';
import { exportValidationPdf } from '@/lib/research/pdfExport';

const LOCAL_STORAGE_KEY = 'skripsi_validation_domain_items_v2';

export default function ValidationSection() {
  const [activeDomainKey, setActiveDomainKey] = useState<'materi' | 'media' | 'islam' | 'all'>('materi');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [modalDomain, setModalDomain] = useState<'materi' | 'media' | 'islam'>('materi');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  
  // Clone initial items state so user can interactively change rater scores with localStorage persistence
  const [domainItems, setDomainItems] = useState<Record<string, ValidationItem[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.materi && parsed.media && parsed.islam) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse validation items from localStorage:', e);
      }
    }
    return {
      materi: VALIDATION_DOMAINS.materi.items.map(it => ({ ...it })),
      media: VALIDATION_DOMAINS.media.items.map(it => ({ ...it })),
      islam: VALIDATION_DOMAINS.islam.items.map(it => ({ ...it }))
    };
  });

  const [copied, setCopied] = useState<string | null>(null);

  // Sync state to localStorage whenever domainItems change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(domainItems));
    } catch (e) {
      console.warn('Failed to save validation items to localStorage:', e);
    }
  }, [domainItems]);

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

  // Compute Aiken's V for single item: V = ( (r1-1) + (r2-1) + (r3-1) ) / (3 * (5-1)) = sum_s / 12
  const computeV = (item: ValidationItem) => {
    const s1 = Math.max(0, Math.min(4, item.r1 - 1));
    const s2 = Math.max(0, Math.min(4, item.r2 - 1));
    const s3 = Math.max(0, Math.min(4, item.r3 - 1));
    return (s1 + s2 + s3) / 12;
  };

  const handleScoreChange = (domain: string, itemId: string, rater: 'r1' | 'r2' | 'r3', val: number) => {
    const clamped = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
    triggerAutoSaveFeedback();
    setDomainItems(prev => ({
      ...prev,
      [domain]: prev[domain].map(item => item.id === itemId ? { ...item, [rater]: clamped } : item)
    }));
  };

  const handleApplyAikensCalculatorScore = (itemId: string, r1: number, r2: number, r3: number) => {
    triggerAutoSaveFeedback();
    // Find target item across domains
    setDomainItems(prev => {
      const next = { ...prev };
      for (const domain of ['materi', 'media', 'islam'] as const) {
        if (next[domain].some(it => it.id === itemId)) {
          next[domain] = next[domain].map(it => it.id === itemId ? { ...it, r1, r2, r3 } : it);
          break;
        }
      }
      return next;
    });
  };

  const resetScores = () => {
    triggerAutoSaveFeedback();
    const fresh = {
      materi: VALIDATION_DOMAINS.materi.items.map(it => ({ ...it })),
      media: VALIDATION_DOMAINS.media.items.map(it => ({ ...it })),
      islam: VALIDATION_DOMAINS.islam.items.map(it => ({ ...it }))
    };
    setDomainItems(fresh);
  };

  // Get active items
  const activeItems: { domainName: string; item: ValidationItem }[] = React.useMemo(() => {
    if (activeDomainKey === 'all') {
      return [
        ...domainItems.materi.map(it => ({ domainName: 'Materi', item: it })),
        ...domainItems.media.map(it => ({ domainName: 'Media', item: it })),
        ...domainItems.islam.map(it => ({ domainName: 'Islam', item: it }))
      ];
    }
    const name = activeDomainKey === 'materi' ? 'Materi' : activeDomainKey === 'media' ? 'Media' : 'Islam';
    return domainItems[activeDomainKey].map(it => ({ domainName: name, item: it }));
  }, [activeDomainKey, domainItems]);

  // Calculations
  const meanV = React.useMemo(() => {
    if (!activeItems.length) return '0.000';
    const sum = activeItems.reduce((acc, curr) => acc + computeV(curr.item), 0);
    return (sum / activeItems.length).toFixed(3);
  }, [activeItems]);

  const validCount = activeItems.filter(it => computeV(it.item) >= 0.667).length;
  const revisionCount = activeItems.length - validCount;
  const completionPercentage = activeItems.length > 0 ? Math.round((validCount / activeItems.length) * 100) : 0;

  // Domain title and table code for export
  const currentDomainMeta = React.useMemo(() => {
    const domainLabel = activeDomainKey === 'materi' 
      ? 'Ahli Materi Matematika' 
      : activeDomainKey === 'media' 
      ? 'Ahli Media & IT' 
      : activeDomainKey === 'islam'
      ? 'Ahli Integrasi Islam'
      : 'Gabungan Seluruh Rumpun Validasi';
    const tableCode = activeDomainKey === 'materi'
      ? 'Tabel 3.2'
      : activeDomainKey === 'media'
      ? 'Tabel 3.3'
      : activeDomainKey === 'islam'
      ? 'Tabel 3.4'
      : 'Tabel 3.2 - 3.4';
    return { domainLabel, tableCode };
  }, [activeDomainKey]);

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

  const copySummary = () => {
    let text = `===========================================================\n`;
    text += `RINGKASAN UJI VALIDITAS AHLI (AIKEN'S V) - ${activeDomainKey.toUpperCase()}\n`;
    text += `Rerata Indeks V: ${meanV} (${validCount}/${activeItems.length} Butir Valid V >= 0.667)\n`;
    text += `===========================================================\n\n`;
    activeItems.forEach(({ domainName, item }, idx) => {
      const v = computeV(item).toFixed(3);
      const statusLabel = item.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI';
      text += `${idx + 1}. [${item.id}] [${domainName}] [${statusLabel}]\n`;
      text += `   Indikator: ${item.indicator}\n`;
      text += `   Pernyataan: ${item.statement}\n`;
      text += `   Skor: R1=${item.r1}, R2=${item.r2}, R3=${item.r3} | Aiken's V = ${v} (${Number(v) >= 0.667 ? 'VALID' : 'REVISI'})\n\n`;
    });
    downloadFile(text, `rekap-uji-validitas-aiken-${activeDomainKey}.txt`, 'text/plain;charset=utf-8;');
    navigator.clipboard.writeText(text);
    setCopied('text');
    setTimeout(() => setCopied(null), 2500);
  };

  const copyAsCsv = () => {
    // Include UTF-8 BOM for seamless SPSS & Excel import
    let csv = '\uFEFF';
    csv += 'No,Kode_Butir,Rumpun_Validasi,Aspek,Indikator,Butir_Pernyataan,Rater_1,Rater_2,Rater_3,Jumlah_S,Aikens_V,Status_Validitas,Status_Instrumen\n';
    activeItems.forEach(({ domainName, item }, idx) => {
      const s1 = item.r1 - 1;
      const s2 = item.r2 - 1;
      const s3 = item.r3 - 1;
      const sumS = s1 + s2 + s3;
      const v = computeV(item).toFixed(3);
      const valStatus = Number(v) >= 0.667 ? 'VALID' : 'REVISI';
      const itemStat = item.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi';
      csv += `${idx + 1},"${item.id}","${domainName}","${item.aspect || ''}","${item.indicator}","${item.statement.replace(/"/g, '""')}",${item.r1},${item.r2},${item.r3},${sumS},${v},"${valStatus}","${itemStat}"\n`;
    });
    downloadFile(csv, `data-validitas-aiken-${activeDomainKey}-spss.csv`, 'text/csv;charset=utf-8;');
    navigator.clipboard.writeText(csv);
    setCopied('csv');
    setTimeout(() => setCopied(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    exportValidationPdf({
      domainName: currentDomainMeta.domainLabel,
      tableCode: currentDomainMeta.tableCode,
      items: activeItems.map(ai => ai.item),
      meanV,
      validCount,
      totalItems: activeItems.length
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
                <Calculator className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Kalkulator & Matriks Validasi Ahli (Aiken&apos;s V)
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1.5 leading-relaxed">
              Formula validitas isi Aiken: <MathFormula formula="V = \frac{\sum s}{n(c-1)}" /> dengan <MathFormula formula="n=3" /> rater pakar, <MathFormula formula="c=5" /> skala Likert. Batas signifikansi validitas isi: <MathFormula formula="V \ge 0{,}667" />.
            </p>
          </div>

          {/* Domain Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDomainKey('materi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeDomainKey === 'materi'
                  ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              Tabel 3.2: Materi ({domainItems.materi.length} Item)
            </button>
            <button
              onClick={() => setActiveDomainKey('media')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeDomainKey === 'media'
                  ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              Tabel 3.3: Media ({domainItems.media.length} Item)
            </button>
            <button
              onClick={() => setActiveDomainKey('islam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeDomainKey === 'islam'
                  ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              Tabel 3.4: Nilai Islam ({domainItems.islam.length} Item)
            </button>
            <button
              onClick={() => setActiveDomainKey('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeDomainKey === 'all'
                  ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              Semua ({activeItems.length} Item)
            </button>
          </div>
        </div>

        {/* Real-Time Visual Feedback & Progress Mechanism */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Status Kelengkapan Validasi Indikator ({activeDomainKey.toUpperCase()})
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
                  {validCount} dari {activeItems.length} Indikator Memenuhi Ambang Batas Aiken (<MathFormula formula="V \ge 0{,}667" />)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                {completionPercentage}% Fit & Valid
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <Save className="w-3.5 h-3.5" />
                <span>Tersimpan Otomatis</span>
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                completionPercentage === 100 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                  : completionPercentage >= 70
                  ? 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${Math.max(5, completionPercentage)}%` }}
            />
          </div>

          {/* Checklist Summary Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{validCount} Butir Valid</span>
            </span>

            {revisionCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{revisionCount} Butir Usulan Revisi</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span>Total: {activeItems.length} Butir Penilaian</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span>Rerata V = {meanV}</span>
            </span>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase">
              Rerata Indeks V Rumpun
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-800 dark:text-emerald-400">
              {meanV}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Ambang Kritis: 0,667
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase">
              Status Validitas Butir
            </div>
            <div className="text-base font-bold text-emerald-800 dark:text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{validCount} dari {activeItems.length} VALID</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
              Tingkat Kesepakatan: {((validCount / activeItems.length) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase">
              Jumlah Penilai (Rater)
            </div>
            <div className="text-3xl font-extrabold font-mono text-indigo-900 dark:text-indigo-300">
              3 Pakar
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Skala Penilaian: 1 (STS) s.d. 5 (SS)
            </div>
          </div>
        </div>

        {/* Recharts Likert Scale Distribution Chart */}
        <LikertDistributionChart 
          items={activeItems.map(ai => ai.item)} 
          domainName={currentDomainMeta.domainLabel} 
        />

        {/* Interactive Automated Aiken's V Calculator */}
        <AikensCalculator 
          items={activeItems.map(ai => ai.item)} 
          domainName={currentDomainMeta.domainLabel} 
          onApplyScore={handleApplyAikensCalculatorScore} 
        />

        {/* Toolbar & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="text-slate-500 dark:text-slate-400 italic">
            *Skor Rater 1, 2, atau 3 dapat diedit langsung pada tabel di bawah. Perubahan tersimpan di browser secara otomatis.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={resetScores}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95"
              title="Reset skor rater ke nilai bawaan skripsi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Draf</span>
            </button>

            {/* Preview Before Export Button */}
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-950 dark:bg-indigo-800 hover:bg-indigo-900 dark:hover:bg-indigo-700 text-white font-semibold transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Pratinjau dokumen A4 cetak sebelum mengunduh PDF"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-300" />
              <span>Preview & Ekspor PDF</span>
            </button>

            {/* Quick PDF Export */}
            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-semibold transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Download Laporan Uji Aiken's V Format PDF (jsPDF)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Download as CSV (SPSS/Excel) */}
            <button
              onClick={copyAsCsv}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 active:scale-95"
              title="Download data tabel dalam format CSV siap impor SPSS atau Microsoft Excel"
            >
              {copied === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copied === 'csv' ? 'CSV Diunduh & Tersalin!' : 'Download as CSV'}</span>
            </button>

            <button
              onClick={copySummary}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              title="Download ringkasan teks dan salin ke clipboard"
            >
              {copied === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied === 'text' ? 'Teks Tersalin!' : 'Download Rekap'}</span>
            </button>

            <button
              onClick={() => {
                const targetDomain = activeDomainKey === 'all' ? 'materi' : activeDomainKey;
                setModalDomain(targetDomain);
                setIsPrintModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Buka Format Baku Lembar Validasi Siap Cetak/Serah ke Dosen Pakar"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Lembar Siap Cetak</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden md:flex px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              title="Cetak matriks validasi Aiken's V"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold font-mono uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3 w-20">Kode</th>
                <th className="p-3">Pernyataan Indikator Validasi</th>
                <th className="p-3 w-32 text-center">Status Butir</th>
                <th className="p-3 w-16 text-center">R1</th>
                <th className="p-3 w-16 text-center">R2</th>
                <th className="p-3 w-16 text-center">R3</th>
                <th className="p-3 w-24 text-center">Indeks V</th>
                <th className="p-3 w-24 text-center">Hasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {activeItems.map(({ domainName, item }, idx) => {
                const itemV = computeV(item);
                const isValid = itemV >= 0.667;
                const isRevision = item.status === 'usulan_revisi';
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors ${
                      isRevision 
                        ? 'bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-100/60 dark:hover:bg-amber-950/40' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-900 dark:text-indigo-300">
                      {item.id}
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
                      <div className="font-medium">{item.statement}</div>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Aspek: {item.aspect || domainName}</span>
                        <span>&bull;</span>
                        <span>Indikator: {item.indicator}</span>
                      </div>
                      {item.statusNote && (
                        <div className={`text-[10px] italic flex items-center gap-1 ${
                          isRevision ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          <Info className="w-3 h-3 shrink-0" />
                          <span>{item.statusNote}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'resmi_proposal' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resmi Proposal</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-amber-400 dark:border-amber-800 shadow-xs whitespace-nowrap">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Usulan Revisi</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={item.r1}
                        onChange={e => handleScoreChange(
                          domainName === 'Materi' ? 'materi' : domainName === 'Media' ? 'media' : 'islam',
                          item.id,
                          'r1',
                          parseInt(e.target.value, 10)
                        )}
                        className="w-10 h-7 text-center py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={item.r2}
                        onChange={e => handleScoreChange(
                          domainName === 'Materi' ? 'materi' : domainName === 'Media' ? 'media' : 'islam',
                          item.id,
                          'r2',
                          parseInt(e.target.value, 10)
                        )}
                        className="w-10 h-7 text-center py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={item.r3}
                        onChange={e => handleScoreChange(
                          domainName === 'Materi' ? 'materi' : domainName === 'Media' ? 'media' : 'islam',
                          item.id,
                          'r3',
                          parseInt(e.target.value, 10)
                        )}
                        className="w-10 h-7 text-center py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-xs text-emerald-800 dark:text-emerald-400">
                      {itemV.toFixed(3)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        isValid
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}>
                        {isValid ? 'Valid' : 'Revisi'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Before Export Modal */}
      <ValidationExportPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        domainName={currentDomainMeta.domainLabel}
        tableCode={currentDomainMeta.tableCode}
        items={activeItems.map(ai => ai.item)}
        meanV={meanV}
        validCount={validCount}
        totalItems={activeItems.length}
        onConfirmExportPdf={() => {
          handleExportPdf();
          setIsPreviewModalOpen(false);
        }}
        onConfirmExportCsv={() => {
          copyAsCsv();
          setIsPreviewModalOpen(false);
        }}
      />

      {/* Printable Validation Sheet Modal */}
      <PrintableValidationSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        domain={modalDomain}
        items={domainItems[modalDomain]}
      />

      {/* Non-Intrusive Auto-Saving Indicator Toast */}
      <AutoSaveToast status={saveStatus} lastSavedTime={lastSavedTime} />
    </div>
  );
}
