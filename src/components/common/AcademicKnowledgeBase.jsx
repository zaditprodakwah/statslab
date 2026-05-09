import React, { useState } from 'react'
import { X, ExternalLink, ArrowRight, ArrowUp, BookOpen, Info } from 'lucide-react'
import { CartesianAid } from '../ui/CartesianAid'
import { PremiumIcon } from '../ui/PremiumIcons'

export function AcademicKnowledgeBase({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('philosophy')

  if (!isOpen) return null

  const tabs = [
    { id: 'philosophy', label: 'Filosofi Amanah', icon: 'finder' },
    { id: 'pedagogy', label: 'Logika Audit', icon: 'detective' },
    { id: 'cartesian', label: 'Peta Kartesius', icon: 'cartesian' },
    { id: 'mobile', label: 'Panduan Mobile', icon: 'reporter' },
    { id: 'glossary', label: 'Glosarium Data', icon: 'master' },
  ]

  const digitalLibraryLink = "https://scholar.google.com/scholar?q=statistics+pedagogy+data+integrity+for+students"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row animate-scale-in">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-xl shadow-emerald-500/20">
              <PremiumIcon id="literasi" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter italic leading-tight">Academic<br/>Knowledge</h2>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Ref. Kurikulum Nasional</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow overflow-x-auto md:overflow-x-visible flex md:flex-col pb-4 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap md:whitespace-normal group relative overflow-hidden ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xl' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <PremiumIcon 
                  id={tab.icon} 
                  size={20} 
                  className={activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'} 
                />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto hidden md:block pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 relative group overflow-hidden">
               <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Keanggotaan</p>
                <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tighter italic">Peneliti Akademik<br/>Verified</h4>
              </div>
              <PremiumIcon id="master" size={48} className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto relative bg-white dark:bg-slate-900 flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-6 right-8 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all z-50 group shadow-lg border border-transparent hover:border-slate-200"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>

          <div className="p-8 md:p-16 flex-grow">
            {activeTab === 'philosophy' && (
              <div className="max-w-3xl animate-fade-in space-y-12">
                <section>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Ethical Data Literacy
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6 leading-[0.9]">Filosofi <span className="text-emerald-600">Amanah</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-xl">
                    Statistik bukan sekadar angka, melainkan representasi dari kenyataan. Di StatsLab, kita belajar bahwa penyajian data yang tidak jujur (seperti memotong sumbu Y) adalah bentuk pengkhianatan terhadap fakta.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <PremiumIcon id="ziswaf" size={80} />
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-slate-200 text-2xl mb-4 italic uppercase tracking-tighter">Integritas Visual</h4>
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Menampilkan data mulai dari titik nol adalah standar kejujuran untuk menghindari distorsi perbandingan yang menyesatkan.</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 group hover:border-blue-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <PremiumIcon id="qurban" size={80} />
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-slate-200 text-2xl mb-4 italic uppercase tracking-tighter">Proporsionalitas</h4>
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Membantu audiens memahami skala perubahan yang sebenarnya secara jujur, bukan yang dilebih-lebihkan untuk tujuan tertentu.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cartesian' && (
              <div className="max-w-4xl animate-fade-in space-y-12">
                <section>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Visual Foundations
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6 leading-[0.9]">Sumbu <span className="text-blue-600">Kartesius</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-xl">
                    Memahami arah data adalah langkah pertama menjadi Master Data. Grafik statistik menggunakan sistem koordinat untuk menghubungkan kategori dengan nilai.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="sticky top-0">
                    <CartesianAid />
                  </div>
                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-l-8 border-emerald-500 shadow-sm group hover:scale-[1.02] transition-transform">
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-xl mb-3 italic uppercase tracking-tighter">Sumbu X (Horizontal)</h4>
                      <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Tempat kita meletakkan <strong>Kategori</strong> atau <strong>Waktu</strong>. Misalnya: Nama Siswa, Bulan, atau Jenis Bantuan. Digambarkan mendatar dari kiri ke kanan.
                      </p>
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-l-8 border-blue-500 shadow-sm group hover:scale-[1.02] transition-transform">
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-xl mb-3 italic uppercase tracking-tighter">Sumbu Y (Vertikal)</h4>
                      <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Tempat kita meletakkan <strong>Nilai</strong> atau <strong>Jumlah</strong>. Sumbu inilah yang harus dijaga kejujurannya (Skala Amanah) dengan memulai dari angka 0.
                      </p>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                       <div className="relative z-10">
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3 italic">Detektif Data Tips</p>
                        <p className="text-lg font-medium leading-relaxed italic opacity-90">
                          "Selalu periksa angka di Sumbu-Y. Jika grafik melonjak tinggi tapi angkanya hanya beda sedikit, kemungkinan besar sumbu tersebut 'dipotong' tidak dari nol!"
                        </p>
                       </div>
                       <PremiumIcon id="detective" size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pedagogy' && (
              <div className="max-w-3xl animate-fade-in space-y-12">
                <section>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    Internal Audit Logic
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6 leading-[0.9]">Logika <span className="text-amber-500">Pedagogis</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-xl">
                    StatsLab menggunakan algoritma audit real-time untuk mendeteksi ketidakkonsistenan data berdasarkan standar integritas akademik.
                  </p>
                </section>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-8 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30">
                    <h4 className="font-black text-rose-800 dark:text-rose-400 text-xl mb-3 uppercase italic tracking-tighter flex items-center gap-2">
                       <PremiumIcon id="detective" size={24} /> Threshold Anomali: 30%
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                      Sistem akan memicu peringatan <strong>Tabayyun</strong> jika selisih antara <strong>Mean</strong> dan <strong>Median</strong> melebihi 30%. Ketimpangan ini menandakan adanya <i>Outlier</i> (pencilan) yang mendistorsi gambaran data secara keseluruhan.
                    </p>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="font-black text-emerald-800 dark:text-emerald-400 text-xl mb-3 uppercase italic tracking-tighter flex items-center gap-2">
                       <PremiumIcon id="master" size={24} /> Integritas Sumbu Y
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
                      Sesuai standar <strong>Integritas Visual</strong>, grafik statistik wajib dimulai dari angka 0 pada Sumbu Y. Memulai grafik dari angka selain nol dapat menciptakan "ilusi perubahan" yang menyesatkan audiens.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mobile' && (
              <div className="max-w-3xl animate-fade-in space-y-12">
                <section>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Multi-Device Experience
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6 leading-[0.9]">Panduan <span className="text-blue-600">Mobile</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-xl">
                    StatsLab dirancang untuk pengalaman riset yang fleksibel, baik di Desktop Laboratorium maupun Perangkat Mobile lapangan.
                  </p>
                </section>

                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                      <PremiumIcon id="reporter" size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-lg uppercase italic tracking-tighter">Card View (Data Table)</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Pada tampilan mobile, tabel data berubah menjadi kartu interaktif. Gunakan input yang lebih besar (min-44px) untuk memudahkan navigasi sentuh.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                      <PremiumIcon id="finder" size={24} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-lg uppercase italic tracking-tighter">Pusat Kontrol (Header)</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Akses switch modul dan pengaturan melalui ikon <strong>Grid</strong> di pojok kanan atas. Gunakan <i>Action Sheet</i> yang muncul untuk kendali penuh.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'glossary' && (
              <div className="max-w-5xl animate-fade-in space-y-12">
                 <section>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                    Data Terminology
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6 leading-[0.9]">Kamus <span className="text-emerald-600">Statistika</span></h3>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { term: "Dataset", def: "Kumpulan data yang sedang kita olah.", icon: "ziswaf" },
                     { term: "Outlier", def: "Data pencilan yang nilainya sangat berbeda drastis dari rata-rata.", icon: "analyst" },
                     { term: "Mean", def: "Nilai tengah yang didapat dari jumlah data dibagi banyaknya data.", icon: "reporter" },
                     { term: "Visualisasi", def: "Cara menampilkan data dalam bentuk gambar/grafik agar mudah dimengerti.", icon: "literasi" },
                     { term: "Anomali", def: "Keanehan atau ketidakteraturan dalam data.", icon: "detective" },
                     { term: "Integritas", def: "Kejujuran dalam menyajikan informasi tanpa manipulasi.", icon: "master" }
                   ].map((item, idx) => (
                     <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group">
                       <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                         <PremiumIcon id={item.icon} size={24} className="text-emerald-500" />
                       </div>
                       <h4 className="font-black text-emerald-600 text-xl mb-2 uppercase tracking-tighter italic leading-none">{item.term}</h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.def}</p>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer (Standardized for all devices) */}
          <div className="p-6 md:p-10 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tighter italic">Global Stat-Pedia</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Akses Referensi Akademik Terverifikasi</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                // Persistent cross-device window.open utility
                const newWindow = window.open(digitalLibraryLink, '_blank', 'noopener,noreferrer');
                if (newWindow) newWindow.opener = null;
              }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 group"
            >
              <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Buka Perpustakaan Digital
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
