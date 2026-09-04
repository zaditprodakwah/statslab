'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Keyboard, 
  GraduationCap, 
  UserCheck, 
  Lightbulb,
  Sparkles
} from 'lucide-react';

export default function GuideSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara menggunakan fitur Task Studio untuk kegiatan pembelajaran di kelas?',
      a: 'Guru dapat membuka menu "Task Studio (T1 - T8)", memilih nomor tugas sesuai tahapan materi, dan memproyeksikan visualisasi grafik interaktif. Siswa diminta mengamati fenomena data, mengubah slider atau parameter, dan menjawab formulasi soal dengan rubrik politomi 0, 1, 2.'
    },
    {
      q: "Mengapa batas minimum Aiken's V ditetapkan pada 0,667?",
      a: "Berdasarkan tabel Aiken (1985) dengan jumlah penilai n = 3 orang ahli dan jumlah skala Likert c = 5 poin, nilai kritis koefisien validitas isi pada taraf signifikansi p < 0,05 adalah 0,667. Butir instrumen dengan V >= 0,667 dinyatakan valid dan tidak memerlukan revisi substansial."
    },
    {
      q: 'Bagaimana nilai keislaman diintegrasikan tanpa menimbulkan kesan dipaksakan?',
      a: 'Integrasi dilakukan secara organis melalui dataset sosiostatistika Islami nyata (seperti penerimaan zakat fitrah, aset wakaf produktif, kehadiran muraja\'ah santri, dan laporan infak masjid) serta penanaman karakter intelektual Tabayyun (verifikasi data) dan Amanah (penyajian data tanpa distorsi grafik).'
    },
    {
      q: 'Apakah aplikasi web ini dapat diakses secara offline atau pada ponsel siswa?',
      a: 'Ya, antarmuka dirancang sepenuhnya responsif (mobile-first & desktop-friendly) dan berjalan secara efisien di sisi peramban (client-side) tanpa membutuhkan instalasi perangkat lunak atau koneksi server berbobot berat.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
            <HelpCircle className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Panduan Penggunaan Media & Tanya Jawab (FAQ)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              Petunjuk operasional praktis bagi guru, penguji, dan siswa madrasah dalam memanfaatkan platform dasbor.
            </p>
          </div>
        </div>

        {/* User Role Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <GraduationCap className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              <span>Petunjuk untuk Guru / Pengajar</span>
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-4 leading-relaxed">
              <li>Gunakan tugas T1–T3 sebagai stimulus apersepsi dan pengenalan ukuran pemusatan data.</li>
              <li>Manfaatkan tugas T5 (Grafik Infak Bias) untuk mengajarkan etika komunikasi data dan integritas visual.</li>
              <li>Jadikan rubrik penskoran politomi (0, 1, 2) sebagai pedoman asesmen formatif otentik.</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Petunjuk untuk Siswa & Validator</span>
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-4 leading-relaxed">
              <li>Eksplorasi kontrol interaktif (slider, filter kategori, switch pencilan) sebelum menjawab tugas.</li>
              <li>Gunakan mode gelap (ikon bulan) saat membaca di lingkungan dengan pencahayaan rendah.</li>
              <li>Gunakan tombol pencarian cepat (<kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd>) untuk menemukan konsep spesifik secara instan.</li>
            </ul>
          </div>
        </div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
            <Keyboard className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
            <span>Pintasan Keyboard (Keyboard Shortcuts)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-400 text-[10px]">Pencarian Cepat</div>
              <div className="font-bold text-indigo-900 dark:text-indigo-300">Ctrl + K / ⌘K</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-400 text-[10px]">Tutup Modal</div>
              <div className="font-bold text-indigo-900 dark:text-indigo-300">Esc</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-400 text-[10px]">Navigasi Hasil</div>
              <div className="font-bold text-indigo-900 dark:text-indigo-300">↑ / ↓ Arrow</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-400 text-[10px]">Cetak Dokumen</div>
              <div className="font-bold text-indigo-900 dark:text-indigo-300">Ctrl + P / ⌘P</div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
