'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Sliders, 
  Sparkles,
  Info,
  Scale,
  Eye,
  X
} from 'lucide-react';
import { TASKS_DATA } from '@/lib/research/data';

interface TaskStudioSectionProps {
  initialTaskIndex?: number;
}

export default function TaskStudioSection({ initialTaskIndex = 0 }: TaskStudioSectionProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(initialTaskIndex);
  const [showSolution, setShowSolution] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  // Widget States
  // T1
  const [t1Answer, setT1Answer] = useState<string>('');
  const [t1Feedback, setT1Feedback] = useState<{ correct: boolean; message: string; score: number } | null>(null);
  const [t1SelectedBar, setT1SelectedBar] = useState<number | null>(3); // Kec D default

  // T2
  const [t2Filter, setT2Filter] = useState<'all' | 'category'>('all');

  // T3
  const [t3IncludeRamadan, setT3IncludeRamadan] = useState<boolean>(true);

  // T4
  const [t4ShowTrendline, setT4ShowTrendline] = useState<boolean>(true);
  const [t4MurajaahHours, setT4MurajaahHours] = useState<number>(10);

  // T5
  const [t5GraphMode, setT5GraphMode] = useState<'A' | 'B'>('A');

  // T6
  const [t6IncludeOutliers, setT6IncludeOutliers] = useState<boolean>(true);

  // T8
  const [t8BudgetList, setT8BudgetList] = useState([
    { name: "Tahfidz Al-Qur'an", trend: '+40% peminat', allocated: 7000000, max: 10000000, color: 'bg-indigo-600' },
    { name: 'Pramuka Islam & Seni', trend: '+25% peminat', allocated: 6000000, max: 10000000, color: 'bg-emerald-600' },
    { name: 'Kaligrafi & Hadroh', trend: '+15% peminat', allocated: 4000000, max: 10000000, color: 'bg-amber-600' },
    { name: 'PMR & Poskestren', trend: '+5% peminat', allocated: 3000000, max: 10000000, color: 'bg-cyan-600' }
  ]);

  const task = TASKS_DATA[currentTaskIndex] || TASKS_DATA[0];

  // Helper calculations
  const t3Mean = t3IncludeRamadan ? 68.6 : 46.4;
  const t3Median = t3IncludeRamadan ? 47.5 : 46.0;

  const t6Mean = t6IncludeOutliers ? 75.0 : 86.9;
  const t6Median = t6IncludeOutliers ? 85.5 : 87.0;

  const t8Total = t8BudgetList.reduce((acc, curr) => acc + curr.allocated, 0);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Fallback
    }
  };

  const handleCheckT1 = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(t1Answer.trim(), 10);
    if (val === 800) {
      setT1Feedback({
        correct: true,
        message: 'MasyaAllah, Sangat Tepat! Selisih Zakat = 1.450 kg (Kec. D) - 650 kg (Kec. C) = 800 kg. Anda meraih Skor Maksimal (Skor 2).',
        score: 2
      });
      triggerConfetti();
    } else if (val > 700 && val < 900) {
      setT1Feedback({
        correct: false,
        message: 'Hampir tepat! Periksa kembali selisih antara nilai tertinggi 1.450 kg dan terendah 650 kg.',
        score: 1
      });
    } else {
      setT1Feedback({
        correct: false,
        message: 'Jawaban belum tepat. Silakan gunakan kalkulator selisih dengan nilai tertinggi 1.450 dan terendah 650.',
        score: 0
      });
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const updateBudget = (index: number, value: number) => {
    const updated = [...t8BudgetList];
    updated[index].allocated = value;
    setT8BudgetList(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Task Selection Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {TASKS_DATA.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrentTaskIndex(idx);
              setShowSolution(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
              currentTaskIndex === idx
                ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900 dark:border-indigo-700 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="font-mono">{t.id}</span>
            <span className="text-[11px] opacity-85 font-normal">({t.shortName})</span>
          </button>
        ))}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Context, Rubric, & Watson-Callingham Level */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-xs font-bold font-mono">
                {task.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 font-medium">
                {task.watsonLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800 font-medium">
                Nilai: {task.islamicValue}
              </span>
            </div>

            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
              {task.title}
            </h2>

            {/* Context & Indicator Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              <div className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[10px] font-mono">
                Indikator & Konsep Literasi Data:
              </div>
              <div className="text-indigo-900 dark:text-indigo-300 font-semibold">
                {task.indicator} • <span className="font-mono text-slate-600 dark:text-slate-400 font-normal">{task.mathConcept}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                <strong>Konteks:</strong> {task.context}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700/60 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Prinsip Syariah:</strong> {task.islamicPrinciple}</span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Formulasi Soal / Tugas Kognitif:
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
                &quot;{task.question}&quot;
              </div>
            </div>

            {/* Politomous Scoring Rubric */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Rubrik Penskoran Politomi Rasch (0, 1, 2):
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold text-[10px] font-mono shrink-0">
                    Skor 2
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {task.rubric[2]}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] font-mono shrink-0">
                    Skor 1
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {task.rubric[1]}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px] font-mono shrink-0">
                    Skor 0
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {task.rubric[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Ideal Sample Solution */}
            <div className="pt-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                  <span>Kunci Jawaban & Telaah Kognitif Model</span>
                </div>
                {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSolution && (
                <div className="mt-2 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
                  <div className="font-semibold text-indigo-900 dark:text-indigo-300">
                    Solusi Ideal:
                  </div>
                  <p>{task.sampleSolution}</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Live Interactive Dashboard Simulator Widget */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sliders className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span>Simulasi Dasbor Interaktif</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {task.interactiveFeature}
              </span>
            </div>

            {/* WIDGET T1: Zakat Fitrah */}
            {task.id === 'T1' && (
              <div className="space-y-4">
                {/* SVG Visual Bar Chart */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Distribusi Penerimaan Zakat Fitrah (kg beras):</span>
                    <span className="font-mono text-indigo-800 dark:text-indigo-400">Total: 5.050 kg</span>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { name: 'Kec. A', val: 850, max: 1500, color: 'bg-slate-400 dark:bg-slate-600' },
                      { name: 'Kec. B', val: 1200, max: 1500, color: 'bg-slate-400 dark:bg-slate-600' },
                      { name: 'Kec. C (Terendah)', val: 650, max: 1500, color: 'bg-amber-500' },
                      { name: 'Kec. D (Tertinggi)', val: 1450, max: 1500, color: 'bg-emerald-600' },
                      { name: 'Kec. E', val: 900, max: 1500, color: 'bg-slate-400 dark:bg-slate-600' },
                    ].map((bar, bIdx) => (
                      <div 
                        key={bar.name}
                        onClick={() => setT1SelectedBar(bIdx)}
                        className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        <span className={`text-[10px] font-mono font-bold transition ${
                          t1SelectedBar === bIdx ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {bar.val}
                        </span>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-36 flex items-end p-1">
                          <div 
                            style={{ height: `${(bar.val / bar.max) * 100}%` }}
                            className={`w-full rounded-md transition-all duration-300 ${bar.color} ${
                              t1SelectedBar === bIdx ? 'ring-2 ring-indigo-800 dark:ring-indigo-400' : ''
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate w-full text-center">
                          {bar.name.split(' ')[0]} {bar.name.split(' ')[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Calculator & Student Submission */}
                <form onSubmit={handleCheckT1} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>Kalkulator & Uji Pemahaman:</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">1.450 kg vs 650 kg</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Penerimaan Tertinggi:</div>
                      <div className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-400">1.450 kg (Kec. D)</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Penerimaan Terendah:</div>
                      <div className="text-sm font-bold font-mono text-amber-800 dark:text-amber-400">650 kg (Kec. C)</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium block mb-1">
                      Masukkan Hasil Hitungan Selisih Anda (dalam kg):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={t1Answer}
                        onChange={e => setT1Answer(e.target.value)}
                        placeholder="Contoh: 800"
                        className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-800 outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg font-semibold text-xs transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  {t1Feedback && (
                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                      t1Feedback.correct 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}>
                      {t1Feedback.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>{t1Feedback.message}</span>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* WIDGET T2: Wakaf Produktif */}
            {task.id === 'T2' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setT2Filter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      t2Filter === 'all'
                        ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    4 Kategori Terurai
                  </button>
                  <button
                    onClick={() => setT2Filter('category')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      t2Filter === 'category'
                        ? 'bg-indigo-900 dark:bg-indigo-700 text-white border-indigo-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Produktif (60%) vs Non-Produktif (40%)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  {t2Filter === 'all' ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Distribusi Luas Tanah Wakaf Berdasarkan Peruntukan:
                      </div>
                      {[
                        { label: 'Pertanian & Perkebunan', val: '35%', color: 'bg-emerald-600', sub: 'Produktif' },
                        { label: 'Ruko & Tempat Usaha', val: '25%', color: 'bg-indigo-600', sub: 'Produktif' },
                        { label: 'Masjid & Musholla', val: '20%', color: 'bg-amber-600', sub: 'Non-Produktif' },
                        { label: 'Pemakaman Muslim', val: '20%', color: 'bg-slate-500', sub: 'Non-Produktif' }
                      ].map(item => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300">
                              {item.label} <span className="text-[10px] text-slate-400">({item.sub})</span>
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{item.val}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div style={{ width: item.val }} className={`h-full ${item.color} rounded-full`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          <span>Kelompok Wakaf Produktif (Pertanian + Ruko)</span>
                          <span className="font-mono text-base">60%</span>
                        </div>
                        <div className="w-full bg-emerald-200 dark:bg-emerald-900/80 h-3 rounded-full overflow-hidden">
                          <div className="w-[60%] h-full bg-emerald-600 rounded-full" />
                        </div>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                          Menghasilkan surplus ekonomi berkelanjutan untuk pemberdayaan fakir miskin.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-slate-100">
                          <span>Kelompok Wakaf Non-Produktif (Ibadah + Makam)</span>
                          <span className="font-mono text-base">40%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                          <div className="w-[40%] h-full bg-slate-500 rounded-full" />
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Fasilitas pelayanan spiritual dan sosial keagamaan umat.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WIDGET T3: Outlier Perpustakaan */}
            {task.id === 'T3' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Sertakan Data Anomali Bulan Ramadan (April: 180):
                  </span>
                  <button
                    onClick={() => setT3IncludeRamadan(!t3IncludeRamadan)}
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition ${
                      t3IncludeRamadan
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {t3IncludeRamadan ? 'Aktif (Outlier Masuk)' : 'Nonaktif (Pencilan Dikeluarkan)'}
                  </button>
                </div>

                {/* Month Data Bar */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Peminjaman Buku 6 Bulan: Jan(45), Feb(42), Mar(48), {t3IncludeRamadan ? <strong className="text-rose-600 dark:text-rose-400 font-bold">Apr(180)</strong> : <span className="line-through text-slate-400">Apr(180)</span>}, Mei(50), Jun(47).
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                        Nilai Mean (Rata-rata)
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                        {t3Mean.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {t3IncludeRamadan ? 'Terdistorsi oleh 180' : 'Representatif normal'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                        Nilai Median (Tengah)
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {t3Median.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Sangat stabil (resisten outlier)
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Prinsip Tabayyun:</strong> Mean berubah drastis sebesar +47,8% akibat 1 data ekstrem, sementara Median hanya bergeser +3,3%. Median adalah ukuran pemusatan yang jauh lebih tahan uji terhadap anomali musiman.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET T4: Murajaah vs Hafalan */}
            {task.id === 'T4' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Garis Tren Regresi Linier (Trendline):
                  </span>
                  <button
                    onClick={() => setT4ShowTrendline(!t4ShowTrendline)}
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition ${
                      t4ShowTrendline
                        ? 'bg-indigo-900 dark:bg-indigo-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t4ShowTrendline ? 'Trendline Aktif' : 'Trendline Nonaktif'}
                  </button>
                </div>

                {/* Scatter Plot Visualizer */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Sebaran Titik Santri (Durasi Muraja&apos;ah vs Skor Uji Hafalan):
                  </div>

                  <div className="h-44 bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-end">
                    {/* Trendline overlay */}
                    {t4ShowTrendline && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(45deg, transparent 48%, #4f46e5 49%, #4f46e5 51%, transparent 52%)'
                        }}
                      />
                    )}

                    {/* Scatter dots */}
                    {[
                      { x: 15, y: 30, val: '(2 jam, 60)' },
                      { x: 25, y: 40, val: '(3 jam, 65)' },
                      { x: 35, y: 50, val: '(4 jam, 70)' },
                      { x: 45, y: 58, val: '(5 jam, 74)' },
                      { x: 55, y: 68, val: '(6 jam, 80)' },
                      { x: 65, y: 72, val: '(7 jam, 82)' },
                      { x: 75, y: 84, val: '(8 jam, 88)' },
                      { x: 85, y: 89, val: '(9 jam, 91)' },
                      { x: 95, y: 95, val: '(10 jam, 95)' }
                    ].map((dot, dIdx) => (
                      <div
                        key={dIdx}
                        style={{ left: `${dot.x}%`, bottom: `${dot.y}%` }}
                        className="absolute w-3.5 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-slate-900 shadow-xs cursor-pointer hover:scale-125 transition"
                        title={dot.val}
                      />
                    ))}

                    <div className="w-full flex justify-between text-[10px] font-mono text-slate-400">
                      <span>0 jam</span>
                      <span>5 jam/mgg</span>
                      <span>10 jam/mgg</span>
                    </div>
                  </div>
                </div>

                {/* Prediction Simulator Slider */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex justify-between">
                    <span>Simulator Prediksi Skor Hafalan:</span>
                    <span className="font-mono text-indigo-900 dark:text-indigo-300 font-bold">
                      {t4MurajaahHours} Jam / Minggu
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={t4MurajaahHours}
                    onChange={e => setT4MurajaahHours(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-900 dark:accent-indigo-500"
                  />

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Estimasi Skor Uji Hafalan Santri:
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-800 dark:text-emerald-400">
                      ~{Math.min(100, Math.round(52 + t4MurajaahHours * 4.4))} / 100
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET T5: Infak Bias Comparison */}
            {task.id === 'T5' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setT5GraphMode('A')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      t5GraphMode === 'A'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Grafik A (Truncated Y-Axis / Terpotong)
                  </button>
                  <button
                    onClick={() => setT5GraphMode('B')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      t5GraphMode === 'B'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Grafik B (Zero-Based Axis / Standar Amanah)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[
                      { week: 'Pekan 1', val: 5100000, label: '5.1 Jt' },
                      { week: 'Pekan 2', val: 5200000, label: '5.2 Jt' },
                      { week: 'Pekan 3', val: 5150000, label: '5.15 Jt' },
                      { week: 'Pekan 4', val: 5400000, label: '5.4 Jt' }
                    ].map(item => {
                      // Calculate height based on mode
                      let heightPct = 0;
                      if (t5GraphMode === 'A') {
                        // truncated: min 5.0jt to 5.5jt
                        heightPct = ((item.val - 5000000) / 500000) * 85 + 15;
                      } else {
                        // zero based: 0 to 6jt
                        heightPct = (item.val / 6000000) * 85;
                      }

                      return (
                        <div key={item.week} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                            {item.label}
                          </span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-md transition-all duration-500 ${
                                t5GraphMode === 'A' ? 'bg-rose-600' : 'bg-emerald-600'
                              }`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.week}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    t5GraphMode === 'A'
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300'
                  }`}>
                    {t5GraphMode === 'A' ? (
                      <div>
                        <strong><AlertCircle className="w-4 h-4 inline mr-1" /> Distorsi Visual Skala Terpotong:</strong>
                        <p className="pt-1">
                          Sumbu Y sengaja dimulai dari Rp 5.000.000 (bukan nol). Akibatnya, kenaikan riil yang hanya sebesar ~5,8% terlihat seperti lonjakan dramatis 500%. Ini melanggar etika <em>Amanah</em> penyajian data publik.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <strong><CheckCircle2 className="w-4 h-4 inline mr-1" /> Penyajian Jujur Berbasis Nol (Zero-Baseline):</strong>
                        <p className="pt-1">
                          Sumbu Y berawal dari Rp 0 sehingga proporsi batang mencerminkan rasio riil infak tanpa rekayasa optik manipulatif.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET T6: KKM Bahasa Arab Decision */}
            {task.id === 'T6' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Sertakan 2 Siswa Inklusif (Nilai: 25 & 30):
                  </span>
                  <button
                    onClick={() => setT6IncludeOutliers(!t6IncludeOutliers)}
                    className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition ${
                      t6IncludeOutliers
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {t6IncludeOutliers ? 'Outlier Masuk (10 Siswa)' : 'Outlier Dikecualikan (8 Siswa)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-1">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">
                      Nilai Mean (Rata-rata)
                    </div>
                    <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                      {t6Mean.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {t6IncludeOutliers ? 'Anjlok dari 86,9' : 'Murni nilai reguler'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-1">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">
                      Nilai Median (Tengah)
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {t6Median.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sangat adil untuk mayoritas
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    <span>Keputusan Berbasis Nilai Keadilan (&apos;Adl):</span>
                  </div>
                  <p className="leading-relaxed">
                    Jika guru menetapkan KKM menggunakan Mean dengan outlier (75), maka 8 siswa reguler yang nilainya 82–92 akan dirugikan oleh standar yang terlalu rendah, sedangkan 2 siswa inklusif tetap tidak tuntas. Pendekatan adil: Gunakan Median (85,5) sebagai standar kelas dan buat program matrikulasi terpisah untuk siswa inklusif.
                  </p>
                </div>
              </div>
            )}

            {/* WIDGET T7: Bias Sampling Inspector */}
            {task.id === 'T7' && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-rose-600 dark:text-rose-400 font-bold">
                      Klaim Brosur Promosi:
                    </span>
                    <div className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                      &quot;90% Terbukti Efektif Meningkatkan Nilai Matematika Siswa Madrasah!&quot;
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ukuran sampel: 10 responden siswa.
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSampleModal(true)}
                    className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspeksi Demografi & Latar Belakang Sampel (10 Responden)</span>
                  </button>
                </div>
              </div>
            )}

            {/* WIDGET T8: Budget Allocation Simulator */}
            {task.id === 'T8' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex justify-between items-center font-bold text-slate-900 dark:text-slate-100">
                    <span>Plafon Anggaran Madrasah:</span>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400 text-sm">
                      Rp 20.000.000
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {t8BudgetList.map((ekskul, idx) => (
                      <div key={ekskul.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {ekskul.name} <span className="text-indigo-800 dark:text-indigo-400 font-mono">({ekskul.trend})</span>
                          </span>
                          <span className="font-mono text-indigo-900 dark:text-indigo-300 font-bold">
                            Rp {formatRupiah(ekskul.allocated)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={ekskul.max}
                          step="500000"
                          value={ekskul.allocated}
                          onChange={e => updateBudget(idx, parseInt(e.target.value, 10))}
                          className="w-full accent-indigo-900 dark:accent-indigo-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      Total Anggaran Ter-alokasi:
                    </span>
                    <span className={`font-mono text-base font-bold ${
                      t8Total === 20000000 
                        ? 'text-emerald-800 dark:text-emerald-400' 
                        : 'text-amber-800 dark:text-amber-400'
                    }`}>
                      Rp {formatRupiah(t8Total)}
                    </span>
                  </div>

                  {t8Total === 20000000 ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Sempurna! Total pas Rp 20.000.000 dengan pembagian proporsional terhadap tren peminat.</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-800 dark:text-amber-400 italic">
                      *Sesuaikan slider agar jumlah pas Rp 20.000.000 (Selisih: Rp {formatRupiah(Math.abs(20000000 - t8Total))}).
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* SAMPLE DEMOGRAPHICS INSPECTOR MODAL (FOR T7) */}
      {showSampleModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowSampleModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
                <span>Inspeksi Karakteristik Responden Sampel (Purposive Sampling Bias)</span>
              </h3>
              <button 
                onClick={() => setShowSampleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300 text-xs leading-relaxed">
              <strong><AlertCircle className="w-4 h-4 inline mr-1" /> Temuan Bias Metodologis (Prinsip Tabayyun):</strong>
              <p className="pt-1">
                Seluruh 10 siswa yang disurvei ternyata berasal dari kelas unggulan olimpiade dengan nilai awal yang memang sudah tinggi (92-98). Klaim efektivitas 90% tersebut <strong>TIDAK DAPAT DIGENERALISASI</strong> untuk seluruh siswa madrasah!
              </p>
            </div>

            <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Inisial Responden</th>
                    <th className="p-2.5">Kategori Kelas</th>
                    <th className="p-2.5">Nilai Rerata Math</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-mono text-slate-500">{i + 1}</td>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200">Siswa Unggulan #{i + 1}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-[10px] font-mono">
                          Kelas Pengayaan / Olimpiade
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                        {92 + (i % 6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowSampleModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Tutup Inspeksi Tabayyun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
