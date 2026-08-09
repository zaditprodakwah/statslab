import React, { useState } from 'react';
import DashboardClient from "@/components/DashboardClient";
import StickyHeader from "@/components/navigation/StickyHeader";
import { User, GraduationCap, Microscope, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<'none' | 'student' | 'teacher' | 'researcher'>('none');
  const [sessionActive, setSessionActive] = useState(false);

  if (sessionActive) {
    return (
      <>
        <StickyHeader />
        <DashboardClient />
      </>
    );
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        
        {/* Hero Section */}
        <div className="hero-section text-center">
          <h1 className="hero-title">
            Dasbor Statistika Interaktif
          </h1>
          <p className="hero-subtitle">
            Media Pembelajaran Statistika Terintegrasi Nilai Keislaman. Silakan pilih mode masuk untuk memulai.
          </p>
        </div>

        {/* Role Selector */}
        <div className="role-grid">
          
          <button 
            onClick={() => setActiveRole('student')}
            className={`role-card ${activeRole === 'student' ? 'active-student' : ''}`}
          >
            <div className="role-icon-wrapper text-emerald-600 bg-emerald-100">
              <User size={24} />
            </div>
            <h3 className="role-title">Mode Siswa</h3>
            <p className="role-description">Masuk ke sesi kelas menggunakan 4-Digit PIN tanpa perlu mendaftar akun.</p>
          </button>

          <button 
            onClick={() => setActiveRole('teacher')}
            className={`role-card ${activeRole === 'teacher' ? 'active-teacher' : ''}`}
          >
            <div className="role-icon-wrapper text-blue-600 bg-blue-100">
              <GraduationCap size={24} />
            </div>
            <h3 className="role-title">Mode Guru</h3>
            <p className="role-description">Buat sesi kelas baru dan pantau progres literasi data siswa secara real-time.</p>
          </button>

          <button 
            onClick={() => setActiveRole('researcher')}
            className={`role-card ${activeRole === 'researcher' ? 'active-researcher' : ''}`}
          >
            <div className="role-icon-wrapper text-purple-600 bg-purple-100">
              <Microscope size={24} />
            </div>
            <h3 className="role-title">Eksplorasi Mandiri</h3>
            <p className="role-description">Akses penuh ke dashboard untuk pengunjung, peneliti, atau pengujian.</p>
          </button>
        </div>

        {/* Dynamic Action Area */}
        <div className="action-area">
          {activeRole === 'student' && (
            <div className="glass-panel text-center page-enter">
              <h4 className="action-title">Masuk Sesi Kelas</h4>
              <div className="form-group">
                <input type="text" placeholder="Nama / Presensi (misal: Ahmad - 04)" className="form-input" />
                <input type="text" placeholder="Kode PIN (misal: AK-8B)" maxLength={5} className="form-input text-uppercase" />
                <button 
                  onClick={() => setSessionActive(true)}
                  className="btn-premium btn-emerald w-full flex-center"
                >
                  Mulai Belajar <ArrowRight size={18} className="icon-right" />
                </button>
              </div>
            </div>
          )}
          
          {activeRole === 'teacher' && (
            <div className="glass-panel text-center page-enter">
              <p className="action-desc">Teacher Panel masih dalam tahap pengembangan.</p>
              <button disabled className="btn-disabled w-full">
                Masuk Teacher Panel
              </button>
            </div>
          )}

          {activeRole === 'researcher' && (
            <div className="glass-panel text-center page-enter">
              <p className="action-desc">Lanjutkan eksplorasi modul tanpa login.</p>
              <button 
                onClick={() => setSessionActive(true)}
                className="btn-premium btn-purple w-full flex-center"
              >
                Eksplorasi Modul <ArrowRight size={18} className="icon-right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
