"use client";

import React, { useState } from "react";
import DashboardClient from "@/components/DashboardClient";
import StickyHeader from "@/components/navigation/StickyHeader";
import Leaderboard from "@/components/Leaderboard";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { BookOpen, ShieldCheck, Scale, ArrowRight, User, Loader2, GraduationCap, Eye, KeyRound } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<"student" | "teacher" | "researcher" | "guest">("student");
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    studentName: "",
    schoolName: "",
    studentClass: "",
    pinCode: "AK-8B"
  });

  const setStudentInfo = useStatsLabStore((state) => state.setStudentInfo);

  const handleStartSession = async () => {
    if (activeRole === "guest") {
      setStudentInfo({
        sessionId: undefined,
        studentName: "Pengunjung / Tamu",
        schoolName: "Eksplorasi Mandiri",
        studentClass: "-"
      });
      setSessionActive(true);
      return;
    }

    if (!formData.studentName || !formData.schoolName) {
      setErrorMsg("Nama dan Asal Sekolah wajib diisi!");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudentInfo({
          sessionId: data.data.sessionId,
          studentName: data.data.studentName,
          schoolName: data.data.schoolName,
          studentClass: data.data.studentClass
        });
        setSessionActive(true);
      } else {
        setErrorMsg(data.error || "Gagal membuat sesi");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan koneksi jaringan");
    } finally {
      setLoading(false);
    }
  };

  if (sessionActive) {
    return (
      <>
        <StickyHeader />
        <DashboardClient />
      </>
    );
  }

  return (
    <div className="landing-container" style={{ paddingBottom: "64px" }}>
      <div className="landing-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Hero Section */}
        <div className="hero-section text-center" style={{ padding: "40px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-emerald-50)",
              color: "var(--accent-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "16px"
            }}
          >
            <ShieldCheck size={18} /> R&D Ekosistem Literasi Data STAI Al-Bahjah Cirebon
          </div>

          <h1 className="hero-title" style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--color-emerald-700)" }}>
            StatsLab: Dasbor Statistika Interaktif
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Mengembangkan kemampuan literasi data tingkat lanjut (Watson-Callingham) melalui eksplorasi visual interaktif, berlandaskan prinsip islami <strong>Tabayyun</strong>, <strong>Amanah</strong>, dan <strong>Tawazun</strong>.
          </p>
        </div>

        {/* 4 Mode Entry Selector Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {/* Mode Siswa */}
          <div
            onClick={() => setActiveRole("student")}
            className={`role-card ${activeRole === "student" ? "active-student" : ""}`}
          >
            <div className="role-icon-wrapper" style={{ background: "var(--color-emerald-50)", color: "var(--color-emerald-600)" }}>
              <User size={24} />
            </div>
            <h4 className="role-title">Mode Siswa</h4>
            <p className="role-description">Masuk Sesi Kelas dengan Kode PIN 4-Digit (AK-8B)</p>
          </div>

          {/* Mode Guru */}
          <div
            onClick={() => setActiveRole("teacher")}
            className={`role-card ${activeRole === "teacher" ? "active-teacher" : ""}`}
          >
            <div className="role-icon-wrapper" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <GraduationCap size={24} />
            </div>
            <h4 className="role-title">Mode Guru</h4>
            <p className="role-description">Buat Sesi Kelas Baru & Pantau Progres Pembelajaran</p>
          </div>

          {/* Mode Peneliti */}
          <div
            onClick={() => setActiveRole("researcher")}
            className={`role-card ${activeRole === "researcher" ? "active-researcher" : ""}`}
          >
            <div className="role-icon-wrapper" style={{ background: "#faf5ff", color: "#9333ea" }}>
              <KeyRound size={24} />
            </div>
            <h4 className="role-title">Mode Peneliti</h4>
            <p className="role-description">Akses Panel Admin & Ekspor Berkas Winsteps/LISREL</p>
          </div>

          {/* Mode Eksplorasi (Guest) */}
          <div
            onClick={() => setActiveRole("guest")}
            className="role-card"
            style={{
              borderColor: activeRole === "guest" ? "var(--color-amber-500)" : "var(--color-slate-200)",
              backgroundColor: activeRole === "guest" ? "var(--color-amber-50)" : "var(--bg-surface)"
            }}
          >
            <div className="role-icon-wrapper" style={{ background: "var(--color-amber-50)", color: "var(--color-amber-600)" }}>
              <Eye size={24} />
            </div>
            <h4 className="role-title">Eksplorasi Bebas</h4>
            <p className="role-description">Uji Coba Dasbor Langsung Tanpa Menyimpan Data Sesi</p>
          </div>
        </div>

        {/* Role Form / Action Area */}
        <div className="glass-panel" style={{ padding: "32px", marginBottom: "40px" }}>
          {activeRole === "student" && (
            <div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px", textAlign: "center" }}>Masuk Sesi Pembelajaran Siswa</h3>
              <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.9rem" }}>
                Masukkan nama dan asal sekolah Anda. Kode PIN Sesi diperoleh dari Guru pengajar.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "420px", margin: "0 auto" }}>
                <input
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  className="form-input"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Asal Sekolah / Madraisah"
                  className="form-input"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Kelas (contoh: XI IPA 1)"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="PIN Sesi"
                    className="form-input text-uppercase text-center"
                    style={{ width: "120px", fontWeight: "bold" }}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  />
                </div>

                {errorMsg && <div style={{ color: "var(--color-red-600)", fontSize: "0.875rem", textAlign: "center" }}>{errorMsg}</div>}

                <button
                  onClick={handleStartSession}
                  disabled={loading}
                  className="btn-premium btn-emerald w-full flex-center"
                  style={{ padding: "12px" }}
                >
                  {loading ? <Loader2 size={18} className="spin" style={{ marginRight: "8px" }} /> : null}
                  {loading ? "Menyiapkan Sesi..." : "Mulai Belajar di Dasbor"}
                  {!loading && <ArrowRight size={18} style={{ marginLeft: "8px" }} />}
                </button>
              </div>
            </div>
          )}

          {activeRole === "teacher" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Mode Guru / Pengajar</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" }}>
                Gunakan Panel Admin untuk membuat PIN sesi kelas baru (contoh: AK-8B) dan mengunduh rekap nilai siswa.
              </p>
              <Link href="/admin" className="btn-premium flex-center" style={{ textDecoration: "none", display: "inline-flex", padding: "12px 24px", backgroundColor: "#2563eb" }}>
                Masuk ke Panel Guru & Admin
              </Link>
            </div>
          )}

          {activeRole === "researcher" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Mode Peneliti R&D</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" }}>
                Akses panel kontrol peneliti untuk mengekspor data mentah ke format Winsteps (.ctl) & LISREL (.csv).
              </p>
              <Link href="/admin" className="btn-premium flex-center" style={{ textDecoration: "none", display: "inline-flex", padding: "12px 24px", backgroundColor: "#9333ea" }}>
                Masuk ke Panel Peneliti (PIN STAI26)
              </Link>
            </div>
          )}

          {activeRole === "guest" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Mode Eksplorasi Bebas</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" }}>
                Uji coba visualisasi grafik dan instrumen tugas tanpa pendaftaran identitas atau penyimpanan database.
              </p>
              <button onClick={handleStartSession} className="btn-premium flex-center" style={{ display: "inline-flex", padding: "12px 24px", backgroundColor: "var(--color-amber-500)" }}>
                Langsung Masuk Dasbor (Tamu)
              </button>
            </div>
          )}
        </div>

        {/* 3 Pilar Islam Educational Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-emerald-50)", color: "var(--color-emerald-600)", borderRadius: "50%", marginBottom: "16px" }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Tabayyun (Kritis)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memeriksa validitas data dan mendeteksi anomali/outlier sebelum menyimpulkan.</p>
          </div>

          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-blue-50)", color: "#2563eb", borderRadius: "50%", marginBottom: "16px" }}>
              <BookOpen size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Amanah (Integritas)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Menyajikan data secara jujur tanpa distorsi manipulasi skala grafik (Zero-based).</p>
          </div>

          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-purple-50)", color: "#9333ea", borderRadius: "50%", marginBottom: "16px" }}>
              <Scale size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Tawazun (Keseimbangan)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memahami distribusi data secara objektif (Mean vs Median) secara seimbang.</p>
          </div>
        </div>

        {/* Dynamic Leaderboard */}
        <Leaderboard />
      </div>
    </div>
  );
}
