"use client";

import React, { useState } from 'react';
import DashboardClient from "@/components/DashboardClient";
import StickyHeader from "@/components/navigation/StickyHeader";
import Leaderboard from "@/components/Leaderboard";
import { useStatsLabStore } from "@/store/useStatsLabStore";
import { BookOpen, ShieldCheck, Scale, ArrowRight, User, Loader2 } from "lucide-react";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<'none' | 'student' | 'teacher' | 'researcher'>('none');
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    studentName: "",
    schoolName: "",
    studentClass: "",
    pinCode: ""
  });

  const setStudentInfo = useStatsLabStore(state => state.setStudentInfo);

  const handleStartSession = async () => {
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
          studentClass: data.data.studentClass,
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
      <div className="landing-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Hero Section */}
        <div className="hero-section text-center" style={{ padding: "40px 0" }}>
          <h1 className="hero-title" style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--color-emerald-700)" }}>
            StatsLab: Literasi Data Interaktif
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "1.2rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Mengembangkan kemampuan literasi data tingkat lanjut (Watson-Callingham) melalui eksplorasi visual interaktif, berlandaskan prinsip islami <strong>Tabayyun</strong>, <strong>Amanah</strong>, dan <strong>Tawazun</strong>.
          </p>
        </div>

        {/* Edukasi Konsep (3 Pilar Islam) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-emerald-50)", color: "var(--color-emerald-600)", borderRadius: "50%", marginBottom: "16px" }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Tabayyun (Kritis)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memeriksa validitas data dan mendeteksi anomali/outlier sebelum menyimpulkan.</p>
          </div>
          
          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-blue-50)", color: "var(--color-blue-600)", borderRadius: "50%", marginBottom: "16px" }}>
              <BookOpen size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Amanah (Integritas)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Menyajikan data secara jujur tanpa distorsi manipulasi skala grafik (Zero-based).</p>
          </div>
          
          <div className="glass-panel" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-purple-50)", color: "var(--color-purple-600)", borderRadius: "50%", marginBottom: "16px" }}>
              <Scale size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Tawazun (Keseimbangan)</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memahami distribusi data secara objektif (Mean vs Median) secara seimbang.</p>
          </div>
        </div>

        {/* Form Identitas */}
        <div className="glass-panel" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px", textAlign: "center", color: "var(--text-primary)" }}>Mulai Sesi Belajar</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "24px" }}>Masukkan identitas Anda untuk mencatat progres dan mendapatkan Sertifikat Kelulusan.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px", margin: "0 auto" }}>
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              className="form-input"
              value={formData.studentName}
              onChange={e => setFormData({...formData, studentName: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Asal Sekolah" 
              className="form-input"
              value={formData.schoolName}
              onChange={e => setFormData({...formData, schoolName: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Kelas (Opsional)" 
              className="form-input"
              value={formData.studentClass}
              onChange={e => setFormData({...formData, studentClass: e.target.value})}
            />
            
            {errorMsg && <div style={{ color: "var(--color-red-600)", fontSize: "0.9rem", textAlign: "center" }}>{errorMsg}</div>}
            
            <button 
              onClick={handleStartSession}
              disabled={loading}
              className="btn-premium btn-emerald w-full flex-center"
              style={{ padding: "14px", marginTop: "8px" }}
            >
              {loading ? <Loader2 size={18} className="spin" style={{ marginRight: "8px" }} /> : null}
              {loading ? "Menyiapkan Sesi..." : "Masuk Dasbor"}
              {!loading && <ArrowRight size={18} style={{ marginLeft: "8px" }} />}
            </button>
          </div>
        </div>

        <Leaderboard />

      </div>
    </div>
  );
}
