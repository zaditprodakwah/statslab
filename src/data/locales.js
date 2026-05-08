// ============================================================
// STATSLAB — Bilingual Localization Engine
// Philosophy: Antigravity i18n (Lightweight, pure React State)
// File: src/data/locales.js
// ============================================================
// Bahasa CSV Reference:
//   Tabayyun      → Critical Validation / Verification
//   Amanah        → Visual Integrity / Data Honesty
//   Tawazun       → Data Balance / Objectivity
//   Anomali Data  → Data Anomaly / Outlier
// ============================================================

export const locales = {
  id: {
    // ── App Meta ──────────────────────────────────────────
    appName: 'STATSLAB',
    appFullName: 'StatsLab – Dasbor Statistika Interaktif',
    appTagline: 'Belajar Statistika dengan Nilai Keislaman',
    // ── Onboarding ────────────────────────────────────────
    landing: {
      heroTitle: 'Statistika dengan Nilai Keislaman',
      heroSubtitle: 'Platform interaktif untuk memahami literasi data melalui konteks Filantropi Islam (Ziswaf, Tahfizh, Qurban).',
      feature1Title: 'Gamifikasi 6 Level',
      feature1Desc: 'Selesaikan tantangan analitis dan kumpulkan badge literasi data.',
      feature2Title: 'Tabayyun & Amanah',
      feature2Desc: 'Integrasi nilai Islam dalam verifikasi data (Tabayyun) dan integritas visual (Amanah).',
      feature3Title: 'Expert Validation',
      feature3Desc: 'Dilengkapi portal khusus (Researcher Portal) bagi auditor & validator.',
      btnExplore: 'Mulai Eksplorasi 🚀',
    },
    onboarding: {
      title: 'Selamat Datang di STATSLAB',
      subtitle: 'Isi identitasmu dulu ya, sebelum mulai belajar! 🌟',
      labelNama: 'Nama Lengkap',
      labelKelas: 'Kelas',
      labelSekolah: 'Nama Sekolah / Institusi',
      labelGuru: 'Nama Guru Pembimbing',
      placeholderNama: 'Contoh: Ahmad Fauzi',
      placeholderKelas: 'Contoh: VIII-A',
      placeholderSekolah: 'Contoh: MTs Nurul Iman',
      placeholderGuru: 'Contoh: Bpk. Khoiruzzad, M.Pd.',
      btnStart: 'Mulai Belajar! 🚀',
      required: 'Wajib diisi',
      freshStart: 'Mulai dari Nol',
      freshStartDesc: 'Hapus progres & data lama (Disarankan untuk Responden Baru)',
    },

    // ── Navigation ────────────────────────────────────────
    nav: {
      modules: 'Modul Belajar',
      ziswaf: 'Ziswaf & Keadilan',
      tahfizh: "Mutaba'ah Tahfizh",
      qurban: 'Distribusi Qurban',
      literasi: 'Literasi Perpustakaan',
      progress: 'Progres Saya',
      certificate: 'Sertifikat',
      evalSUS: 'Evaluasi Kepraktisan',
      help: 'Bantuan',
    },

    // ── Stats Labels ──────────────────────────────────────
    stats: {
      mean: 'Rata-rata (Mean)',
      median: 'Nilai Tengah (Median)',
      modus: 'Nilai Terbanyak (Modus)',
      min: 'Nilai Min',
      max: 'Nilai Max',
      count: 'Jumlah Data',
      sum: 'Total',
    },

    // ── Table ─────────────────────────────────────────────
    table: {
      id: 'No',
      value: 'Nilai',
      category: 'Kategori',
      nominal: 'Nominal (Rp)',
      bulan: 'Bulan',
      halaman: 'Halaman / Juz',
      desa: 'Desa / Wilayah',
      target: 'Target',
      realisasi: 'Realisasi',
      jumlah: 'Jumlah Buku',
      addRow: '+ Tambah Baris',
      deleteRow: 'Hapus',
    },

    // ── Tabayyun ──────────────────────────────────────────
    tabayyun: {
      title: '⚠️ Tabayyun: Anomali Data Terdeteksi!',
      body: 'Wah, Rata-ratanya jauh banget dari Nilai Tengah! Yuk kita Tabayyun, sepertinya ada data yang jomplang (Anomali Data / Outlier) nih. Sebagai Muslim yang baik, kita perlu memverifikasi data sebelum mengambil kesimpulan.',
      badge: 'Tabayyun',
      formula: 'Syarat: |Mean − Median| > Median × 0.3',
      found: 'Terdeteksi',
      notFound: 'Data tampak seimbang ✅',
    },

    // ── Amanah ────────────────────────────────────────────
    amanah: {
      toggleLabel: 'Amanah (Integritas Visual)',
      onLabel: 'Skala Amanah (dari Nol)',
      offLabel: 'Skala Bias (Dipotong)',
      description: 'Grafik yang "dipotong" sumbunya bisa menyesatkan! Aktifkan Integritas Visual untuk melihat data secara jujur.',
      tooltip: 'Uji Manipulasi Skala (Scale Manipulation Test)',
    },
    help: {
      title: 'Pusat Literasi & Panduan',
      subtitle: 'StatsLab v1.0 • Academic Research Edition',
      theoryTitle: 'Literasi & Teori Statistika',
      meanTitle: 'Mean (Rata-rata)',
      meanFormula: 'x̄ = (Σ xᵢ) / n',
      meanDesc: 'Mean adalah nilai rata-rata hitung. Sangat berguna untuk melihat tren umum, namun sangat sensitif terhadap nilai ekstrem (outlier).',
      medianTitle: 'Median (Nilai Tengah)',
      medianFormula: 'Me = x[(n+1)/2]',
      medianDesc: 'Median adalah nilai tengah data yang telah diurutkan. Median lebih robust (kebal) terhadap data pencilan dibanding Mean.',
      tabayyunTitle: 'Deteksi Anomali (Tabayyun)',
      tabayyunFormula: 'Anomali = |Mean - Median| > (30% * Median)',
      tabayyunDesc: 'Jika selisih Mean dan Median melebihi 30% dari nilai Median, sistem menganggap ada ketimpangan data yang signifikan yang perlu diperiksa (Tabayyun).',
      gamifyTitle: 'Tahapan Belajar (Gamifikasi)',
      gamifyDesc: 'Selesaikan misi secara sekuensial untuk mendapatkan Sertifikat Auditor Muda:',
      steps: [
        { lvl: 1, title: 'Eksplorasi Dasbor', desc: 'Membuka aplikasi dan memahami antarmuka utama.' },
        { lvl: 2, title: 'Input & Manipulasi Data', desc: 'Coba ubah angka di tabel untuk melihat perubahan visual.' },
        { lvl: 3, title: 'Navigasi Multi-Modul', desc: 'Buka modul selain Ziswaf (Tahfizh, Qurban, Literasi).' },
        { lvl: 4, title: 'Analisis Statistik Dasar', desc: 'Klik salah satu kartu statistik (Mean/Median/Modus) untuk detail.' },
        { lvl: 5, title: 'Investigasi Tabayyun', desc: 'Temukan anomali data dan klik tombol "Konfirmasi Temuan".' },
        { lvl: 6, title: 'Integritas Visual (Amanah)', desc: 'Gunakan saklar Skala Amanah untuk memperbaiki bias visual.' },
      ],
      footerBtn: 'SAYA MENGERTI, LANJUTKAN BELAJAR',
    },

    // ── Gamification ──────────────────────────────────────
    gamify: {
      level: 'Level',
      points: 'Poin',
      badges: 'Badge',
      yourLevel: 'Level Literasimu',
      levels: {
        1: 'Idiosinkratik',
        2: 'Kolokuial',
        3: 'Tidak Konsisten',
        4: 'Konsisten Non-Kritis',
        5: 'Kritis',
        6: 'Kritis Matematis',
      },
      unlockMsg: {
        2: 'Bagus! Kamu berhasil mengedit data. +10 Poin! 🎉',
        3: 'Hebat! Kamu menjelajahi modul baru. +20 Poin! 🌟',
        4: 'Keren! Kamu membaca hasil statistika. +20 Poin! 📊',
        5: 'Luar biasa! Kamu menemukan Anomali Data! +50 Poin & Badge Detektif! 🔍',
        6: 'Sempurna! Kamu memahami bias grafik! +50 Poin & Badge Jujur Visual! 🏆',
      },
      badgeDetektif: 'Detektif Anomali',
      badgeJujur: 'Jujur Visual',
      badgeDetektifDesc: 'Berhasil mendeteksi Anomali Data / Outlier pada data Ziswaf',
      badgeJujurDesc: 'Memahami dan menguji manipulasi skala grafik (Amanah)',
      maxPoints: 150,
      certificateUnlock: 'Cetak sertifikat tersedia setelah Level 6',
    },

    // ── Certificate ───────────────────────────────────────
    certificate: {
      title: 'Sertifikat Penghargaan',
      subtitle: 'Certificate of Achievement',
      body: 'Diberikan kepada',
      class: 'Kelas',
      school: 'Institusi',
      teacher: 'Guru Pembimbing',
      achievement: 'Telah berhasil menyelesaikan',
      productName: 'StatsLab – Dasbor Statistika Interaktif',
      levelAchieved: 'Capaian Level Literasi Data',
      scoreLabel: 'Skor Tabayyun',
      badgesLabel: 'Badge Integritas',
      date: 'Tanggal Cetak',
      signatureAdmin: 'Peneliti Utama',
      signatureTeacher: 'Guru Pembimbing',
      printBtn: 'Cetak Sertifikat (A4)',
      lockedMsg: 'Selesaikan hingga Level 6 untuk mencetak sertifikat!',
    },

    // ── Module Contexts ───────────────────────────────────
    modules: {
      ziswaf: {
        title: 'Ziswaf & Keadilan Distribusi',
        desc: 'Pelajari Mean dari data distribusi Zakat, Infaq, Shadaqah, dan Wakaf (Ziswaf) di komunitasmu.',
        focus: 'Fokus: Rata-rata (Mean)',
        chartType: 'Pie Chart',
        context: 'Data ini menggambarkan distribusi dana Ziswaf kepada mustahiq (penerima manfaat).',
      },
      tahfizh: {
        title: "Mutaba'ah Tahfizh – Istiqomah",
        desc: 'Pelajari Median dari data progress hafalan Al-Qur\'an selama beberapa bulan.',
        focus: 'Fokus: Nilai Tengah (Median)',
        chartType: 'Line Chart',
        context: 'Data ini mencerminkan konsistensi (istiqomah) dalam menghafal Al-Qur\'an.',
      },
      qurban: {
        title: 'Distribusi Qurban – Ketimpangan',
        desc: 'Pelajari Modus dari data realisasi distribusi hewan Qurban ke berbagai desa.',
        focus: 'Fokus: Nilai Terbanyak (Modus)',
        chartType: 'Bar Chart',
        context: 'Data ini menggambarkan ketimpangan distribusi Qurban antar wilayah.',
      },
      literasi: {
        title: 'Literasi Perpustakaan – Frekuensi',
        desc: 'Pelajari Modus dan Frekuensi dari data kategori buku yang paling banyak dipinjam.',
        focus: 'Fokus: Modus & Frekuensi',
        chartType: 'Horizontal Bar',
        context: 'Data ini mencerminkan minat literasi siswa berdasarkan kategori buku.',
      },
    },

    // ── UI Misc ───────────────────────────────────────────
    ui: {
      darkMode: 'Mode Gelap',
      lightMode: 'Mode Terang',
      language: 'Bahasa',
      loading: 'Memuat...',
      edit: 'Edit',
      save: 'Simpan',
      cancel: 'Batal',
      reset: 'Reset',
      close: 'Tutup',
      back: 'Kembali',
      next: 'Lanjut',
      confirm: 'Konfirmasi',
      adminReset: 'Reset Data',
      adminResetConfirm: 'Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.',
    },

    // ── Tawazun (Balance principle hint) ─────────────────
    tawazun: 'Tawazun (Keseimbangan): Jangan terburu menyimpulkan dari satu angka saja. Lihat Mean, Median, dan Modus bersama-sama!',
  },

  en: {
    // ── App Meta ──────────────────────────────────────────
    appName: 'STATSLAB',
    appFullName: 'StatsLab – Interactive Statistics Dashboard',
    appTagline: 'Learning Statistics with Islamic Values',
    // ── Onboarding ────────────────────────────────────────
    landing: {
      heroTitle: 'Statistics with Islamic Values',
      heroSubtitle: 'An interactive platform to understand data literacy through Islamic Philanthropy (Ziswaf, Tahfizh, Qurban).',
      feature1Title: '6-Level Gamification',
      feature1Desc: 'Complete analytical challenges and collect data literacy badges.',
      feature2Title: 'Tabayyun & Amanah',
      feature2Desc: 'Integrating Islamic values in data verification (Tabayyun) and visual integrity (Amanah).',
      feature3Title: 'Expert Validation',
      feature3Desc: 'Equipped with a dedicated portal (Researcher Portal) for auditors & validators.',
      btnExplore: 'Start Exploring 🚀',
    },
    onboarding: {
      title: 'Welcome to STATSLAB',
      subtitle: "Let's fill in your identity before we start! 🌟",
      labelNama: 'Full Name',
      labelKelas: 'Class / Grade',
      labelSekolah: 'School / Institution Name',
      labelGuru: 'Supervising Teacher',
      placeholderNama: 'e.g. Ahmad Fauzi',
      placeholderKelas: 'e.g. Grade 8-A',
      placeholderSekolah: 'e.g. MTs Nurul Iman',
      placeholderGuru: "e.g. Mr. Khoiruzzad, M.Pd.",
      btnStart: 'Start Learning! 🚀',
      required: 'Required',
      freshStart: 'Fresh Start',
      freshStartDesc: 'Clear previous progress & data (Recommended for New Respondents)',
    },

    // ── Navigation ────────────────────────────────────────
    nav: {
      modules: 'Learning Modules',
      ziswaf: 'Ziswaf & Justice',
      tahfizh: 'Tahfizh Tracking',
      qurban: 'Qurban Distribution',
      literasi: 'Library Literacy',
      progress: 'My Progress',
      certificate: 'Certificate',
      evalSUS: 'Usability Evaluation',
      help: 'Help',
    },

    // ── Stats Labels ──────────────────────────────────────
    stats: {
      mean: 'Mean (Average)',
      median: 'Median (Middle Value)',
      modus: 'Mode (Most Frequent)',
      min: 'Min Value',
      max: 'Max Value',
      count: 'Data Count',
      sum: 'Total',
    },

    // ── Table ─────────────────────────────────────────────
    table: {
      id: 'No',
      value: 'Value',
      category: 'Category',
      nominal: 'Amount (Rp)',
      bulan: 'Month',
      halaman: 'Pages / Juz',
      desa: 'Village / Region',
      target: 'Target',
      realisasi: 'Realization',
      jumlah: 'Book Count',
      addRow: '+ Add Row',
      deleteRow: 'Delete',
    },

    // ── Tabayyun ──────────────────────────────────────────
    tabayyun: {
      title: '⚠️ Tabayyun (Verification): Extreme Data Anomaly Detected!',
      body: 'The Mean is very far from the Median! Let\'s do Tabayyun (Critical Validation) — there seems to be an extreme value (Data Anomaly / Outlier). As Muslims, we must verify data before drawing conclusions.',
      badge: 'Verification',
      formula: 'Condition: |Mean − Median| > Median × 0.3',
      found: 'Detected',
      notFound: 'Data appears balanced ✅',
    },

    // ── Amanah ────────────────────────────────────────────
    amanah: {
      toggleLabel: 'Amanah (Visual Integrity)',
      onLabel: 'Honest Scale (from Zero)',
      offLabel: 'Biased Scale (Truncated)',
      description: 'A "truncated" chart axis can be misleading! Enable Visual Integrity (Amanah) to view data honestly.',
      tooltip: 'Scale Manipulation Test (Uji Manipulasi Skala)',
    },
    help: {
      title: 'Literacy Center & Guide',
      subtitle: 'StatsLab v1.0 • Academic Research Edition',
      theoryTitle: 'Statistical Literacy & Theory',
      meanTitle: 'Mean (Average)',
      meanFormula: 'x̄ = (Σ xᵢ) / n',
      meanDesc: 'Mean is the average value. Highly useful for general trends, but extremely sensitive to outliers.',
      medianTitle: 'Median (Middle Value)',
      medianFormula: 'Me = x[(n+1)/2]',
      medianDesc: 'Median is the middle value of sorted data. It is more robust against outliers than Mean.',
      tabayyunTitle: 'Anomaly Detection (Tabayyun)',
      tabayyunFormula: 'Anomaly = |Mean - Median| > (30% * Median)',
      tabayyunDesc: 'If the difference between Mean and Median exceeds 30% of the Median, the system identifies a significant data imbalance requiring verification (Tabayyun).',
      gamifyTitle: 'Learning Stages (Gamification)',
      gamifyDesc: 'Complete missions sequentially to earn the Junior Auditor Certificate:',
      steps: [
        { lvl: 1, title: 'Dashboard Exploration', desc: 'Open the app and understand the main interface.' },
        { lvl: 2, title: 'Data Input & Manipulation', desc: 'Try changing numbers in the table to see visual updates.' },
        { lvl: 3, title: 'Multi-Module Navigation', desc: 'Explore modules beyond Ziswaf (Tahfizh, Qurban, Literacy).' },
        { lvl: 4, title: 'Basic Statistical Analysis', desc: 'Click any statistical card (Mean/Median/Mode) for details.' },
        { lvl: 5, title: 'Tabayyun Investigation', desc: 'Find a data anomaly and click the "Confirm Findings" button.' },
        { lvl: 6, title: 'Visual Integrity (Amanah)', desc: 'Use the Amanah Scale switch to fix visual bias.' },
      ],
      footerBtn: 'I UNDERSTAND, CONTINUE LEARNING',
    },

    // ── Gamification ──────────────────────────────────────
    gamify: {
      level: 'Level',
      points: 'Points',
      badges: 'Badges',
      yourLevel: 'Your Data Literacy Level',
      levels: {
        1: 'Idiosyncratic',
        2: 'Colloquial',
        3: 'Inconsistent',
        4: 'Consistent Non-Critical',
        5: 'Critical',
        6: 'Critical Mathematical',
      },
      unlockMsg: {
        2: 'Great! You edited the data. +10 Points! 🎉',
        3: 'Awesome! You explored a new module. +20 Points! 🌟',
        4: 'Nice! You read the statistics results. +20 Points! 📊',
        5: 'Amazing! You found a Data Anomaly! +50 Points & Badge! 🔍',
        6: 'Perfect! You understood chart bias! +50 Points & Badge! 🏆',
      },
      badgeDetektif: 'Anomaly Detective',
      badgeJujur: 'Visual Integrity',
      badgeDetektifDesc: 'Successfully detected a Data Anomaly / Outlier in Ziswaf data',
      badgeJujurDesc: 'Understood and tested chart scale manipulation (Amanah)',
      maxPoints: 150,
      certificateUnlock: 'Certificate available after reaching Level 6',
    },

    // ── Certificate ───────────────────────────────────────
    certificate: {
      title: 'Certificate of Achievement',
      subtitle: 'Sertifikat Penghargaan',
      body: 'Awarded to',
      class: 'Class',
      school: 'Institution',
      teacher: 'Supervising Teacher',
      achievement: 'Has successfully completed',
      productName: 'StatsLab – Interactive Statistics Dashboard',
      levelAchieved: 'Data Literacy Level Achieved',
      scoreLabel: 'Tabayyun (Verification) Score',
      badgesLabel: 'Integrity Badges',
      date: 'Print Date',
      signatureAdmin: 'Principal Researcher',
      signatureTeacher: 'Supervising Teacher',
      printBtn: 'Print Certificate (A4)',
      lockedMsg: 'Complete up to Level 6 to print your certificate!',
    },

    // ── Module Contexts ───────────────────────────────────
    modules: {
      ziswaf: {
        title: 'Ziswaf & Distribution Justice',
        desc: 'Learn about Mean from Zakat, Infaq, Shadaqah, and Wakaf (Ziswaf) distribution data.',
        focus: 'Focus: Mean (Average)',
        chartType: 'Pie Chart',
        context: 'This data represents the distribution of Ziswaf funds to mustahiq (beneficiaries).',
      },
      tahfizh: {
        title: 'Tahfizh Tracking – Consistency',
        desc: "Learn about Median from Al-Qur'an memorization progress data over several months.",
        focus: 'Focus: Median (Middle Value)',
        chartType: 'Line Chart',
        context: "This data reflects consistency (istiqomah) in memorizing the Qur'an.",
      },
      qurban: {
        title: 'Qurban Distribution – Inequality',
        desc: 'Learn about Mode from Qurban animal distribution data across various villages.',
        focus: 'Focus: Mode (Most Frequent)',
        chartType: 'Bar Chart',
        context: 'This data illustrates inequality in Qurban distribution across regions.',
      },
      literasi: {
        title: 'Library Literacy – Frequency',
        desc: 'Learn about Mode and Frequency from the most borrowed book category data.',
        focus: 'Focus: Mode & Frequency',
        chartType: 'Horizontal Bar',
        context: "This data reflects students' reading interests by book category.",
      },
    },

    // ── UI Misc ───────────────────────────────────────────
    ui: {
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      language: 'Language',
      loading: 'Loading...',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      reset: 'Reset',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      adminReset: 'Reset Data',
      adminResetConfirm: 'Are you sure you want to delete all data? This cannot be undone.',
    },

    // ── Tawazun ───────────────────────────────────────────
    tawazun: "Tawazun (Data Balance / Objectivity): Don't rush to conclusions from just one number. Look at Mean, Median, and Mode together!",
  },
}
