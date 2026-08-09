/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
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
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";

interface InteractiveChartProps {
  title: string;
  islamicValue: string;
  type?: "bar" | "line" | "pie";
  xAxisKey?: string;
  dataKeys?: string[];
  data: unknown[];
  onChartClick?: (payload: unknown) => void;
  compactMode?: boolean;
}

const PIE_COLORS = [
  "var(--color-emerald-600)",
  "var(--color-amber-500)",
  "var(--color-emerald-400)",
  "var(--color-amber-600)",
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
}: InteractiveChartProps) {
  const [data, setData] = useState(initialData);
  const [pendingClick, setPendingClick] = useState<{ payload: any; label: string } | null>(null);
  const [showTabayyunModal, setShowTabayyunModal] = useState(false);

  // Zustand state for 3 Pilar Islam
  const { amanahZeroScale, tabayyunThreshold, tawazunConfirmed } = useStatsLabStore();

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
    if (type !== "pie") return [];
    return dataKeys.map((key) => ({
      name: key,
      value: (data as Record<string, number | undefined>[]).reduce(
        (sum, row) => sum + (Number(row[key]) || 0),
        0
      ),
    }));
  }, [type, dataKeys, data]);

  const referenceLines =
    tawazunConfirmed && type !== "pie" ? (
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

  return (
    <div
      className="dataset-card glass-panel"
      style={{ padding: compactMode ? "16px" : "24px", marginBottom: "24px" }}
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
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Visualisasi Data Statistika Terintegrasi Nilai <strong>{islamicValue}</strong>
          </p>
        </div>

        {/* Chart Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {tawazunConfirmed && type !== "pie" && (
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
          <button
            onClick={handleResetData}
            className="control-btn"
            style={{ padding: "6px" }}
            title="Reset Data ke Semula"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Chart Visualization */}
      <div style={{ width: "100%", height: compactMode ? 240 : 300, marginTop: "12px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
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
                  fill={idx === 0 ? "var(--color-emerald-600)" : "var(--color-amber-500)"}
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                  onClick={(payload) => {
                    handlePointClick(payload);
                  }}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </BarChart>
          ) : type === "line" ? (
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
                  dot={{ r: 6, cursor: "grab" }}
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
