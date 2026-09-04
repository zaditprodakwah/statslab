'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Clock, 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  Grid,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  bullets: {
    title: string;
    desc: string;
  }[];
  stat?: {
    value: string;
    label: string;
    sublabel: string;
  };
  speakerNote: string;
}

const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    badge: "Sidang Proposal Skripsi",
    title: "Pengembangan Media Pembelajaran Dasbor Statistika Interaktif Terintegrasi Nilai Keislaman",
    subtitle: "Untuk Memfasilitasi Literasi Data Siswa Madrasah Tsanawiyah / Sekolah Menengah Pertama",
    bullets: [
      { title: "Peneliti", desc: "Muhammad Khoiruzzadittaqwa (NIM: 2220020002)" },
      { title: "Program Studi", desc: "Tadris Matematika — Institut Al-Bahjah Cirebon" },
      { title: "Fokus Riset", desc: "R&D 3-Tahap Borg & Gall (Define, Design, Develop) Isomorfik Model 4D" }
    ],
    stat: { value: "3 Pilar", label: "Nilai Keislaman", sublabel: "Amanah, Tabayyun, Tawazun" },
    speakerNote: "Assalamu'alaikum wr. wb. Terima kasih kepada Bapak/Ibu Dosen Penguji dan Pembimbing. Hari ini saya memaparkan usulan penelitian skripsi berjudul 'Pengembangan Media Pembelajaran Dasbor Statistika Interaktif Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa'."
  },
  {
    id: 2,
    badge: "Latar Belakang Masalah",
    title: "Urgensi Literasi Data & Tantangan di Madrasah/SMP",
    subtitle: "Kesenjangan Antara Kebutuhan Era AI dan Realitas Pembelajaran Statistika di Kelas",
    bullets: [
      { title: "Rendahnya Literasi Data Siswa", desc: "Rapor Pendidikan & asesmen menunjukkan siswa kesulitan menafsirkan grafik acak dan mengevaluasi klaim statistik secara kritis." },
      { title: "Statistika Disajikan Mekanistik", desc: "Pembelajaran masih berfokus pada kalkulasi manual rumus mean, median, modus tanpa pemaknaan representasi visual kontekstual." },
      { title: "Ketiadaan Integrasi Nilai Islam", desc: "Belum ada media statistika interaktif yang memadukan etika integritas data (Amanah, Tabayyun, Tawazun) dalam sosio-matematika Islam." }
    ],
    stat: { value: "Level 1-2", label: "Watson-Callingham", sublabel: "Mayoritas siswa masih Idiosyncratic / Informal" },
    speakerNote: "Latar belakang didasari data riil: pembelajaran statistika di sekolah masih terjebak pada hafalan rumus mekanistik. Padahal di era ledakan informasi, siswa butuh literasi data kritis berlandaskan etika tabayyun (verifikasi informasi)."
  },
  {
    id: 3,
    badge: "Kebaruan & Orisinalitas",
    title: "Novelty Riset: 3 Pilar Nilai Keislaman dalam Statistika",
    subtitle: "Bukan Sekadar Tempelan Dalil, Melainkan Terintegrasi Didaktis dalam Fitur Media",
    bullets: [
      { title: "Pilar Amanah (Integritas Skala & Data)", desc: "Siswa diajak mengaudit sumbu visual: tidak memotong skala nol (zero baseline) agar tidak memanipulasi persepsi pembaca (QS. Al-Muthaffifin: 1-3)." },
      { title: "Pilar Tabayyun (Verifikasi Titik Ekstrem/Outlier)", desc: "Slider dinamis untuk menyaring pencilan data sebelum membuat generalisasi kesimpulan (QS. Al-Hujurat: 6)." },
      { title: "Pilar Tawazun (Keseimbangan Distribusi & Didactic Boxplot)", desc: "Visualisasi kuartil, IQR, dan simetri distribusi untuk menilai keadilan alokasi sumber daya (QS. Al-Hadid: 25)." }
    ],
    stat: { value: "4 Dataset", label: "Sosio-Matematika Islam", sublabel: "Zakat, Wakaf, Tajwid, Perpustakaan" },
    speakerNote: "Poin kebaruan utama skripsi ini adalah integrasi nilai keislaman yang bersifat fungsional-didaktis, bukan artifisial. Amanah diwujudkan dalam etika sumbu grafik, Tabayyun dalam audit outlier, dan Tawazun dalam analisis simetri boxplot."
  },
  {
    id: 4,
    badge: "Rumusan Masalah & Tujuan",
    title: "Rumusan Masalah & Tujuan Penelitian",
    subtitle: "Fokus Pengembangan Produk, Kevalidan Ahli, dan Kepraktisan Pembelajaran",
    bullets: [
      { title: "Bagaimana Karakteristik & Rancang Bangun Media?", desc: "Menghasilkan dasbor interaktif berbasis web yang memadukan visualisasi data dinamis dan refleksi etika Islam." },
      { title: "Bagaimana Kevalidan Media menurut Para Ahli?", desc: "Menguji validitas isi menggunakan formula Aiken's V terhadap aspek materi, media, dan integrasi keislaman (target V >= 0.78)." },
      { title: "Bagaimana Kepraktisan Media di Lapangan?", desc: "Mengukur kemudahan penggunaan melalui System Usability Scale (SUS) adaptif bersama guru matematika mitra (target SUS > 70)." }
    ],
    stat: { value: "3 Tujuan", label: "Fokus Utama", sublabel: "Karakteristik, Validitas, Kepraktisan" },
    speakerNote: "Rumusan masalah difokuskan pada tiga ranah terukur: spesifikasi rancang bangun media, validitas isi oleh 9 validator ahli (Aiken's V >= 0.78), dan kepraktisan oleh guru mitra lapangan (SUS > 70)."
  },
  {
    id: 5,
    badge: "Metodologi Riset",
    title: "Desain Penelitian: Borg & Gall Disederhanakan 3 Tahap",
    subtitle: "Penyelarasan Metodologis Isomorfik Model 4D Thiagarajan (1974) untuk Skripsi Sarjana",
    bullets: [
      { title: "Tahap 1: Penelitian & Pengumpulan Informasi (Define)", desc: "Analisis kurikulum Merdeka SMP/MTs (Fase D), telaah literasi data Watson-Callingham, dan wawancara kebutuhan guru mitra." },
      { title: "Tahap 2: Perencanaan & Pengembangan Produk Awal (Design)", desc: "Perancangan UI/UX bertema Sleek Islamic Academic, penyusunan 4 konteks dataset Islam, dan formulasi 8 tugas literasi data T1-T8." },
      { title: "Tahap 3: Validasi Ahli & Uji Kepraktisan Terbatas (Develop)", desc: "Validasi 9 ahli (3 Materi, 3 Media, 3 Integrasi Islam) dan uji kepraktisan guru mitra. Tahap implementasi massal (Disseminate) direkomendasikan pada tesis/riset lanjutan." }
    ],
    stat: { value: "3 Tahap", label: "Borg & Gall Resmi", sublabel: "Define → Design → Develop" },
    speakerNote: "Menjawab masukan Kaprodi: penelitian dibatasi secara ketat pada 3 tahap Borg & Gall yang selaras dengan tahap Define, Design, dan Develop model 4D. Ini memastikan kelayakan skripsi S1 tanpa klaim pengujian siswa fiktif."
  },
  {
    id: 6,
    badge: "Kerangka Teori: Literasi Data",
    title: "Kerangka Kerja Watson & Callingham (2003)",
    subtitle: "Hierarki 6 Tingkatan Literasi Statistik yang Menjadi Landasan Butir Tugas",
    bullets: [
      { title: "Level 1-2: Idiosyncratic & Informal", desc: "Mengenali representasi data dasar dan fitur visual permukaan tanpa interpretasi matematis mendalam." },
      { title: "Level 3-4: Inconsistent & Consistent Non-Critical", desc: "Membaca data tersurat (Reading Data) dan menghubungkan antar-data (Reading Between Data)." },
      { title: "Level 5-6: Critical & Critical-Mathematical", desc: "Membaca di luar data (Reading Beyond Data), mengaudit asumsi, mendeteksi bias, dan membuat kesimpulan etis berbasis data." }
    ],
    stat: { value: "6 Level", label: "Watson-Callingham", sublabel: "T1 (L3/4) hingga T8 (L6)" },
    speakerNote: "Hierarki Watson-Callingham adalah instrumen standar emas global untuk mengukur literasi data. Dalam media ini, 8 tugas tersemat (T1-T8) memetakan level 3 hingga level 6."
  },
  {
    id: 7,
    badge: "Arsitektur Media",
    title: "Rancang Bangun 4 Modul Dataset Kontekstual Islam",
    subtitle: "Simulasi Riil Fenomena Keumatan dengan Representasi Grafis Komprehensif",
    bullets: [
      { title: "Modul 1: Distribusi Zakat & Infak", desc: "Diagram Batang Interaktif penerimaan zakat 5 kecamatan, audit selisih ekstrem, dan refleksi amanah pencatatan hak mustahik." },
      { title: "Modul 2: Pemanfaatan Wakaf Produktif", desc: "Diagram Donat & Proporsi luasan tanah wakaf produktif vs fasilitas ibadah, memfasilitasi penalaran membaca antar-data." },
      { title: "Modul 3: Frekuensi Hukum Tajwid Juz 30", desc: "Diagram Garis distribusi hukum Ikhfa, Idgham, Izhar, Iqlab pada surat pendek, melatih deteksi pola dan ketelitian tabayyun." },
      { title: "Modul 4: Sirkulasi Perpustakaan Madrasah", desc: "Didactic Boxplot & Scatter plot peminjaman kitab kuning vs buku sains, melatih analisis simetri, IQR, dan tawazun." }
    ],
    stat: { value: "4 Modul", label: "Dataset Tematik", sublabel: "Zakat, Wakaf, Tajwid, Perpustakaan" },
    speakerNote: "Empat dataset dirancang mewakili variasi grafik standar Fase D: Bar Chart, Donut/Pie Chart, Line Chart, dan Boxplot. Semua mengusung nilai keislaman autentik."
  },
  {
    id: 8,
    badge: "Tugas Tersemat & Evaluasi",
    title: "8 Tugas Literasi Data Watson-Callingham (T1–T8)",
    subtitle: "Terintegrasi Langsung dalam Alur Belajar dengan Rubrik Politomi 0-1-2",
    bullets: [
      { title: "T1 (Level 3/4 - Amanah)", desc: "Membaca data tersurat dan menghitung selisih ekstrem penerimaan zakat fitrah." },
      { title: "T2 (Level 4 - Amanah & Maslahah)", desc: "Membandingkan proporsi wakaf produktif vs non-produktif dan menyimpulkan kemaslahatan." },
      { title: "T3 (Level 4/5 - Tabayyun)", desc: "Mendeteksi anomali data tajwid dan verifikasi sumber sebelum menyimpulkan." },
      { title: "T4 (Level 4/5 - Tawazun)", desc: "Menganalisis simetri sirkulasi perpustakaan menggunakan didactic boxplot." },
      { title: "T5-T8 (Level 5 & 6 - Evaluasi Kritis)", desc: "Audit manipulasi sumbu nol grafik, inferensi tren wakaf, dan pengambilan keputusan alokasi zakat berbasis bukti." }
    ],
    stat: { value: "8 Tugas", label: "T1 s.d. T8", sublabel: "Rubrik Politomi Model Rasch PCM" },
    speakerNote: "Setiap tugas dirancang dengan rubrik berjenjang: skor 0 untuk miskonsepsi, skor 1 untuk perhitungan benar tanpa satuan/alasan, dan skor 2 untuk respon akurat dan beretika ilmiah."
  },
  {
    id: 9,
    badge: "Model Psikometri",
    title: "Fondasi Pengukuran: Model Rasch Partial Credit (PCM)",
    subtitle: "Menilai Kompetensi Siswa Berdasarkan Bobot Kesulitan Langkah Kognitif",
    bullets: [
      { title: "Keunggulan Pemodelan Politomi PCM", desc: "Menghargai proses kognitif parsial siswa (skor 1) dibanding dikotomi kaku (0 atau 1) Masters (1982)." },
      { title: "Estimasi Theta (Kemampuan Siswa)", desc: "Memisahkan parameter kemampuan individu dengan tingkat kesulitan butir secara invarian." },
      { title: "Kesiapan Instrumen Evaluasi Lanjutan", desc: "Rubrik T1-T8 telah diverifikasi kisi-kisi dan batasan ambang langkah kognitifnya sehingga siap digunakan pada uji empiris lapangan." }
    ],
    stat: { value: "Politomi", label: "Model Rasch PCM", sublabel: "Skor 0, 1, dan 2" },
    speakerNote: "Model Rasch PCM digunakan karena data penalaran siswa bersifat bertingkat. Ini membuktikan bahwa instrumen dirancang dengan ketelitian psikometri yang kuat."
  },
  {
    id: 10,
    badge: "Uji Kevalidan Produk",
    title: "Prosedur Validasi Ahli & Formula Indeks Aiken's V",
    subtitle: "Melibatkan 9 Validator Ahli (Rater) dengan Skala Penilaian 5 Kategori",
    bullets: [
      { title: "Komposisi 9 Ahli (Rater)", desc: "3 Dosen Ahli Materi Matematika, 3 Dosen Ahli Media & Teknologi Pembelajaran, dan 3 Ahli Integrasi Keislaman." },
      { title: "Formula Aiken's V", desc: "V = Sigma(s) / [n * (c - 1)], dengan n = 9 rater dan c = 5 kategori skala Likert." },
      { title: "Batas Kritis Kevalidan", desc: "Merujuk Tabel Aiken (1985) untuk 9 rater pada taraf signifikansi p = 0.05, butir valid jika V >= 0.78." }
    ],
    stat: { value: "V >= 0.78", label: "Standar Kevalidan", sublabel: "Tabel Aiken (1985) n=9, c=5, p=0.05" },
    speakerNote: "Untuk menguji validitas isi, kita menggunakan 9 validator ahli independen. Ambang batas keberhasilan ditetapkan secara ketat mengikuti tabel distribusi Aiken yaitu V >= 0.78."
  },
  {
    id: 11,
    badge: "Uji Kepraktisan Media",
    title: "Prosedur Uji Kepraktisan: SUS Adaptif Guru Mitra",
    subtitle: "Mengukur Efisiensi & Kemudahan Implementasi Pembelajaran di Kelas Nyata",
    bullets: [
      { title: "Subjek Uji Kepraktisan", desc: "Guru Matematika Mitra di MTs/SMP yang mengampu pembelajaran statistika kelas VIII." },
      { title: "Instrumen SUS Adaptif 15 Butir", desc: "Dimensi kemudahan penggunaan, konsistensi antarmuka, kejelasan narasi Islam, dan efisiensi waktu belajar." },
      { title: "Kriteria Keberhasilan Bangor et al. (2008)", desc: "Media dinyatakan praktis jika skor SUS konversi berada di atas 70 (kategori Acceptable / Good)." }
    ],
    stat: { value: "SUS > 70", label: "Target Kepraktisan", sublabel: "Kategori Acceptable / Good" },
    speakerNote: "Uji kepraktisan dinilai langsung oleh guru mitra yang mengajar siswa. Kriteria skor SUS > 70 menjamin media tidak membebani guru saat diterapkan di kelas."
  },
  {
    id: 12,
    badge: "Fitur Unggulan Media",
    title: "Fitur Interaktif Dasbor StatsLab",
    subtitle: "Teknologi Web Modern Dirancang Khusus untuk Aksesibilitas Pembelajaran Madrasah",
    bullets: [
      { title: "Dynamic Slider Ambang Batas (Tabayyun)", desc: "Siswa dapat menggeser batas ekstrem data secara langsung dan mengamati perubahan visual grafik." },
      { title: "Didactic Boxplot & Outlier Inspector", desc: "Visualisasi kuartil bawah, median, dan kuartil atas disertai deteksi pencilan interaktif." },
      { title: "Mode Proyektor Kontras Tinggi", desc: "Pengoptimalan tampilan untuk layar proyektor kelas madrasah agar grafik tetap tajam dan jelas dibaca dari baris belakang." },
      { title: "Voice / Audio Reflection & Multi-Ukuran Font", desc: "Aksesibilitas inklusif untuk beragam gaya belajar siswa." }
    ],
    stat: { value: "Next.js 15", label: "Teknologi Media", sublabel: "Recharts, TypeScript, Vercel Edge" },
    speakerNote: "Fitur media dibangun dengan teknologi modern: interaktivitas grafik responsif, mode proyektor untuk fasilitas madrasah, dan aksesibilitas ramah pengguna."
  },
  {
    id: 13,
    badge: "Respons Telaah Dosen",
    title: "Tindak Lanjut & Matriks Perbaikan Masukan Kaprodi",
    subtitle: "Penyempurnaan Menyeluruh Naskah Proposal Berdasarkan Telaah K-01 s.d. K-08",
    bullets: [
      { title: "K-01 s.d. K-03: Metodologi & Subjek Riset", desc: "Menegaskan R&D 3 tahap Borg & Gall (tanpa diklaim uji 125 siswa) dan fokus sasaran MTs/SMP kelas VIII." },
      { title: "K-04 s.d. K-06: Validasi & Standar Psikometri", desc: "Menetapkan r=9 rater (Aiken V >= 0.78), kuesioner SUS guru mitra (>70), dan rubrik politomi PCM T1-T8." },
      { title: "K-07 s.d. K-08: Rujukan Teoretis & Bahasa Akademik", desc: "Memasukkan Tesis Aini (Ulfah, 2020), pedoman tugas akhir Al-Bahjah, serta membersihkan jargon koding dari naskah proposal." }
    ],
    stat: { value: "8 Poin", label: "Telaah Kaprodi", sublabel: "100% Ditindaklanjuti dan Selesai" },
    speakerNote: "Seluruh 8 catatan telaah kritis Kaprodi telah kami integrasikan secara tuntas ke dalam dokumen proposal revisi master dan paket instrumen."
  },
  {
    id: 14,
    badge: "Timeline & Rencana Kerja",
    title: "Jadwal & Tahapan Eksekusi Penelitian",
    subtitle: "Rencana Aksi Pasca Sidang Proposal Menuju Penyusunan Skripsi Lengkap",
    bullets: [
      { title: "Bulan 1: Penyempurnaan Produk & Distribusi Instrumen", desc: "Finalisasi build media dan pengiriman lembar validasi ke 9 validator ahli." },
      { title: "Bulan 2: Pengolahan Indeks Aiken's V & Revisi Produk", desc: "Kalkulasi V per butir, tabulasi catatan kualitatif rater, dan perbaikan media tahap 1." },
      { title: "Bulan 3: Uji Kepraktisan Guru Mitra & Analisis SUS", desc: "Simulasi penggunaan kelas bersama guru mitra, pengisian kuesioner SUS, dan kalkulasi skor." },
      { title: "Bulan 4: Penyusunan Laporan Skripsi & Naskah Publikasi", desc: "Penulisan Bab IV-V skripsi dan submit manuskrip ke jurnal terakreditasi SINTA." }
    ],
    stat: { value: "4 Bulan", label: "Durasi Target", sublabel: "Validasi hingga Naskah Skripsi Jadi" },
    speakerNote: "Jadwal penelitian terencana rapi selama 4 bulan: dari pengumpulan penilaian 9 rater, revisi media, uji praktisi guru mitra, hingga submit naskah publikasi."
  },
  {
    id: 15,
    badge: "Publikasi Ilmiah",
    title: "Kesiapan Publikasi Artikel Jurnal Terakreditasi",
    subtitle: "Target Publikasi pada Jurnal Pendidikan Matematika SINTA 3 / SINTA 4",
    bullets: [
      { title: "Manuskrip Lengkap Telah Disusun", desc: "Format 2 kolom Times New Roman 10pt dengan rumus OMML murni, bebas cacat XML." },
      { title: "Kelengkapan Berkas Submit OJS", desc: "Telah disiapkan Cover Letter bilingual, Surat Pernyataan Orisinalitas, dan Naskah Blind Review." },
      { title: "Kepengarangan (3 Penulis)", desc: "1: Muhammad Khoiruzzadittaqwa, 2: Dosen Pembimbing 1, 3: Dosen Pembimbing 2." }
    ],
    stat: { value: "SINTA 3/4", label: "Target Jurnal", sublabel: "Jurnal Cendekia: Jurnal Pendidikan Matematika" },
    speakerNote: "Sebagai luaran wajib/tambahan, naskah artikel jurnal SINTA 3/4 telah selesai ditulis lengkap dengan paket blind review untuk OJS."
  },
  {
    id: 16,
    badge: "Kesimpulan Proposal",
    title: "Kesimpulan & Harapan Kebermanfaatan Riset",
    subtitle: "Menghadirkan Media Pembelajaran Matematika yang Bermutu, Modern, dan Berakhlak",
    bullets: [
      { title: "Solusi Nyata Kebutuhan Madrasah", desc: "Menjembatani pemahaman statistika kontekstual dengan nilai etika Islam yang autentik." },
      { title: "Instrumen Teruji & Terukur", desc: "Fondasi evaluasi kokoh berstandar psikometri Aiken's V dan model Rasch PCM." },
      { title: "Dukungan Ekosistem Terpadu", desc: "Dasbor pembelajaran siswa, portal evaluator, dan salindia sidang terintegrasi dalam satu sistem terpadu." }
    ],
    stat: { value: "Bismillah", label: "Kesiapan Riset", sublabel: "Siap Melangkah ke Tahap Develop" },
    speakerNote: "Sebagai kesimpulan, proposal ini telah siap secara teoretis, metodologis, instrumen, dan teknis aplikasi. Kami memohon arahan, bimbingan, dan masukan dari Dewan Penguji."
  },
  {
    id: 17,
    badge: "Sesi Tanya Jawab",
    title: "Terima Kasih / Jazakumullah Khairan",
    subtitle: "Kami Siap Mendengar Tanggapan, Arahan, dan Diskusi dari Dewan Penguji",
    bullets: [
      { title: "Peneliti", desc: "Muhammad Khoiruzzadittaqwa (NIM: 2220020002)" },
      { title: "Tautan Produk & Instrumen", desc: "statslabmedia.vercel.app / Rute /doc" },
      { title: "Dokumen Master", desc: "Tersedia di Pusat Unduhan Berkas Skripsi" }
    ],
    stat: { value: "Alhamdulillah", label: "Sidang Proposal", sublabel: "Institut Al-Bahjah Cirebon" },
    speakerNote: "Demikian pemaparan proposal skripsi saya. Waktu selanjutnya saya kembalikan kepada Ketua Sidang. Wassalamu'alaikum warahmatullahi wabarakatuh."
  }
];

export default function SidangPresentationPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 minutes timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA[currentSlideIndex];

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNotes(prev => !prev);
      } else if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setShowGrid(prev => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans select-none overflow-hidden">
      
      {/* Top Presentation Bar */}
      <header className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
            SL
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-md">
              Sidang Proposal Skripsi • StatsLab
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Muhammad Khoiruzzadittaqwa • STAI Al-Bahjah
            </div>
          </div>
        </div>

        {/* Timer & Presentation Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${
            secondsRemaining < 3 * 60 
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-emerald-400'
          }`}>
            <Clock size={13} />
            <span>{formatTimer(secondsRemaining)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200"
              title={isTimerRunning ? 'Pause Timer' : 'Mulai Timer'}
            >
              {isTimerRunning ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => { setSecondsRemaining(15 * 60); setIsTimerRunning(false); }}
              className="text-slate-400 hover:text-slate-200"
              title="Reset 15 Menit"
            >
              <RotateCcw size={11} />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Quick links to Main Dashboard and Research Doc */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 px-2.5 py-1 rounded border border-emerald-700/60 transition"
          >
            <ExternalLink size={12} /> Demo Siswa
          </Link>

          <Link
            href="/doc"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/80 px-2.5 py-1 rounded border border-blue-700/60 transition"
          >
            <BookOpen size={12} /> Portal /doc
          </Link>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition ${
              showNotes 
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Tampilkan Catatan Pembicara / Jawaban Kaprodi (Shortcut: N)"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Catatan</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded border transition ${
              showGrid 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Lihat Daftar Seluruh Slide (Shortcut: O)"
          >
            <Grid size={15} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Layar Penuh (Shortcut: F)"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* Main Slide Content Canvas */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        
        {/* Subtle Islamic Geometric Ambient Background */}
        <div className="absolute inset-0 bg-radial from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />
        
        {/* Slide Card */}
        <div className="relative z-10 w-full max-w-5xl bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[500px] sm:min-h-[560px]">
          
          {/* Slide Header */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                {currentSlide.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Slide {currentSlide.id} dari {totalSlides}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-50 tracking-tight leading-snug">
              {currentSlide.title}
            </h1>
            <p className="text-sm sm:text-base text-emerald-400/90 font-medium mt-1 leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Slide Body: Bullets & Stat Highlight */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Bullets List (2 Cols on desktop) */}
            <div className="md:col-span-2 space-y-3.5">
              {currentSlide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800/40 border border-slate-800 rounded-xl p-3.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {bullet.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {bullet.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat Feature Card (1 Col) */}
            {currentSlide.stat && (
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-700/40 rounded-2xl p-6 text-center shadow-lg flex flex-col justify-center items-center h-full min-h-[180px]">
                <Sparkles className="text-amber-400 mb-2" size={24} />
                <div className="text-3xl sm:text-4xl font-serif font-bold text-slate-50 tracking-tight">
                  {currentSlide.stat.value}
                </div>
                <div className="text-xs font-semibold text-emerald-300 mt-1 uppercase tracking-wider font-mono">
                  {currentSlide.stat.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 max-w-[180px] leading-snug">
                  {currentSlide.stat.sublabel}
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-400">
              STAI Al-Bahjah Cirebon • Program Studi Tadris Matematika
            </span>
            <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline">
              Gunakan panah keyboard (← / →) untuk berpindah salindia
            </span>
          </div>
        </div>

        {/* Speaker Notes Drawer (Toggled by 'N' or button) */}
        {showNotes && (
          <aside className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 bg-slate-900/95 border border-amber-600/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md z-40 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Award size={15} />
                  <span>Catatan Presenter & Jawaban Kaprodi</span>
                </div>
                <button
                  onClick={() => setShowNotes(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Tutup
                </button>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-3 max-h-[420px] overflow-y-auto pr-1">
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg">
                  <span className="text-[10px] font-mono text-amber-300 font-bold uppercase block mb-1">
                    Skrip Ujaran Rekomendasi
                  </span>
                  <p className="italic text-slate-200">
                    &quot;{currentSlide.speakerNote}&quot;
                  </p>
                </div>

                <div className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck size={12} /> Antisipasi Pertanyaan Penguji:
                  </div>
                  <p className="text-slate-400">
                    Jika ditanya tentang pembatasan subjek: Tegaskan bahwa riset adalah R&D 3 tahap (Define, Design, Develop) yang berfokus pada validitas instrumen ahli dan kepraktisan guru, bukan eksperimen keefektifan massal siswa.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
              Tekan tombol <kbd className="px-1 py-0.5 bg-slate-800 rounded">N</kbd> untuk sembunyikan catatan
            </div>
          </aside>
        )}

        {/* Slide Overview Grid Drawer (Toggled by 'O' or button) */}
        {showGrid && (
          <div className="absolute inset-4 bg-slate-950/95 border border-slate-800 rounded-3xl p-6 z-40 overflow-y-auto animate-fadeIn backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                <Grid size={18} className="text-emerald-400" />
                <span>Pilih Salindia Sidang Proposal ({totalSlides} Slide)</span>
              </h2>
              <button
                onClick={() => setShowGrid(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg"
              >
                Tutup (Esc / O)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {SLIDES_DATA.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setShowGrid(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                    idx === currentSlideIndex
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold text-emerald-400">#{s.id}</span>
                    <span className="truncate max-w-[80px] text-slate-400">{s.badge}</span>
                  </div>
                  <div className="text-xs font-semibold leading-tight line-clamp-2">
                    {s.title}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono truncate mt-1">
                    {s.bullets[0]?.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Presentation Controls Bar */}
      <footer className="h-16 px-4 sm:px-8 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between backdrop-blur-md z-30 shrink-0">
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition"
            title="Slide Sebelumnya (Shortcut: ←)"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlideIndex === totalSlides - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white transition shadow-sm"
            title="Slide Berikutnya (Shortcut: → atau Spasi)"
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-4 sm:mx-8">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>Kemajuan Sidang</span>
            <span>{Math.round(((currentSlideIndex + 1) / totalSlides) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        {/* Standalone HTML Fallback Button */}
        <div className="flex items-center gap-2">
          <a
            href="/sidang_standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 underline"
            title="Buka File HTML Presentasi Standalone Asli"
          >
            Versi Offline HTML
          </a>
        </div>
      </footer>
    </div>
  );
}
