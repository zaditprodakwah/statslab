'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  RotateCcw, 
  Download, 
  Check, 
  GraduationCap, 
  Sparkles,
  Search,
  Info,
  FileCheck
} from 'lucide-react';
import { VALIDATION_DOMAINS, SUS_ITEMS, TASKS_DATA } from '@/lib/research/data';
import { ValidationItem, SUSItem, TaskData } from '@/lib/research/types';
import PrintableValidationSheetModal from './PrintableValidationSheetModal';

export default function MasterInstrumentsSection() {
  // Navigation within the master section
  const [activeTable, setActiveTable] = useState<'all' | 't32' | 't33' | 't34' | 't35' | 't36'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resmi_proposal' | 'usulan_revisi'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfficialSheetOpen, setIsOfficialSheetOpen] = useState(false);
  const [officialSheetDomain, setOfficialSheetDomain] = useState<'materi' | 'media' | 'islam'>('materi');
  
  // State for editable datasets
  const [materiItems, setMateriItems] = useState<ValidationItem[]>(() => 
    VALIDATION_DOMAINS.materi.items.map(it => ({ ...it }))
  );
  const [mediaItems, setMediaItems] = useState<ValidationItem[]>(() => 
    VALIDATION_DOMAINS.media.items.map(it => ({ ...it }))
  );
  const [islamItems, setIslamItems] = useState<ValidationItem[]>(() => 
    VALIDATION_DOMAINS.islam.items.map(it => ({ ...it }))
  );
  const [susItemsState, setSusItemsState] = useState<SUSItem[]>(() => 
    SUS_ITEMS.map(it => ({ ...it }))
  );
  const [tasksState, setTasksState] = useState<TaskData[]>(() => 
    TASKS_DATA.map(it => ({ ...it, rubric: { ...it.rubric } }))
  );

  // Modal / Editing states
  const [copiedType, setCopiedType] = useState<string | null>(null);
  

  // Compute Aiken's V helper
  const computeV = (item: ValidationItem) => {
    const s1 = Math.max(0, Math.min(4, (item.r1 || 1) - 1));
    const s2 = Math.max(0, Math.min(4, (item.r2 || 1) - 1));
    const s3 = Math.max(0, Math.min(4, (item.r3 || 1) - 1));
    return (s1 + s2 + s3) / 12;
  };

  // Reset all to default proposal data
  const handleResetAll = () => {
    if (window.confirm('Kembalikan semua data instrumen dan rubrik ke draf standar proposal skripsi?')) {
      setMateriItems(VALIDATION_DOMAINS.materi.items.map(it => ({ ...it })));
      setMediaItems(VALIDATION_DOMAINS.media.items.map(it => ({ ...it })));
      setIslamItems(VALIDATION_DOMAINS.islam.items.map(it => ({ ...it })));
      setSusItemsState(SUS_ITEMS.map(it => ({ ...it })));
      setTasksState(TASKS_DATA.map(it => ({ ...it, rubric: { ...it.rubric } })));
    }
  };

  // Filtered lists
  const filteredMateri = useMemo(() => {
    return materiItems.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        item.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [materiItems, statusFilter, searchQuery]);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        item.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [mediaItems, statusFilter, searchQuery]);

  const filteredIslam = useMemo(() => {
    return islamItems.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        item.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [islamItems, statusFilter, searchQuery]);

  const filteredSUS = useMemo(() => {
    return susItemsState.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dimension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [susItemsState, statusFilter, searchQuery]);

  const filteredTasks = useMemo(() => {
    return tasksState.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [tasksState, statusFilter, searchQuery]);

  // Download / Copy Data Helpers
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback to clipboard if file download is blocked
      navigator.clipboard.writeText(content);
    }
  };

  const copyToClipboard = (text: string, typeName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(typeName);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const generateCsvData = () => {
    let csv = 'Kode,Tabel,Kategori/Aspek,Indikator/Dimensi,Butir Pernyataan/Tugas,Status,Skor/V-Index\n';
    
    // Materi
    filteredMateri.forEach(it => {
      const v = computeV(it).toFixed(3);
      csv += `"${it.id}","Tabel 3.2","${it.aspect || 'Materi'}","${it.indicator}","${it.statement.replace(/"/g, '""')}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}","V=${v} (R1:${it.r1},R2:${it.r2},R3:${it.r3})"\n`;
    });

    // Media
    filteredMedia.forEach(it => {
      const v = computeV(it).toFixed(3);
      csv += `"${it.id}","Tabel 3.3","${it.aspect || 'Media'}","${it.indicator}","${it.statement.replace(/"/g, '""')}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}","V=${v} (R1:${it.r1},R2:${it.r2},R3:${it.r3})"\n`;
    });

    // Islam
    filteredIslam.forEach(it => {
      const v = computeV(it).toFixed(3);
      csv += `"${it.id}","Tabel 3.4","${it.aspect || 'Islam'}","${it.indicator}","${it.statement.replace(/"/g, '""')}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}","V=${v} (R1:${it.r1},R2:${it.r2},R3:${it.r3})"\n`;
    });

    // SUS
    filteredSUS.forEach(it => {
      csv += `"SUS-${it.id}","Tabel 3.5","SUS Adaptif","${it.dimension}","${it.text.replace(/"/g, '""')}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}","Skor ${it.score} (${it.isPositive ? 'Positif' : 'Negatif'})"\n`;
    });

    // Rubrik Tasks
    filteredTasks.forEach(it => {
      csv += `"${it.id}","Tabel 3.6","Rubrik Kognitif","${it.indicator}","${it.title}: ${it.question.replace(/"/g, '""')}","${it.status === 'resmi_proposal' ? 'Resmi Proposal' : 'Usulan Revisi'}","Skor 2: ${it.rubric[2].replace(/"/g, '""')} | Skor 1: ${it.rubric[1].replace(/"/g, '""')} | Skor 0: ${it.rubric[0].replace(/"/g, '""')}"\n`;
    });

    return csv;
  };

  const generatePlainTextData = () => {
    let text = '========================================================================\n';
    text += 'DOKUMEN LENGKAP INSTRUMEN & RUBRIK SKRIPSI TADRIS MATEMATIKA STAI AL-BAHJAH\n';
    text += 'Judul: PENGEMBANGAN MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF\n';
    text += 'Peneliti: MUHAMMAD KHOIRUZZADITTAQWA (NIM: 2220020002)\n';
    text += '========================================================================\n\n';

    // Tabel 3.2
    text += '1. TABEL 3.2: LEMBAR VALIDASI AHLI MATERI MATEMATIKA (9 BUTIR RESMI + EKSTENSI)\n';
    text += '------------------------------------------------------------------------\n';
    filteredMateri.forEach((it, idx) => {
      const v = computeV(it).toFixed(3);
      text += `${idx + 1}. [${it.id}] [${it.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI'}]\n`;
      text += `   Indikator: ${it.indicator}\n`;
      text += `   Pernyataan: ${it.statement}\n`;
      text += `   Skor Validator: R1=${it.r1}, R2=${it.r2}, R3=${it.r3} | Aiken's V = ${v} (${Number(v) >= 0.667 ? 'VALID' : 'REVISI'})\n`;
      if (it.statusNote) text += `   Catatan: ${it.statusNote}\n`;
      text += '\n';
    });

    // Tabel 3.3
    text += '\n2. TABEL 3.3: LEMBAR VALIDASI AHLI MEDIA & TEKNOLOGI PENDIDIKAN (10 BUTIR RESMI + EKSTENSI)\n';
    text += '------------------------------------------------------------------------\n';
    filteredMedia.forEach((it, idx) => {
      const v = computeV(it).toFixed(3);
      text += `${idx + 1}. [${it.id}] [${it.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI'}]\n`;
      text += `   Indikator: ${it.indicator}\n`;
      text += `   Pernyataan: ${it.statement}\n`;
      text += `   Skor Validator: R1=${it.r1}, R2=${it.r2}, R3=${it.r3} | Aiken's V = ${v} (${Number(v) >= 0.667 ? 'VALID' : 'REVISI'})\n`;
      if (it.statusNote) text += `   Catatan: ${it.statusNote}\n`;
      text += '\n';
    });

    // Tabel 3.4
    text += '\n3. TABEL 3.4: LEMBAR VALIDASI AHLI INTEGRASI NILAI ISLAM (8 BUTIR RESMI + EKSTENSI)\n';
    text += '------------------------------------------------------------------------\n';
    filteredIslam.forEach((it, idx) => {
      const v = computeV(it).toFixed(3);
      text += `${idx + 1}. [${it.id}] [${it.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI'}]\n`;
      text += `   Indikator: ${it.indicator}\n`;
      text += `   Pernyataan: ${it.statement}\n`;
      text += `   Skor Validator: R1=${it.r1}, R2=${it.r2}, R3=${it.r3} | Aiken's V = ${v} (${Number(v) >= 0.667 ? 'VALID' : 'REVISI'})\n`;
      if (it.statusNote) text += `   Catatan: ${it.statusNote}\n`;
      text += '\n';
    });

    // Tabel 3.5
    text += '\n4. TABEL 3.5: KUESIONER SYSTEM USABILITY SCALE (SUS) ADAPTIF 14 BUTIR\n';
    text += '------------------------------------------------------------------------\n';
    filteredSUS.forEach((it, idx) => {
      text += `${idx + 1}. [No. ${it.id}] [${it.status === 'resmi_proposal' ? 'RESMI PROPOSAL' : 'USULAN REVISI'}] (${it.isPositive ? 'Positif' : 'Negatif'})\n`;
      text += `   Dimensi: ${it.dimension}\n`;
      text += `   Pernyataan: ${it.text}\n`;
      text += `   Skor Siswa: ${it.score} (Skala 1-5)\n`;
      if (it.statusNote) text += `   Catatan: ${it.statusNote}\n`;
      text += '\n';
    });

    // Tabel 3.6
    text += '\n5. TABEL 3.6: RUBRIK PENSKORAN POLITOMI 8 TUGAS LITERASI DATA (T1 - T8)\n';
    text += '------------------------------------------------------------------------\n';
    filteredTasks.forEach((it) => {
      text += `TUGAS ${it.id}: ${it.title} [${it.watsonLevel}] [${it.gaisePhase}]\n`;
      text += `Konteks: ${it.context}\n`;
      text += `Nilai Keislaman: ${it.islamicValue} (${it.islamicPrinciple})\n`;
      text += `Pertanyaan: ${it.question}\n`;
      text += `RUBRIK POLITOMI (Skala 0-2):\n`;
      text += `  - Skor 2 (Penuh): ${it.rubric[2]}\n`;
      text += `  - Skor 1 (Parsial): ${it.rubric[1]}\n`;
      text += `  - Skor 0 (Tidak Ada/Salah): ${it.rubric[0]}\n`;
      text += `Kunci Solusi: ${it.sampleSolution}\n\n`;
    });

    return text;
  };

  const handleDownloadCsv = () => {
    const csv = generateCsvData();
    downloadFile(csv, 'bank-instrumen-skripsi-tabel-3-2-sampai-3-6.csv', 'text/csv;charset=utf-8;');
    copyToClipboard(csv, 'csv');
  };

  const handleDownloadText = () => {
    const text = generatePlainTextData();
    downloadFile(text, 'bank-instrumen-dan-rubrik-skripsi-lengkap.txt', 'text/plain;charset=utf-8;');
    copyToClipboard(text, 'text');
  };

  const handleDownloadJson = () => {
    const dataObj = {
      title: 'Koleksi Instrumen & Rubrik Skripsi STAI Al-Bahjah',
      author: 'Muhammad Khoiruzzadittaqwa',
      nim: '2220020002',
      table32_materi: filteredMateri,
      table33_media: filteredMedia,
      table34_islam: filteredIslam,
      table35_sus: filteredSUS,
      table36_rubricTasks: filteredTasks
    };
    const jsonStr = JSON.stringify(dataObj, null, 2);
    downloadFile(jsonStr, 'instrumen-skripsi-lengkap.json', 'application/json;charset=utf-8;');
    copyToClipboard(jsonStr, 'json');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner & Academic Notice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                  Bank Instrumen & Rubrik Lengkap Terperinci
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transkrip butir demi butir lengkap sesuai Proposal Skripsi Bab III (Tabel 3.2, 3.3, 3.4, 3.5, dan 3.6).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Download / Copy / Export / Print / Reset) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 border border-slate-200 dark:border-slate-700"
              title="Download file .TXT dan salin semua butir instrumen"
            >
              {copiedType === 'text' ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-500" />}
              <span>{copiedType === 'text' ? 'File Diunduh & Tersalin!' : 'Download .TXT'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition active:scale-95 border border-emerald-200 dark:border-emerald-800"
              title="Download file .CSV (Excel/SPSS) dan salin ke clipboard"
            >
              {copiedType === 'csv' ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-emerald-600" />}
              <span>{copiedType === 'csv' ? 'CSV Diunduh & Tersalin!' : 'Download CSV (Excel)'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 border border-slate-200 dark:border-slate-700"
              title="Download file .JSON data"
            >
              {copiedType === 'json' ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-500" />}
              <span>{copiedType === 'json' ? 'JSON Diunduh & Tersalin!' : 'Download JSON'}</span>
            </button>

            <button
              onClick={() => {
                const dom = activeTable === 't33' ? 'media' : activeTable === 't34' ? 'islam' : 'materi';
                setOfficialSheetDomain(dom);
                setIsOfficialSheetOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white transition active:scale-95 shadow-xs"
              title="Buka Format Baku Lembar Validasi Siap Cetak/Serah ke Dosen Pakar"
            >
              <FileCheck className="w-4 h-4" />
              <span>Format Lembar Siap Cetak</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-900 dark:bg-indigo-700 text-white hover:bg-indigo-800 transition active:scale-95 shadow-xs"
              title="Cetak / Print Dokumen Resmi (Format A4 PDF)"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dokumen Resmi</span>
            </button>

            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
              title="Reset ke Nilai Draf Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Table Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTable('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 'all'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Tabel (5 Instrumen)
            </button>
            <button
              onClick={() => setActiveTable('t32')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 't32'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabel 3.2: Materi
            </button>
            <button
              onClick={() => setActiveTable('t33')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 't33'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabel 3.3: Media
            </button>
            <button
              onClick={() => setActiveTable('t34')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 't34'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabel 3.4: Islam
            </button>
            <button
              onClick={() => setActiveTable('t35')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 't35'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabel 3.5: SUS 14
            </button>
            <button
              onClick={() => setActiveTable('t36')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTable === 't36'
                  ? 'bg-indigo-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabel 3.6: Rubrik T1-T8
            </button>
          </div>

          {/* Status & Search Filter */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setStatusFilter('resmi_proposal')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                  statusFilter === 'resmi_proposal'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Resmi Proposal
              </button>
              <button
                onClick={() => setStatusFilter('usulan_revisi')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                  statusFilter === 'usulan_revisi'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Usulan Revisi
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[160px] sm:min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari butir/indikator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Legend / Status Guide Banner */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Panduan Penandaan Butir:</span>
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tertera di Proposal Skripsi (Bab III)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Usulan Revisi / Ekstensi Perlu Ditulis (Highlight Khusus)</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Klik pada teks butir atau skor rater untuk mengedit data secara langsung.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TABEL 3.2 LEMBAR VALIDASI AHLI MATERI MATEMATIKA */}
      {/* ========================================================================= */}
      {(activeTable === 'all' || activeTable === 't32') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-xs">
                  Tabel 3.2
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  Lembar Validasi Ahli Materi Matematika & Pembelajaran
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kesesuaian konten Kurikulum Merdeka Fase D, validitas konstruk literasi data, akurasi ukuran pemusatan, dan rubrik politomi (Skala Likert 1-5).
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Butir: <span className="font-bold text-indigo-900 dark:text-indigo-300">{filteredMateri.length}</span> Butir
            </div>
          </div>

          {/* Table Render */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 w-16 text-center">Kode</th>
                  <th className="p-3 w-40">Aspek & Indikator</th>
                  <th className="p-3">Butir Pernyataan Lengkap</th>
                  <th className="p-3 w-32 text-center">Status Butir</th>
                  <th className="p-3 w-28 text-center">Rater (1-5)<br/><span className="text-[10px] font-normal font-mono">R1 | R2 | R3</span></th>
                  <th className="p-3 w-24 text-center">Aiken&apos;s V<br/><span className="text-[10px] font-normal font-mono">(&ge; 0.667)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                {filteredMateri.map((item) => {
                  const v = computeV(item);
                  const isValid = v >= 0.667;
                  const isRevision = item.status === 'usulan_revisi';
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors ${
                        isRevision 
                          ? 'bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-100/60 dark:hover:bg-amber-950/40' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.aspect}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.indicator}
                        </div>
                      </td>
                      <td className="p-3 space-y-1.5">
                        <textarea
                          rows={2}
                          value={item.statement}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMateriItems(prev => prev.map(it => it.id === item.id ? { ...it, statement: val } : it));
                          }}
                          className="w-full p-2 text-xs rounded-lg bg-transparent hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition resize-y text-slate-800 dark:text-slate-200"
                        />
                        {item.statusNote && (
                          <div className={`text-[10px] italic flex items-center gap-1 ${
                            isRevision ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <Info className="w-3 h-3 shrink-0" />
                            <span>{item.statusNote}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.status === 'resmi_proposal' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resmi Proposal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-amber-400 dark:border-amber-800 shadow-xs">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Usulan Revisi</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(['r1', 'r2', 'r3'] as const).map(raterKey => (
                            <input
                              key={raterKey}
                              type="number"
                              min={1}
                              max={5}
                              value={item[raterKey]}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const clamped = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
                                setMateriItems(prev => prev.map(it => it.id === item.id ? { ...it, [raterKey]: clamped } : it));
                              }}
                              className="w-8 h-7 text-center font-mono font-bold text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className={`font-mono font-bold text-xs ${isValid ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {v.toFixed(3)}
                        </div>
                        <span className={`text-[10px] font-semibold ${isValid ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                          {isValid ? 'Valid (Fit)' : 'Revisi'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TABEL 3.3 LEMBAR VALIDASI AHLI MEDIA & TEKNOLOGI */}
      {/* ========================================================================= */}
      {(activeTable === 'all' || activeTable === 't33') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-xs">
                  Tabel 3.3
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  Lembar Validasi Ahli Media & Teknologi Pendidikan
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tampilan visual dasbor (CLT), navigasi dan struktur menu interaktif, responsivitas antarmuka multiperangkat, serta keandalan sistem web.
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Butir: <span className="font-bold text-indigo-900 dark:text-indigo-300">{filteredMedia.length}</span> Butir
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 w-16 text-center">Kode</th>
                  <th className="p-3 w-40">Aspek & Indikator</th>
                  <th className="p-3">Butir Pernyataan Lengkap</th>
                  <th className="p-3 w-32 text-center">Status Butir</th>
                  <th className="p-3 w-28 text-center">Rater (1-5)<br/><span className="text-[10px] font-normal font-mono">R1 | R2 | R3</span></th>
                  <th className="p-3 w-24 text-center">Aiken&apos;s V<br/><span className="text-[10px] font-normal font-mono">(&ge; 0.667)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                {filteredMedia.map((item) => {
                  const v = computeV(item);
                  const isValid = v >= 0.667;
                  const isRevision = item.status === 'usulan_revisi';
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors ${
                        isRevision 
                          ? 'bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-100/60 dark:hover:bg-amber-950/40' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.aspect}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.indicator}
                        </div>
                      </td>
                      <td className="p-3 space-y-1.5">
                        <textarea
                          rows={2}
                          value={item.statement}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMediaItems(prev => prev.map(it => it.id === item.id ? { ...it, statement: val } : it));
                          }}
                          className="w-full p-2 text-xs rounded-lg bg-transparent hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition resize-y text-slate-800 dark:text-slate-200"
                        />
                        {item.statusNote && (
                          <div className={`text-[10px] italic flex items-center gap-1 ${
                            isRevision ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <Info className="w-3 h-3 shrink-0" />
                            <span>{item.statusNote}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.status === 'resmi_proposal' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resmi Proposal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-amber-400 dark:border-amber-800 shadow-xs">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Usulan Revisi</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(['r1', 'r2', 'r3'] as const).map(raterKey => (
                            <input
                              key={raterKey}
                              type="number"
                              min={1}
                              max={5}
                              value={item[raterKey]}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const clamped = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
                                setMediaItems(prev => prev.map(it => it.id === item.id ? { ...it, [raterKey]: clamped } : it));
                              }}
                              className="w-8 h-7 text-center font-mono font-bold text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className={`font-mono font-bold text-xs ${isValid ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {v.toFixed(3)}
                        </div>
                        <span className={`text-[10px] font-semibold ${isValid ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                          {isValid ? 'Valid (Fit)' : 'Revisi'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: TABEL 3.4 LEMBAR VALIDASI AHLI INTEGRASI NILAI ISLAM */}
      {/* ========================================================================= */}
      {(activeTable === 'all' || activeTable === 't34') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-xs">
                  Tabel 3.4
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  Lembar Validasi Ahli Integrasi Nilai-Nilai Islam
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kesesuaian prinsip syariat, keabsahan dalil Al-Qur&apos;an/Hadits, autentisitas rujukan, dan pembentukan karakter Tabayyun serta Amanah data.
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Butir: <span className="font-bold text-indigo-900 dark:text-indigo-300">{filteredIslam.length}</span> Butir
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 w-16 text-center">Kode</th>
                  <th className="p-3 w-40">Aspek & Indikator</th>
                  <th className="p-3">Butir Pernyataan Lengkap</th>
                  <th className="p-3 w-32 text-center">Status Butir</th>
                  <th className="p-3 w-28 text-center">Rater (1-5)<br/><span className="text-[10px] font-normal font-mono">R1 | R2 | R3</span></th>
                  <th className="p-3 w-24 text-center">Aiken&apos;s V<br/><span className="text-[10px] font-normal font-mono">(&ge; 0.667)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                {filteredIslam.map((item) => {
                  const v = computeV(item);
                  const isValid = v >= 0.667;
                  const isRevision = item.status === 'usulan_revisi';
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors ${
                        isRevision 
                          ? 'bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-100/60 dark:hover:bg-amber-950/40' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.aspect}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.indicator}
                        </div>
                      </td>
                      <td className="p-3 space-y-1.5">
                        <textarea
                          rows={2}
                          value={item.statement}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIslamItems(prev => prev.map(it => it.id === item.id ? { ...it, statement: val } : it));
                          }}
                          className="w-full p-2 text-xs rounded-lg bg-transparent hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition resize-y text-slate-800 dark:text-slate-200"
                        />
                        {item.statusNote && (
                          <div className={`text-[10px] italic flex items-center gap-1 ${
                            isRevision ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <Info className="w-3 h-3 shrink-0" />
                            <span>{item.statusNote}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.status === 'resmi_proposal' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resmi Proposal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-amber-400 dark:border-amber-800 shadow-xs">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Usulan Revisi</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(['r1', 'r2', 'r3'] as const).map(raterKey => (
                            <input
                              key={raterKey}
                              type="number"
                              min={1}
                              max={5}
                              value={item[raterKey]}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const clamped = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
                                setIslamItems(prev => prev.map(it => it.id === item.id ? { ...it, [raterKey]: clamped } : it));
                              }}
                              className="w-8 h-7 text-center font-mono font-bold text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className={`font-mono font-bold text-xs ${isValid ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {v.toFixed(3)}
                        </div>
                        <span className={`text-[10px] font-semibold ${isValid ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                          {isValid ? 'Valid (Fit)' : 'Revisi'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: TABEL 3.5 KUESIONER SUS ADAPTIF 14 BUTIR */}
      {/* ========================================================================= */}
      {(activeTable === 'all' || activeTable === 't35') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-xs">
                  Tabel 3.5
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  Kuesioner System Usability Scale (SUS) Adaptif (14 Butir Siswa)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                10 butir standar Brooke (pola berselang positif/negatif) + 4 butir adaptif integrasi keislaman & responsivitas dasbor (Skala Likert 1-5).
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Butir: <span className="font-bold text-indigo-900 dark:text-indigo-300">{filteredSUS.length}</span> Butir
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 w-16 text-center">No.</th>
                  <th className="p-3 w-48">Dimensi Usabilitas</th>
                  <th className="p-3">Butir Pernyataan Kuesioner Siswa</th>
                  <th className="p-3 w-28 text-center">Polaritas</th>
                  <th className="p-3 w-32 text-center">Status Butir</th>
                  <th className="p-3 w-24 text-center">Skor Respon<br/><span className="text-[10px] font-normal font-mono">(Skala 1-5)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                {filteredSUS.map((item) => {
                  const isRevision = item.status === 'usulan_revisi';
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors ${
                        isRevision 
                          ? 'bg-amber-50/70 dark:bg-amber-950/25 hover:bg-amber-100/60 dark:hover:bg-amber-950/40' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.dimension}
                      </td>
                      <td className="p-3 space-y-1.5">
                        <textarea
                          rows={2}
                          value={item.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSusItemsState(prev => prev.map(it => it.id === item.id ? { ...it, text: val } : it));
                          }}
                          className="w-full p-2 text-xs rounded-lg bg-transparent hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition resize-y text-slate-800 dark:text-slate-200"
                        />
                        {item.statusNote && (
                          <div className={`text-[10px] italic flex items-center gap-1 ${
                            isRevision ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <Info className="w-3 h-3 shrink-0" />
                            <span>{item.statusNote}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.isPositive 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {item.isPositive ? 'Positif (+)' : 'Negatif (-)'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {item.status === 'resmi_proposal' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resmi Proposal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] border border-amber-400 dark:border-amber-800 shadow-xs">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Usulan Revisi</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={item.score}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            const clamped = Math.max(1, Math.min(5, isNaN(val) ? 1 : val));
                            setSusItemsState(prev => prev.map(it => it.id === item.id ? { ...it, score: clamped } : it));
                          }}
                          className="w-10 h-8 text-center font-mono font-bold text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-indigo-950 dark:text-indigo-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-xs mx-auto"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: TABEL 3.6 RUBRIK PENSKORAN POLITOMI 8 TUGAS (T1 - T8) */}
      {/* ========================================================================= */}
      {(activeTable === 'all' || activeTable === 't36') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono font-bold text-xs">
                  Tabel 3.6
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  Rubrik Penskoran Politomi 8 Tugas Literasi Data Tersemat (T1 - T8)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kriteria penskoran bertingkat (Skor 0: Belum Mampu, Skor 1: Sebagian/Parsial, Skor 2: Penuh/Komprehensif) berdasarkan Hierarki Watson-Callingham.
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Tugas: <span className="font-bold text-indigo-900 dark:text-indigo-300">{filteredTasks.length}</span> Tugas Tersemat
            </div>
          </div>

          {/* Cards for each Task Rubric */}
          <div className="space-y-4">
            {filteredTasks.map((t) => (
              <div 
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-900 dark:bg-indigo-700 text-white font-mono font-bold text-xs">
                        {t.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {t.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-300 dark:border-emerald-800">
                        Resmi Proposal (Tabel 3.6)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                      <span><strong>Tingkat Kognitif:</strong> {t.watsonLevel}</span>
                      <span>&bull;</span>
                      <span><strong>Fase GAISE II:</strong> {t.gaisePhase}</span>
                      <span>&bull;</span>
                      <span className="text-indigo-900 dark:text-indigo-300 font-medium"><strong>Nilai Keislaman:</strong> {t.islamicValue}</span>
                    </div>
                  </div>
                </div>

                {/* Question & Context */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Pertanyaan Tugas:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{t.question}</p>
                  </div>
                </div>

                {/* Rubric Grid (Skor 2, Skor 1, Skor 0) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Skor 2 */}
                  <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-900 dark:text-emerald-300">
                        Skor 2 (Kemampuan Penuh)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                        Maksimal
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={t.rubric[2]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTasksState(prev => prev.map(it => it.id === t.id ? { ...it, rubric: { ...it.rubric, 2: val } } : it));
                      }}
                      className="w-full p-2 text-xs rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Skor 1 */}
                  <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-amber-900 dark:text-amber-300">
                        Skor 1 (Kemampuan Sebagian)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                        Parsial
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={t.rubric[1]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTasksState(prev => prev.map(it => it.id === t.id ? { ...it, rubric: { ...it.rubric, 1: val } } : it));
                      }}
                      className="w-full p-2 text-xs rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Skor 0 */}
                  <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-rose-900 dark:text-rose-300">
                        Skor 0 (Belum Mampu)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
                        Nol
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={t.rubric[0]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTasksState(prev => prev.map(it => it.id === t.id ? { ...it, rubric: { ...it.rubric, 0: val } } : it));
                      }}
                      className="w-full p-2 text-xs rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-300 dark:border-rose-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Sample Solution Discussion */}
                <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-900 dark:text-indigo-300">Kunci Jawaban & Pembahasan Model: </span>
                    <span className="text-slate-700 dark:text-slate-300">{t.sampleSolution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Validation Sheet Modal for Raters */}
      <PrintableValidationSheetModal
        isOpen={isOfficialSheetOpen}
        onClose={() => setIsOfficialSheetOpen(false)}
        domain={officialSheetDomain}
        items={
          officialSheetDomain === 'materi'
            ? materiItems
            : officialSheetDomain === 'media'
            ? mediaItems
            : islamItems
        }
      />
    </div>
  );
}
