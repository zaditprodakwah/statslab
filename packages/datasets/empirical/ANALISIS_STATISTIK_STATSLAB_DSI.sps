* ==============================================================================
* IBM SPSS STATISTICS SYNTAX SCRIPT
* JUDUL RISET : PENGEMBANGAN DASBOR STATISTIKA INTERAKTIF TERINTEGRASI NILAI KEISLAMAN
* PENELITI    : MUHAMMAD KHOIRUZZADITTAQWA (NIM: 2220020002)
* PROGRAM     : TADRIS MATEMATIKA - INSTITUT AL-BAHJAH CIREBON
* TANGGAL     : OKTOBER 2026
* ============================================================================== .

* ------------------------------------------------------------------------------
* 1. MEMBUKA DATASET PENGALAMAN SISWA (N = 31)
* ------------------------------------------------------------------------------ .
GET FILE='/Users/mac/Documents/AGENTS_WORK_HUB/01_AKADEMIK_RISET/01_SKRIPSI_UTAMA/03_Data_Instrumen/SPSS_Exports/SPSS_DATA_PENGALAMAN_SISWA_N31.sav'.
DATASET NAME SiswaExperience WINDOW=FRONT.

* ------------------------------------------------------------------------------
* 2. DESCRIPTIVE STATISTICS 10 BUTIR SYSTEM USABILITY SCALE (SUS) SISWA
* ------------------------------------------------------------------------------ .
DESCRIPTIVES VARIABLES=SUS_01 SUS_02 SUS_03 SUS_04 SUS_05 SUS_06 SUS_07 SUS_08 SUS_09 SUS_10
  /STATISTICS=MEAN STDDEV MIN MAX SEMEAN.

* ------------------------------------------------------------------------------
* 3. UJI RELIABILITAS KONSISTENSI INTERNAL (CRONBACH'S ALPHA) 10 BUTIR SUS
* Catatan: Butir nomor genap (Q2, Q4, Q6, Q8, Q10) menggunakan variabel recoded
*          (SUS_02_REC, SUS_04_REC, dst.) agar berarah positif searah.
* ------------------------------------------------------------------------------ .
RELIABILITY
  /VARIABLES=SUS_01 SUS_02_REC SUS_03 SUS_04_REC SUS_05 SUS_06_REC SUS_07 SUS_08_REC SUS_09 SUS_10_REC
  /SCALE('System Usability Scale 10 Items') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE SCALE
  /SUMMARY=TOTAL.

* ------------------------------------------------------------------------------
* 4. UJI RELIABILITAS ANGKET KESELURUHAN (SUS + 4 BUTIR KHUSUS) (14 BUTIR)
* ------------------------------------------------------------------------------ .
RELIABILITY
  /VARIABLES=SUS_01 SUS_02_REC SUS_03 SUS_04_REC SUS_05 SUS_06_REC SUS_07 SUS_08_REC SUS_09 SUS_10_REC
             ETIKA_11 ETIKA_12 ETIKA_13 ETIKA_14
  /SCALE('Angket Pengalaman Belajar Siswa Lengkap') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE SCALE
  /SUMMARY=TOTAL.

* ------------------------------------------------------------------------------
* 5. STATISTIKA DESKRIPTIF SKOR BAKU SUS (0 - 100)
* ------------------------------------------------------------------------------ .
DESCRIPTIVES VARIABLES=SUS_TOTAL
  /STATISTICS=MEAN STDDEV MIN MAX SEMEAN KURTOSIS SKEWNESS.

FREQUENCIES VARIABLES=SUS_TOTAL
  /FORMAT=NOTABLE
  /PERCENTILES=25.0 50.0 75.0
  /HISTOGRAM NORMAL
  /ORDER=ANALYSIS.

* ------------------------------------------------------------------------------
* 6. DESCRIPTIVES 4 BUTIR KHUSUS KARAKTER ETIS & SOSIOMATEMATIKA
* ------------------------------------------------------------------------------ .
DESCRIPTIVES VARIABLES=ETIKA_11 ETIKA_12 ETIKA_13 ETIKA_14
  /STATISTICS=MEAN STDDEV MIN MAX.

* ------------------------------------------------------------------------------
* 7. ANALISIS DATA KEPRAKTISAN GURU (N = 4)
* ------------------------------------------------------------------------------ .
GET FILE='/Users/mac/Documents/AGENTS_WORK_HUB/01_AKADEMIK_RISET/01_SKRIPSI_UTAMA/03_Data_Instrumen/SPSS_Exports/SPSS_DATA_KEPRAKTISAN_GURU_N4.sav'.
DATASET NAME TeacherUsability WINDOW=FRONT.

DESCRIPTIVES VARIABLES=GURU_SUS_TOTAL KEPRAKTISAN_TOTAL KEPRAKTISAN_PCT
  /STATISTICS=MEAN STDDEV MIN MAX SEMEAN.

LIST VARIABLES=ID_GURU NAMA_GURU SEKOLAH GURU_SUS_TOTAL KEPRAKTISAN_PCT.
