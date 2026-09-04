'use client';

import React from 'react';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { PSYCHOMETRICS_DATA } from '@/lib/research/data';
import MathFormula from './MathFormula';

export default function PsychometricsSection() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Introduction Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
            <BarChart3 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Validitas Konstruk Psikometri: Rasch PCM & CFA LISREL
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              Analisis psikometrik instrumen tugas tersemat T1–T8 untuk menjamin reliabilitas, kalibrasi tingkat kesulitan, dan ketepatan model struktural.
            </p>
          </div>
        </div>

        {/* LISREL Goodness of Fit Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Indeks Kelayakan Model Struktural (CFA LISREL 8.80)</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 font-bold">
              Status: Model Fit Sempurna
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Indeks Evaluasi (Fit Indices)</th>
                  <th className="p-3 text-center w-28">Nilai Hitung</th>
                  <th className="p-3 text-center w-32">Kriteria Standar</th>
                  <th className="p-3 text-center w-36">Kesimpulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {PSYCHOMETRICS_DATA.lisrelFit.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      <MathFormula formula={row.metric} />
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-indigo-900 dark:text-indigo-300">
                      {row.value}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">
                      {row.threshold}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rasch PCM Item Calibration Table */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Kalibrasi Parameter Butir Model Rasch Partial Credit Model (WINSTEPS)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              N=125 Siswa, 8 Butir Politomi
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Kode & Nama Tugas</th>
                  <th className="p-3 text-center">Measure (Logits)</th>
                  <th className="p-3 text-center">Std Error</th>
                  <th className="p-3 text-center">Infit MNSQ</th>
                  <th className="p-3 text-center">Outfit MNSQ</th>
                  <th className="p-3 text-center">Tingkat Watson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {PSYCHOMETRICS_DATA.raschItemParams.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {row.item}
                    </td>
                    <td className={`p-3 text-center font-mono font-bold ${
                      parseFloat(row.measure) > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-800 dark:text-emerald-400'
                    }`}>
                      {row.measure}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-500 dark:text-slate-400">
                      {row.se}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {row.infitMnsq}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {row.outfitMnsq}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {row.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Wright Map Representation */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Visualisasi Wright Map (Person Ability vs Item Difficulty):</span>
            <span className="text-[11px] font-mono text-indigo-900 dark:text-indigo-300">Skala Logits (-2.0 s.d. +2.0)</span>
          </div>

          <div className="h-56 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex justify-between gap-4 font-mono text-[11px]">
            {/* Left: Person Distribution */}
            <div className="flex-1 border-r border-dashed border-slate-300 dark:border-slate-700 pr-3 flex flex-col justify-between">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold">
                Kemampuan Siswa (Person Ability)
              </div>
              <div className="text-right text-slate-600 dark:text-slate-400 space-y-1">
                <div>+2.0 Logits | ## (Top 5%)</div>
                <div>+1.0 Logits | ###### (25%)</div>
                <div>+0.0 Logits | ########## (Mean = 0.32)</div>
                <div>-1.0 Logits | ####### (20%)</div>
                <div>-2.0 Logits | # (5%)</div>
              </div>
            </div>

            {/* Right: Item Thresholds */}
            <div className="flex-1 pl-3 flex flex-col justify-between">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold">
                Tingkat Kesulitan Butir (Item Difficulty)
              </div>
              <div className="text-left text-indigo-900 dark:text-indigo-300 font-bold space-y-1">
                <div>+1.56 | T8 (Alokasi Anggaran)</div>
                <div>+1.15 | T7 (Bias Sampling Klaim)</div>
                <div>+0.81 | T6 (KKM Bahasa Arab)</div>
                <div>+0.48 | T5 (Grafik Infak Bias)</div>
                <div>+0.12 | T4 (Murajaah vs Hafalan)</div>
                <div>-0.35 | T3 (Outlier Ramadan)</div>
                <div>-0.92 | T2 (Wakaf Produktif)</div>
                <div>-1.45 | T1 (Zakat Fitrah)</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Interpretasi Wright Map:</strong> Sebaran tingkat kesulitan butir tugas (T1 s.d. T8) tersebar merata dari rentang -1,45 logit hingga +1,56 logit, mengonfirmasi gradasi kesulitan instrumen yang selaras sempurna dengan kurva kemampuan siswa madrasah.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
