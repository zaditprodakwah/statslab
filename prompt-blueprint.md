# **📊 StatsLab: Antigravity Edition**

**Research-Grade Interactive Statistics Dashboard with Islamic Epistemology & CLT Scaffolding**

## **📖 1\. PROJECT OVERVIEW & RESEARCH CONTEXT**

**StatsLab** adalah *Single Page Application* (SPA) luring-pertama (*offline-first*) yang dirancang sebagai produk luaran Skripsi R\&D (Model 4D). Produk ini mengintegrasikan *Cognitive Load Theory* (CLT), Epistemologi Islam, dan Hierarki Literasi Data Watson-Callingham.

* **Metodologi Riset:** Model 4D (Thiagarajan). Fokus pada Validitas Pakar dan Uji Kepraktisan (*System Usability Scale* / SUS) tanpa eksperimen massal.  
* **Tujuan Luaran:** Prototipe final untuk Publikasi Jurnal Terakreditasi SINTA.  
* **Batasan Sistem:** 100% *Client-Side*. Tidak menggunakan API eksternal, *database*, atau *backend* terpusat. Mengandalkan localStorage API.

## **👥 2\. STAKEHOLDER INTERFACES & UI/UX DESIGN**

Sistem harus memiliki antarmuka, komponen, dan *copywriting* yang secara khusus melayani 4 kelompok pengguna berikut:

### **A. Pengguna (Siswa: Remaja 13-15 Tahun)**

* **Kebutuhan UI/UX:** *Progressive disclosure* (informasi muncul bertahap), warna menyejukkan (*Emerald/Slate*), animasi *smooth* 400ms, dan navigasi multi-input (*keyboard/touch/mouse*).  
* **Copywriting:** Ramah, memotivasi, dan tidak menggurui.  
  * *Contoh Alert Tabayyun:* "⚠️ Wah, Rata-ratanya jauh banget dari Nilai Tengah\! Yuk kita Tabayyun, sepertinya ada data yang jomplang (Outlier) nih."  
* **Komponen Khusus:** Layar *Onboarding* (Input Nama/Kelas), Panel Gamifikasi (Level & Poin), dan Kanvas Interaktif (Tabel sinkron dengan Grafik).

### **B. Stakeholder (Guru & Sekolah)**

* **Kebutuhan UI/UX:** Tampilan formal, berwibawa, dan siap cetak.  
* **Komponen Khusus:** \<CertificateGenerator /\>. Layar khusus yang hanya terbuka di Level 6\. Dilengkapi CSS @media print murni untuk format A4.  
* **Data yang Ditampilkan:** Nama Institusi (Dinamis), Nama Guru Pembimbing, Rekam Jejak Level Literasi Siswa, Skor Tabayyun, dan Capaian Integritas Data (Badges).

### **C. Peneliti Utama / Admin (Anda)**

* **Kebutuhan UI/UX:** Akses cepat ke kontrol evaluasi tanpa mengganggu pengalaman siswa.  
* **Komponen Khusus:** 1\. **Evaluation Hook:** Tombol "Evaluasi Kepraktisan (SUS)" di Navbar yang menavigasi ke Google Form peneliti.  
  2\. **Hidden Admin Tool:** Tombol kecil/tersembunyi (misal: di *footer* logo) bertuliskan "Reset Data". Berfungsi menjalankan localStorage.clear() dan me-*reload* halaman. Sangat krusial saat mengujikan 1 perangkat ke banyak siswa secara bergantian.

### **D. Peneliti & Pengembang Lain (Open Source/Peer Reviewers)**

* **Kebutuhan UI/UX:** Kode yang modular, terdokumentasi, dan arsitektur *logic* yang terpisah dari antarmuka visual.  
* **Komponen Khusus:** Struktur direktori yang jelas (pemisahan folder /hooks, /components, /data) agar pengembang lain mudah meng- *fork* atau menambah modul dataset baru tanpa merusak *state* utama.

## **🤖 3\. SYSTEM INSTRUCTION FOR AI CODER (THE PROMPT)**

**ACT AS:** Senior Staff Frontend Engineer, UI/UX Accessibility Expert, dan Educational Technology Architect. Eksekusi kode secara utuh, kokoh, dan tanpa halusinasi data.

### **3.1 Strict Engineering Protocol**

1. **Zero CLS:** *Cumulative Layout Shift* \= 0\. Gunakan *skeleton* atau kontainer dengan dimensi (height/width) tetap.  
2. **Sub-50ms Reactivity:** Perubahan input tabel harus memicu *re-render* grafik secara instan (*Dual Coding Theory*). Wajib gunakan useMemo untuk kalkulasi useStats.  
3. **Tech Stack:** React.js 18+ (Vite), Tailwind CSS (*Glassmorphism*: bg-white/80 backdrop-blur-md), chart.js & react-chartjs-2, lucide-react.  
4. **Universal Design:** Sakelar Dark/Light Mode (memanipulasi class dark di \<html\>) dan Font Scaler (A-/A/A+). Seluruh elemen \<button\>/\<input\> wajib memiliki tabIndex dan focus:ring-2 focus:ring-emerald-500.

### **3.2 Directory & Relational Structure**

src/  
├── components/  
│   ├── layout/       (Header, Sidebar, MainLayout, WelcomeScreen)  
│   ├── modules/      (ZiswafModule, TahfizhModule, QurbanModule, LiterasiModule)  
│   ├── ui/           (TabayyunAlert, AmanahToggle, StatCard, DataTable, AdminReset)  
│   ├── gamification/ (BadgeGallery, LevelProgressBar)  
│   └── certificate/  (CertificateView, PrintButton)  
├── hooks/  
│   ├── useStats.js   (Logic: Mean, Median, Modus aggregator)  
│   ├── useTabayyun.js(Logic: Mendeteksi Math.abs(Mean \- Median) \> Median \* 0.3)  
│   ├── useAmanah.js  (Logic: Mengontrol options.scales.y.min Chart.js)  
│   ├── useGamify.js  (Logic: Manajemen Poin & Level \-\> localStorage)  
│   └── useProfile.js (Logic: Simpan Identitas Siswa \-\> localStorage)  
├── data/  
│   └── presetData.js (JSON Arrays default)  
└── App.jsx

## **🗄️ 4\. RAW DATASETS & THEMATIC MODULES**

Gunakan *array* JSON persis seperti di bawah ini sebagai *default state*. **Jangan berhalusinasi mengarang angka sendiri**, karena angka ini telah disesuaikan agar algoritma useTabayyun terpicu.

**1\. ZISWAF (Keadilan Distribusi) \- Pie Chart (Fokus: Mean)**

\[  
  { "id": 1, "kategori": "Fakir", "nominal": 500000 },  
  { "id": 2, "kategori": "Miskin", "nominal": 450000 },  
  { "id": 3, "kategori": "Fisabilillah", "nominal": 5000000 }  
\]

*(Nilai Fisabilillah sengaja di-set 5.000.000 sebagai Outlier untuk mendemonstrasikan peringatan Tabayyun).*

**2\. Mutaba'ah Tahfizh (Istiqomah) \- Line Chart (Fokus: Median)**

\[  
  { "id": 1, "bulan": "Juli", "halaman": 15 },  
  { "id": 2, "bulan": "Agustus", "halaman": 18 },  
  { "id": 3, "bulan": "September", "halaman": 6 },  
  { "id": 4, "bulan": "Oktober", "halaman": 20 }  
\]

**3\. Distribusi Qurban (Ketimpangan) \- Bar Chart (Fokus: Modus)**

\[  
  { "id": 1, "desa": "Sukamaju", "target": 50, "realisasi": 48 },  
  { "id": 2, "desa": "Sukarame", "target": 30, "realisasi": 10 },  
  { "id": 3, "desa": "Mekarsari", "target": 40, "realisasi": 40 }  
\]

**4\. Demografi Literasi Perpustakaan \- Horizontal Bar (Fokus: Modus & Frekuensi)**

\[  
  { "id": 1, "kategori": "Fiqh", "jumlah": 45 },  
  { "id": 2, "kategori": "Aqidah", "jumlah": 50 },  
  { "id": 3, "kategori": "Sains", "jumlah": 12 },  
  { "id": 4, "kategori": "Sejarah Islam", "jumlah": 20 }  
\]

## **🎮 5\. ASSESSMENT INTEGRATION & SCORING RUBRIC**

Sistem useGamify.js akan mengelola transisi 6 Level Literasi (Watson & Callingham) dengan aturan mutlak:

| Level | Nama Status (Hierarki) | Kondisi Terbuka (Unlock Trigger) | Reward |
| :---- | :---- | :---- | :---- |
| **Lvl 1** | **Idiosinkratik** | Default saat form *Onboarding* selesai. | 0 Pts |
| **Lvl 2** | **Colloquial** | User berhasil mengubah/mengedit 1 baris angka di DataTable. | \+10 Pts |
| **Lvl 3** | **Inconsistent** | User melakukan navigasi membuka Modul Visualisasi ke-2. | \+20 Pts |
| **Lvl 4** | **Consistent Non-Critical** | User membaca Kartu \<StatCard\> hasil hitungan Mean/Median. | \+20 Pts |
| **Lvl 5** | **Critical** | User berhasil memicu munculnya \<TabayyunAlert /\> pada data ZISWAF. | \+50 Pts & Badge *Detektif Anomali* |
| **Lvl 6** | **Critical Mathematical** | User berinteraksi dengan \<AmanahToggle /\> (memahami bias grafik). | \+50 Pts & Badge *Jujur Visual* |

*(Maksimal Poin: 150 Pts. Pencetakan \<CertificateGenerator /\> hanya diizinkan aktif setelah status mencapai Lvl 6).*

## **🚀 6\. BUILD, DEPLOYMENT, & MAINTENANCE PROTOCOL**

### **A. Local Setup (Inisiasi Build)**

npm create vite@latest statslab-app \-- \--template react  
cd statslab-app  
npm install tailwindcss postcss autoprefixer chart.js react-chartjs-2 lucide-react  
npx tailwindcss init \-p  
npm run dev

### **B. Deployment untuk Publikasi Jurnal (SINTA)**

Reviewer jurnal membutuhkan tautan aktif untuk menilai produk.

1. Hubungkan repositori lokal ke GitHub.  
2. Gunakan **Vercel** atau **Netlify** ![][image1] *Import GitHub Repository*.  
3. Framework Vite akan otomatis terdeteksi. Klik *Deploy*.  
4. Gunakan tautan yang dihasilkan (misal: statslab.vercel.app) ke dalam draf naskah publikasi Anda.

### **C. Protokol Uji Coba Terbatas (Maintenance Lapangan)**

Saat melakukan evaluasi kepraktisan (menggunakan instrumen SUS) secara tatap muka:

1. Sediakan satu perangkat keras (Tablet/Laptop) yang sudah membuka aplikasi.  
2. Persilakan Responden 1 bereksplorasi hingga meraih sertifikat dan mengisi tautan SUS di Header.  
3. **PENTING (Tugas Admin):** Klik tombol tersembunyi "Reset Data" di bagian bawah layar, ATAU hapus secara manual via *Browser Developer Tools* ![][image1] *Application* ![][image1] *Local Storage* ![][image1] *Clear*.  
4. Muat ulang halaman, lalu berikan perangkat kepada Responden 2\. Ini menjamin data pengujian tidak tercampur.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAAAdUlEQVR4XmNgGAWjgHpAXl5+L7oY2QBo2D90MbKBnJycDRCXoYuTDYCuO6egoGCOLs4gKytrQg4GGnYLaOg+dMP8yMFAg66BMNAIFhQDSQVAV00EGuSNLk4yABqiCDSsE12cLAA07BO6GNkAaNhhdLFRMNwAADgJIGwPRW62AAAAAElFTkSuQmCC>