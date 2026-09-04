'use client';

import React from 'react';
import { 
  GraduationCap, 
  FlaskConical, 
  Calculator, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Cpu, 
  Sliders, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { TabType } from '@/lib/research/types';
import MathFormula from './MathFormula';

interface OverviewSectionProps {
  onNavigate: (tab: TabType, extraIndex?: number) => void;
}

export default function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Paper Title Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Spesifikasi Produk Media & Instrumentasi Penelitian Skripsi</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-semibold">
            Status: Terverifikasi Expert
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 leading-tight">
          Pengembangan Media Pembelajaran Dasbor Statistika Interaktif Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
          Media pembelajaran berbasis web interaktif (React.js & Next.js) yang dirancang secara sistematis guna menstimulasi penalaran literasi data siswa SMP/MTs (Level 4–6 Hierarki Watson-Callingham) melalui eksplorasi sosiostatistika Islami berlandaskan etika <em>Amanah</em> (kejujuran penyajian data) dan <em>Tabayyun</em> (verifikasi kritis data).
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button 
            onClick={() => onNavigate('instruments')}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Bank Instrumen & Rubrik Lengkap (Tabel 3.2-3.6)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => onNavigate('tasks', 0)}
            className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Buka Task Studio (T1 - T8)</span>
          </button>
          
          <button 
            onClick={() => onNavigate('validation')}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Uji Aiken&apos;s V Lab</span>
          </button>

          <button 
            onClick={() => onNavigate('sus')}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>SUS Tester (14 Butir)</span>
          </button>
        </div>
      </div>

      {/* Key Spec Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-mono font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-between">
            <span>Spesifikasi 01</span>
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
            8 Embedded Tasks
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Tugas kognitif tersemat dengan skala penskoran politomi (0, 1, 2). Skor maksimal 16 berdasarkan kerangka GAISE II & Watson-Callingham.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Spesifikasi 02</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
            3 Rumpun Validasi Expert
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Penilaian kelayakan Aiken&apos;s V (<MathFormula formula="V \ge 0{,}667" />) meliputi Materi Matematika (9 butir), Media (10 butir), dan Nilai Islam (8 butir).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>Spesifikasi 03</span>
            <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
            SUS 14-Item Adaptif
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Pengukuran usabilitas oleh N=125 siswa dengan rumus standar Brooke. Target skor rerata &gt; 72 (Kategori <em>Good / Acceptable</em>).
          </p>
        </div>
      </div>

      {/* Tri-Pilar Architecture Matrix */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h2 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-indigo-800 dark:text-indigo-400" />
          <span>Arsitektur Integrasi Tri-Pilar Media Pembelajaran</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-semibold text-[10px] font-mono">
                Pilar 01
              </span>
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Cognitive Load Reduction
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mengalihkan fokus mental dari komputasi manual berulang ke rekonstruksi penalaran bermakna (<em>extraneous cognitive load reduction</em>) melalui visualisasi interaktif dan umpan balik dinamis real-time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold text-[10px] font-mono">
                Pilar 02
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Rasch PCM & CFA LISREL
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Kalibrasi parameter butir tugas tersemat berbasis Model Rasch Partial Credit Model dan CFA LISREL 8.80 untuk memastikan validitas konstruk instrumen yang terstandar dan independen sampel.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold text-[10px] font-mono">
                Pilar 03
              </span>
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Ethos Tabayyun & Amanah
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Menginternalisasi prinsip verifikasi kritis data (<em>Tabayyun</em>) serta penyajian jujur tanpa manipulasi visual optik (<em>Amanah</em>) guna mengikis dikotomi ilmu agama dan ilmu statistika.
            </p>
          </div>
        </div>
      </div>

      {/* Target Capaian & Kerangka Watson-Callingham */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
            <span>Target Capaian Pembelajaran (Kurikulum Merdeka - Fase D)</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Membuat dan menginterpretasikan diagram batang, lingkaran, garis, dan diagram pencar (scatter plot).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Menentukan dan menganalisis ukuran pemusatan (Mean, Median, Modus) serta dampaknya terhadap pencilan (outliers).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Mengevaluasi keabsahan data, mendeteksi penyajian bias grafik, dan merumuskan keputusan logis berbasis data.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Gradasi Kognitif Hierarki Watson-Callingham</span>
          </h2>
          <div className="space-y-1.5 text-xs font-sans">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Level 6: Critical Mathematical</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">T7, T8</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Level 5: Critical / Inconsistent</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">T4, T5, T6</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Level 3/4: Informal & Quantitative</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">T1, T2, T3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
