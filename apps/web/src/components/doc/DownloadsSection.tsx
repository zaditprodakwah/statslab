import React from 'react';
import { FileText, Download, CheckCircle2, Award, ShieldCheck, BookOpen } from 'lucide-react';

interface DownloadItem {
  title: string;
  filename: string;
  path: string;
  size: string;
  type: string;
  category: 'Naskah Utama' | 'Publikasi' | 'Instrumen & Validasi';
  description: string;
  verifiedNotes: string;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    title: 'Naskah Lengkap Proposal Skripsi (Revisi Standar Ilmiah)',
    filename: 'Proposal_Skripsi_Master_StatsLab.docx',
    path: '/downloads/Proposal_Skripsi_Master_StatsLab.docx',
    size: '888 KB',
    type: 'DOCX (Microsoft Word)',
    category: 'Naskah Utama',
    description: '357 paragraf narasi akademik murni (tanpa jargon koding), 14 tabel standar APA 7th, 40 heading terstruktur (Navigasi Word aktif), mencakup Bab I-III dan metodologi 3-tahap Borg & Gall.',
    verifiedNotes: 'Bebas residu n=125 subjek & terintegrasi 8 telaah Kaprodi (K-01..K-08).'
  },
  {
    title: 'Manuskrip Artikel Jurnal SINTA 4 (Full Version)',
    filename: 'Artikel_Jurnal_SINTA4_StatsLab.docx',
    path: '/downloads/Artikel_Jurnal_SINTA4_StatsLab.docx',
    size: '246 KB',
    type: 'DOCX (Microsoft Word)',
    category: 'Publikasi',
    description: 'Format 2 kolom Times New Roman 10pt sesuai pedoman Author Guidelines Jurnal Cendekia (SINTA 3/4). Rumus murni OMML <m:oMath> tanpa gambar MathType.',
    verifiedNotes: '3 Penulis: Muhammad Khoiruzzadittaqwa, Dosen Pembimbing 1, Dosen Pembimbing 2.'
  },
  {
    title: 'Manuskrip Artikel Blind Review (Anonymized OJS)',
    filename: 'Blind_Review_Manuscript.docx',
    path: '/downloads/Blind_Review_Manuscript.docx',
    size: '246 KB',
    type: 'DOCX (Microsoft Word)',
    category: 'Publikasi',
    description: 'Naskah teranonimkan untuk kepatuhan etika telaah sejawat ganda (Double-Blind Peer Review OJS). Identitas penulis dan instansi disamarkan secara sistematis.',
    verifiedNotes: 'Siap unggah ke portal OJS Jurnal Cendekia: Jurnal Pendidikan Matematika.'
  },
  {
    title: 'Bundel Lengkap Lampiran Instrumen Penelitian',
    filename: 'Paket_Instrumen_Lengkap.docx',
    path: '/downloads/Paket_Instrumen_Lengkap.docx',
    size: '51 KB',
    type: 'DOCX (Microsoft Word)',
    category: 'Instrumen & Validasi',
    description: 'Kompilasi master seluruh instrumen: 30 butir validasi ahli (MTR-10, MED-11, ISL-9), 15 butir SUS guru mitra, dan pedoman penskoran politomi PCM T1-T8.',
    verifiedNotes: 'Dilengkapi lembar pengesahan, kisi-kisi, dan rubrik berjenjang 0, 1, 2.'
  },
  {
    title: 'Lembar Distribusi: Ahli Materi Pembelajaran (MTR)',
    filename: '01_Lembar_Validasi_Ahli_Materi.docx',
    path: '/downloads/01_Lembar_Validasi_Ahli_Materi.docx',
    size: '38 KB',
    type: 'DOCX (Distribusi Rater 1-3)',
    category: 'Instrumen & Validasi',
    description: '10 butir penilaian kurikulum statistik SMP/MTs, akurasi representasi numerik, dan integrasi nilai keislaman untuk Rater 1, 2, 3.',
    verifiedNotes: 'Target V >= 0.78 (Tabel V Aiken r=9, c=5).'
  },
  {
    title: 'Lembar Distribusi: Ahli Media & Grafika (MED)',
    filename: '02_Lembar_Validasi_Ahli_Media.docx',
    path: '/downloads/02_Lembar_Validasi_Ahli_Media.docx',
    size: '39 KB',
    type: 'DOCX (Distribusi Rater 4-6)',
    category: 'Instrumen & Validasi',
    description: '11 butir penilaian visualisasi interaktif, respon slider ambang batas, konsistensi warna, dan aksesibilitas untuk Rater 4, 5, 6.',
    verifiedNotes: 'Target V >= 0.78 (Tabel V Aiken r=9, c=5).'
  },
  {
    title: 'Lembar Distribusi: Ahli Integrasi Keislaman (ISL)',
    filename: '03_Lembar_Validasi_Ahli_Integrasi_Islam.docx',
    path: '/downloads/03_Lembar_Validasi_Ahli_Integrasi_Islam.docx',
    size: '38 KB',
    type: 'DOCX (Distribusi Rater 7-9)',
    category: 'Instrumen & Validasi',
    description: '9 butir penilaian ketepatan dalil Al-Qur\'an, fiqih zakat/wakaf, adab pencatatan data (Tabayyun, Amanah, Tawazun) untuk Rater 7, 8, 9.',
    verifiedNotes: 'Target V >= 0.78 (Tabel V Aiken r=9, c=5).'
  },
  {
    title: 'Kuesioner Kepraktisan: SUS Adaptif Guru Mitra',
    filename: '04_Kuesioner_Kepraktisan_SUS_Guru_Mitra.docx',
    path: '/downloads/04_Kuesioner_Kepraktisan_SUS_Guru_Mitra.docx',
    size: '39 KB',
    type: 'DOCX (Guru Mitra Lapangan)',
    category: 'Instrumen & Validasi',
    description: '15 butir skala Likert 1-5 adaptif untuk mengukur efisiensi, kemudahan belajar, dan kepuasan guru matematika dalam implementasi kelas.',
    verifiedNotes: 'Target Skor SUS > 70 (Bangor et al., Kategori "Acceptable / Good").'
  },
  {
    title: 'Pedoman Penskoran: Tugas Literasi Data Politomi PCM',
    filename: '05_Pedoman_Penskoran_Tugas_Politomi_PCM.docx',
    path: '/downloads/05_Pedoman_Penskoran_Tugas_Politomi_PCM.docx',
    size: '42 KB',
    type: 'DOCX (Pedoman Korektor)',
    category: 'Instrumen & Validasi',
    description: 'Rubrik penskoran berjenjang politomi 0, 1, 2 untuk 8 tugas literasi data Watson-Callingham (T1-T8) berlandaskan model Rasch PCM.',
    verifiedNotes: '0: Miskonsepsi; 1: Parsial; 2: Akurat & Terintegrasi Nilai Islam.'
  }
];

export default function DownloadsSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Award className="text-amber-400" size={28} />
          <h2 className="text-2xl font-serif font-bold tracking-wide">
            Pusat Repositori Berkas Riset Skripsi & Publikasi
          </h2>
        </div>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          Unduh dokumen akademik resmi berstandar Word (.docx) yang telah diverifikasi mutakhir 
          bebas dari residu pengujian fiktif, terbebas dari jargon koding pada narasi, dan memenuhi 
          standar pengajuan sidang proposal serta publikasi jurnal terakreditasi SINTA.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-emerald-200">
          <span className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <ShieldCheck size={14} className="text-emerald-300" /> APA 7th Edition Formatting
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 size={14} className="text-emerald-300" /> SINTA 3/4 Target Ready
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <BookOpen size={14} className="text-emerald-300" /> 9 Expert Raters Distribution Pack
          </span>
        </div>
      </div>

      {/* Grid of Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOWNLOAD_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  item.category === 'Naskah Utama' 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : item.category === 'Publikasi'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.size}
                </span>
              </div>

              <h3 className="font-serif font-bold text-slate-800 dark:text-slate-100 text-base leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800 mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-500" /> Verifikasi Akademik
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                  {item.verifiedNotes}
                </div>
              </div>
            </div>

            <a
              href={item.path}
              download={item.filename}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Download size={14} /> Unduh Berkas ({item.type.split(' ')[0]})
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
