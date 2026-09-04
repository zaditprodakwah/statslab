'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  FileDown, 
  Download, 
  Printer, 
  FileText,
  Layers
} from 'lucide-react';
import { ValidationItem } from '@/lib/research/types';
import { getFormattedDate } from '@/lib/research/pdfExport';

interface ValidationExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  tableCode: string;
  items: ValidationItem[];
  meanV: string;
  validCount: number;
  totalItems: number;
  onConfirmExportPdf: () => void;
  onConfirmExportCsv: () => void;
}

export default function ValidationExportPreviewModal({
  isOpen,
  onClose,
  domainName,
  tableCode,
  items,
  meanV,
  validCount,
  totalItems,
  onConfirmExportPdf,
  onConfirmExportCsv
}: ValidationExportPreviewModalProps) {
  // Close on Escape key & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validPercentage = totalItems > 0 ? ((validCount / totalItems) * 100).toFixed(1) : '0';
  const currentDate = getFormattedDate();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:static print:bg-white print:z-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="preview-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:rounded-none relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Action Bar (Hidden in print) */}
        <div className="no-print p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 id="preview-modal-title" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  Preview Dokumen Sebelum Ekspor PDF
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Format A4 Standar
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Verifikasi data Aiken&apos;s V sebelum mencetak atau mengunduh berkas PDF / CSV
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onConfirmExportPdf}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Unduh dokumen PDF langsung"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF Sekarang</span>
            </button>
            <button
              onClick={onConfirmExportCsv}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition items-center gap-1.5 active:scale-95"
              title="Unduh data tabel dalam format CSV (SPSS/Excel)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition items-center gap-1.5 active:scale-95"
              title="Cetak langsung menggunakan dialog cetak browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Print</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup Preview"
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition ml-1"
              title="Tutup (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto print:p-0 print:overflow-visible space-y-6 text-slate-900 bg-slate-100 dark:bg-slate-950/70 print:bg-white print:text-black">
          
          {/* A4 Paper Container Representation */}
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-slate-200 text-slate-900 print:shadow-none print:border-none print:p-0">
            
            {/* Header / Letterhead */}
            <div className="text-center pb-4 border-b-2 border-indigo-950 space-y-1">
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-indigo-950 uppercase">
                LAPORAN HASIL UJI VALIDITAS AHLI (AIKEN&apos;S V)
              </h2>
              <h3 className="text-xs font-bold text-slate-800 uppercase">
                MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF BERBASIS NILAI KEISLAMAN
              </h3>
              <p className="text-[11px] text-slate-600">
                Rumpun Validasi: <span className="font-semibold">{domainName.toUpperCase()}</span> ({tableCode}) &bull; Ambang Batas Valid: <span className="font-mono font-semibold">V &ge; 0.667</span> &bull; Rater (<span className="font-mono">n = 3</span>)
              </p>
            </div>

            {/* Summary Metrics Box */}
            <div className="my-5 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <div className="text-xs font-bold text-indigo-950 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-800" />
                <span>Ringkasan Psikometrik Rumpun:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Rerata Aiken&apos;s V:</span>
                  <span className="text-base font-extrabold font-mono text-emerald-800">{meanV}</span>
                  <span className="text-[10px] text-slate-500 block">Kriteria: Sangat Tinggi</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Kelayakan Butir:</span>
                  <span className="text-base font-bold text-indigo-900">{validCount} / {totalItems} Butir</span>
                  <span className="text-[10px] text-emerald-700 block font-mono font-semibold">({validPercentage}% Valid)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Kesimpulan Akhir:</span>
                  <span className={`text-xs font-bold block pt-1 ${validCount === totalItems ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {validCount === totalItems ? '✓ Seluruh Butir Valid (Fit)' : '⚠ Terdapat Butir Perlu Revisi'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Instrumen Siap Uji Coba</span>
                </div>
              </div>
            </div>

            {/* Data Table Preview */}
            <div className="border border-slate-300 rounded-lg overflow-x-auto my-4">
              <table className="w-full text-left text-[11px] border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-indigo-950 text-white font-bold border-b border-slate-300">
                    <th className="py-2 px-2 w-8 text-center border-r border-indigo-900">No</th>
                    <th className="py-2 px-2 w-12 text-center border-r border-indigo-900">Kode</th>
                    <th className="py-2 px-2.5 w-32 border-r border-indigo-900">Aspek / Indikator</th>
                    <th className="py-2 px-2.5 border-r border-indigo-900">Butir Pernyataan</th>
                    <th className="py-2 px-1.5 w-7 text-center border-r border-indigo-900">R1</th>
                    <th className="py-2 px-1.5 w-7 text-center border-r border-indigo-900">R2</th>
                    <th className="py-2 px-1.5 w-7 text-center border-r border-indigo-900">R3</th>
                    <th className="py-2 px-2 w-14 text-center border-r border-indigo-900">V-Index</th>
                    <th className="py-2 px-2 w-16 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, idx) => {
                    const s1 = it.r1 - 1;
                    const s2 = it.r2 - 1;
                    const s3 = it.r3 - 1;
                    const sumS = s1 + s2 + s3;
                    const vScore = (sumS / (3 * 4)).toFixed(3);
                    const isValid = Number(vScore) >= 0.667;

                    return (
                      <tr key={it.id} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                        <td className="py-2 px-2 text-center font-mono text-slate-500 border-r border-slate-200">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-indigo-950 border-r border-slate-200">
                          {it.id}
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-800 border-r border-slate-200">
                          {it.aspect || it.indicator}
                        </td>
                        <td className="py-2 px-2.5 text-slate-700 border-r border-slate-200 leading-snug">
                          {it.statement}
                        </td>
                        <td className="py-2 px-1.5 text-center font-mono border-r border-slate-200">{it.r1}</td>
                        <td className="py-2 px-1.5 text-center font-mono border-r border-slate-200">{it.r2}</td>
                        <td className="py-2 px-1.5 text-center font-mono border-r border-slate-200">{it.r3}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-indigo-950 border-r border-slate-200">
                          {vScore}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isValid 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}>
                            {isValid ? 'VALID' : 'REVISI'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Formula Note */}
            <p className="text-[10px] text-slate-500 italic mt-2">
              Formula Validitas Aiken: V = &sum;s / [n(c - 1)] = &sum;(r - 1) / 12 &bull; Batas penerimaan validitas isi psikometrik: V &ge; 0.667.
            </p>

            {/* Signature Block */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <div className="text-right text-xs space-y-1">
                <p className="text-slate-600">Cirebon, {currentDate}</p>
                <p className="text-slate-600">Peneliti / Pengembang Media,</p>
                <div className="h-14"></div>
                <p className="font-bold text-slate-900 underline">Muhammad Khoiruzzadittaqwa</p>
                <p className="text-[11px] text-slate-500 font-mono">NIM. 2220020002</p>
                <p className="text-[10px] text-slate-500">Tadris Matematika STAI Al-Bahjah Cirebon</p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Controls */}
        <div className="no-print p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">ESC</kbd> untuk kembali ke editor.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
            >
              Kembali / Edit
            </button>
            <button
              onClick={onConfirmExportPdf}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
