"use client";

import React, { useState } from 'react';
import DashboardClient from "@/components/DashboardClient";
import StickyHeader from "@/components/navigation/StickyHeader";
import { User, GraduationCap, Microscope, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<'none' | 'student' | 'teacher' | 'researcher'>('none');
  const [sessionActive, setSessionActive] = useState(false);

  // If session is active (e.g. Student entered PIN), show the dashboard
  if (sessionActive) {
    return (
      <>
        <StickyHeader />
        <DashboardClient />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-slate-900">
            Dasbor Statistika Interaktif
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Media Pembelajaran Statistika Terintegrasi Nilai Keislaman. Silakan pilih mode masuk untuk memulai.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          {/* Mode Siswa */}
          <button 
            onClick={() => setActiveRole('student')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-left hover:border-emerald-500 hover:shadow-lg ${activeRole === 'student' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
          >
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <User size={24} />
            </div>
            <h3 className="font-outfit font-semibold text-lg text-slate-900 mb-2 w-full text-center">Mode Siswa</h3>
            <p className="text-sm text-slate-500 text-center">Masuk ke sesi kelas menggunakan 4-Digit PIN tanpa perlu mendaftar akun.</p>
          </button>

          {/* Mode Guru */}
          <button 
            onClick={() => setActiveRole('teacher')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-left hover:border-blue-500 hover:shadow-lg ${activeRole === 'teacher' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-outfit font-semibold text-lg text-slate-900 mb-2 w-full text-center">Mode Guru</h3>
            <p className="text-sm text-slate-500 text-center">Buat sesi kelas baru dan pantau progres literasi data siswa secara real-time.</p>
          </button>

          {/* Mode Peneliti / Tamu */}
          <button 
            onClick={() => setActiveRole('researcher')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-left hover:border-purple-500 hover:shadow-lg ${activeRole === 'researcher' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}
          >
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
              <Microscope size={24} />
            </div>
            <h3 className="font-outfit font-semibold text-lg text-slate-900 mb-2 w-full text-center">Eksplorasi Mandiri</h3>
            <p className="text-sm text-slate-500 text-center">Akses penuh ke dashboard untuk pengunjung, peneliti, atau pengujian.</p>
          </button>
        </div>

        {/* Dynamic Action Area based on Role */}
        <div className="pt-8 h-40">
          {activeRole === 'student' && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <h4 className="font-medium text-slate-900 mb-4">Masuk Sesi Kelas</h4>
              <div className="space-y-3">
                <input type="text" placeholder="Nama / Presensi (misal: Ahmad - 04)" className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="text" placeholder="Kode PIN (misal: AK-8B)" maxLength={5} className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase" />
                <button 
                  onClick={() => setSessionActive(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  Mulai Belajar <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}
          
          {activeRole === 'teacher' && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <p className="text-slate-600 mb-4">Teacher Panel masih dalam tahap pengembangan.</p>
              <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-md font-medium cursor-not-allowed">
                Masuk Teacher Panel
              </button>
            </div>
          )}

          {activeRole === 'researcher' && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <p className="text-slate-600 mb-4">Lanjutkan eksplorasi modul tanpa login.</p>
              <button 
                onClick={() => setSessionActive(true)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors flex items-center justify-center"
              >
                Eksplorasi Modul <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
