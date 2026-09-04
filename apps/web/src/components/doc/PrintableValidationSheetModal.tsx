'use client';

import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  FileCheck,
  FileDown
} from 'lucide-react';
import { ValidationItem } from '@/lib/research/types';
import { exportOfficialValidationSheetPdf } from '@/lib/research/pdfExport';

interface PrintableValidationSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: 'materi' | 'media' | 'islam';
  items: ValidationItem[];
}

export default function PrintableValidationSheetModal({
  isOpen,
  onClose,
  domain,
  items
}: PrintableValidationSheetModalProps) {
  const [validatorName, setValidatorName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skripsi_validation_sheet_meta');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.validatorName !== undefined) return parsed.validatorName;
        }
      } catch {
        // ignore
      }
    }
    return '';
  });

  const [validatorNip, setValidatorNip] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skripsi_validation_sheet_meta');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.validatorNip !== undefined) return parsed.validatorNip;
        }
      } catch {
        // ignore
      }
    }
    return '';
  });

  const [validatorInstansi, setValidatorInstansi] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skripsi_validation_sheet_meta');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.validatorInstansi !== undefined) return parsed.validatorInstansi;
        }
      } catch {
        // ignore
      }
    }
    return 'STAI Al-Bahjah Cirebon';
  });

  const [assessmentDate, setAssessmentDate] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skripsi_validation_sheet_meta');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.assessmentDate !== undefined) return parsed.assessmentDate;
        }
      } catch {
        // ignore
      }
    }
    return '........................ 2026';
  });

  const [city, setCity] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skripsi_validation_sheet_meta');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.city !== undefined) return parsed.city;
        }
      } catch {
        // ignore
      }
    }
    return 'Cirebon';
  });

  const [copied, setCopied] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skripsi_validation_sheet_meta', JSON.stringify({
        validatorName,
        validatorNip,
        validatorInstansi,
        assessmentDate,
        city
      }));
    } catch (e) {
      console.warn('Failed to save validation sheet meta to localStorage:', e);
    }
  }, [validatorName, validatorNip, validatorInstansi, assessmentDate, city]);

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

  const domainConfig = {
    materi: {
      title: 'LEMBAR VALIDASI AHLI MATERI MATEMATIKA',
      tableCode: 'Tabel 3.2',
      focus: 'Kesesuaian Kurikulum Merdeka, Konsep Ukuran Pemusatan & Konteks Dataset',
      expertRole: 'Ahli Materi Matematika'
    },
    media: {
      title: 'LEMBAR VALIDASI AHLI MEDIA & TEKNOLOGI PENDIDIKAN',
      tableCode: 'Tabel 3.3',
      focus: 'Visual Dasbor, Navigasi Interaktif, Cognitive Load Theory & Multiperangkat',
      expertRole: 'Ahli Media & Teknologi Pendidikan'
    },
    islam: {
      title: 'LEMBAR VALIDASI AHLI INTEGRASI NILAI KEISLAMAN',
      tableCode: 'Tabel 3.4',
      focus: 'Autentisitas Dalil Syariat, Prinsip Tabayyun & Amanah Data',
      expertRole: 'Ahli Integrasi Nilai Islam'
    }
  }[domain];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    exportOfficialValidationSheetPdf({
      domainTitle: domainConfig.title,
      tableCode: domainConfig.tableCode,
      expertRole: domainConfig.expertRole,
      items,
      validatorName,
      validatorNip,
      validatorInstansi,
      assessmentDate,
      city
    });
  };

  const handleCopyText = () => {
    let text = `================================================================================\n`;
    text += `${domainConfig.title}\n`;
    text += `Media Pembelajaran Dasbor Statistika Interaktif Terintegrasi Nilai Keislaman\n`;
    text += `Program Studi Tadris Matematika - STAI Al-Bahjah Cirebon\n`;
    text += `Acuan Proposal: ${domainConfig.tableCode} (Skala Likert 1-5)\n`;
    text += `================================================================================\n\n`;
    text += `Nama Validator     : ${validatorName || '...........................................................'}\n`;
    text += `NIP / NIDN         : ${validatorNip || '...........................................................'}\n`;
    text += `Instansi / Prodi   : ${validatorInstansi || '...........................................................'}\n`;
    text += `Bidang Kepakaran   : [X] ${domainConfig.expertRole}\n`;
    text += `Tanggal Penilaian  : ${assessmentDate || '...........................................................'}\n\n`;
    text += `PETUNJUK PENGISIAN:\n`;
    text += `Berikan tanda centang (✓) pada kolom skala penilaian (1 sampai 5) yang paling sesuai:\n`;
    text += `1 = Sangat Tidak Sesuai (STS)    4 = Sesuai (S)\n`;
    text += `2 = Tidak Sesuai (TS)            5 = Sangat Sesuai (SS)\n`;
    text += `3 = Kurang Sesuai (KS)\n\n`;
    text += `--------------------------------------------------------------------------------\n`;
    text += `No | Aspek / Indikator & Butir Pernyataan                  | 1 | 2 | 3 | 4 | 5 | Catatan\n`;
    text += `--------------------------------------------------------------------------------\n`;
    
    items.forEach((item, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      text += `${num} | [${item.id}] ${item.indicator}: ${item.statement}\n`;
      text += `   |                                                      |   |   |   |   |   | \n`;
    });
    
    text += `--------------------------------------------------------------------------------\n\n`;
    text += `KOMENTAR / SARAN PERBAIKAN UMUM:\n`;
    text += `................................................................................\n`;
    text += `................................................................................\n\n`;
    text += `KESIMPULAN KELAYAKAN:\n`;
    text += `[ ] Layak digunakan tanpa revisi\n`;
    text += `[ ] Layak digunakan dengan revisi sesuai saran\n`;
    text += `[ ] Tidak layak digunakan / perlu revisi total\n\n`;
    text += `                                                    ${city}, ${assessmentDate}\n`;
    text += `                                                    Validator,\n\n\n\n`;
    text += `                                                    ( ${validatorName || '..........................'} )\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    let text = `================================================================================\n`;
    text += `${domainConfig.title}\n`;
    text += `Media Pembelajaran Dasbor Statistika Interaktif Terintegrasi Nilai Keislaman\n`;
    text += `Program Studi Tadris Matematika - STAI Al-Bahjah Cirebon\n`;
    text += `Acuan Proposal: ${domainConfig.tableCode} (Skala Likert 1-5)\n`;
    text += `================================================================================\n\n`;
    text += `Nama Validator     : ${validatorName || '...........................................................'}\n`;
    text += `NIP / NIDN         : ${validatorNip || '...........................................................'}\n`;
    text += `Instansi / Prodi   : ${validatorInstansi || '...........................................................'}\n`;
    text += `Bidang Kepakaran   : [X] ${domainConfig.expertRole}\n`;
    text += `Tanggal Penilaian  : ${assessmentDate || '...........................................................'}\n\n`;
    text += `PETUNJUK PENGISIAN:\n`;
    text += `Berikan tanda centang (✓) pada kolom skala penilaian (1 sampai 5) yang paling sesuai:\n`;
    text += `1 = Sangat Tidak Sesuai (STS)    4 = Sesuai (S)\n`;
    text += `2 = Tidak Sesuai (TS)            5 = Sangat Sesuai (SS)\n`;
    text += `3 = Kurang Sesuai (KS)\n\n`;
    text += `--------------------------------------------------------------------------------\n`;
    text += `No | Aspek / Indikator & Butir Pernyataan                  | 1 | 2 | 3 | 4 | 5 | Catatan\n`;
    text += `--------------------------------------------------------------------------------\n`;
    
    items.forEach((item, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      text += `${num} | [${item.id}] ${item.indicator}: ${item.statement}\n`;
      text += `   |                                                      |   |   |   |   |   | \n`;
    });
    
    text += `--------------------------------------------------------------------------------\n\n`;
    text += `KOMENTAR / SARAN PERBAIKAN UMUM:\n`;
    text += `................................................................................\n`;
    text += `................................................................................\n\n`;
    text += `KESIMPULAN KELAYAKAN:\n`;
    text += `[ ] Layak digunakan tanpa revisi\n`;
    text += `[ ] Layak digunakan dengan revisi sesuai saran\n`;
    text += `[ ] Tidak layak digunakan / perlu revisi total\n\n`;
    text += `                                                    ${city}, ${assessmentDate}\n`;
    text += `                                                    Validator,\n\n\n\n`;
    text += `                                                    ( ${validatorName || '..........................'} )\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lembar-validasi-${domain}-siap-cetak.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:static print:bg-white print:z-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:rounded-none relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Controls Top Bar (Hidden on print) */}
        <div className="no-print p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Format Lembar Validasi (Siap Serah & Cetak)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {domainConfig.tableCode} &bull; Sesuai Format Skripsi Tadris Matematika
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white transition flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Download Dokumen PDF (jsPDF)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleCopyText}
              className="hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition items-center gap-1.5 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / A4</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition ml-1"
              title="Tutup (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable / Printable Form Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto print:p-0 print:overflow-visible space-y-6 text-slate-900 bg-white dark:bg-slate-900 print:bg-white print:text-black">
          
          {/* Official Letterhead / Header */}
          <div className="text-center border-b-2 border-slate-900 dark:border-slate-300 print:border-black pb-4 space-y-1">
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight uppercase print:text-sm">
              LEMBAR VALIDASI AHLI {domain === 'materi' ? 'MATERI MATEMATIKA' : domain === 'media' ? 'MEDIA & TEKNOLOGI PENDIDIKAN' : 'INTEGRASI NILAI KEISLAMAN'}
            </h2>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 print:text-xs uppercase">
              PENGEMBANGAN MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF TERINTEGRASI NILAI KEISLAMAN UNTUK MEMFASILITASI LITERASI DATA SISWA
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-700 italic">
              Program Studi Tadris Matematika &bull; Sekolah Tinggi Agama Islam Al-Bahjah Cirebon &bull; Acuan {domainConfig.tableCode}
            </p>
          </div>

          {/* Identity Table / Metadata Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 print:bg-white print:border-black print:p-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">Nama Validator:</span>
                <input
                  type="text"
                  placeholder="..........................................................."
                  value={validatorName}
                  onChange={(e) => setValidatorName(e.target.value)}
                  className="flex-1 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-indigo-600 px-1 py-0.5 text-xs text-slate-900 dark:text-slate-100 print:text-black"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">NIP / NIDN:</span>
                <input
                  type="text"
                  placeholder="..........................................................."
                  value={validatorNip}
                  onChange={(e) => setValidatorNip(e.target.value)}
                  className="flex-1 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-indigo-600 px-1 py-0.5 text-xs text-slate-900 dark:text-slate-100 print:text-black"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">Instansi / Unit:</span>
                <input
                  type="text"
                  value={validatorInstansi}
                  onChange={(e) => setValidatorInstansi(e.target.value)}
                  className="flex-1 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-indigo-600 px-1 py-0.5 text-xs text-slate-900 dark:text-slate-100 print:text-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">Bidang Kepakaran:</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-300 print:text-black">
                  [ ✓ ] {domainConfig.expertRole}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">Tanggal Penilaian:</span>
                <input
                  type="text"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="flex-1 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-indigo-600 px-1 py-0.5 text-xs text-slate-900 dark:text-slate-100 print:text-black"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 sm:w-32 font-bold shrink-0">Fokus Evaluasi:</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 print:text-black italic">
                  {domainConfig.focus}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs space-y-1 print:bg-white print:border-black">
            <span className="font-bold text-amber-950 dark:text-amber-300 print:text-black">PETUNJUK PENGISIAN:</span>
            <p className="text-slate-700 dark:text-slate-300 print:text-black leading-relaxed">
              Bapak/Ibu dimohon memberikan penilaian terhadap butir-butir pernyataan di bawah ini dengan memberikan tanda centang (✓) pada salah satu kolom skala penilaian (1 sampai 5) yang paling sesuai:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1 font-semibold text-[10px] sm:text-[11px] text-center text-slate-800 dark:text-slate-200 print:text-black">
              <div className="p-1 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900 print:border-black">1 = STS</div>
              <div className="p-1 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900 print:border-black">2 = TS</div>
              <div className="p-1 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900 print:border-black">3 = KS</div>
              <div className="p-1 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900 print:border-black">4 = S</div>
              <div className="p-1 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900 print:border-black col-span-2 sm:col-span-1">5 = SS</div>
            </div>
          </div>

          {/* Validation Checklist Table */}
          <div className="border border-slate-300 dark:border-slate-700 print:border-black rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 print:bg-slate-200 print:text-black font-bold border-b border-slate-300 dark:border-slate-700 print:border-black">
                  <th className="py-2.5 px-3 w-10 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700 print:border-black">Aspek / Indikator & Butir Pernyataan</th>
                  <th className="py-2.5 px-1.5 w-8 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">1</th>
                  <th className="py-2.5 px-1.5 w-8 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">2</th>
                  <th className="py-2.5 px-1.5 w-8 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">3</th>
                  <th className="py-2.5 px-1.5 w-8 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">4</th>
                  <th className="py-2.5 px-1.5 w-8 text-center border-r border-slate-300 dark:border-slate-700 print:border-black">5</th>
                  <th className="py-2.5 px-3 w-36 sm:w-40 text-center">Catatan / Saran Khusus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-black">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 print:hover:bg-transparent">
                    <td className="py-2.5 px-3 text-center font-mono font-semibold border-r border-slate-300 dark:border-slate-700 print:border-black">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700 print:border-black">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-[10px] border border-indigo-200 dark:border-indigo-800 print:border-black print:text-black">
                            {item.id}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">
                            {item.aspect || item.indicator}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 print:text-black leading-relaxed">
                          {item.statement}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 px-1 border-r border-slate-300 dark:border-slate-700 print:border-black text-center"></td>
                    <td className="py-2 px-1 border-r border-slate-300 dark:border-slate-700 print:border-black text-center"></td>
                    <td className="py-2 px-1 border-r border-slate-300 dark:border-slate-700 print:border-black text-center"></td>
                    <td className="py-2 px-1 border-r border-slate-300 dark:border-slate-700 print:border-black text-center"></td>
                    <td className="py-2 px-1 border-r border-slate-300 dark:border-slate-700 print:border-black text-center"></td>
                    <td className="py-2 px-2 text-center text-slate-400 italic"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Qualitative Notes / Comments Box */}
          <div className="border border-slate-300 dark:border-slate-700 print:border-black p-4 rounded-xl space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider block text-slate-900 dark:text-slate-100 print:text-black">
              KOMENTAR / SARAN PERBAIKAN UMUM:
            </span>
            <div className="h-16 border-b border-dashed border-slate-300 dark:border-slate-600 print:border-black"></div>
            <div className="h-6 border-b border-dashed border-slate-300 dark:border-slate-600 print:border-black"></div>
          </div>

          {/* Conclusion & Signature Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-end">
            <div className="border border-slate-300 dark:border-slate-700 print:border-black p-4 rounded-xl space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-wider block text-slate-900 dark:text-slate-100 print:text-black">
                KESIMPULAN KELAYAKAN MEDIA:
              </span>
              <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 print:text-black">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-400" />
                <span>Layak digunakan tanpa revisi</span>
              </label>
              <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 print:text-black">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-400" />
                <span>Layak digunakan dengan revisi sesuai saran</span>
              </label>
              <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 print:text-black">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-400" />
                <span>Tidak layak / perlu revisi total</span>
              </label>
            </div>

            <div className="text-center text-xs space-y-12">
              <div>
                <p>{city}, {assessmentDate}</p>
                <p className="font-semibold">Validator {domainConfig.expertRole},</p>
              </div>
              <div>
                <p className="font-bold underline decoration-dotted">
                  ( {validatorName || '...................................................'} )
                </p>
                <p className="text-[11px] text-slate-500 print:text-black">
                  NIP/NIDN: {validatorNip || '...................................................'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile-friendly bottom bar */}
        <div className="no-print p-3 border-t border-slate-200 dark:border-slate-800 flex sm:hidden items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl">
          <button
            onClick={handleExportPdf}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-700 text-white flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          >
            Tutup Lembar
          </button>
        </div>

      </div>
    </div>
  );
}

