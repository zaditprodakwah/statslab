# StatsLab DSI (Dasbor Statistika Interaktif)

> **Wahana Eksplorasi Literasi Data Sosio-Matematika Terintegrasi Nilai Tabayyun & Adl**  
> *Media Pembelajaran Matematika SMP Fase D berbasis Model Pengembangan 4D (Thiagarajan)*  
> **Status:** Teruji Empiris, Sangat Valid (Aiken's $V = 0.85, p < 0.05$) dan Praktis (SUS $= 68.0$, Marginal High / Acceptable)  
> **Akses Laboratorium Daring:** [https://dstatistika.pages.dev/](https://dstatistika.pages.dev/)  
> **Repositori Resmi GitHub:** [https://github.com/zaditprodakwah/statslab](https://github.com/zaditprodakwah/statslab)  
> **Pangkalan Data Terbuka (Kaggle DOI):** [10.34740/kaggle/dsv/22047486](https://doi.org/10.34740/kaggle/dsv/22047486) ([Kaggle Dataset Page](https://www.kaggle.com/datasets/muhzadit/statslab-dsi-empirical-data))  

---

## 🏛️ Latar Belakang & Landasan Metodologis

Aplikasi **StatsLab DSI** dikembangkan sebagai luaran konkret riset Research and Development (R&D) Model 4D (*Define, Design, Develop, Disseminate*) pada Program Studi Tadris Matematika, Institut Al-Bahjah Cirebon, bekerjasama dengan mitra implementasi **SMP Islam Qurani Al Bahjah Cirebon** serta triangulasi lapangan di **SMPN 46 Bandung** dan **SPM Wustha Al-Bahjah Muara Basung Riau**.

1. **Tahap Define (Pendefinisian):**  
   Menjawab krisis literasi data siswa Indonesia (PISA 2022 skor 366 vs rerata OECD 472) serta miskonsepsi kronis yang menyamakan Mean sebagai satu-satunya ukuran pemusatan tanpa memahami kerentanannya terhadap pencilan (*outlier*). Penyelarasan yuridis mengacu langsung pada SK BSKAP No. 033/H/KR/2022 (hal. 147) dan No. 032/H/KR/2024 (hal. 132) terkait capaian analisis perubahan data akibat nilai ekstrem pada Fase D SMP.

2. **Tahap Design (Perancangan):**  
   Menerapkan sistem desain **TasteSkill Warm Editorial** (`#FBF9F5` Warm Ivory, `#1E1B18` Deep Charcoal Umber, `#1B4332` Forest Emerald, `#8F652E` Bronze Ochre) dengan rasio kontras WCAG 2.1 AAA (15.2:1), manipulasi slider reaktif (<16ms) untuk menekan *Split-Attention Effect* (Cognitive Load Theory), serta 8 tugas diagnostik Watson-Callingham dengan rubrik *Partial Credit Model* (PCM).

3. **Tahap Develop (Pengembangan):**  
   - **Validitas Ahli (Aiken's V):** Dinilai oleh 6 dosen ahli lintas materi, media teknologi, dan integrasi nilai Islam dengan 33 butir instrumen, menghasilkan skor validitas isi rata-rata $V = 0.85$ ($p < 0.05$, kategori *Sangat Valid*).  
   - **Kepraktisan Lapangan (SUS):** Diujicobakan pada 4 guru matematika ahli dan 31 siswa Fase D, menghasilkan skor rata-rata kepraktisan guru 83.1% dan skor System Usability Scale (SUS) siswa **68.0** (*Marginal High / Good Usability*).

4. **Tahap Disseminate (Penyebarluasan):**  
   Peluncuran terbuka via Cloudflare Pages (`https://dstatistika.pages.dev/`), repositori kode terbuka GitHub (`zaditprodakwah/statslab`), pangkalan data terbuka Kaggle Datasets (`muhzadit/statslab-dsi-empirical-data`), serta Berita Acara Serah Terima (BAST) media dan modul pendamping resmi kepada sekolah mitra.

---

## 🧭 Fitur Unggulan

- **4 Paket Kasus Sosio-Matematika Kontekstual Santri Cirebon:**
  1. *Laporan Donasi & Infak:* Analisis sumbangan 10 donatur dengan pencilan ekstrem donatur tunggal (Rp 48.500.000) yang menguji nalar tabayyun antara Mean dan Median.
  2. *Panen Raya Kebun Wakaf:* Pencatatan bobot panen sayur hidroponik (kg) untuk menguji keadilan distribusi (QS. Al-Baqarah: 261).
  3. *Setoran Hafalan Santri:* Skor kelancaran makharijul huruf dan tajwid santri (QS. Al-Muzzammil: 4).
  4. *Sirkulasi Kitab Perpustakaan:* Frekuensi peminjaman kitab kuning dan referensi sains (QS. Al-'Alaq: 1-3).
- **Simulasi Interaktif Tabayyun (<16ms):** Menggeser slider data secara waktu-nyata menggerakkan garis Mean menjauhi Median, mendemonstrasikan secara visual keunggulan ketahanan (*robustness*) Median.
- **Sumbu Jujur Toggle (Anti-Truncated Axis):** Pembuktian empiris bagaimana memotong sumbu vertikal grafik dapat memanipulasi persepsi visual pembaca (QS. Al-Muthaffifin).
- **8 Tugas Watson-Callingham (PCM):** Asesmen bertingkat dari Level 1 (Idiosyncratic) hingga Level 6 (Advanced Critical) dengan umpan balik didaktik langsung.
- **Kalkulator SUS Digital:** Evaluasi kepraktisan otomatis berdasarkan standar System Usability Scale (Brooke, 1996).
- **Ekspor Lembar Diagnostik A4:** Format cetak rapi lembar kerja siswa untuk portofolio asesmen formatif guru.

---

## 🛠️ Stack Teknologi

- **Frontend:** React 19, TypeScript 5.7, Vite 6.2, Lucide Icons
- **Styling:** TasteSkill Warm Editorial Vanilla CSS Tokens (bebas pustaka CSS kembung)
- **Backend Edge / API:** Hono 4.7 pada Cloudflare Pages Functions
- **Database:** Cloudflare D1 (SQLite Edge Database)
- **Hosting & CDN:** Cloudflare Pages (`dstatistika.pages.dev`)
- **Pangkalan Data Riset:** Kaggle Datasets (`statslab-dsi-empirical-data`)

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori aplikasi
cd apps/statslab-dsi

# 2. Instalasi dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Bangun berkas produksi
npm run build

# 5. Uji coba lokal fungsi edge
npx wrangler pages dev dist
```

---

## 👥 Majelis Dewan Pembimbing & Penguji Tugas Akhir

- **Dosen Pembimbing I / Ketua Sidang:**  
  Sidik Nurasa, S.Pd., M.Pd. (NUPTK: 1948773674130372)
- **Dosen Pembimbing II:**  
  Susilawati, S.Pd., M.Pd.
- **Dosen Penguji Utama / Ketua Program Studi Tadris Matematika:**  
  Ana Khofifahturizqi, S.Pd., M.Mat.

---

## 📚 Rekam Jejak Publikasi Peneliti

1. **Hussein, S., Khoiruzzadittaqwa, M., Luthfiyah, L., & Alhaq, M. M. (2024).**  
   *The Effectiveness of Project-Based Learning and Problem-Based Learning in Improving Student Achievement and Involvement in Learning Mathematics.*  
   *International Journal of Mathematics and Mathematics Education (IJMME)*, Terakreditasi Nasional **SINTA 2**, Vol. 2, No. 2, Juni 2024.  
   DOI: [10.56855/ijmme.v2i2.931](https://doi.org/10.56855/ijmme.v2i2.931)

2. **Khoiruzzadittaqwa, M. (2024).**  
   *Efektivitas Model Pembelajaran Generatif Terhadap Kemampuan Pemecahan Masalah Matematika Siswa.*  
   *Al-Bahjah Journal of Mathematics Education (ABJME)*, Terakreditasi Nasional **SINTA 3**, Vol. 2, No. 1, Maret 2024.  
   DOI: [10.61553/abjme.v2i1.152](https://doi.org/10.61553/abjme.v2i1.152)

---

## 📄 Hak Cipta & Sitasi

Dikembangkan oleh:  
**Muhammad Khoiruzzadittaqwa**  
Program Studi Tadris Matematika, Institut Al-Bahjah Cirebon  
Surel: `muhzadit@gmail.com`  
Mitra: SMP Islam Qurani Al Bahjah Cirebon, SMPN 46 Bandung, SPM Wustha Al-Bahjah Muara Basung Riau
