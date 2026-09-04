'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  BookOpen, 
  MessageSquare, 
  HelpCircle,
  Sliders,
  RotateCcw,
  Zap
} from 'lucide-react';
import MathFormula from './MathFormula';
import { ValidationItem } from '@/lib/research/types';

interface AikensCalculatorProps {
  items: ValidationItem[];
  domainName: string;
  onApplyScore?: (itemId: string, r1: number, r2: number, r3: number) => void;
}

export default function AikensCalculator({ items, domainName, onApplyScore }: AikensCalculatorProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [raterCount, setRaterCount] = useState<number>(3);
  const [scaleCategory, setScaleCategory] = useState<number>(5);
  
  // Custom scores for up to 7 raters
  const [raterScores, setRaterScores] = useState<number[]>([5, 5, 4]);
  const [customIndicator, setCustomIndicator] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Sync selected item
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const target = items.find(it => it.id === id);
    if (target) {
      setRaterScores([target.r1, target.r2, target.r3]);
      setCustomIndicator(target.indicator);
    }
  };

  const handleScoreChange = (index: number, val: number) => {
    const clamped = Math.max(1, Math.min(scaleCategory, isNaN(val) ? 1 : val));
    setRaterScores(prev => {
      const next = [...prev];
      next[index] = clamped;
      return next;
    });
  };

  const handleRaterCountChange = (count: number) => {
    setRaterCount(count);
    setRaterScores(prev => {
      const next = [...prev];
      while (next.length < count) {
        next.push(scaleCategory); // Default to highest scale
      }
      return next.slice(0, count);
    });
  };

  // Computations
  const computation = useMemo(() => {
    const n = raterCount;
    const c = scaleCategory;
    const lo = 1; // Lowest possible score
    const sArray = raterScores.slice(0, n).map(r => Math.max(0, r - lo));
    const sumS = sArray.reduce((acc, curr) => acc + curr, 0);
    const denominator = n * (c - lo);
    const v = denominator > 0 ? sumS / denominator : 0;
    const vFormatted = v.toFixed(3);

    // Critical threshold according to Aiken's (1985) table (n=3, c=5 => 0.667, n=4, c=5 => 0.625, etc.)
    let threshold = 0.667;
    if (n === 2) threshold = 0.750;
    else if (n === 3) threshold = 0.667;
    else if (n === 4) threshold = 0.625;
    else if (n === 5) threshold = 0.600;
    else if (n === 6) threshold = 0.583;
    else if (n >= 7) threshold = 0.571;

    const isValid = v >= threshold;

    // Qualitative category
    let category = '';
    let categoryColor = '';
    let categoryBg = '';

    if (v >= 0.80) {
      category = 'Validitas Isi Sangat Tinggi';
      categoryColor = 'text-emerald-800 dark:text-emerald-300';
      categoryBg = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';
    } else if (v >= threshold) {
      category = 'Validitas Isi Tinggi (Memenuhi Syarat)';
      categoryColor = 'text-indigo-800 dark:text-indigo-300';
      categoryBg = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800';
    } else if (v >= 0.50) {
      category = 'Validitas Isi Sedang / Perlu Revisi';
      categoryColor = 'text-amber-800 dark:text-amber-300';
      categoryBg = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
    } else {
      category = 'Validitas Isi Rendah (Gugur / Rombak)';
      categoryColor = 'text-rose-800 dark:text-rose-300';
      categoryBg = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800';
    }

    // Dynamic Qualitative Feedback & Validator Note
    let feedback = '';
    let recommendation = '';

    if (v >= 0.88) {
      feedback = 'Pernyataan instrumen sangat terukur, konstruksi butir jelas, dan tidak menimbulkan multitafsir. Seluruh pakar memberikan skor maksimal.';
      recommendation = 'Dapat langsung digunakan tanpa perbaikan redaksional (Fit & Ready for Field Testing).';
    } else if (v >= threshold) {
      feedback = 'Substansi materi dan indikator operasional telah sesuai dengan tujuan penelitian R&D, terdapat sedikit variasi skor antar penilai.';
      recommendation = 'Disarankan menyempurnakan aspek tipografi, tata bahasa baku, atau kejelasan instruksi pengerjaan.';
    } else if (v >= 0.50) {
      feedback = 'Terdapat diskrepansi penilaian antar pakar. Indikator dinilai belum sepenuhnya merefleksikan aspek kompetensi matematis atau integrasi keislaman secara mendalam.';
      recommendation = 'Lakukan revisi redaksional butir, perjelas rubrik penskoran, dan ajukan kembali pada sesi review validasi lanjutan.';
    } else {
      feedback = 'Mayoritas pakar memberikan skor rendah karena konstruksi butir membingungkan atau tidak relevan dengan kompetensi dasar.';
      recommendation = 'Butir disarankan diganti (drop) atau dirombak total sebelum uji coba lapangan (Pilot Study).';
    }

    return {
      n,
      c,
      sArray,
      sumS,
      denominator,
      v,
      vFormatted,
      threshold,
      isValid,
      category,
      categoryColor,
      categoryBg,
      feedback,
      recommendation
    };
  }, [raterCount, scaleCategory, raterScores]);

  const copyFormulaBreakdown = () => {
    const text = `Perhitungan Aiken's V [${selectedItemId || 'Simulasi'}]:\n` +
      `Formula: V = sum(s) / [n * (c - 1)]\n` +
      `Jumlah Rater (n) = ${computation.n}, Kategori Skala (c) = ${computation.c}\n` +
      `Skor Rater = [${raterScores.slice(0, computation.n).join(', ')}]\n` +
      `Nilai s = [${computation.sArray.join(', ')}]\n` +
      `Jumlah s (sum_s) = ${computation.sumS}\n` +
      `Penyebut = ${computation.n} * (${scaleCategory} - 1) = ${computation.denominator}\n` +
      `Indeks Aiken's V = ${computation.sumS} / ${computation.denominator} = ${computation.vFormatted}\n` +
      `Status = ${computation.isValid ? 'VALID' : 'REVISI'} (${computation.category})\n` +
      `Umpan Balik: ${computation.feedback}\n` +
      `Rekomendasi: ${computation.recommendation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToTable = () => {
    if (selectedItemId && onApplyScore) {
      onApplyScore(
        selectedItemId,
        raterScores[0] || 5,
        raterScores[1] || 5,
        raterScores[2] || 4
      );
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Kalkulator & Simulator Koefisien Aiken&apos;s V Otomatis</span>
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Real-Time Computation
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              Hitung indeks validitas isi, uji signifikansi <MathFormula formula="V \ge V_{\text{tabel}}" />, dan telaah umpan balik kualitatif validator secara interaktif.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyFormulaBreakdown}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95"
            title="Salin langkah kalkulasi lengkap ke clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin!' : 'Salin Langkah Hitung'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters & Real-Time Calculation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Parameter & Rater Scores Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Input Parameter Uji</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Skala Likert (1 - {scaleCategory})</span>
          </div>

          {/* Item Selector Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Pilih Butir Indikator dari Tabel:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => handleSelectItem(e.target.value)}
              className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="">-- Simulasi Kustom Bebas --</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  [{it.id}] {it.indicator.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Rater Count & Scale Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Jumlah Pakar (<MathFormula formula="n" />):
              </label>
              <select
                value={raterCount}
                onChange={(e) => handleRaterCountChange(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold"
              >
                <option value={2}>2 Rater Pakar</option>
                <option value={3}>3 Rater (Standar Skripsi)</option>
                <option value={4}>4 Rater Pakar</option>
                <option value={5}>5 Rater Pakar</option>
                <option value={6}>6 Rater Pakar</option>
                <option value={7}>7 Rater Pakar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Kategori Skala (<MathFormula formula="c" />):
              </label>
              <select
                value={scaleCategory}
                onChange={(e) => setScaleCategory(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold"
              >
                <option value={4}>4 Pilihan (1-4)</option>
                <option value={5}>5 Pilihan (1-5 Likert)</option>
                <option value={7}>7 Pilihan (1-7)</option>
              </select>
            </div>
          </div>

          {/* Rater Scores Input Fields */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-700/80">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Isi Skor Penilaian Rater (1 - {scaleCategory}):</span>
              <span className="text-[10px] text-slate-500 italic">*Edit skor untuk kalkulasi langsung</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: raterCount }).map((_, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-900 dark:text-indigo-300 block">
                    Rater {idx + 1}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={scaleCategory}
                    value={raterScores[idx] || 1}
                    onChange={(e) => handleScoreChange(idx, parseInt(e.target.value, 10))}
                    className="w-full text-center py-1 text-sm font-mono font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] font-mono text-slate-500 block">
                    s_{idx + 1} = {(raterScores[idx] || 1) - 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply to Table Button (if an item is selected) */}
          {selectedItemId && onApplyScore && raterCount === 3 && (
            <button
              onClick={handleApplyToTable}
              className="w-full py-2 px-3 rounded-xl bg-indigo-900 dark:bg-indigo-800 hover:bg-indigo-800 dark:hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />
              <span>Terapkan Skor ke Butir [{selectedItemId}] di Tabel</span>
            </button>
          )}
        </div>

        {/* Right Column: Mathematical Breakdown & Validator Feedback (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Calculation Output Card */}
          <div className={`p-4 rounded-2xl border transition-all ${computation.categoryBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Hasil Perhitungan Indeks Validitas Isi
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 dark:text-slate-100">
                    V = {computation.vFormatted}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                    computation.isValid 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-rose-600 text-white border-rose-700'
                  }`}>
                    {computation.isValid ? 'VALID' : 'REVISI'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs font-bold ${computation.categoryColor}`}>
                  {computation.category}
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  Ambang Batas: <MathFormula formula={`V \\ge ${computation.threshold.toFixed(3)}`} />
                </div>
              </div>
            </div>

            {/* Formula Step-by-Step Breakdown */}
            <div className="pt-3 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Rincian Matematis Aiken&apos;s (1985):</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10 font-mono text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700 dark:text-slate-300">
                  <span>1. Nilai Deviasi Skor (s = r - 1):</span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">
                    [{computation.sArray.join(', ')}]
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700 dark:text-slate-300">
                  <span>2. Total Jumlah Deviasi (Σ s):</span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">
                    {computation.sArray.join(' + ')} = {computation.sumS}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700 dark:text-slate-300">
                  <span>3. Penyebut Maksimal [n × (c - 1)]:</span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">
                    {computation.n} × ({scaleCategory} - 1) = {computation.denominator}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-slate-900 dark:text-slate-100 font-bold border-t border-slate-200 dark:border-slate-700 pt-1">
                  <span>4. Formula Akhir:</span>
                  <span className="text-indigo-900 dark:text-indigo-400">
                    V = {computation.sumS} / {computation.denominator} = {computation.vFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Validator Qualitative Feedback & Academic Notes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Umpan Balik Kualitatif & Telaah Ahli (Validator Feedback):</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Catatan Kualitatif Validator:
                </span>
                <p className="text-slate-700 dark:text-slate-300 italic pt-0.5 leading-relaxed">
                  &ldquo;{computation.feedback}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Rekomendasi Tindak Lanjut:
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium pt-0.5 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{computation.recommendation}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
