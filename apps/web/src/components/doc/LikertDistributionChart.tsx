'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as Star } from 'lucide-react';
import { ValidationItem } from '@/lib/research/types';

interface LikertDistributionChartProps {
  items: ValidationItem[];
  domainName: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      scale: number;
      label: string;
      total: number;
      percentage: number;
      r1: number;
      r2: number;
      r3: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-xs space-y-1.5 z-50">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Skala {data.scale}: {data.label}</span>
        </div>
        <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono">
          <div className="flex justify-between gap-4">
            <span>Total Frekuensi:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{data.total} ({data.percentage}%)</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] text-slate-500">
            <span>Rater 1 (Pakar 1):</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{data.r1} butir</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] text-slate-500">
            <span>Rater 2 (Pakar 2):</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{data.r2} butir</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] text-slate-500">
            <span>Rater 3 (Pakar 3):</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{data.r3} butir</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function LikertDistributionChart({ items, domainName }: LikertDistributionChartProps) {
  const [viewMode, setViewMode] = useState<'total' | 'by_rater'>('total');

  const stats = useMemo(() => {
    const rawCounts = [
      { scale: 1, label: 'Sangat Kurang', shortLabel: 'Skala 1', r1: 0, r2: 0, r3: 0, total: 0, color: '#f43f5e' },
      { scale: 2, label: 'Kurang Sesuai', shortLabel: 'Skala 2', r1: 0, r2: 0, r3: 0, total: 0, color: '#fb923c' },
      { scale: 3, label: 'Cukup Sesuai', shortLabel: 'Skala 3', r1: 0, r2: 0, r3: 0, total: 0, color: '#facc15' },
      { scale: 4, label: 'Sesuai / Baik', shortLabel: 'Skala 4', r1: 0, r2: 0, r3: 0, total: 0, color: '#6366f1' },
      { scale: 5, label: 'Sangat Sesuai', shortLabel: 'Skala 5', r1: 0, r2: 0, r3: 0, total: 0, color: '#10b981' }
    ];

    let totalRatings = 0;
    let sumScore = 0;

    items.forEach(it => {
      [it.r1, it.r2, it.r3].forEach((r, idx) => {
        const val = Math.max(1, Math.min(5, Math.round(r) || 1));
        const item = rawCounts.find(c => c.scale === val);
        if (item) {
          if (idx === 0) item.r1 += 1;
          if (idx === 1) item.r2 += 1;
          if (idx === 2) item.r3 += 1;
          item.total += 1;
          totalRatings += 1;
          sumScore += val;
        }
      });
    });

    const meanLikert = totalRatings > 0 ? (sumScore / totalRatings).toFixed(2) : '0';
    const highQualityCount = (rawCounts.find(c => c.scale === 4)?.total || 0) + (rawCounts.find(c => c.scale === 5)?.total || 0);
    const highQualityPct = totalRatings > 0 ? Math.round((highQualityCount / totalRatings) * 100) : 0;

    // Find modus
    const sorted = [...rawCounts].sort((a, b) => b.total - a.total);
    const modus = sorted[0]?.total > 0 ? `Skala ${sorted[0].scale} (${sorted[0].label})` : '-';

    const chartData = rawCounts.map(c => ({
      ...c,
      percentage: totalRatings > 0 ? Math.round((c.total / totalRatings) * 100) : 0
    }));

    return {
      chartData,
      totalRatings,
      meanLikert,
      highQualityPct,
      modus
    };
  }, [items]);

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Distribusi Skor Skala Likert (1 - 5) Penilai Ahli</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                {domainName}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Visualisasi proporsi sebaran penilaian 3 validator pada skala Likert 1 (Sangat Kurang) hingga 5 (Sangat Baik)
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('total')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              viewMode === 'total'
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 font-bold shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Total Frekuensi
          </button>
          <button
            onClick={() => setViewMode('by_rater')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              viewMode === 'by_rater'
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 font-bold shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Breakdown per Rater (R1, R2, R3)
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'total' ? (
            <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis 
                dataKey="shortLabel" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis 
                dataKey="shortLabel" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="r1" name="Rater 1 (Materi/Media)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="r2" name="Rater 2 (Ahli Pembelajaran)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="r3" name="Rater 3 (Integrasi/IT)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary KPI Cards Below Chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Rerata Skor Likert</div>
          <div className="text-base font-bold font-mono text-indigo-900 dark:text-indigo-300">
            {stats.meanLikert} <span className="text-xs font-normal text-slate-500">/ 5.00</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Modus (Dominan)</div>
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 truncate mt-1">
            {stats.modus}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Skor Baik & Sangat Baik (4-5)</div>
          <div className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
            {stats.highQualityPct}% <span className="text-[11px] font-normal text-slate-500">kesepakatan</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Observasi Penilaian</div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
            {stats.totalRatings} <span className="text-[11px] font-normal text-slate-500">rating pakar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
