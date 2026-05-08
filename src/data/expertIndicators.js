/**
 * expertIndicators.js
 * Source: proposal.md (Tabel 3.1, 3.2, 3.3)
 * Objective: Replace placeholders with real research indicators for expert validation.
 */

export const EXPERT_INDICATORS = {
  materi: {
    title: { id: 'Validasi Ahli Materi', en: 'Subject Matter Expert Validation' },
    description: { id: 'Mengukur kualitas konten, akurasi statistika, dan literasi data.', en: 'Measuring content quality, statistical accuracy, and data literacy.' },
    categories: [
      {
        id: 'kualitas',
        name: { id: 'Kualitas Isi', en: 'Content Quality' },
        indicators: [
          { id: 1, text: { id: 'Kesesuaian materi dengan kurikulum dan tujuan pembelajaran matematika SMP/MTs.', en: 'Alignment of material with the curriculum and learning objectives of Junior High School mathematics.' } },
          { id: 2, text: { id: 'Kedalaman dan keluasan cakupan materi yang disajikan dalam dasbor.', en: 'Depth and breadth of the material coverage presented in the dashboard.' } },
          { id: 3, text: { id: 'Akurasi konsep statistika (rata-rata, median, modus) pada dataset yang tersedia.', en: 'Accuracy of statistical concepts (mean, median, mode) in the available datasets.' } },
          { id: 4, text: { id: 'Ketepatan pemilihan jenis grafik (Pie, Bar, Line) untuk setiap kategori data.', en: 'Appropriateness of chart types (Pie, Bar, Line) for each data category.' } }
        ]
      },
      {
        id: 'literasi',
        name: { id: 'Literasi Statistika', en: 'Statistical Literacy' },
        indicators: [
          { id: 5, text: { id: 'Media memfasilitasi kemampuan membaca data di luar teks (Reading beyond the data).', en: 'Media facilitates the ability to read beyond the data.' } },
          { id: 6, text: { id: 'Kemampuan dasbor dalam membantu siswa menarik kesimpulan dari distribusi data.', en: 'Dashboard capability in helping students draw conclusions from data distribution.' } },
          { id: 7, text: { id: 'Stimulasi evaluasi kritis terhadap anomali data (Outlier) sebagai bentuk penalaran.', en: 'Stimulation of critical evaluation of data anomalies (outliers) as a form of reasoning.' } },
          { id: 8, text: { id: 'Kesesuaian fitur interaktif dalam mendukung pemahaman variabilitas data.', en: 'Appropriateness of interactive features in supporting the understanding of data variability.' } }
        ]
      },
      {
        id: 'penyajian',
        name: { id: 'Penyajian', en: 'Presentation' },
        indicators: [
          { id: 9, text: { id: 'Keruntutan alur penyampaian materi melalui konsep Data Storytelling.', en: 'Coherence of the material delivery flow through Data Storytelling concepts.' } },
          { id: 10, text: { id: 'Kejelasan petunjuk operasional dan latihan pada setiap modul dasbor.', en: 'Clarity of operational instructions and exercises in each dashboard module.' } }
        ]
      }
    ]
  },
  media: {
    title: { id: 'Validasi Ahli Media', en: 'Media Expert Validation' },
    description: { id: 'Mengukur kualitas teknis, desain visual, dan beban kognitif (CLT).', en: 'Measuring technical quality, visual design, and cognitive load (CLT).' },
    categories: [
      {
        id: 'visual',
        name: { id: 'Desain Visual', en: 'Visual Design' },
        indicators: [
          { id: 1, text: { id: 'Keterbacaan teks dan tipografi yang digunakan pada antarmuka dasbor.', en: 'Readability of text and typography used on the dashboard interface.' } },
          { id: 2, text: { id: 'Komposisi warna dasbor mendukung kenyamanan visual (Minimalist Design).', en: 'Dashboard color composition supports visual comfort (Minimalist Design).' } }
        ]
      },
      {
        id: 'interaksi',
        name: { id: 'Interaktivitas', en: 'Interactivity' },
        indicators: [
          { id: 3, text: { id: 'Responsivitas grafik saat data pada tabel diubah (Reaktivitas Sub-50ms).', en: 'Responsiveness of charts when table data is changed (Sub-50ms reactivity).' } },
          { id: 4, text: { id: 'Kemudahan penggunaan fitur filter data berbasis React.js.', en: 'Ease of use of the data filtering features based on React.js.' } }
        ]
      },
      {
        id: 'navigasi',
        name: { id: 'Navigasi', en: 'Navigation' },
        indicators: [
          { id: 5, text: { id: 'Kemudahan akses antar modul (Ziswaf, Tahfizh, Qurban, Literasi).', en: 'Ease of access between modules (Ziswaf, Tahfizh, Qurban, Literacy).' } },
          { id: 6, text: { id: 'Kejelasan ikon navigasi dan konsistensi tata letak elemen visual.', en: 'Clarity of navigation icons and consistency of visual element layout.' } }
        ]
      },
      {
        id: 'teknis',
        name: { id: 'Kualitas Teknis', en: 'Technical Quality' },
        indicators: [
          { id: 7, text: { id: 'Kecepatan rendering data dan stabilitas media di berbagai peramban.', en: 'Data rendering speed and media stability across various browsers.' } },
          { id: 8, text: { id: 'Ketiadaan kesalahan teknis (Bug/Error) saat interaksi data berlangsung.', en: 'Absence of technical errors (bugs/errors) during data interaction.' } }
        ]
      },
      {
        id: 'efisiensi',
        name: { id: 'Efisiensi (Beban Kognitif)', en: 'Efficiency (Cognitive Load)' },
        indicators: [
          { id: 9, text: { id: 'Kesesuaian jumlah informasi dalam satu tampilan layar (Split-Attention Effect).', en: 'Appropriateness of the amount of information in a single screen view (Split-Attention Effect).' } },
          { id: 10, text: { id: 'Efektivitas media dalam meminimalkan beban kognitif luar (Extraneous Load).', en: 'Effectiveness of the media in minimizing extraneous cognitive load.' } }
        ]
      }
    ]
  },
  agama: {
    title: { id: 'Validasi Ahli Integrasi Islam', en: 'Islamic Integration Expert Validation' },
    description: { id: 'Mengukur ketepatan internalisasi nilai-nilai keislaman dalam konten.', en: 'Measuring the accuracy of internalizing Islamic values within the content.' },
    categories: [
      {
        id: 'tabayyun',
        name: { id: 'Pilar Tabayyun', en: 'Tabayyun Pillar' },
        indicators: [
          { id: 1, text: { id: 'Media mengimplementasikan verifikasi kritis sumber data (Konsep QS. Al-Hujurat: 6).', en: 'Media implements critical verification of data sources (QS. Al-Hujurat: 6 concept).' } },
          { id: 2, text: { id: 'Fitur deteksi anomali data mendorong sikap teliti dan tidak terburu-buru menyimpulkan.', en: 'Data anomaly detection features encourage meticulousness and avoid hasty conclusions.' } }
        ]
      },
      {
        id: 'amanah',
        name: { id: 'Pilar Amanah', en: 'Amanah Pillar' },
        indicators: [
          { id: 3, text: { id: 'Integritas representasi visual data: ketiadaan manipulasi skala pada sumbu grafik.', en: 'Integrity of visual data representation: absence of scale manipulation on chart axes.' } },
          { id: 4, text: { id: 'Kejujuran sistem dalam menyajikan data apa adanya tanpa bias visual.', en: 'System honesty in presenting data as is without visual bias.' } }
        ]
      },
      {
        id: 'konteks',
        name: { id: 'Konteks Konten', en: 'Content Context' },
        indicators: [
          { id: 5, text: { id: 'Relevansi dataset bertema islami (Ziswaf, Tahfizh, Qurban) dengan materi statistika.', en: 'Relevance of Islamic-themed datasets (Ziswaf, Tahfizh, Qurban) to statistical material.' } },
          { id: 6, text: { id: 'Ketepatan penggunaan istilah islami yang disisipkan dalam narasi data.', en: 'Accuracy of the use of Islamic terms inserted into data narratives.' } }
        ]
      },
      {
        id: 'afektif',
        name: { id: 'Dampak Afektif', en: 'Affective Impact' },
        indicators: [
          { id: 7, text: { id: 'Media mengoptimalkan peningkatan kesadaran religius melalui interpretasi data sosial.', en: 'Media optimizes the enhancement of religious awareness through social data interpretation.' } },
          { id: 8, text: { id: 'Stimulasi empati siswa terhadap isu umat melalui visualisasi distribusi Ziswaf/Qurban.', en: 'Stimulation of student empathy for community issues through the visualization of Ziswaf/Qurban distribution.' } }
        ]
      }
    ]
  }
}
