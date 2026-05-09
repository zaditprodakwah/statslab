// ============================================================
// STATSLAB — Preset Dataset (Blueprint-Exact Values)
// WARNING: Jangan ubah nilai angka tanpa mengubah algoritma
// useTabayyun, karena angka ini sengaja dikalibrasi agar
// alert Tabayyun terpicu pada dataset ZISWAF.
// ============================================================

export const PRESET_ZISWAF_NORMAL = [
  { id: 1, kategori: 'Fakir', nominal: 500000 },
  { id: 2, kategori: 'Miskin', nominal: 450000 },
  { id: 3, kategori: 'Fisabilillah', nominal: 600000 }, // Normal
]

export const PRESET_ZISWAF = [
  { id: 1, kategori: 'Fakir', nominal: 500000 },
  { id: 2, kategori: 'Miskin', nominal: 450000 },
  { id: 3, kategori: 'Fisabilillah', nominal: 5000000 }, // Fisabilillah = 5.000.000 → Outlier (Strong Anomaly)
]

export const PRESET_TAHFIZH_NORMAL = [
  { id: 1, bulan: 'Juli', halaman: 15 },
  { id: 2, bulan: 'Agustus', halaman: 18 },
  { id: 3, bulan: 'September', halaman: 22 }, // Normal progression
  { id: 4, bulan: 'Oktober', halaman: 20 },
]

export const PRESET_TAHFIZH = [
  { id: 1, bulan: 'Juli', halaman: 15 },
  { id: 2, bulan: 'Agustus', halaman: 18 },
  { id: 3, bulan: 'September', halaman: 95 }, // 95 -> Extreme Spike (Mean will shift heavily)
  { id: 4, bulan: 'Oktober', halaman: 20 },
]

export const PRESET_QURBAN_NORMAL = [
  { id: 1, desa: 'Sukamaju', target: 50, realisasi: 48 },
  { id: 2, desa: 'Sukarame', target: 30, realisasi: 32 }, // Normal
  { id: 3, desa: 'Mekarsari', target: 40, realisasi: 40 },
]

export const PRESET_QURBAN = [
  { id: 1, desa: 'Sukamaju', target: 50, realisasi: 48 },
  { id: 2, desa: 'Sukarame', target: 30, realisasi: 150 }, // 150 -> Over-realization Anomaly
  { id: 3, desa: 'Mekarsari', target: 40, realisasi: 40 },
]

export const PRESET_LITERASI_NORMAL = [
  { id: 1, kategori: 'Fiqh', jumlah: 45 },
  { id: 2, kategori: 'Aqidah', jumlah: 50 },
  { id: 3, kategori: 'Sains', jumlah: 60 }, // Normal
  { id: 4, kategori: 'Sejarah Islam', jumlah: 20 },
]

export const PRESET_LITERASI = [
  { id: 1, kategori: 'Fiqh', jumlah: 45 },
  { id: 2, kategori: 'Aqidah', jumlah: 50 },
  { id: 3, kategori: 'Sains', jumlah: 350 }, // 350 -> Inventory Spike / Anomaly
  { id: 4, kategori: 'Sejarah Islam', jumlah: 20 },
]
