# @statslab/analysis

Pustaka skrip psikometri dan eksportir data analitik untuk ekosistem **StatsLab R&D**. Paket ini menyediakan antarmuka untuk berinteraksi dengan algoritma validitas instrumen pendidikan terbuka (*Open Science*).

## Fitur Tersedia
- `exporter.ts`: Modul Node.js untuk mengekstrak respons siswa dari Prisma Database menjadi format CSV Matriks (1/0) Rasch PCM dan berkas *control* (`.ctl`) untuk perangkat lunak Winsteps.
- `aiken-v.r`: Skrip R untuk menghitung *Content Validity Index* dari panel pakar.
- `rasch-pcm.r`: Skrip R (berbasis *eRm*/*TAM*) untuk pemodelan Rasch PCM.
- `cfa-lavaan.r`: Skrip R (berbasis *lavaan*) untuk *Confirmatory Factor Analysis*.

## Instalasi

```bash
npm install @statslab/analysis
```

## Penggunaan Modul Eksportir

```typescript
import { exportRaschMatrix } from '@statslab/analysis/src/exporter';

// Mengekspor matriks data dan menyimpannya di file CSV
await exportRaschMatrix(prismaClientInstance);
```

*(Untuk skrip R, silakan eksekusi langsung dari *folder* `node_modules/@statslab/analysis/scripts/` menggunakan *environment* RStudio Anda).*

## Tentang StatsLab
StatsLab adalah repositori open-source berskala penelitian yang dikembangkan di **Institut Al-Bahjah Cirebon**. Untuk informasi lebih lanjut mengenai aplikasi utamanya, kunjungi repositori utama di [GitHub (zaditprodakwah/statslab)](https://github.com/zaditprodakwah/statslab).
