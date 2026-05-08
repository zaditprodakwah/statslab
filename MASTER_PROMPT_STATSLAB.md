# **🤖 AI CODER DIRECTIVE: STATSLAB FINAL SYSTEM INTEGRATION**

**Project:** StatsLab \- Dasbor Statistika Interaktif (R\&D Edition)

**Role:** Senior Frontend Architect & Educational Technologist

**Objective:** Finalisasi UI/UX, Sinkronisasi Indikator Proposal, dan Pembangunan *In-App Documentation*.

## **⚠️ MANDATORY INSTRUCTION (BACA SEBELUM CODING)**

Di dalam *workspace* ini, terdapat dua file referensi utama:

1. prompt-blueprint.md (Arsitektur dasar & dataset mutlak).  
2. proposal.md (Dokumen riset Bab III).

**Tugas Utama Anda:** Hentikan penggunaan teks *placeholder* (seperti "Indikator 01", "Indikator 02") di halaman Validasi Pakar. Anda **WAJIB** membaca file proposal.md dan mengekstrak teks asli dari tabel kisi-kisi instrumen untuk diimplementasikan ke dalam UI.

## **🛠️ TAHAP 1: SINKRONISASI EXPERT VALIDATION HUB**

Modifikasi komponen ExpertHub.jsx (atau sejenisnya di dalam Portal Admin).

1. **Mapping Indikator:**  
   Tarik data dari proposal.md dan konversikan menjadi array objek konstan di dalam kode.  
   * **Tab Ahli Materi:** Gunakan pernyataan dari **Tabel 3.1** (Aspek Kualitas Isi, Literasi, Penyajian).  
   * **Tab Ahli Media:** Gunakan pernyataan dari **Tabel 3.2** (Aspek Desain Visual, Interaktivitas, Navigasi, Beban Kognitif).  
   * **Tab Ahli Agama (Integrasi Islam):** Gunakan pernyataan dari **Tabel 3.3** (Aspek Tabayyun, Amanah, Konteks Konten).  
2. **Mekanisme Form:**  
   * Setiap indikator menggunakan Dropdown/Radio Button Skala Likert 1-5 (Sangat Kurang s.d. Sangat Layak).  
   * Sertakan kolom \<textarea\> opsional di bawah setiap kategori untuk "Catatan/Saran Revisi".  
3. **Print-Ready Export (Crucial):**  
   * Tombol "Cetak PDF" wajib menggunakan CSS @media print.  
   * Saat dicetak: Halaman harus berformat A4 monokrom, menyembunyikan semua tombol navigasi web, menampilkan seluruh teks indikator secara penuh (tidak terpotong), dan menyertakan "Ruang Tanda Tangan Basah" (Nama Kota, Tanggal, Nama Validator, NIP) di bagian paling bawah.

## **📚 TAHAP 2: PEMBANGUNAN "IN-APP DOCUMENTATION"**

Sistem harus memiliki panduan operasional (TOR/TOS) yang terintegrasi di dalam antarmuka UI. Bangun komponen \<HelpModal /\> atau \<DocumentationHub /\> yang merender konten berbeda berdasarkan peran pengguna.

### **A. Tampilan untuk Siswa (Akses dari Header Utama)**

Buat tombol "Bantuan / Cara Bermain" di Navbar siswa. Tampilkan UI *Modal* dengan poin berikut:

* **Eksplorasi Data:** "Ubah angka pada tabel di bawah grafik untuk melihat perubahan visual secara langsung."  
* **Misi Utama:** "Capai Level 6 dengan mendeteksi anomali data (Nilai tidak wajar) dan memastikan grafik jujur (tidak memanipulasi sumbu Y)."  
* **Fitur Tabayyun & Amanah:** Berikan *tooltip* penjelasan singkat bahwa Tabayyun adalah mengecek kebenaran data, dan Amanah adalah menyajikan data tanpa manipulasi.  
* **Sertifikat & Evaluasi:** "Sertifikat dan Form Evaluasi hanya dapat diakses setelah kamu menyelesaikan misi (Mencapai Level 6)."

### **B. Tampilan untuk Peneliti/Admin (Akses di Portal Admin)**

Di dalam /researcher-only (setelah *Magic Entry* klik logo 5x), sediakan tab "Knowledge Base / Admin Guide" yang berisi:

* **Magic Entry:** Penjelasan bahwa sistem dikunci dengan klik 5x pada logo.  
* **Data Persistence:** Penjelasan bahwa profil siswa disimpan di localStorage untuk kecepatan akses (*Offline-first*).  
* **Reset Protocol:** Instruksi tegas: *"Gunakan tombol RESET DATA sebelum memberikan perangkat ke responden uji coba berikutnya agar profil tidak tercampur."*  
* **SheetDB Flow:** Penjelasan bahwa skor SUS dikalkulasi otomatis dan dikirim ke Google Sheets (Tampilkan status API *Connected/Disconnected*).  
* **God Mode:** Penjelasan fungsi tombol *Simulation Mode* (Bypass ke Level 6 instan untuk demonstrasi sidang).

### **C. Tampilan untuk Validator (Akses di Portal Admin)**

Di dalam Tab Validasi, berikan *Header Info* atau pemberitahuan UI sebelum form dimulai:

* **Tujuan:** "Formulir ini bertujuan untuk mengukur validitas media (Indeks Aiken's V) berdasarkan Model Pengembangan 4D."  
* **Instruksi:** "Mohon berikan skor 1 hingga 5 pada setiap indikator yang disediakan berdasarkan pengalaman Anda mengeksplorasi StatsLab."  
* **Output:** "Setelah selesai, klik tombol 'Cetak PDF' di bagian bawah untuk mengunduh lembar pengesahan yang siap ditandatangani."

## **⚡ TAHAP 3: PROTOKOL TEKNIS & PERFORMA (ANTIGRAVITY)**

Pastikan kode yang Anda tulis mematuhi standar berikut:

1. **Zero CLS (Cumulative Layout Shift):** Dokumentasi dan Form Validasi yang panjang tidak boleh merusak *layout* saat dimuat. Gunakan *Skeleton Loader* jika memproses *mapping* data yang besar.  
2. **State Management:** Simpan draf isian form Validator ke dalam sessionStorage (contoh: validator\_draft\_materi) agar jika dosen tidak sengaja me-refresh halaman (F5), skor yang sudah diisi tidak hilang.  
3. **i18n (Lokalisasi):** Jika ada UI bahasa Inggris, pastikan terhubung ke locales.js. (Tetapkan istilah Islami seperti *Tabayyun* dan *Amanah* tidak diterjemahkan secara harfiah).

**EXECUTION TRIGGER:** "Saya telah memahami instruksi ini. Saya akan mulai dengan mengekstrak indikator dari proposal.md dan membangun komponen ExpertHub.jsx dengan data asli, lalu mengimplementasikan \<DocumentationHub /\>. Output pertama saya adalah *update* kode untuk portal validator."