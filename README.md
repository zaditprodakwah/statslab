# StatsLab: Dasbor Statistika Interaktif & EdTech R&D Ecosystem

<p align="center">
  <em>Media Pembelajaran Statistika Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa</em>
</p>

<p align="center">
  <a href="https://statslabmedia.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-StatsLab_V2-059669?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-15_App_Router-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma v7" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Psychometrics-R_Rasch_%26_CFA-276DC3?style=for-the-badge&logo=r" alt="R Psychometrics" />
  <img src="https://img.shields.io/badge/License-MIT_%26_CC--BY_4.0-blue?style=for-the-badge" alt="License" />
</p>

---

## 📖 Tentang Proyek

**StatsLab** adalah repositori R&D (*Research & Development*) EdTech *open source* berbasis keislaman pertama di Indonesia. Dikembangkan sebagai instrumen penelitian skripsi sekaligus infrastruktur terbuka (*Learning Analytics*) untuk komunitas peneliti, guru, dan pengembang teknologi pendidikan di lingkungan **STAI Al-Bahjah Cirebon**.

Proyek ini dirancang secara komprehensif mengintegrasikan prinsip kognitif kualitatif dengan analisis kuantitatif psikometri modern, mematuhi panduan kognitif **Cognitive Load Theory (CLT)** dan **Taste-Skill Design System** untuk menghadirkan antarmuka visualisasi data yang bersih (*clean UI*), interaktif, dan meminimalisasi beban kognitif ekstra (*extraneous load*) bagi siswa.

---

## 🏛 Arsitektur Tiga Pilar (Three-Pillar Architecture)

StatsLab dibangun di atas **Arsitektur Tiga Pilar** yang memisahkan dan memetakan fungsi sistem secara presisi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STATSLAB R&D ECOSYSTEM                            │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│    PILAR 1: WEB APP CORE     │     PILAR 2: EDTECH UX &     │ PILAR 3: OPEN │
│   (Next.js 15 / Prisma v7)   │       ISLAMIC VALUES         │ SCIENCE R&D   │
├──────────────────────────────┼──────────────────────────────┼───────────────┤
│ • Next.js 15 App Router      │ • Cognitive Load Theory      │ • Rasch PCM   │
│ • Neon Serverless Postgres   │ • Watson-Callingham Level 1-6│ • CFA Lavaan  │
│ • Recharts Data Viz          │ • Nilai Tabayyun, Amanah,    │ • Winsteps    │
│ • Zustand State Manager      │   & Tawazun                  │   Export      │
│ • Zod Schema Validation      │ • Adaptive SUS 14 Evaluation │ • Aiken's V   │
└──────────────────────────────┴──────────────────────────────┴───────────────┘
```

### 1. Pilar 1: Web Application Core (Layer 1 - Dynamic Interactive App)
- **Framework & Runtime**: Next.js 15 (App Router), React 19, TypeScript 5 (Strict Mode).
- **Styling & Design System**: Vanilla CSS dengan Custom Properties, Glassmorphism, Dark Mode support, dan kepatuhan penuh pada *Anti-AI-Slop & Taste-Skill UI/UX*.
- **Visualisasi & State**: Visualisasi grafik dinamis berbasis Recharts 2 & *Lightweight Client State Management* dengan Zustand.
- **Database & Persistence**: Prisma ORM v7 terhubung ke Neon PostgreSQL (Serverless pooling & unpooled connections).

### 2. Pilar 2: Extended EdTech UX & Values Integration (Layer 2 - Pedagogical & Values)
- **Integrasi Nilai Keislaman**:
  - **Pilar Amanah (QS. Al-Mutaffifin: 1–3)**: Sakelar audit visual skala sumbu Y (*zero-based* vs *truncated*) untuk melatih kejujuran dan ketelitian membaca grafik data.
  - **Pilar Tabayyun (QS. Al-Hujurat: 6)**: Deteksi outlier dan lonjakan data otomatis (>20% dari median) disertai peringatan verifikasi data.
  - **Pilar Tawazun (QS. Al-Infitar: 7)**: Indikator keseimbangan distribusi data kuantitatif (*Mean vs Median*).
- **Asesmen Literasi Data Watson-Callingham**:
  - **8 Embedded Tasks**: Berjenjang dari Level 4 (*Reading Data*), Level 5 (*Reading Between*), hingga Level 6 (*Reading Beyond & Data-Driven Decision Making*).
  - **Penilaian Politomi (0, 1, 2)**: Heuristik skoring analitis otomatis berbasis kriteria rubrik baku.
  - **Sertifikat Digital (Level 6)**: Perekaman pencapaian otomatis disertai efek *confetti* saat siswa menuntaskan seluruh tingkatan literasi data.
- **Instrumen Kepraktisan Media**:
  - **System Usability Scale (SUS 14-butir adaptif)**: Kuesioner evaluasi UX otomatis dengan pengkategorian predikat (*Best Imaginable*, *Excellent*, *Good*, *OK*, *Poor*).

### 3. Pilar 3: Open Science Psychometrics & R&D (`packages/analysis/`)
- **Model Rasch PCM (Partial Credit Model)**: Ekspor matriks data `.csv` dari PostgreSQL dan ekspor format file kontrol Winsteps (`.ctl`) untuk pengolahan parameter butir (*item difficulty*) dan *person ability*. Skrip R otomatis menggunakan pustaka `eRm` dan `TAM`.
- **CFA (Confirmatory Factor Analysis)**: Skrip validasi struktur faktor instrumen berbasis pustaka R `lavaan`.
- **Validitas Pakar Aiken's V**: Perhitungan koefisien kesepakatan pakar ($V = \Sigma s / (n(c-1))$).

---

## 📂 Struktur Repositori Monorepo

StatsLab mengadopsi struktur *monorepo* (menggunakan **NPM Workspaces**) untuk memisahkan logika aplikasi web, pustaka analisis psikometri, dataset mentah, rubrik skoring, dan komponen sistem.

```text
STATSLAB/
├── apps/
│   └── web/                         # Next.js 15 Web Application
│       ├── prisma/                  # Schema Prisma v7 & script Database Seeding
│       ├── public/                  # Static Assets, llms.txt, robots.txt, sitemap.xml
│       └── src/
│           ├── app/                 # App Router (Pages, API Routes /api/sessions, /api/task-resp, dll)
│           ├── components/          # Reusable UI & Chart Components
│           └── lib/                 # Utilities, Zod schemas, & Prisma Client setup
├── packages/
│   ├── analysis/                    # R Scripts untuk Psikometri & Open Science
│   │   └── scripts/
│   │       ├── cfa-lavaan.r         # Skrip Analisis Faktor Konfirmatori (lavaan)
│   │       └── rasch-pcm.r          # Skrip Rasch Partial Credit Model (eRm & TAM)
│   ├── datasets/                    # Raw JSON Datasets (Data Zakat, Tajwid, Literasi)
│   └── rubrics/                     # Rubrik Penilaian Politomi & Kuesioner SUS
├── vercel.json                      # Konfigurasi Monorepo Deployment Vercel
├── package.json                     # NPM Workspaces Root Configuration
├── LICENSE                          # Lisensi Ganda (MIT & CC-BY 4.0)
└── README.md                        # Dokumentasi Utama Repositori
```

---

## 🚀 Instalasi & Pengembangan Lokal

### Prasyarat
- **Node.js**: `v24.x` atau lebih baru
- **NPM**: `v10.8.2` atau lebih baru
- **Database**: PostgreSQL (direkomendasikan Neon PostgreSQL Serverless)
- **R Environment** *(Opsional, untuk pengolahan Psikometri Pilar 3)*: R v4.x + paket `eRm`, `TAM`, `lavaan`.

### Langkah-Langkah Menjalankan Aplikasi

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/zaditprodakwah/statslab.git
   cd statslab
   ```

2. **Instal Dependensi Monorepo**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env` pada `apps/web/.env` (atau salin dari `apps/web/.env.example`):
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_POOLER_URL/neondb?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://neondb_owner:YOUR_DIRECT_URL/neondb?sslmode=require"
   
   # Token akses Panel Guru / Admin (buat dengan: openssl rand -hex 24)
   ADMIN_TOKEN="GANTI_DENGAN_TOKEN_ACAK_ANDA"
   ```

4. **Generate Prisma Client & Seed Database**:
   ```bash
   npm run postinstall --workspace=apps/web
   cd apps/web && npx tsx prisma/seed.ts && cd ../..
   ```

5. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka peramban Anda di `http://localhost:3000`.

---

## 🌐 Deployment (Vercel Monorepo)

Repositori ini disesuaikan untuk deployment langsung ke **Vercel** menggunakan strategi **NPM Workspaces**. 

File `vercel.json` pada akar proyek mengonfigurasi jalur build secara presisi:
```json
{
  "buildCommand": "npm run build --workspace=apps/web",
  "installCommand": "npm install",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

Aplikasi live menyertakan metadata terstruktur **JSON-LD Schema Markup** (`SoftwareApplication` & `Organization`) yang secara eksplisit menghubungkan proyek ini dengan **STAI Al-Bahjah Cirebon** serta optimasi SEO/GEO/AEO (*llms.txt*, *robots.txt*, *sitemap.xml* dinamis).

---

## 🤝 Berkontribusi & Kode Etik

Kami menyambut kontribusi dari komunitas peneliti, pendidik, dan pengembang perangkat lunak! 

- Sebelum mengajukan Pull Request, mohon membaca **[CONTRIBUTING.md](CONTRIBUTING.md)** untuk memahami panduan kontribusi.
- Semua partisipan diharapkan mematuhi etika dan nilai kesopanan yang tercantum dalam **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)**.

---

## 📜 Lisensi

Proyek ini dilindungi oleh **Model Lisensi Ganda**:

1. **MIT License**: Berlaku untuk seluruh *source code* perangkat lunak web (`apps/web/`). Anda bebas menggunakan, memodifikasi, dan mendistribusikan ulang kode ini.
2. **Creative Commons Attribution 4.0 International (CC-BY 4.0)**: Berlaku untuk dataset (`packages/datasets/`), rubrik asesmen (`packages/rubrics/`), instrumen tugas, dan skrip analisis psikometri (`packages/analysis/`).

Detail lengkap dapat dibaca pada file **[LICENSE](LICENSE)**.

---

<p align="center">
  <strong>StatsLab R&D Ecosystem</strong> • STAI Al-Bahjah Cirebon
</p>
