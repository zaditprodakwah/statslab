/**
 * expertIndicators.js
 * Source: proposal.md (Tabel 3.1, 3.2, 3.3)
 * Objective: Replace placeholders with real research indicators for expert validation.
 */

export const EXPERT_INDICATORS = {
  materi: {
    title: 'Validasi Ahli Materi',
    description: 'Mengukur kualitas konten, akurasi statistika, dan literasi data.',
    categories: [
      {
        name: 'Kualitas Isi',
        indicators: [
          { id: 1, text: 'Kesesuaian materi dengan kurikulum dan tujuan pembelajaran matematika SMP/MTs.' },
          { id: 2, text: 'Kedalaman dan keluasan cakupan materi yang disajikan dalam dasbor.' },
          { id: 3, text: 'Akurasi konsep statistika (rata-rata, median, modus) pada dataset yang tersedia.' },
          { id: 4, text: 'Ketepatan pemilihan jenis grafik (Pie, Bar, Line) untuk setiap kategori data.' }
        ]
      },
      {
        name: 'Literasi Statistika',
        indicators: [
          { id: 5, text: 'Media memfasilitasi kemampuan membaca data di luar teks (Reading beyond the data).' },
          { id: 6, text: 'Kemampuan dasbor dalam membantu siswa menarik kesimpulan dari distribusi data.' },
          { id: 7, text: 'Stimulasi evaluasi kritis terhadap anomali data (Outlier) sebagai bentuk penalaran.' },
          { id: 8, text: 'Kesesuaian fitur interaktif dalam mendukung pemahaman variabilitas data.' }
        ]
      },
      {
        name: 'Penyajian',
        indicators: [
          { id: 9, text: 'Keruntutan alur penyampaian materi melalui konsep Data Storytelling.' },
          { id: 10, text: 'Kejelasan petunjuk operasional dan latihan pada setiap modul dasbor.' }
        ]
      }
    ]
  },
  media: {
    title: 'Validasi Ahli Media',
    description: 'Mengukur kualitas teknis, desain visual, dan beban kognitif (CLT).',
    categories: [
      {
        name: 'Desain Visual',
        indicators: [
          { id: 1, text: 'Keterbacaan teks dan tipografi yang digunakan pada antarmuka dasbor.' },
          { id: 2, text: 'Komposisi warna dasbor mendukung kenyamanan visual (Minimalist Design).' }
        ]
      },
      {
        name: 'Interaktivitas',
        indicators: [
          { id: 3, text: 'Responsivitas grafik saat data pada tabel diubah (Reaktivitas Sub-50ms).' },
          { id: 4, text: 'Kemudahan penggunaan fitur filter data berbasis React.js.' }
        ]
      },
      {
        name: 'Navigasi',
        indicators: [
          { id: 5, text: 'Kemudahan akses antar modul (Ziswaf, Tahfizh, Qurban, Literasi).' },
          { id: 6, text: 'Kejelasan ikon navigasi dan konsistensi tata letak elemen visual.' }
        ]
      },
      {
        name: 'Kualitas Teknis',
        indicators: [
          { id: 7, text: 'Kecepatan rendering data dan stabilitas media di berbagai peramban.' },
          { id: 8, text: 'Ketiadaan kesalahan teknis (Bug/Error) saat interaksi data berlangsung.' }
        ]
      },
      {
        name: 'Efisiensi (Beban Kognitif)',
        indicators: [
          { id: 9, text: 'Kesesuaian jumlah informasi dalam satu tampilan layar (Split-Attention Effect).' },
          { id: 10, text: 'Efektivitas media dalam meminimalkan beban kognitif luar (Extraneous Load).' }
        ]
      }
    ]
  },
  agama: {
    title: 'Validasi Ahli Integrasi Islam',
    description: 'Mengukur ketepatan internalisasi nilai-nilai keislaman dalam konten.',
    categories: [
      {
        name: 'Pilar Tabayyun',
        indicators: [
          { id: 1, text: 'Media mengimplementasikan verifikasi kritis sumber data (Konsep QS. Al-Hujurat: 6).' },
          { id: 2, text: 'Fitur deteksi anomali data mendorong sikap teliti dan tidak terburu-buru menyimpulkan.' }
        ]
      },
      {
        name: 'Pilar Amanah',
        indicators: [
          { id: 3, text: 'Integritas representasi visual data: ketiadaan manipulasi skala pada sumbu grafik.' },
          { id: 4, text: 'Kejujuran sistem dalam menyajikan data apa adanya tanpa bias visual.' }
        ]
      },
      {
        name: 'Konteks Konten',
        indicators: [
          { id: 5, text: 'Relevansi dataset bertema islami (Ziswaf, Tahfizh, Qurban) dengan materi statistika.' },
          { id: 6, text: 'Ketepatan penggunaan istilah islami yang disisipkan dalam narasi data.' }
        ]
      },
      {
        name: 'Dampak Afektif',
        indicators: [
          { id: 7, text: 'Media mengoptimalkan peningkatan kesadaran religius melalui interpretasi data sosial.' },
          { id: 8, text: 'Stimulasi empati siswa terhadap isu umat melalui visualisasi distribusi Ziswaf/Qurban.' }
        ]
      }
    ]
  }
}
