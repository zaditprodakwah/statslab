/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
  ResponsiveContainer,
} from "recharts";
import { ShieldCheck, HelpCircle, Eye, RefreshCw, MoveVertical } from "lucide-react";
import { useStatsLabStore } from "@/store/useStatsLabStore";

interface InteractiveChartProps {
  title: string;
  islamicValue: string;
  type?: "bar" | "line";
  xAxisKey?: string;
  dataKeys?: string[];
  data: unknown[];
  onChartClick?: (payload: unknown) => void;
  compactMode?: boolean;
}

export default function InteractiveChart({
  title,
  islamicValue,
  type = "bar",
  xAxisKey = "wilayah",
  dataKeys = ["zakat"],
  data: initialData,
  onChartClick,
  compactMode = false
}: InteractiveChartProps) {
  const [data, setData] = useState(initialData);
  const [showTabayyunModal, setShowTabayyunModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // Zustand state for 3 Pilar Islam
  const { amanahZeroScale, toggleAmanahScale } = useStatsLabStore();

  const handleOutlierClick = (item: unknown) => {
    setSelectedPoint(item);
    setShowTabayyunModal(true);
  };

  const handleResetData = () => {
    setData(initialData);
  };

  return (
    <div className="dataset-card glass-panel" style={{ padding: compactMode ? "16px" : "24px", marginBottom: "24px" }}>
      {/* Card Header & Islamic Value Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: compactMode ? "1.1rem" : "1.25rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Visualisasi Data Statistika Terintegrasi Nilai <strong>{islamicValue}</strong>
          </p>
        </div>

        {/* 3 Pilar Islam Control Toggles */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={toggleAmanahScale}
            className="btn-premium"
            style={{
              padding: "6px 12px",
              fontSize: "0.8rem",
              backgroundColor: amanahZeroScale ? "var(--color-emerald-700)" : "var(--color-amber-500)",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            title={
              amanahZeroScale
                ? "Prinsip Amanah: Skala Sumbu Y dimulai dari Nol (Jujur & Transparan)"
                : "Skala Potong: Sumbu Y dipotong (Dapat Memanipulasi Visual)"
            }
          >
            <ShieldCheck size={14} />
            {amanahZeroScale ? "Amanah: Skala Nol (Aktif)" : "Skala Dipotong (Non-Amanah)"}
          </button>

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
              <YAxis domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 20", "auto"]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", fontSize: "0.85rem" }} />
              <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
              {dataKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={idx === 0 ? "var(--color-emerald-600)" : "var(--color-amber-500)"}
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                  onClick={(payload) => {
                    if (onChartClick) onChartClick(payload);
                  }}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
              <YAxis domain={amanahZeroScale ? [0, "auto"] : ["dataMin - 20", "auto"]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "var(--radius-md)", fontSize: "0.85rem" }} />
              <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
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
                      if (onChartClick) onChartClick(payload);
                    },
                    cursor: "grab"
                  }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Tabayyun Verification Modal */}
      {showTabayyunModal && selectedPoint && (
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
            padding: "16px"
          }}
        >
          <div className="glass-panel" style={{ width: "100%", maxWidth: "450px", padding: "24px" }}>
            <h4 style={{ fontSize: "1.2rem", color: "var(--color-emerald-700)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={20} /> Peringatan Etika Tabayyun (QS. Al-Hujurat: 6)
            </h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Anda memilih titik data nilai ekstrem/outlier pada <strong>{selectedPoint[xAxisKey]}</strong>.
              Sebelum menyimpulkan data ini, lakukan verifikasi ulang apakah ada kesalahan input data.
            </p>

            <button
              onClick={() => setShowTabayyunModal(false)}
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
