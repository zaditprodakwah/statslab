# @statslab/datasets

Kumpulan dataset edukasi bernuansa Islami dan instrumen penelitian untuk ekosistem **StatsLab R&D**. Paket ini digunakan untuk menggerakkan Dasbor Statistika Interaktif dengan metrik literasi data (Watson-Callingham Level 1-6).

## Dataset yang Tersedia
- `zakat-infak.json`
- `perpus-madrasah.json`
- `tajwid-juz-30.json`
- `wakaf-produktif.json`

## Instalasi

```bash
npm install @statslab/datasets
```

## Penggunaan (Node.js / Next.js)

Karena paket ini mengekspor berkas JSON mentah dan fungsi enumerasi, Anda dapat menggunakannya langsung pada proyek Anda:

```javascript
// Contoh: Melakukan import dataset mentah (pastikan bundler Anda mendukung resolusi JSON)
import zakatData from '@statslab/datasets/zakat-infak.json';

console.log(zakatData.title); 
// Output: "Distribusi Zakat & Infak Masjid Raya"
```

## Tentang StatsLab
StatsLab adalah repositori open-source berskala penelitian yang dikembangkan di **Institut Al-Bahjah Cirebon**. Untuk informasi lebih lanjut mengenai aplikasi utamanya, kunjungi repositori utama di [GitHub (zaditprodakwah/statslab)](https://github.com/zaditprodakwah/statslab).
