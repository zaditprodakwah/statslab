import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "StatsLab — Dasbor Statistika Interaktif & EdTech Ecosystem";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#064e3b",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.08) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.15) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#10b981",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#064e3b",
              letterSpacing: "0.5px",
            }}
          >
            StatsLab V2
          </div>
          <span style={{ fontSize: "18px", opacity: 0.8, color: "#a7f3d0" }}>
            Institut Al-Bahjah Cirebon • Pendidikan Matematika
          </span>
        </div>

        {/* Center Title & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1000px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Dasbor Statistika Interaktif & Ecosystem EdTech R&D
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#6ee7b7",
              margin: 0,
              lineHeight: 1.4,
              opacity: 0.95,
            }}
          >
            Integrasi Nilai Keislaman (Tabayyun, Amanah, Tawazun) • Asesmen Literasi Data Watson-Callingham Level 1-6 • Psikometri Rasch PCM & CFA
          </p>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "18px", color: "#a7f3d0" }}>
            <span>Peneliti: Muhammad Khoiruzzadittaqwa (muhzadit)</span>
          </div>
          <div style={{ fontSize: "18px", color: "#34d399", fontWeight: 600 }}>
            statslabmedia.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
