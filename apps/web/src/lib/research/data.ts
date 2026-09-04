import { TaskData, ValidationItem, SUSItem, ReferenceItem, GlossaryItem } from './types';

export const TASKS_DATA: TaskData[] = [
  {
    id: 'T1',
    shortName: 'Zakat Fitrah',
    title: 'T1: Membaca Data Tersurat dari Visualisasi Interaktif',
    watsonLevel: 'Level 3/4 (Informal / Quantitative)',
    gaisePhase: 'Fase I: Formulate Questions & Read Data',
    islamicValue: 'Amanah (Kejujuran Pencatatan & Takaran)',
    islamicPrinciple: 'Pencatatan dan penghitungan hak mustahik secara akurat tanpa pengurangan takaran (QS. Al-Muthaffifin: 1-3).',
    indicator: 'Reading Data (Membaca data tersurat dari representasi visual)',
    context: 'Data Penerimaan Zakat Fitrah di 5 Kecamatan (Kec. A, Kec. B, Kec. C, Kec. D, Kec. E) yang disajikan dalam diagram batang interaktif.',
    question: 'Perhatikan diagram batang interaktif penerimaan zakat fitrah. Gunakan fitur hover/kalkulator selisih. Identifikasi kecamatan dengan penerimaan zakat tertinggi dan terendah, lalu hitung selisihnya dalam kg!',
    interactiveFeature: 'Hover Tooltip & Difference Calculator',
    mathConcept: 'Operasi Selisih Nilai Ekstrem (Maksimum - Minimum)',
    defaultAnswer: 800,
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Langkah 2: Perencanaan & Rubrik Tabel 3.6). Mengukur kompetensi dasar membaca data tersurat.',
    tableRef: 'Tabel 3.6 (Butir T1)',
    rubric: {
      2: 'Siswa mampu mengidentifikasi kecamatan dengan perolehan zakat tertinggi (Kec. D = 1.450 kg) dan terendah (Kec. C = 650 kg) secara tepat, serta menghitung selisih 800 kg secara akurat lengkap beserta satuan pengukurannya.',
      1: 'Siswa mampu mengidentifikasi kecamatan tertinggi dan terendah dengan tepat, namun keliru dalam melakukan kalkulasi selisih matematis atau tidak menyertakan satuan kg.',
      0: 'Siswa salah dalam mengidentifikasi kecamatan tertinggi dan terendah, atau tidak memberikan respon jawaban sama sekali.'
    },
    sampleSolution: 'Kecamatan tertinggi = Kec. D (1.450 kg), terendah = Kec. C (650 kg). Selisih mutlak = 1.450 kg - 650 kg = 800 kg.'
  },
  {
    id: 'T2',
    shortName: 'Wakaf Produktif',
    title: 'T2: Membandingkan dan Menemukan Pola Distribusi Data',
    watsonLevel: 'Level 4 (Quantitative / Structural)',
    gaisePhase: 'Fase II: Collect Data & Interpret Distribution',
    islamicValue: 'Amanah & Maslahah (Pengelolaan Wakaf Berkelanjutan)',
    islamicPrinciple: 'Optimalisasi aset wakaf untuk kemaslahatan umat berkelanjutan secara adil dan transparan.',
    indicator: 'Reading Between Data (Membandingkan proporsi dan bagian-bagian data)',
    context: 'Distribusi Luas Tanah Wakaf Produktif (Pertanian & Ruko Usaha) vs Non-Produktif (Pemakaman & Tempat Ibadah) pada suatu wilayah.',
    question: 'Gunakan filter kategori untuk memisahkan peruntukan wakaf produktif (pertanian & usaha) dengan non-produktif (pemakaman & ibadah). Bandingkan proporsinya dan simpulkan kecenderungannya!',
    interactiveFeature: 'Dropdown Category Filter & Donut Chart Breakdown',
    mathConcept: 'Proporsi, Persentase & Distribusi Frekuensi Relatif',
    defaultAnswer: '60% vs 40%',
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menilai kapasitas membandingkan relasi sub-kelompok data.',
    tableRef: 'Tabel 3.6 (Butir T2)',
    rubric: {
      2: 'Siswa berhasil mengelompokkan dan membandingkan persentase kedua sektor wakaf (60% produktif vs 40% non-produktif) secara akurat serta menyimpulkan signifikansi kemaslahatan ekonomi wakaf.',
      1: 'Siswa mampu menghitung persentase proporsi masing-masing kelompok data dengan benar, namun kesimpulan analisis atau interpretasi manajerial wakaf belum tepat.',
      0: 'Siswa salah dalam mengklasifikasikan kategori data dan gagal menghitung rasio proporsi.'
    },
    sampleSolution: 'Wakaf Produktif = Pertanian (35%) + Ruko (25%) = 60%. Wakaf Non-Produktif = Tempat Ibadah (20%) + Makam (20%) = 40%. Rasio perbandingan 3 : 2 dengan dominasi sektor produktif.'
  },
  {
    id: 'T3',
    shortName: 'Perpustakaan Madrasah',
    title: 'T3: Menganalisis Dampak Pencilan (Outlier) terhadap Ukuran Pemusatan',
    watsonLevel: 'Level 4/5 (Relational / Inconsistent Critical)',
    gaisePhase: 'Fase III: Analyze Data & Evaluate Outliers',
    islamicValue: 'Istiqamah & Tabayyun (Ketelitian & Verifikasi Anomali)',
    islamicPrinciple: 'Verifikasi ketahanan data statistik terhadap anomali musiman (kegiatan Ramadan) secara objektif tanpa prasangka.',
    indicator: 'Reading Between Data (Sensitivitas Mean vs Median terhadap data ekstrem)',
    context: 'Tren peminjaman buku perpustakaan madrasah selama 6 bulan dengan lonjakan ekstrem di bulan Ramadan (April: 180 peminjaman).',
    question: 'Aktifkan dan nonaktifkan data bulan Ramadan (April: 180 peminjaman). Analisis ukuran pemusatan manakah (Mean atau Median) yang mengalami pergeseran paling drastis dan jelaskan alasan teoretisnya!',
    interactiveFeature: 'Toggle Outlier Switch & Live Mean-Median Sensitivity Gauge',
    mathConcept: 'Resistensi Ukuran Pemusatan: Mean (sensitif) vs Median (resisten outlier)',
    defaultAnswer: 'Mean',
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Mengukur pemahaman relasional sifat matematis ukuran pemusatan.',
    tableRef: 'Tabel 3.6 (Butir T3)',
    rubric: {
      2: 'Siswa secara tepat menunjukkan perubahan Mean (dari 46,4 ke 68,6) dan Median (dari 46,0 ke 47,5), menyimpulkan bahwa Mean sangat sensitif terhadap pencilan sedangkan Median stabil, serta menjelaskan landasan matematisnya (penjumlahan nilai vs posisi urutan tengah).',
      1: 'Siswa dapat mengidentifikasi pergeseran nilai statistik dengan benar, tetapi penjelasan teoretis mengenai penyebab resistensi median belum lengkap.',
      0: 'Siswa salah menentukan ukuran pemusatan yang sensitif terhadap pencilan atau tidak memahami konsep outlier.'
    },
    sampleSolution: 'Mean melonjak tajam dari 46,4 menjadi 68,6 (+47,8%), sedangkan Median relatif konstan dari 46,0 menjadi 47,5 (+3,3%). Mean dipengaruhi besaran numerik ekstrem, sedangkan median hanya bergantung pada posisi urutan nilai tengah.'
  },
  {
    id: 'T4',
    shortName: "Muraja'ah vs Hafalan",
    title: 'T4: Menafsirkan Hubungan Antar-Variabel (Scatter Plot & Regresi)',
    watsonLevel: 'Level 5 (Critical / Inconsistent)',
    gaisePhase: 'Fase III: Model Association & Prediction',
    islamicValue: 'Mujahadah & Tawakkal (Hukum Kausalitas Ikhtiar)',
    islamicPrinciple: 'Hukum kausalitas ikhtiar: hubungan linier positif antara kesungguhan waktu muraja\'ah dengan ketahanan hafalan Al-Qur\'an.',
    indicator: 'Reading Beyond Data (Inferensi sebaran tren, korelasi, dan ekstrapolasi prediksi)',
    context: 'Hubungan Durasi Muraja\'ah (Jam/Minggu) dengan Skor Uji Hafalan Al-Qur\'an pada 10 Santri Madrasah.',
    question: 'Aktifkan garis tren (trendline) pada scatter plot interaktif. Bagaimanakah bentuk asosiasi antar-variabel? Gunakan model untuk memprediksikan skor hafalan jika santri bermuraja\'ah selama 10 jam/minggu!',
    interactiveFeature: 'Interactive Scatter Plot with Toggleable Trendline & Prediction Slider',
    mathConcept: 'Korelasi Linier Positif, Scatter Plot, Garis Regresi Tren',
    defaultAnswer: 95,
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menilai kapasitas inferensi dan ekstrapolasi tren data kontinu.',
    tableRef: 'Tabel 3.6 (Butir T4)',
    rubric: {
      2: 'Siswa mampu mengidentifikasi arah korelasi positif kuat (semakin tinggi durasi muraja\'ah, semakin tinggi skor hafalan) dan memprediksikan skor hafalan santri (~95) secara logis berbasis garis tren regresi linier.',
      1: 'Siswa mampu menyebutkan jenis hubungan korelasi positif namun nilai prediksi skor hafalan kurang presisi atau tanpa dasar model tren.',
      0: 'Siswa salah mengartikan pola hubungan antar-variabel dan gagal memprediksi nilai.'
    },
    sampleSolution: 'Hubungan bersifat korelasi linier positif kuat. Berdasarkan garis tren regresi linier, santri dengan waktu muraja\'ah 10 jam/minggu diestimasikan meraih skor hafalan pada rentang 93 - 97 poin.'
  },
  {
    id: 'T5',
    shortName: 'Grafik Infak Bias',
    title: 'T5: Evaluasi Kritis terhadap Visualisasi Data yang Bias/Manipulatif',
    watsonLevel: 'Level 5/6 (Critical Mathematical)',
    gaisePhase: 'Fase IV: Interpret Results & Ethical Critique',
    islamicValue: 'Amanah & Kejujuran (Anti-Manipulasi Visual & Larangan Tadlis)',
    islamicPrinciple: 'Penyajian laporan keuangan publik tanpa manipulasi optik skala grafik (Larangan tadlis / penipuan persepsi visual).',
    indicator: 'Evaluasi Kritis Data (Mendeteksi skala sumbu terpotong / truncated Y-axis)',
    context: 'Laporan Visual Pengumpulan Infak Masjid selama 4 Pekan dengan 2 Pilihan Format Tampilan Sumbu Y (Grafik A: Potong di 5 Juta vs Grafik B: Mulai dari Nol).',
    question: 'Bandingkan Grafik A (skala sumbu Y terpotong mulai Rp 5.000.000) dan Grafik B (skala sumbu Y dimulai dari nol). Mengapa Grafik A memberikan ilusi peningkatan yang sangat drastis? Evaluasi dari sudut pandang integritas Amanah data!',
    interactiveFeature: 'Side-by-Side Chart Comparison & Truncated Axis Visualizer',
    mathConcept: 'Integritas Skala Visual Grafik, Distorsi Persepsi Visual, Zero-Baseline Charting',
    defaultAnswer: 'Pemotongan Sumbu Y',
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menilai literasi kritis evaluasi misinformasi visual grafis.',
    tableRef: 'Tabel 3.6 (Butir T5)',
    rubric: {
      2: 'Siswa mampu membongkar distorsi visual pada Grafik A akibat pemotongan sumbu Y (truncated baseline), menjelaskan bahwa kenaikan riil hanya ~5,8% bukan 500%, serta meninjau implikasi etika Amanah dalam komunikasi data publik.',
      1: 'Siswa menemukan perbedaan skala Y namun argumentasi mengenai distorsi optik atau prinsip etika Amanah pelaporan data belum komprehensif.',
      0: 'Siswa menganggap kedua grafik memberikan pesan yang sama atau gagal mengidentifikasi manipulasi baseline sumbu Y.'
    },
    sampleSolution: 'Grafik A memotong sumbu Y di titik 5 juta rupiah sehingga kenaikan moderat Rp 300.000 terlihat secara visual seperti lonjakan 5 kali lipat. Grafik B menyajikan proporsi riil dari dasar nol (zero-baseline) sesuai standar integritas data Amanah.'
  },
  {
    id: 'T6',
    shortName: 'KKM Bahasa Arab',
    title: 'T6: Pengambilan Keputusan Berbasis Ukuran Pemusatan yang Tepat',
    watsonLevel: 'Level 5/6 (Critical Mathematical)',
    gaisePhase: 'Fase IV: Make Data-Driven Decisions Under Uncertainty',
    islamicValue: "Tabayyun & Keadilan ('Adl)",
    islamicPrinciple: 'Keadilan proporsional dalam menetapkan standar evaluasi belajar yang tidak merugikan mayoritas siswa karena anomali kasus inklusif.',
    indicator: 'Evaluasi Kritis & Pengambilan Keputusan Kontekstual Berkeadilan',
    context: 'Data nilai ujian Bahasa Arab satu kelas (10 siswa) dengan keberadaan 2 siswa pindahan/inklusif bernilai rendah (25 dan 30).',
    question: 'Guru madrasah ingin menetapkan KKM berbasis representasi kelas yang adil. Aktifkan/nonaktifkan data pencilan siswa inklusif. Ukuran pemusatan manakah (Mean atau Median) yang paling adil dan representatif dijadikan dasar acuan? Jelaskan dengan landasan Tabayyun!',
    interactiveFeature: 'Interactive Outlier Remover & Dual Benchmark Comparator',
    mathConcept: 'Robustness Measures of Central Tendency & Fair Decision Modeling',
    defaultAnswer: 'Median / Mean tanpa outlier',
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menilai kapasitas sintesis data dan pengambilan keputusan etis.',
    tableRef: 'Tabel 3.6 (Butir T6)',
    rubric: {
      2: 'Siswa memilih Median (85,5) atau Mean tanpa outlier (86,9) sebagai dasar pengambilan keputusan yang adil, menjelaskan bahwa Mean keseluruhan (75,0) terdistorsi berat oleh nilai ekstrem dua siswa inklusif, dan menguraikan rekomendasi penanganan afirmasi berbasis Tabayyun.',
      1: 'Siswa memilih ukuran statistik yang tepat namun belum mengaitkan alasan dengan konsep keadilan representasi dan program penanganan khusus inklusif.',
      0: 'Siswa memilih Mean dengan outlier (75,0) tanpa menyadari dampaknya yang merugikan evaluasi pencapaian mayoritas siswa.'
    },
    sampleSolution: 'Nilai Median (85,5) atau Mean terkoreksi (86,9) adalah ukuran paling adil untuk menetapkan standar capaian kelas, sementara 2 siswa inklusif difasilitasi program bimbingan matrikulasi khusus berdasarkan prinsip Tabayyun dan keadilan proporsional.'
  },
  {
    id: 'T7',
    shortName: 'Bias Sampling',
    title: 'T7: Memvalidasi Klaim/Informasi Berdasarkan Bias Metodologis Sampel',
    watsonLevel: 'Level 6 (Critical Mathematical)',
    gaisePhase: 'Fase I & IV: Scrutinize Claims & Sampling Rigor',
    islamicValue: 'Tabayyun (Verifikasi Metodologis & Anti-Hoaks)',
    islamicPrinciple: 'Kewajiban meneliti kebenaran metodologis suatu klaim sebelum mempercayai dan menyebarkannya (QS. Al-Hujurat: 6).',
    indicator: 'Reading Beyond Data & Evaluasi Metodologis Representativitas Sampel',
    context: 'Klaim promosi sebuah platform bimbingan belajar: "90% Efektif Meningkatkan Nilai Matematika Siswa Madrasah" yang didasarkan pada survei 10 responden.',
    question: 'Klik tombol "Inspeksi Demografi Sampel" untuk memeriksa latar belakang responden. Evaluasilah apakah klaim 90% tersebut dapat digeneralisasi untuk seluruh populasi siswa madrasah? Berikan telaah kritis Anda berdasarkan prinsip Tabayyun!',
    interactiveFeature: 'Sample Demographics Inspector Modal with Subgroup Stratification',
    mathConcept: 'Sampling Bias, Representativeness, Purposive Bias, Generalizability',
    defaultAnswer: 'Sampel Bias Tidak Mewakili Populasi',
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menilai level tertinggi literasi kritis terhadap metodologi data.',
    tableRef: 'Tabel 3.6 (Butir T7)',
    rubric: {
      2: 'Siswa secara tegas menolak klaim generalisasi karena menemukan bahwa seluruh responden (N=10) berasal dari kelas unggulan olimpiade (purposive sampling bias) dengan ukuran sampel terlalu kecil, serta menjustifikasi telaah menggunakan prinsip Tabayyun informasi ilmiah.',
      1: 'Siswa menyatakan klaim kurang meyakinkan karena jumlah sampel sedikit, namun belum mampu mendeteksi bias seleksi demografi responden secara spesifik.',
      0: 'Siswa menerima klaim promosi secara mentah tanpa melakukan verifikasi keabsahan latar belakang sampel.'
    },
    sampleSolution: 'Klaim tidak valid digeneralisasikan karena sampel mengalami bias seleksi (100% siswa kelas olimpiade) dan ukuran sampel (N=10) tidak mencerminkan variansi populasi madrasah. Sesuai prinsip Tabayyun, diperlukan stratified random sampling.'
  },
  {
    id: 'T8',
    shortName: 'Alokasi Anggaran',
    title: 'T8: Simulasi Pengambilan Keputusan Strategis & Alokasi Sumber Daya',
    watsonLevel: 'Level 6 (Critical Mathematical)',
    gaisePhase: 'Fase IV: Multi-Criteria Optimization & Policy Formulation',
    islamicValue: 'Amanah & Syura (Efisiensi, Musyawarah & Keadilan Alokatif)',
    islamicPrinciple: 'Pengelolaan kas organisasi madrasah secara adil, produktif, dan berbasis kebutuhan riil peserta didik melalui musyawarah.',
    indicator: 'Pengambilan Keputusan Multikriteria, Optimasi Proporsional & Sintesis Terpadu',
    context: 'Data historis pertumbuhan peminat dan kebutuhan operasional 4 kegiatan ekstrakurikuler madrasah (Tahfidz, Pramuka Islam, Kaligrafi, PMR).',
    question: 'Gunakan simulator slider untuk mengalokasikan total plafon anggaran madrasah sebesar Rp 20.000.000. Sesuaikan pembagian anggaran secara proporsional dengan tren pertumbuhan minat santri dan berikan justifikasi efisiensinya!',
    interactiveFeature: 'Multi-Slider Dynamic Budget Allocator with Live Total Counter & Optimization Target',
    mathConcept: 'Alokasi Proporsional, Optimasi Bersyarat, Analisis Tren Multivariat',
    defaultAnswer: 20000000,
    status: 'resmi_proposal',
    statusNote: 'Tertera pada Proposal Skripsi Bab III (Rubrik Tabel 3.6). Menguji kemampuan integratif pemodelan matematika dan kebijakan etis.',
    tableRef: 'Tabel 3.6 (Butir T8)',
    rubric: {
      2: 'Siswa berhasil menyusun alokasi anggaran tepat total Rp 20.000.000 yang proporsional dengan tren lonjakan peminat (Tahfidz +40% dan Pramuka +25%), serta memberikan argumentasi manajerial berbasis efisiensi Amanah dan Syura.',
      1: 'Siswa menyusun total anggaran tepat Rp 20.000.000, namun proporsi pembagian tiap pos kegiatan belum sepenuhnya mencerminkan tren pertumbuhan data riil.',
      0: 'Siswa gagal memenuhi plafon total Rp 20.000.000 atau membagi anggaran secara sembarangan tanpa dasar data.'
    },
    sampleSolution: 'Alokasi proporsional ideal: Tahfidz Al-Qur\'an Rp 7.000.000 (tren +40%), Pramuka Islam Rp 6.000.000 (tren +25%), Kaligrafi Rp 4.000.000 (tren +15%), PMR Rp 3.000.000 (tren +5%). Total Rp 20.000.000 efisien dan seimbang.'
  }
];

export const VALIDATION_DOMAINS: Record<string, { title: string; desc: string; icon: string; tableNumber: string; items: ValidationItem[] }> = {
  materi: {
    title: 'Tabel 3.2: Lembar Validasi Ahli Materi Matematika',
    desc: 'Instrumen evaluasi kesesuaian konten dengan KD Kurikulum Merdeka Fase D, akurasi konsep statistika deskriptif, dan ketepatan konteks dataset sosiomatematika.',
    icon: 'Calculator',
    tableNumber: 'Tabel 3.2',
    items: [
      {
        id: 'MTR-01',
        statement: 'Kesesuaian dan keselarasan konten dasbor dengan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran Kurikulum Merdeka Matematika Fase D.',
        indicator: 'Kesesuaian Kurikulum & Capaian Pembelajaran',
        aspect: 'Kesesuaian Konten dengan Kurikulum Merdeka',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-02',
        statement: 'Kesesuaian struktur tugas tersemat dalam merefleksikan tingkatan literasi data (reading data, reading between data, dan reading beyond data).',
        indicator: 'Validitas Konstruk Literasi Data (Curcio / Watson)',
        aspect: 'Kesesuaian Konten dengan Kurikulum Merdeka',
        r1: 5, r2: 4, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-03',
        statement: 'Keakuratan formulasi dan definisi matematis untuk ukuran pemusatan (Mean, Median, Modus) dan ukuran penyebaran data.',
        indicator: 'Akurasi Konsep Statistika Deskriptif',
        aspect: 'Akurasi Konsep Statistika',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-04',
        statement: 'Ketepatan penyajian visualisasi grafik statistik (pelabelan sumbu, interval skala, kejelasan legenda, dan zero-baseline).',
        indicator: 'Presisi Representasi Visual Grafik',
        aspect: 'Akurasi Konsep Statistika',
        r1: 4, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-05',
        statement: 'Ketiadaan miskonsepsi matematis dalam narasi penugasan, stimulus visual interaktif, maupun umpan balik otomatis sistem.',
        indicator: 'Integritas & Kebebasan dari Miskonsepsi',
        aspect: 'Akurasi Konsep Statistika',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-06',
        statement: 'Penjenjangan tingkat kesulitan 8 tugas kognitif selaras dengan tahapan Hierarki Watson-Callingham (Level 3 hingga Level 6).',
        indicator: 'Penjenjangan Hierarki Kognitif Penalaran',
        aspect: 'Akurasi Konsep Statistika',
        r1: 5, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-07',
        statement: 'Ketepatan pemilihan konteks dataset bernuansa sosiostatistika dalam menggambarkan fenomena riil kehidupan siswa.',
        indicator: 'Autentisitas & Kontekstualitas Dataset',
        aspect: 'Ketepatan Konteks Dataset Kehidupan Nyata',
        r1: 4, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-08',
        statement: 'Kejelasan operasionalisasi rubrik penskoran politomi (skor 0, 1, 2) dalam mendiskriminasikan level pemahaman siswa secara objektif.',
        indicator: 'Gradasi & Diskriminasi Rubrik Politomi',
        aspect: 'Ketepatan Konteks Dataset Kehidupan Nyata',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-09',
        statement: 'Kejelasan kunci jawaban, pembahasan, dan kriteria pemenuhan indikator kognitif pada tiap butir tugas tersemat.',
        indicator: 'Kejelasan Kunci Jawaban & Panduan Solusi',
        aspect: 'Ketepatan Konteks Dataset Kehidupan Nyata',
        r1: 4, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.2 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.2'
      },
      {
        id: 'MTR-10',
        statement: 'Kesesuaian rubrik diagnostik dalam memetakan letak kesalahan konsep (error analysis) pada jawaban parsial (skor 1) siswa.',
        indicator: 'Rubrik Diagnostik Error Analysis (Usulan Validator)',
        aspect: 'Ketepatan Konteks Dataset Kehidupan Nyata',
        r1: 5, r2: 5, r3: 5,
        status: 'usulan_revisi',
        statusNote: 'Usulan Revisi Validator Materi: Diperlukan untuk penguatan Bab IV dalam analisis butir Partial Credit Model (PCM).',
        tableRef: 'Tabel 3.2 (Ekstensi)'
      }
    ]
  },
  media: {
    title: 'Tabel 3.3: Lembar Validasi Ahli Media & Teknologi Pendidikan',
    desc: 'Instrumen telaah kualitas tampilan antarmuka (UI/UX), arsitektur navigasi, responsivitas multiperangkat, serta kepatuhan pada Cognitive Load Theory (CLT).',
    icon: 'Laptop',
    tableNumber: 'Tabel 3.3',
    items: [
      {
        id: 'MED-01',
        statement: 'Antarmuka dasbor memiliki tata letak minimalis dan terstruktur (clean interface) yang tidak menimbulkan kelelahan visual.',
        indicator: 'Tata Letak & Estetika Antarmuka (UI)',
        aspect: 'Tampilan Visual Dasbor',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-02',
        statement: 'Kombinasi warna, kontras teks, dan keterbacaan tipografi memfasilitasi kenyamanan pengguna pada mode terang maupun gelap.',
        indicator: 'Tipografi, Kontras & Aksesibilitas Visual',
        aspect: 'Tampilan Visual Dasbor',
        r1: 5, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-03',
        statement: 'Konsistensi dan kejelasan fungsi tombol navigasi, menu samping, remah roti (breadcrumb), dan kontrol interaktif.',
        indicator: 'Konsistensi Struktur Navigasi & Alur Menu',
        aspect: 'Navigasi dan Struktur Menu',
        r1: 4, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-04',
        statement: 'Kelancaran dan responsivitas interaktivitas komponen dinamis (slider parameter, filter dropdown, switch toggle outlier).',
        indicator: 'Kelancaran Interaktivitas Pengguna',
        aspect: 'Navigasi dan Struktur Menu',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-05',
        statement: 'Kecepatan dan ketepatan sistem dalam memberikan umpan balik visual grafis secara real-time saat pengguna mengubah parameter.',
        indicator: 'Kecepatan Umpan Balik Real-Time',
        aspect: 'Navigasi dan Struktur Menu',
        r1: 5, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-06',
        statement: 'Penyajian elemen antarmuka terbukti meminimalkan beban kognitif luar (extraneous cognitive load) sesuai prinsip CLT Sweller.',
        indicator: 'Reduksi Beban Kognitif Luar (CLT)',
        aspect: 'Tampilan Visual Dasbor',
        r1: 4, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-07',
        statement: 'Kehandalan responsivitas tampilan antarmuka saat dibuka pada berbagai resolusi layar peranti (laptop desktop, tablet, smartphone).',
        indicator: 'Adaptabilitas Responsif Multiplatform',
        aspect: 'Responsivitas Antarmuka Berbagai Layar',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-08',
        statement: 'Sistem aplikasi web terbebas dari galat pemrograman (error/bug) saat melakukan komputasi statistik dan render grafik.',
        indicator: 'Kestabilan Kode & Keandalan Fungsional',
        aspect: 'Responsivitas Antarmuka Berbagai Layar',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-09',
        statement: 'Kemudahan akses aplikasi web berbasis browser modern (client-side rendering) tanpa membutuhkan instalasi yang membebani siswa.',
        indicator: 'Aksesibilitas & Efisiensi Distribusi Digital',
        aspect: 'Responsivitas Antarmuka Berbagai Layar',
        r1: 5, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-10',
        statement: 'Keselarasan alur operasional media dengan prinsip-prinsip baku interaksi manusia dan komputer (Human-Computer Interaction).',
        indicator: 'Penerapan Kaidah Ergonomi & HCI',
        aspect: 'Navigasi dan Struktur Menu',
        r1: 4, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.3 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.3'
      },
      {
        id: 'MED-11',
        statement: 'Kepatuhan antarmuka terhadap standar aksesibilitas kontras warna WCAG 2.1 Level AA untuk kenyamanan mata siswa.',
        indicator: 'Kepatuhan Standar Aksesibilitas WCAG 2.1',
        aspect: 'Tampilan Visual Dasbor',
        r1: 5, r2: 5, r3: 4,
        status: 'usulan_revisi',
        statusNote: 'Usulan Revisi Validator Media: Standar pengujian kontras rasio minimal 4.5:1 untuk teks normal.',
        tableRef: 'Tabel 3.3 (Ekstensi)'
      }
    ]
  },
  islam: {
    title: 'Tabel 3.4: Lembar Validasi Ahli Integrasi Nilai-Nilai Islam',
    desc: 'Instrumen evaluasi kesesuaian nilai syariat, keabsahan dalil Al-Qur\'an & Hadits, serta keterpaduan adab berinteraksi dengan data (Tabayyun & Amanah).',
    icon: 'BookOpenCheck',
    tableNumber: 'Tabel 3.4',
    items: [
      {
        id: 'ISL-01',
        statement: 'Kesesuaian penanaman nilai pilar Tabayyun (verifikasi kritis dan ketelitian informasi) dalam aktivitas analisis dan evaluasi data.',
        indicator: 'Internalisasi Pilar Tabayyun (QS. Al-Hujurat: 6)',
        aspect: 'Kesesuaian Nilai dengan Prinsip Dasar Islam',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-02',
        statement: 'Kesesuaian internalisasi nilai pilar Amanah (kejujuran dan transparansi) dalam penyajian data tanpa rekayasa manipulasi grafis.',
        indicator: 'Internalisasi Pilar Amanah (QS. Al-Ahzab: 72 & Al-Muthaffifin: 1-3)',
        aspect: 'Kesesuaian Nilai dengan Prinsip Dasar Islam',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-03',
        statement: 'Keabsahan dan keautentikan rujukan ayat Al-Qur\'an, hadits, serta kaidah ushul fikih yang disematkan pada setiap tugas studi.',
        indicator: 'Autentisitas & Keabsahan Dalil Syar\'i',
        aspect: 'Autentisitas Sumber Rujukan Nilai',
        r1: 4, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-04',
        statement: 'Keterpaduan nilai keislaman menyatu secara organis dan epistemologis dengan materi matematika tanpa menimbulkan kesan tempelan.',
        indicator: 'Keterpaduan Epistemologis & Organis',
        aspect: 'Ketepatan Konteks Penyajian Literasi Data',
        r1: 5, r2: 4, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-05',
        statement: 'Ketepatan pemilihan stimulus dataset bernuansa filantropi dan edukasi Islam (Zakat Fitrah, Wakaf Produktif, Muraja\'ah Qur\'an, Kas Madrasah).',
        indicator: 'Relevansi Kontekstual Dataset Keislaman',
        aspect: 'Ketepatan Konteks Penyajian Literasi Data',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-06',
        statement: 'Potensi media dalam membina karakter peserta didik agar bersikap kritis terhadap disinformasi, adil dalam evaluasi, dan bertanggung jawab.',
        indicator: 'Dampak Pembentukan Karakter Siswa Berakhlak',
        aspect: 'Kesesuaian Nilai dengan Prinsip Dasar Islam',
        r1: 5, r2: 5, r3: 4,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-07',
        statement: 'Ketepatan penggunaan istilah keagamaan dan transliterasi Arab-Latin yang santun, sahih, dan sesuai tahap kognitif siswa madrasah.',
        indicator: 'Ketepatan Bahasa & Transliterasi Istilah',
        aspect: 'Autentisitas Sumber Rujukan Nilai',
        r1: 4, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-08',
        statement: 'Kemampuan media dalam mengikis dikotomi pemisah antara sains matematika umum dengan nilai-nilai wahyu ilahiah.',
        indicator: 'Eliminasi Dikotomi Sains & Agama',
        aspect: 'Ketepatan Konteks Penyajian Literasi Data',
        r1: 5, r2: 5, r3: 5,
        status: 'resmi_proposal',
        statusNote: 'Item resmi pada Tabel 3.4 Proposal Skripsi Bab III.',
        tableRef: 'Tabel 3.4'
      },
      {
        id: 'ISL-09',
        statement: 'Internalisasi nilai prinsip Syura (musyawarah perumusan keputusan) dan Ihtiyath (kehati-hatian) dalam pemodelan data strategi.',
        indicator: 'Penguatan Nilai As-Syura & Al-Ihtiyath',
        aspect: 'Kesesuaian Nilai dengan Prinsip Dasar Islam',
        r1: 5, r2: 5, r3: 5,
        status: 'usulan_revisi',
        statusNote: 'Usulan Revisi Validator Integrasi Islam: Menambahkan penegasan dalil QS. Asy-Syura: 38 pada penugasan T8.',
        tableRef: 'Tabel 3.4 (Ekstensi)'
      }
    ]
  }
};

export const SUS_ITEMS: SUSItem[] = [
  {
    id: 1,
    text: 'Saya berpikir akan sering menggunakan Dasbor Statistika Interaktif ini kembali dalam pembelajaran statistika.',
    score: 4,
    isPositive: true,
    dimension: 'Frekuensi Minat Penggunaan (Frequency of Use)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 1, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 1)'
  },
  {
    id: 2,
    text: 'Saya merasa antarmuka sistem dasbor statistika ini terlalu rumit dan membingungkan untuk digunakan.',
    score: 2,
    isPositive: false,
    dimension: 'Kompleksitas Antarmuka (Complexity)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 2, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 2)'
  },
  {
    id: 3,
    text: 'Saya merasa dasbor statistika interaktif ini sangat mudah untuk dioperasikan dalam eksplorasi data.',
    score: 5,
    isPositive: true,
    dimension: 'Kemudahan Pengoperasian (Ease of Use)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 3, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 3)'
  },
  {
    id: 4,
    text: 'Saya merasa membutuhkan bantuan orang lain atau instruktur teknis untuk dapat mengoperasikan dasbor ini.',
    score: 1,
    isPositive: false,
    dimension: 'Kemandirian Penggunaan (Need for Support)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 4, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 4)'
  },
  {
    id: 5,
    text: 'Saya menemukan bahwa berbagai fitur interaktif (grafik, filter, slider) dalam dasbor ini terintegrasi dengan sangat rapi.',
    score: 4,
    isPositive: true,
    dimension: 'Integritas Fitur (Integrity of Functions)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 5, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 5)'
  },
  {
    id: 6,
    text: 'Saya merasa terdapat banyak hal yang tidak konsisten pada tombol, warna, atau susunan menu dasbor ini.',
    score: 2,
    isPositive: false,
    dimension: 'Konsistensi Desain (Inconsistency)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 6, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 6)'
  },
  {
    id: 7,
    text: 'Saya merasa teman-teman sekelas akan mempelajari cara menggunakan dasbor ini dengan sangat cepat.',
    score: 5,
    isPositive: true,
    dimension: 'Kecepatan Belajar Sistem (Learnability)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 7, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 7)'
  },
  {
    id: 8,
    text: 'Saya merasa alur kerja dan navigasi dasbor ini sangat janggal atau membingungkan saat pertama kali dicoba.',
    score: 1,
    isPositive: false,
    dimension: 'Kejelasan Navigasi (Cumbersomeness)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 8, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 8)'
  },
  {
    id: 9,
    text: 'Saya merasa sangat percaya diri saat menyelesaikan tugas-tugas literasi data menggunakan dasbor ini.',
    score: 4,
    isPositive: true,
    dimension: 'Kepercayaan Diri Siswa (Confidence)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 9, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 9)'
  },
  {
    id: 10,
    text: 'Saya harus mempelajari banyak hal teknis yang rumit terlebih dahulu sebelum bisa mahir menggunakan dasbor ini.',
    score: 2,
    isPositive: false,
    dimension: 'Beban Pembelajaran Awal (Initial Burden)',
    status: 'resmi_proposal',
    statusNote: 'Item standar SUS Brooke (Item 10, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 10)'
  },
  {
    id: 11,
    text: 'Tampilan antarmuka dasbor ini sangat responsif, rapi, dan nyaman dibuka baik di layar laptop maupun ponsel pintar.',
    score: 5,
    isPositive: true,
    dimension: 'Responsivitas Antarmuka (Mobile & Desktop Adaptivity)',
    status: 'resmi_proposal',
    statusNote: 'Item Adaptif Proposal (Item 11 Tambahan, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 11)'
  },
  {
    id: 12,
    text: 'Penyajian dataset bernuansa Islami pada dasbor ini mempermudah saya memahami penerapan etika Tabayyun dan Amanah data.',
    score: 5,
    isPositive: true,
    dimension: 'Kemanfaatan Integrasi Nilai Islam (Islamic Value Utility)',
    status: 'resmi_proposal',
    statusNote: 'Item Adaptif Proposal (Item 12 Tambahan, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 12)'
  },
  {
    id: 13,
    text: 'Saya mengalami kesulitan dalam memahami respon visual grafik dan kalkulator interaktif saat mengubah parameter angka.',
    score: 2,
    isPositive: false,
    dimension: 'Keterbacaan Umpan Balik Visual (Visual Feedback)',
    status: 'resmi_proposal',
    statusNote: 'Item Adaptif Proposal (Item 13 Tambahan, Pola Genap Negatif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 13)'
  },
  {
    id: 14,
    text: 'Dasbor ini menanamkan kesadaran pada saya untuk menyajikan dan membaca data statistika secara jujur tanpa manipulasi.',
    score: 5,
    isPositive: true,
    dimension: 'Pembentukan Karakter Integritas Data (Ethical Awareness)',
    status: 'resmi_proposal',
    statusNote: 'Item Adaptif Proposal (Item 14 Tambahan, Pola Ganjil Positif). Tertera pada Tabel 3.5 Proposal Skripsi.',
    tableRef: 'Tabel 3.5 (No. 14)'
  },
  {
    id: 15,
    text: 'Petunjuk instruksional dan rubrik penskoran pada setiap penugasan tersemat sangat jelas dan mudah dipahami langkah-langkahnya.',
    score: 5,
    isPositive: true,
    dimension: 'Kejelasan Petunjuk Instruksional (Instructional Clarity)',
    status: 'usulan_revisi',
    statusNote: 'Usulan Revisi Penguji: Butir pengayaan untuk validasi keterpahaman petunjuk tugas mandiri siswa.',
    tableRef: 'Tabel 3.5 (Ekstensi)'
  }
];

export const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: 'aiken-1985',
    tag: 'Aiken (1985)',
    authors: 'Aiken, L. R.',
    year: '1985',
    title: 'Three coefficients for analyzing the reliability and validity of ratings',
    source: 'Educational and Psychological Measurement, 45(1), 131–142',
    doi: '10.1177/0013164485451012',
    formattedHtml: 'Aiken, L. R. (1985). Three coefficients for analyzing the reliability and validity of ratings. <em>Educational and Psychological Measurement</em>, 45(1), 131–142.',
    plainText: 'Aiken, L. R. (1985). Three coefficients for analyzing the reliability and validity of ratings. Educational and Psychological Measurement, 45(1), 131–142.',
    category: 'Metodologi'
  },
  {
    id: 'watson-2003',
    tag: 'Watson & Callingham (2003)',
    authors: 'Watson, J. M., & Callingham, R. A.',
    year: '2003',
    title: 'Statistical literacy: A complex hierarchical construct',
    source: 'Statistics Education Research Journal, 2(2), 3–30',
    formattedHtml: 'Watson, J. M., & Callingham, R. A. (2003). Statistical literacy: A complex hierarchical construct. <em>Statistics Education Research Journal</em>, 2(2), 3–30.',
    plainText: 'Watson, J. M., & Callingham, R. A. (2003). Statistical literacy: A complex hierarchical construct. Statistics Education Research Journal, 2(2), 3–30.',
    category: 'Statistika'
  },
  {
    id: 'brooke-1996',
    tag: 'Brooke (1996)',
    authors: 'Brooke, J.',
    year: '1996',
    title: 'SUS-A quick and dirty usability scale',
    source: 'In P. W. Jordan et al. (Eds.), Usability Evaluation in Industry (pp. 189–194). Taylor & Francis',
    formattedHtml: 'Brooke, J. (1996). SUS-A quick and dirty usability scale. Dalam P. W. Jordan et al. (Eds.), <em>Usability Evaluation in Industry</em> (hlm. 189–194). Taylor & Francis.',
    plainText: 'Brooke, J. (1996). SUS-A quick and dirty usability scale. Usability Evaluation in Industry, 189–194.',
    category: 'Metodologi'
  },
  {
    id: 'gaise-2020',
    tag: 'Bargagliotti et al. (2020)',
    authors: 'Bargagliotti, A., Franklin, C., Arnold, P., Gould, R., Johnson, S., Perez, L., & Spangler, D. A.',
    year: '2020',
    title: 'Pre-K–12 Guidelines for Assessment and Instruction in Statistics Education II (GAISE II)',
    source: 'American Statistical Association and National Council of Teachers of Mathematics',
    formattedHtml: 'Bargagliotti, A., Franklin, C., et al. (2020). <em>Pre-K–12 Guidelines for Assessment and Instruction in Statistics Education II (GAISE II)</em>. American Statistical Association.',
    plainText: 'Bargagliotti, A., Franklin, C., et al. (2020). Pre-K–12 Guidelines for Assessment and Instruction in Statistics Education II (GAISE II). American Statistical Association.',
    category: 'Statistika'
  },
  {
    id: 'gomez-2025',
    tag: 'Gómez & Henríquez-Rivas (2025)',
    authors: 'Gómez, A., & Henríquez-Rivas, C.',
    year: '2025',
    title: 'Decision-making in contexts of risk and uncertainty: An instrument for secondary education',
    source: 'Eurasia Journal of Mathematics, Science and Technology Education, 21(10), em2510',
    formattedHtml: 'Gómez, A., & Henríquez-Rivas, C. (2025). Decision-making in contexts of risk and uncertainty: An instrument for secondary education. <em>Eurasia Journal of Mathematics, Science and Technology Education</em>, 21(10), em2510.',
    plainText: 'Gómez, A., & Henríquez-Rivas, C. (2025). Decision-making in contexts of risk and uncertainty: An instrument for secondary education. Eurasia Journal of Mathematics, Science and Technology Education, 21(10).',
    category: 'Statistika'
  },
  {
    id: 'mahmudah-2022',
    tag: 'Mahmudah & Muqowim (2022)',
    authors: 'Mahmudah, I., & Muqowim, M.',
    year: '2022',
    title: 'Integration of Islamic values in mathematics learning in class IV students of Madrasah Ibtidaiyah',
    source: 'Al-Madrasah: Jurnal Pendidikan Madrasah Ibtidaiyah, 6(4), 1075–1086',
    formattedHtml: 'Mahmudah, I., & Muqowim, M. (2022). Integration of Islamic values in mathematics learning in class IV students of Madrasah Ibtidaiyah. <em>Al-Madrasah: Jurnal Pendidikan Madrasah Ibtidaiyah</em>, 6(4), 1075–1086.',
    plainText: 'Mahmudah, I., & Muqowim, M. (2022). Integration of Islamic values in mathematics learning. Al-Madrasah, 6(4), 1075–1086.',
    category: 'Pendidikan Islam'
  },
  {
    id: 'skulmowski-2021',
    tag: 'Skulmowski & Xu (2021)',
    authors: 'Skulmowski, A., & Xu, K.',
    year: '2021',
    title: 'Understanding cognitive load in digital and online learning: A new perspective on extraneous cognitive load',
    source: 'Educational Psychology Review, 34(1), 171–196',
    formattedHtml: 'Skulmowski, A., & Xu, K. (2021). Understanding cognitive load in digital and online learning: A new perspective on extraneous cognitive load. <em>Educational Psychology Review</em>, 34(1), 171–196.',
    plainText: 'Skulmowski, A., & Xu, K. (2021). Understanding cognitive load in digital and online learning. Educational Psychology Review, 34(1), 171–196.',
    category: 'Cognitive Load'
  },
  {
    id: 'masters-1982',
    tag: 'Masters (1982)',
    authors: 'Masters, G. N.',
    year: '1982',
    title: 'A Rasch model for partial credit scoring',
    source: 'Psychometrika, 47(2), 149–174',
    formattedHtml: 'Masters, G. N. (1982). A Rasch model for partial credit scoring. <em>Psychometrika</em>, 47(2), 149–174.',
    plainText: 'Masters, G. N. (1982). A Rasch model for partial credit scoring. Psychometrika, 47(2), 149–174.',
    category: 'Metodologi'
  }
];

export const GLOSSARY_DATA: GlossaryItem[] = [
  {
    term: "Aiken's V Index",
    definition: "Koefisien validitas isi untuk mengukur derajat kesepakatan antar pakar terhadap suatu butir instrumen skala Likert: V = \\sum s / [n(c-1)].",
    relevance: 'Digunakan untuk menguji validitas isi instrumen tugas kognitif, lembar observasi, dan modul integrasi keislaman (ambang batas valid V >= 0,667).',
    category: 'Psikometri'
  },
  {
    term: 'Rasch Partial Credit Model (PCM)',
    definition: 'Model Item Response Theory (IRT) politomi yang mengukur probabilitas peserta berpindah dari satu kategori skor ke kategori berikutnya secara independen sampel.',
    relevance: 'Digunakan untuk mengkalibrasi tingkat kesulitan butir tugas tersemat T1-T8 yang diskor secara bertingkat (0, 1, 2).',
    category: 'Psikometri'
  },
  {
    term: 'Hierarki Watson-Callingham',
    definition: 'Taksonomi 6 tingkat perkembangan literasi data: Idiosyncratic, Informal, Inconsistent, Consistent Non-Critical, Critical, dan Critical Mathematical.',
    relevance: 'Menjadi acuan gradasi kesulitan dan tuntutan kognitif dari T1 (Level 3/4) hingga T8 (Level 6).',
    category: 'Statistika'
  },
  {
    term: 'Tabayyun Data',
    arabic: 'التَّبَيُّن',
    definition: 'Prinsip verifikasi kebenaran dan ketelitian metodologis sebelum mempercayai atau menyebarkan informasi/klaim berbasis data (QS. Al-Hujurat: 6).',
    relevance: 'Ditanamkan pada tugas T3 (evaluasi pencilan), T6 (keadilan penetapan batas KKM), dan T7 (identifikasi bias sampling).',
    category: 'Keislaman'
  },
  {
    term: 'Amanah Data',
    arabic: 'الأَمَانَة',
    definition: 'Prinsip kejujuran intelektual dalam mencatat, mengolah, dan menyajikan visualisasi data tanpa rekayasa visual manipulatif (QS. Al-Ahzab: 72).',
    relevance: 'Ditanamkan pada tugas T1 (pencatatan zakat), T2 (alokasi wakaf), T5 (penolakan pemotongan sumbu Y), dan T8 (anggaran).',
    category: 'Keislaman'
  },
  {
    term: 'Extraneous Cognitive Load',
    definition: 'Beban kognitif luar yang dipicu oleh desain antarmuka yang buruk, instruksi membingungkan, atau navigasi yang tidak konsisten.',
    relevance: 'Direduksi melalui tata letak antarmuka yang bersih (clean layout), pemilihan warna harmonis, serta visualisasi grafik instan.',
    category: 'Media'
  },
  {
    term: 'System Usability Scale (SUS)',
    definition: 'Kuesioner standar internasional dengan 14 butir pernyataan bernada positif dan negatif berselang-seling untuk mengukur usabilitas sistem.',
    relevance: 'Mengukur persepsi 125 siswa terhadap kepraktisan, kemudahan pakai, dan integrasi nilai keislaman dalam dasbor interaktif.',
    category: 'Media'
  },
  {
    term: 'Zero-Baseline Charting',
    definition: 'Aturan baku visualisasi data di mana sumbu nilai (sumbu Y) harus berawal dari titik nol (0) untuk mencegah distorsi ilusi proporsi optik.',
    relevance: 'Diuji secara interaktif pada Tugas T5 untuk melatih kepekaan deteksi disinformasi grafis.',
    category: 'Statistika'
  }
];

export const PSYCHOMETRICS_DATA = {
  lisrelFit: [
    { metric: 'Chi-Square / df (\\chi^2 / df)', value: '1.42', threshold: '< 2.00', status: 'Good Fit (Sangat Baik)' },
    { metric: 'RMSEA (Root Mean Square Error of Approx.)', value: '0.038', threshold: '< 0.05', status: 'Close Fit (Sangat Baik)' },
    { metric: 'CFI (Comparative Fit Index)', value: '0.982', threshold: '> 0.95', status: 'Exceptional (Sempurna)' },
    { metric: 'TLI / NNFI (Tucker-Lewis Index)', value: '0.978', threshold: '> 0.95', status: 'Exceptional (Sempurna)' },
    { metric: 'SRMR (Standardized Root Mean Residual)', value: '0.041', threshold: '< 0.05', status: 'Good Fit (Sangat Baik)' },
    { metric: 'GFI (Goodness of Fit Index)', value: '0.965', threshold: '> 0.90', status: 'Good Fit (Sangat Baik)' }
  ],
  raschItemParams: [
    { item: 'T1 (Zakat Fitrah)', measure: '-1.45', se: '0.18', infitMnsq: '0.98', outfitMnsq: '0.94', pValue: '0.86', level: 'Level 3/4' },
    { item: 'T2 (Wakaf Produktif)', measure: '-0.92', se: '0.16', infitMnsq: '1.02', outfitMnsq: '0.99', pValue: '0.78', level: 'Level 4' },
    { item: 'T3 (Outlier Ramadan)', measure: '-0.35', se: '0.15', infitMnsq: '0.95', outfitMnsq: '0.96', pValue: '0.69', level: 'Level 4/5' },
    { item: 'T4 (Murajaah vs Hafalan)', measure: '+0.12', se: '0.14', infitMnsq: '1.04', outfitMnsq: '1.03', pValue: '0.61', level: 'Level 5' },
    { item: 'T5 (Grafik Infak Bias)', measure: '+0.48', se: '0.14', infitMnsq: '0.97', outfitMnsq: '0.92', pValue: '0.54', level: 'Level 5/6' },
    { item: 'T6 (KKM Bahasa Arab)', measure: '+0.81', se: '0.15', infitMnsq: '1.01', outfitMnsq: '1.06', pValue: '0.47', level: 'Level 5/6' },
    { item: 'T7 (Bias Sampling Klaim)', measure: '+1.15', se: '0.17', infitMnsq: '0.93', outfitMnsq: '0.89', pValue: '0.38', level: 'Level 6' },
    { item: 'T8 (Alokasi Anggaran)', measure: '+1.56', se: '0.19', infitMnsq: '1.06', outfitMnsq: '1.08', pValue: '0.31', level: 'Level 6' }
  ]
};

