"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { ShieldCheck, Scale, AlertTriangle } from "lucide-react";

interface ChartProps {
  data: any[];
  type: "bar" | "line";
  xAxisKey: string;
  dataKeys: string[];
  title: string;
  islamicValue: string;
}

export default function InteractiveChart({
  data,
  type,
  xAxisKey,
  dataKeys,
  title,
  islamicValue
}: ChartProps) {
  const { amanahZeroScale, toggleAmanahScale, confirmTawazun, tawazunConfirmed } = useStatsLabStore();
  const [activeTabayyun, setActiveTabayyun] = useState(false);

  // Calculate Mean and Median for Tawazun check
  const values = data.map((d) => d[dataKeys[0]] || 0);
  const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  // Outlier detection threshold (20% from median for Tabayyun)
  const isOutlierDetected = values.some((v) => Math.abs(v - median) > 0.2 * median);

  return (
    <div className="dataset-card glass-panel" style={{ padding: "24px", marginBottom: "24px" }}>
      {/* Header & Islamic Value Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>{title}</h3>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Nilai Keislaman: <strong style={{ color: "var(--accent-primary)" }}>Pilar {islamicValue}</strong>
          </span>
        </div>

        {/* 3 Islamic Pillars Control Tools */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Pilar Amanah Toggle */}
          <button
            onClick={toggleAmanahScale}
            className="btn-premium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              backgroundColor: amanahZeroScale ? "var(--color-emerald-700)" : "var(--color-amber-500)"
            }}
            title="Klik untuk menguji skala sumbu Y nol-based vs truncated (QS. Al-Mutaffifin: 1-3)"
          >
            <ShieldCheck size={16} />
            {amanahZeroScale ? "Amanah: Skala V-Zero" : "Amanah: Skala Dipotong"}
          </button>

          {/* Pilar Tabayyun Trigger */}
          {isOutlierDetected && (
            <button
              onClick={() => setActiveTabayyun(!activeTabayyun)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-amber-500)",
                backgroundColor: activeTabayyun ? "var(--color-amber-500)" : "transparent",
                color: activeTabayyun ? "#fff" : "var(--color-amber-500)",
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <AlertTriangle size={16} />
              {activeTabayyun ? "Tabayyun: Outlier Dideteksi" : "Uji Tabayyun"}
            </button>
          )}

          {/* Pilar Tawazun Trigger */}
          <button
            onClick={confirmTawazun}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-emerald-600)",
              backgroundColor: tawazunConfirmed ? "var(--color-emerald-600)" : "transparent",
              color: tawazunConfirmed ? "#fff" : "var(--color-emerald-600)",
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <Scale size={16} />
            {tawazunConfirmed ? "Tawazun OK" : "Cek Tawazun"}
          </button>
        </div>
      </div>

      {/* Tabayyun Verification Alert */}
      {activeTabayyun && (
        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderLeft: "4px solid var(--color-amber-500)",
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "0.9rem"
          }}
        >
          <strong>⚠️ Peringatan Tabayyun (QS. Al-Hujurat: 6):</strong> Ditemukan indikasi pencatatan lonjakan ekstrem (outlier &gt; 20% dari median). Lakukan verifikasi sumber data sebelum menarik kesimpulan akhir.
        </div>
      )}

      {/* Recharts Render Container */}
      <div style={{ width: "100%", height: 350, marginTop: "16px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey={xAxisKey} />
              <YAxis domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 5000000", "auto"]} />
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)" }} />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={idx === 0 ? "var(--color-emerald-600)" : "var(--color-amber-500)"}
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey={xAxisKey} />
              <YAxis domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 20", "auto"]} />
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)" }} />
              <Legend />
              {dataKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke="var(--color-emerald-700)"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Mean vs Median Analytical Footer (Tawazun Indicator) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px stroke var(--color-slate-200)",
          fontSize: "0.875rem",
          color: "var(--text-secondary)"
        }}
      >
        <span>Rata-Rata (Mean): <strong>{mean.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</strong></span>
        <span>Nilai Tengah (Median): <strong>{median.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</strong></span>
        <span>Status Distribusi (Tawazun): <strong style={{ color: Math.abs(mean - median) < 10 ? "var(--color-emerald-700)" : "var(--color-amber-500)" }}>{Math.abs(mean - median) < 10 ? "Seimbang" : "Miring (Asimetris)"}</strong></span>
      </div>
    </div>
  );
}
