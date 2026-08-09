# StatsLab: Dasbor Statistika Interaktif & EdTech R&D Ecosystem
<p align="center">
  <em>Media Pembelajaran Statistika Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa</em>
</p>

<p align="center">
  <a href="https://statslabmedia.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-StatsLab_V2-059669?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-15_App_Router-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma v7" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql" alt="Neon PostgreSQL" />
</p>

---

## 📖 Tentang Proyek

**StatsLab** adalah repositori R&D (*Research & Development*) EdTech *open source* berbasis keislaman pertama di Indonesia. Dikembangkan sebagai instrumen penelitian skripsi sekaligus infrastruktur terbuka (*Learning Analytics*) untuk komunitas peneliti, guru, dan pengembang teknologi pendidikan.

Proyek ini dibangun berdasarkan **Cognitive Load Theory (CLT)** dan **Taste Skill Design System**, menyajikan antarmuka visualisasi data yang bersih (*clean UI*), elegan, dan meminimalisasi beban kognitif ekstra bagi siswa.

---

## 🌟 Fitur Utama & Keunggulan

### 1. Integrasi 3 Pilar Islam
- **Pilar Amanah (QS. Al-Mutaffifin: 1–3)**: Sakelar audit visual skala sumbu Y (*zero-based* vs *truncated*) untuk melatih kecermatan dan kejujuran membaca grafik.
- **Pilar Tabayyun (QS. Al-Hujurat: 6)**: Deteksi outlier/lonjakan data otomatis (>20% dari median) disertai peringatan verifikasi data.
- **Pilar Tawazun (QS. Al-Infitar: 7)**: Indikator keseimbangan distribusi data kuantitatif (*Mean vs Median*).

### 2. Modul Asesmen Literasi Data Watson-Callingham
- **8 Embedded Tasks**: Tugas berjenjang Level 4–6 (*Reading Data*, *Reading Between*, *Reading Beyond*, hingga *Data-Driven Decision Making*).
- **Penilaian Politomi (0, 1, 2)**: Heuristik skoring analitis otomatis.
- **Sertifikat Digital (Level 6)**: Buka otomatis disertai efek *confetti* saat siswa menyelesaikan seluruh tingkat literasi.

### Deployment (Vercel Monorepo)

Due to Vercel's interaction with `pnpm`'s `fetch` implementation during monorepo resolution, this project has been fully migrated to use **NPM Workspaces**. It is configured to build successfully using `vercel.json` with the following configuration:
```json
{
  "buildCommand": "npm run build --workspace=apps/web",
  "installCommand": "npm install",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

The live application features advanced SEO/AEO/GEO optimization, explicitly identifying STAI Al-Bahjah Cirebon as the sponsoring institution via JSON-LD metadata.

### 3. Instrumen Kepraktisan Media & Ekspor Psikometri
- **System Usability Scale (SUS 14 Butir Adaptif)**: Kuesioner evaluasi UX otomatis dengan pengkategorian predikat (*Best Imaginable*, *Excellent*, *Good*).
- **Winsteps & Rasch PCM Export**: Ekspor matriks data `.csv` siap impor untuk analisis *Item/Person Reliability* dan *Item Fit*.

### 4. Advanced SEO / GEO / AEO
- **JSON-LD Schema Markup**: Terstruktur untuk `SoftwareApplication` & `Organization`.
- **AI Agent Friendly**: Dilengkapi `public/llms.txt`, `robots.txt`, dan `sitemap.xml` dinamis.

---

## 🚀 Instalasi & Pengembangan Lokal

StatsLab menggunakan arsitektur *monorepo* (`pnpm workspace`) berbasis Next.js 15, Prisma v7, dan Neon PostgreSQL.

### Prasyarat
- **Frontend:** Next.js 14+ (App Router), React, Vanilla CSS (Strict Anti-AI Slop), Recharts, Zustand
- **Backend:** Prisma ORM, PostgreSQL (via Supabase/Neon)
- **Deployment:** Vercel Edge Runtime (Monorepo setup using NPM Workspaces and Node.js >=24.x)
- **Onboarding:** Interactive Role-based entry (Siswa / Guru / Peneliti) with zero-registration session creation

### Langkah Menjalankan Aplikasi

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/zaditprodakwah/statslab.git
   cd statslab
   ```

2. **Instal Dependensi Workspace**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin file `.env.example` ke `apps/web/.env` dan atur URL PostgreSQL Anda:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_POOLER_URL/neondb?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://neondb_owner:YOUR_DIRECT_URL/neondb?sslmode=require"
   # Token akses Panel Guru & Admin (dibuat dengan: openssl rand -hex 24)
   ADMIN_TOKEN="GANTI_DENGAN_TOKEN_ACAK"
   ```

4. **Generate Prisma & Seed Database**:
   ```bash
   npm run postinstall --workspace=apps/web
   npx tsx apps/web/prisma/seed.ts
   ```

5. **Jalankan Server Lokal**:
   ```bash
   npm run dev
   ```
   Akses antarmuka di `http://localhost:3000`.

---

## 🤝 Berkontribusi & Lisensi

Kami mengundang Anda untuk bergabung memperkaya ekosistem ini! Silakan baca pedoman kontribusi lengkap kami di [CONTRIBUTING.md](CONTRIBUTING.md) dan pastikan interaksi mematuhi nilai etika di [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Proyek ini menggunakan model lisensi ganda:
- **MIT License**: Untuk semua *source code* perangkat lunak web (`apps/web/`).
- **CC-BY 4.0 International**: Untuk dataset (`packages/datasets`), instrumen tugas, dan skrip psikometri.

Info lengkap dapat dilihat di [LICENSE](LICENSE).
