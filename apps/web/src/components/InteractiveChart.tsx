/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ShieldCheck, RefreshCw, ChevronUp, ChevronDown, BarChart3, LineChart as LineIcon, PieChart as PieIcon } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import type { PrerequisiteKey } from "@/lib/scoring";

interface InteractiveChartProps {
  title: string;
  islamicValue: string;
  type?: "bar" | "line" | "pie";
  xAxisKey?: string;
  dataKeys?: string[];
  data: unknown[];
  onChartClick?: (payload: unknown) => void;
  compactMode?: boolean;
  // T4/T7: modul mana yang sedang ditugaskan (glow highlight) oleh gembok prasyarat.
  highlightKey?: PrerequisiteKey | null;
}

const PIE_COLORS = [
  "var(--color-emerald-600)",
  "var(--color-amber-500)",
  "var(--color-emerald-400)",
  "var(--color-amber-600)",
];

const CHART_TYPES: { key: "bar" | "line" | "pie"; label: string; icon: typeof BarChart3 }[] = [
  { key: "bar", label: "Bar", icon: BarChart3 },
  { key: "line", label: "Line", icon: LineIcon },
  { key: "pie", label: "Pie", icon: PieIcon },
];

function summarize(values: number[]) {
  if (values.length === 0) return { mean: 0, median: 0, stdDev: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return { mean, median, stdDev: Math.sqrt(variance) };
}

export default function InteractiveChart({
  title,
  islamicValue,
  type = "bar",
  xAxisKey = "provinsi",
  dataKeys = ["penghimpunan_miliar"],
  data: initialData,
  onChartClick,
  compactMode = false,
  highlightKey = null,
}: InteractiveChartProps) {
  const [data, setData] = useState(initialData);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">(type);
  const [pendingClick, setPendingClick] = useState<{ payload: any; label: string } | null>(null);
  const [showTabayyunModal, setShowTabayyunModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Zustand state for 3 Pilar Islam
  const { amanahZeroScale, tabayyunThreshold, tawazunConfirmed, setTabayyunThreshold, setChartTypeUsed } = useStatsLabStore();

  // Chart Type Switcher (Level 2) — catat tipe yang digunakan agar gembok chartType terbuka.
  const changeChartType = (next: "bar" | "line" | "pie") => {
    setChartType(next);
    setChartTypeUsed(next);
  };

  // Modul chart (tabayyun/chartType) sedang ditugaskan → tampil glow + selalu terbuka.
  const chartHighlighted = highlightKey === "tabayyunThreshold" || highlightKey === "chartType";

  // Mobile Collapsible: default menyusut di HP (lebar ≤ 640px), kecuali modul sedang ditugaskan.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => {
      if (!chartHighlighted) setCollapsed(mq.matches);
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [chartHighlighted]);

  // Efek visual: saat modul ditugaskan, grafik selalu terbuka meski `collapsed` masih true.
  const isCollapsed = collapsed && !chartHighlighted;

  const primaryKey = dataKeys[0];
  const stats = useMemo(() => {
    const values = (data as Record<string, number | undefined>[])
      .map((row) => Number(row[primaryKey]))
      .filter((v) => !Number.isNaN(v));
    return summarize(values);
  }, [data, primaryKey]);

  // Outlier detection berbasis threshold Pilar Tabayyun (store.tabayyunThreshold)
  const isOutlier = (value: number) => {
    const t = tabayyunThreshold || 0.2;
    return value < stats.mean * (1 - t) || value > stats.mean * (1 + t);
  };

  const handlePointClick = (payload: any) => {
    const row = payload?.activePayload ? payload.activePayload[0]?.payload : payload;
    const value = Number(row?.[primaryKey]);
    if (!Number.isNaN(value) && isOutlier(value)) {
      setPendingClick({ payload, label: row?.[xAxisKey] ?? "Titik Data" });
      setShowTabayyunModal(true);
      return;
    }
    if (onChartClick) onChartClick(payload);
  };

  const confirmTabayyun = () => {
    setShowTabayyunModal(false);
    if (pendingClick && onChartClick) onChartClick(pendingClick.payload);
    setPendingClick(null);
  };

  const handleResetData = () => {
    setData(initialData);
  };

  // Diagram lingkaran: agregasi nilai tiap dataKey ke satu irisan (distribusi kategori)
  const pieData = useMemo(() => {
    if (chartType !== "pie") return [];
    return dataKeys.map((key) => ({
      name: key,
      value: (data as Record<string, number | undefined>[]).reduce(
        (sum, row) => sum + (Number(row[key]) || 0),
        0
      ),
    }));
  }, [chartType, dataKeys, data]);

  const referenceLines =
    tawazunConfirmed && chartType !== "pie" ? (
      <>
        <ReferenceLine
          y={stats.mean}
          stroke="var(--color-purple-600)"
          strokeDasharray="5 4"
          label={{
            value: `Mean ${stats.mean.toFixed(1)}`,
            position: "insideTopRight",
            fontSize: 11,
            fill: "var(--color-purple-600)",
          }}
        />
        <ReferenceLine
          y={stats.median}
          stroke="#2563eb"
          strokeDasharray="5 4"
          label={{
            value: `Median ${stats.median.toFixed(1)}`,
            position: "insideBottomLeft",
            fontSize: 11,
            fill: "#2563eb",
          }}
        />
      </>
    ) : null;

  const outlierBarFill = (row: Record<string, any>) => {
    const v = Number(row[primaryKey]);
    if (Number.isNaN(v)) return "var(--color-emerald-600)";
    return isOutlier(v) ? "var(--color-red-500)" : "var(--color-emerald-600)";
  };

  const customLineDot = (props: any) => {
    const { cx, cy, index, payload } = props;
    const v = Number(payload?.[primaryKey]);
    const outlier = !Number.isNaN(v) && isOutlier(v);
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={outlier ? 7 : 5}
        fill={outlier ? "var(--color-red-500)" : "var(--color-emerald-700)"}
        stroke="#fff"
        strokeWidth={1.5}
        cursor="pointer"
      />
    );
  };

  return (
    <div
      className="dataset-card glass-panel"
      style={{
        padding: compactMode ? "16px" : "24px",
        marginBottom: "24px",
        border: chartHighlighted ? "2px solid var(--color-amber-500)" : undefined,
        boxShadow: chartHighlighted ? "0 0 0 4px rgba(245,158,11,0.15)" : undefined,
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Card Header & Islamic Value Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: compactMode ? "1.1rem" : "1.25rem",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {chartHighlighted && <span>✨</span>}
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Visualisasi Data Statistika Terintegrasi Nilai <strong>{islamicValue}</strong>
          </p>
          {chartHighlighted && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-amber-700)",
                backgroundColor: "var(--color-amber-50)",
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
              }}
            >
              {highlightKey === "tabayyunThreshold"
                ? "🎯 Tugas aktif: geser Slider Tabayyun lalu klik titik ekstrem untuk verifikasi."
                : "🎯 Tugas aktif: ubah tipe grafik untuk mengamati pola data."}
            </p>
          )}
        </div>

        {/* Chart Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {tawazunConfirmed && chartType !== "pie" && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--color-purple-600)",
                backgroundColor: "var(--color-purple-50)",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                fontWeight: 600,
              }}
            >
              ⚖️ Tawazun: Mean vs Median
            </span>
          )}

          {/* Chart Type Switcher (Level 2) */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "var(--color-slate-100)",
              borderRadius: "var(--radius-full)",
              padding: "4px",
            }}
            title="Chart Type Switcher — ubah tipe visualisasi"
          >
            {CHART_TYPES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => changeChartType(key)}
                className="control-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: chartType === key ? "var(--color-emerald-700)" : "transparent",
                  color: chartType === key ? "#fff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Tabayyun Threshold Slider (Level 3) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              backgroundColor: "var(--color-slate-100)",
              borderRadius: "var(--radius-full)",
            }}
            title="Tabayyun Threshold Slider — atur ambang batas outlier"
          >
            <ShieldCheck size={14} color="var(--color-emerald-700)" />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Tabayyun {Math.round(tabayyunThreshold * 100)}%
            </span>
            <input
              type="range"
              min={0.05}
              max={0.5}
              step={0.05}
              value={tabayyunThreshold}
              onChange={(e) => setTabayyunThreshold(Number(e.target.value))}
              aria-label="Tabayyun threshold"
              style={{ width: "90px", cursor: "pointer" }}
            />
          </div>

          <button
            onClick={handleResetData}
            className="control-btn"
            style={{ padding: "6px" }}
            title="Reset Data ke Semula"
          >
            <RefreshCw size={16} />
          </button>

          {/* Collapse Toggle (Mobile) */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="control-btn"
            style={{ padding: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            title={isCollapsed ? "Perluas Grafik" : "Ciutkan Grafik"}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Collapsed state: grafik menyusut jadi header ringkas (mobile-friendly) */}
(removed)
        <button
          onClick={() => setCollapsed(false)}
          className="w-full"
          style={{
            width: "100%",
            padding: "14px",
            border: "1px dashed var(--color-slate-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-slate-50)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "0.9rem",
          }}
        >
          <ChevronDown size={18} /> Grafik diciutkan — klik untuk memperluas dan berinteraksi
        </button>
      ) : (
        <div style={{ width: "100%", height: compactMode ? 240 : 300, marginTop: "12px" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                <YAxis
                  domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 20", "auto"]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", fontSize: "0.85rem" }} />
                <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
                {referenceLines}
                {dataKeys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                    onClick={(payload) => {
                      handlePointClick(payload);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {(data as Record<string, any>[]).map((row, i) => (
                      <Cell
                        key={`cell-${key}-${i}`}
                        fill={idx === 0 ? outlierBarFill(row) : "var(--color-amber-500)"}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                <YAxis
                  domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 20", "auto"]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", fontSize: "0.85rem" }} />
                <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
                {referenceLines}
                {dataKeys.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke="var(--color-emerald-700)"
                    strokeWidth={3}
                    dot={customLineDot}
                    animationDuration={800}
                    activeDot={{
                      r: 9,
                      onClick: (e, payload) => {
                        handlePointClick(payload);
                      },
                      cursor: "grab",
                    }}
                  />
                ))}
              </LineChart>
            ) : (
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", fontSize: "0.85rem" }} />
                <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={compactMode ? 70 : 90}
                  label
                  animationDuration={800}
                  onClick={(payload: any) => {
                    handlePointClick({
                      ...payload.payload,
                      [xAxisKey]: payload.name,
                      value: payload.value,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabayyun Verification Modal */}
      {showTabayyunModal && pendingClick && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            className="glass-panel"
            style={{ width: "100%", maxWidth: "450px", padding: "24px" }}
          >
            <h4
              style={{
                fontSize: "1.2rem",
                color: "var(--color-emerald-700)",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={20} /> Peringatan Etika Tabayyun (QS. Al-Hujurat: 6)
            </h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Anda memilih titik data nilai ekstrem/outlier pada{" "}
              <strong>{pendingClick.label}</strong>. Sebelum menyimpulkan data ini, lakukan
              verifikasi ulang apakah ada kesalahan input data.
            </p>

            <button
              onClick={confirmTabayyun}
              className="btn-premium btn-emerald w-full"
              style={{ padding: "10px" }}
            >
              Saya Mengerti (Konfirmasi Tabayyun)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
