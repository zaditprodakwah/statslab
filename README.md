# StatsLab: Dasbor Statistika Interaktif & EdTech R&D Ecosystem
<p align="center">
  <em>Media Pembelajaran Statistika Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa</em>
</p>

---

## 📖 Tentang Proyek

**StatsLab** adalah repositori R&D (Research & Development) EdTech *open source* berbasis keislaman pertama di Indonesia. Awalnya dikembangkan sebagai instrumen penelitian skripsi, StatsLab kini berevolusi menjadi infrastruktur terbuka (*Learning Analytics*) untuk komunitas peneliti, guru, dan pengembang teknologi pendidikan.

Proyek ini dibangun berdasarkan **Cognitive Load Theory**, menyajikan antarmuka visualisasi data yang bersih dan meminimalisasi beban kognitif ekstra bagi siswa.

### Arsitektur Tiga Pilar
1. **Web App (Layer 1 & 2)**: Antarmuka Next.js 15 interaktif dengan integrasi gamifikasi dan *clean UI*.
2. **Dataset & Instrumen (Open Data)**: Repositori JSON data bernuansa Islami (Zakat, Wakaf, Tajwid) dan instrumen literasi (Hierarki Watson-Callingham).
3. **Analitik Psikometri (Open Science)**: Skrip analitik R (`eRm`, `lavaan`) untuk reproduksi akademis (Rasch Model, CFA, Aiken's V).

Untuk pemahaman mendalam tentang batasan antara pilar penelitian dan pengayaan produk, silakan baca [Arsitektur Master](docs/master.md).

---

## 🚀 Instalasi & Pengembangan

StatsLab menggunakan arsitektur *monorepo* (pnpm workspace) dan basis data PostgreSQL.

### Prasyarat
- Node.js 20.x
- `pnpm` (direkomendasikan versi 9)
- PostgreSQL database (lokal atau menggunakan [Neon.tech](https://neon.tech))

### Langkah Menjalankan Aplikasi
1. Clone repositori:
   ```bash
   git clone https://github.com/zaditprodakwah/statslab.git
   cd statslab
   ```
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Siapkan database di folder `apps/web`:
   ```bash
   cd apps/web
   cp .env.example .env
   # Masukkan kredensial DATABASE_URL Anda di .env
   
   pnpm prisma generate
   pnpm prisma db push
   ```
4. Jalankan *development server*:
   ```bash
   pnpm dev
   ```
5. Buka `http://localhost:3000` di *browser*.

---

## 🤝 Berkontribusi (Community & Open Source)

Kami mengundang Anda untuk bergabung memperkaya ekosistem ini! Anda dapat berkontribusi melalui:
- **Pengajuan Dataset Islami Baru**: Punya data menarik seputar ekonomi syariah atau demografi muslim? Ajukan via *Issues*.
- **Perbaikan UI/UX**: Bantu kurangi beban kognitif siswa lebih jauh lagi.
- **Skrip Psikometri**: Tambahkan modul analisis data statistik (*Learning Analytics*).

Silakan baca pedoman kontribusi lengkap kami di [CONTRIBUTING.md](CONTRIBUTING.md) dan pastikan interaksi mematuhi nilai Tabayyun & Amanah di [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📜 Lisensi & Atribusi

Proyek ini menggunakan model lisensi ganda:
- **MIT License**: Untuk semua *source code* perangkat lunak web (berada di `apps/web/`).
- **CC-BY 4.0 International**: Untuk dataset (`packages/datasets`), instrumen tugas, dan skrip psikometri. Hal ini memungkinkan kutipan akademis terbuka yang terhubung ke Zenodo DOI.

Info lengkap dapat dilihat di [LICENSE](LICENSE).
