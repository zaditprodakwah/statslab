import { useState } from 'react'
import { BookOpen, X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react'

export function AcademicKnowledgeBase({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tor')

  if (!isOpen) return null

  const tabs = [
    { id: 'tor', label: 'Term of Reference (TOR)', icon: FileText },
    { id: 'tos', label: 'Terms of Service (TOS)', icon: CheckCircle2 },
    { id: 'disclaimer', label: 'Disclaimer & Etik', icon: ShieldAlert }
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Academic Knowledge Base</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dokumen Legal & Akademik StatsLab</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 focus:outline-none ${
                  isActive 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
          <div className="prose prose-sm dark:prose-invert prose-emerald max-w-none text-slate-600 dark:text-slate-300">
            
            {activeTab === 'tor' && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Term of Reference (TOR) - Pembelajaran Statistika Berbasis Realitas</h3>
                <p>
                  <strong>Latar Belakang:</strong> Pembelajaran statistika di tingkat menengah (SMP/MTs) seringkali terjebak pada hafalan rumus tanpa memahami konteks dunia nyata. StatsLab hadir sebagai platform inovatif yang menjembatani teori akademik dengan realitas sosial, ekonomi, dan lingkungan.
                </p>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">Tujuan Akademik</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Meningkatkan kemampuan <strong>Literasi Data</strong> siswa melalui studi kasus nyata.</li>
                  <li>Mengintegrasikan nilai-nilai karakter, khususnya <strong>Tabayyun</strong> (verifikasi data) dan <strong>Amanah</strong> (kejujuran visualisasi).</li>
                  <li>Menerapkan prinsip <em>Data Storytelling</em> agar siswa dapat menceritakan makna di balik angka.</li>
                </ul>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">Metodologi</h4>
                <p>
                  StatsLab menggunakan pendekatan <em>Scenario-Based Learning</em> dan <em>Gamification</em>. Siswa akan dihadapkan pada dua jenis skenario: Normal dan Anomali (misalnya data yang memiliki pencilan ekstrem). Hal ini memaksa siswa berpikir kritis tentang kapan menggunakan Mean dan kapan menggunakan Median, mensimulasikan proses Tabayyun di dunia nyata.
                </p>
              </div>
            )}

            {activeTab === 'tos' && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Terms of Service (TOS) & Kode Etik Pengguna</h3>
                <p>
                  Dengan menggunakan platform StatsLab, setiap pengguna (siswa, pendidik, dan peneliti) menyetujui persyaratan layanan berikut:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">1. Integritas Akademik (Prinsip Amanah)</h4>
                  <p className="text-sm">
                    Pengguna dilarang dengan sengaja memanipulasi pengaturan visualisasi grafik (seperti memotong sumbu Y atau mengatur skala secara tidak proporsional) dengan tujuan untuk menipu, melebih-lebihkan, atau menyembunyikan fakta dari data (<em>Misleading Graphs</em>). Platform akan mendeteksi dan memberi peringatan pada manipulasi semacam ini.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">2. Verifikasi Data (Prinsip Tabayyun)</h4>
                  <p className="text-sm">
                    Pengguna wajib memeriksa secara teliti jika terdapat data anomali atau pencilan (<em>outliers</em>) sebelum mengambil kesimpulan statistik. Kelalaian dalam mengidentifikasi anomali yang berujung pada analisis yang bias melanggar nilai Tabayyun dalam pengolahan informasi.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">3. Penggunaan Modul</h4>
                  <p className="text-sm">
                    Progres, skor, dan data gamifikasi direkam secara lokal di peramban pengguna. StatsLab tidak bertanggung jawab atas hilangnya progres jika data lokal dibersihkan.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'disclaimer' && (
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Disclaimer & Peringatan Risiko</h3>
                
                <div className="flex gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <div className="mt-1 flex-shrink-0 text-amber-500">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Status Data & Skenario</h4>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
                      Beberapa dataset yang digunakan dalam StatsLab (seperti Ziswaf, Tahfizh, Qurban, Literasi) merupakan simulasi akademis yang didasarkan pada proporsi dunia nyata, namun telah disesuaikan (<em>adjusted</em>) untuk tujuan pedagogis. Data ini TIDAK DAPAT dijadikan referensi utama untuk pengambilan kebijakan resmi di luar konteks simulasi aplikasi ini.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Batasan Sistem</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>Algoritma Deteksi Amanah:</strong> Peringatan manipulasi grafik (<em>Amanah Checker</em>) didasarkan pada deteksi matematis sederhana terhadap batas sumbu Y. Tidak menutup kemungkinan ada kasus khusus di mana pemotongan sumbu Y dapat dibenarkan secara statistik lanjutan.</li>
                    <li><strong>Penyimpanan Progres:</strong> Aplikasi bersifat <em>client-side</em> tanpa database terpusat. Keamanan dan keberlanjutan data bergantung sepenuhnya pada manajemen penyimpanan lokal perangkat masing-masing pengguna.</li>
                    <li><strong>Evaluasi:</strong> Sistem sertifikasi akhir didasarkan pada logika heuristik gamifikasi. Keabsahan sertifikat murni untuk validasi partisipasi dalam simulasi ini, bukan merupakan gelar akademik resmi.</li>
                  </ul>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 dark:focus:ring-offset-slate-900"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>
    </div>
  )
}
