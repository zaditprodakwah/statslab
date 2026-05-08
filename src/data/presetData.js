// ============================================================
// STATSLAB — Preset Dataset (Blueprint-Exact Values)
// WARNING: Jangan ubah nilai angka tanpa mengubah algoritma
// useTabayyun, karena angka ini sengaja dikalibrasi agar
// alert Tabayyun terpicu pada dataset ZISWAF.
// ============================================================

export const PRESET_ZISWAF = [
  { id: 1, kategori: 'Fakir', nominal: 500000 },
  { id: 2, kategori: 'Miskin', nominal: 450000 },
  { id: 3, kategori: 'Fisabilillah', nominal: 5000000 },
  // Fisabilillah = 5.000.000 → Outlier (Strong Anomaly)
]

export const PRESET_TAHFIZH = [
  { id: 1, bulan: 'Juli', halaman: 15 },
  { id: 2, bulan: 'Agustus', halaman: 18 },
  { id: 3, bulan: 'September', halaman: 1 }, // September = 1 -> Anomaly (Sudden drop)
  { id: 4, bulan: 'Oktober', halaman: 20 },
]

export const PRESET_QURBAN = [
  { id: 1, desa: 'Sukamaju', target: 50, realisasi: 48 },
  { id: 2, desa: 'Sukarame', target: 30, realisasi: 2 }, // Sukarame = 2 -> Anomaly (Target vs Realization gap)
  { id: 3, desa: 'Mekarsari', target: 40, realisasi: 40 },
]

export const PRESET_LITERASI = [
  { id: 1, kategori: 'Fiqh', jumlah: 45 },
  { id: 2, kategori: 'Aqidah', jumlah: 50 },
  { id: 3, kategori: 'Sains', jumlah: 2 }, // Sains = 2 -> Anomaly (Low interest/stock)
  { id: 4, kategori: 'Sejarah Islam', jumlah: 20 },
]

