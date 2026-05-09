# **📊 LAPORAN AUDIT & ROADMAP IMPLEMENTASI: STATSLAB V1**

**Dokumen Evaluasi Teknis, Performa, UI/UX, dan Arahan Kode**

*Versi: 2.1 (Actionable Directives untuk AI Coder \- Fokus Skalabilitas & Multi-Device)*

## **1\. STATUS SISTEM SAAT INI**

Berdasarkan penelaahan repositori kode (src/) dan pratinjau UI/UX, purwarupa StatsLab V1 telah menerjemahkan landasan teoretis (Hierarki Watson-Callingham, *Cognitive Load Theory*/CLT, dan Epistemologi Islam) ke dalam komponen React.

Namun, arsitektur saat ini memiliki inefisiensi pada manajemen *state*, siklus *rendering*, serta belum teroptimasi secara penuh untuk skalabilitas dan pengalaman multi-perangkat (*desktop* vs *mobile*). Hal ini berpotensi menurunkan performa dan efektivitas aplikasi saat diakses melalui gawai berspesifikasi rendah dengan ukuran layar terbatas.

## **2\. EVALUASI KRITIS & TEMUAN (FINDINGS)**

### **A. Arsitektur & Performa (Efisiensi Sistem)**

* **Prop Drilling Eksesif:** App.jsx bertindak sebagai *God Component*. Komponen ini memegang seluruh *state* (moduleData, isDark, gamify, profile) dan mendistribusikannya melalui *props* berlapis. Hal ini menyebabkan kesulitan pemeliharaan dan memicu *re-render* yang tidak perlu pada komponen yang tidak terdampak.  
* **Sinkronisasi LocalStorage Sinkron:** Fungsi useEffect di App.jsx menyimpan moduleData secara langsung ke localStorage setiap kali terjadi perubahan sekecil apa pun pada data. Ini berpotensi memblokir *main thread* (menyebabkan jeda UI) jika *array* data membesar.  
* **Re-render Chart.js:** Komponen grafik di modul pembelajaran (seperti ZiswafModule.jsx) tidak memoisasi (*memoize*) objek data dan options. Akibatnya, react-chartjs-2 menghancurkan dan membangun ulang kanvas setiap kali ada pembaruan *state*.

### **B. Responsivitas & Interaktivitas Multi-Perangkat (UI/UX)**

* **Konflik Z-Index & Overlap:** Terdapat risiko tumpang tindih visual antara GuideBubble.jsx, TabayyunAlert.jsx, dan Toast.jsx jika sebuah aksi memicu ketiganya secara bersamaan, melanggar prinsip CLT (*Split-Attention Effect*).  
* **Paritas Desktop vs Mobile:** Interaktivitas sistem saat ini bias terhadap pengguna desktop.  
  * **Tabel Non-Responsif:** Pada antarmuka seluler, DataTable.jsx memaksa pengguna melakukan *scroll* horizontal, memaksa pergeseran tata letak (*layout shift*).  
  * **Target Sentuh (*Touch Targets*):** Beberapa elemen interaktif (seperti *slider* filter, tombol *tooltip*, dan AmanahToggle) tidak memenuhi standar minimum area sentuh (44x44px), sehingga menyulitkan navigasi di layar sentuh (*smartphone*).  
  * **Interaksi Grafik (*Chart Interactions*):** *Tooltip* pada Chart.js terpotong pada layar kecil, dan grafik tidak melakukan kalibrasi *resize* dinamis secara optimal saat orientasi perangkat (*portrait*/*landscape*) diubah.

### **C. Keselarasan Dokumentasi Internal**

* **Kesenjangan Informasi UI & Fitur:** Logika teknis di *backend* (useTabayyun.js menggunakan ambang batas 30%, useAmanah.js mengunci sumbu Y ke 0\) sudah berjalan, namun tidak terekspos eksplisit. Selain itu, penyesuaian interaksi untuk pengguna mobile belum terdokumentasi di pusat bantuan aplikasi.

## **3\. ROADMAP IMPLEMENTASI (ARAHAN UNTUK AI CODER)**

Bagian ini adalah instruksi wajib yang harus dijalankan oleh *AI Coder* secara bertahap tanpa mengubah fungsionalitas inti aplikasi.

### **FASE 1: Refaktor Manajemen State (Prioritas Tinggi)**

1. **Ekstraksi Context:** \* Buat src/contexts/GamifyContext.jsx dan pindahkan seluruh logika useGamify.js ke dalamnya.  
   * Buat src/contexts/ModuleDataContext.jsx untuk menyimpan dan memanipulasi moduleData.  
2. **Pembersihan App.jsx:** Hapus *prop drilling*. Pastikan komponen modul (misal: ZiswafModule.jsx) mengonsumsi fungsi pembaruan data dan gamifikasi secara langsung melalui useContext().

### **FASE 2: Optimasi Performa & Rendering (Prioritas Tinggi)**

1. **Debounce LocalStorage:**  
   * Implementasikan *custom hook* useDebounceSave (penundaan \~500ms) di dalam *Context* sebelum menjalankan localStorage.setItem('statslab\_module\_data', ...) untuk mencegah *stuttering*.  
2. **Memoize Konfigurasi Chart:**  
   * Di dalam setiap file modul, bungkus *prop* data dan options untuk komponen Chart dengan useMemo.  
     const chartData \= useMemo(() \=\> ({ labels, datasets }), \[data\_source\]);

### **FASE 3: Fungsionalitas & Responsivitas Multi-Device (Prioritas Tinggi)**

1. **Orkestrasi Notifikasi:** \* Modifikasi GuideBubble.jsx agar memantau *state* peringatan. Jika TabayyunAlert aktif, set GuideBubble ke mode *minimized* (tersembunyi sementara).  
2. **Tabel Seluler (Mobile Cards):**  
   * Edit DataTable.jsx. Gunakan *utility classes* Tailwind (misal: md:table, block, md:table-row, flex-col) untuk mengubah format \<table\> menjadi susunan Kartu Vertikal ketika lebar layar di bawah *breakpoint* sm (640px).  
3. **Standarisasi Area Sentuh (Touch Targets):**  
   * Modifikasi tombol navigasi, kontrol filter, dan AmanahToggle.jsx. Pastikan memiliki properti min-h-\[44px\] min-w-\[44px\] atau p-3 ke atas agar mudah ditekan di layar sentuh. Ganti interaksi yang murni bergantung pada hover dengan alternatif yang mendukung aksi ketuk (tap/click).  
4. **Kalibrasi Chart.js untuk Mobile:**  
   * Tambahkan maintainAspectRatio: false dan responsive: true pada options Chart.js.  
   * Atur opsi interaksi *tooltip*: interaction: { mode: 'index', intersect: false } agar titik data pada grafik mudah disentuh oleh jari tanpa harus berada persis di atas titik (titik piksel akurat).

### **FASE 4: Penyesuaian Teks & Dokumentasi Aplikasi (Wajib)**

*Setiap perubahan fitur di atas harus diiringi dengan pembaruan dokumentasi internal aplikasi berikut:*

1. **Pembaruan AcademicKnowledgeBase.jsx:**  
   * Tambahkan paragraf definitif mengenai logika sistem:  
     * *"Sistem mendeteksi anomali (Tabayyun) jika selisih absolut antara Mean dan Median melampaui 30% dari nilai Median."*  
     * *"Integritas Amanah dievaluasi melalui skala visual; grafik yang jujur wajib mendudukkan nilai Sumbu Y dari angka Nol."*  
2. **Pembaruan HelpModal.jsx (Panduan Multi-Device):** \* Tambahkan instruksi eksplisit mengenai relasi level (1-6) dengan tugasnya.  
   * Tambahkan seksi khusus **Panduan Penggunaan Mobile**: *"Untuk perangkat smartphone, ketuk (tap) pada area grafik untuk melihat detail nilai, dan gunakan mode portrait/landscape untuk menyesuaikan tampilan data."*

**Instruksi Eksekusi AI:** Jalankan implementasi secara berurutan mulai dari **Fase 1** hingga **Fase 4**. Lakukan *build test* internal setelah setiap fase untuk memastikan tidak ada fungsionalitas lama (misal: *Expert Validation Hub* dan cetak PDF) yang rusak (*breaking changes*).