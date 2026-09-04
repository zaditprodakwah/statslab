import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ValidationItem, SUSItem } from './types';

// Helper to format date
export function getFormattedDate(): string {
  const now = new Date();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/**
 * Export Aiken's V Expert Validation Matrix as a professional Academic PDF
 */
export function exportValidationPdf({
  domainName,
  tableCode,
  items,
  meanV,
  validCount,
  totalItems
}: {
  domainName: string;
  tableCode: string;
  items: ValidationItem[];
  meanV: string;
  validCount: number;
  totalItems: number;
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Document Metadata
  doc.setProperties({
    title: `Laporan Hasil Uji Validitas Ahli (Aiken's V) - ${domainName}`,
    subject: `Instrumen & Rubrik R&D Media Pembelajaran Statistika Terintegrasi Nilai Keislaman (${tableCode})`,
    author: 'Muhammad Khoiruzzadittaqwa (NIM. 2220020002)',
    keywords: `Aiken V, Validasi Ahli, ${domainName}, Tadris Matematika, STAI Al-Bahjah Cirebon, R&D Statistika`,
    creator: 'Dasbor Instrumen & Rubrik Skripsi STAI Al-Bahjah'
  });

  // Header / Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(24, 30, 75); // Deep Indigo
  doc.text('LAPORAN HASIL UJI VALIDITAS AHLI (AIKEN\'S V)', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text(
    `MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF BERBASIS NILAI KEISLAMAN`,
    pageWidth / 2,
    22,
    { align: 'center' }
  );

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text(
    `Rumpun Validasi: ${domainName.toUpperCase()} (${tableCode}) | Ambang Batas Valid: V >= 0.667 | Rater (n=3)`,
    pageWidth / 2,
    27,
    { align: 'center' }
  );

  // Decorative divider
  doc.setDrawColor(200, 205, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageWidth - 14, 30);

  // Summary Metrics Box
  doc.setFillColor(245, 247, 252);
  doc.roundedRect(14, 33, pageWidth - 28, 18, 2, 2, 'F');
  doc.setDrawColor(215, 222, 240);
  doc.roundedRect(14, 33, pageWidth - 28, 18, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 25, 60);
  doc.text('Ringkasan Psikometrik:', 18, 39);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text(`* Rerata Aiken's V: ${meanV}`, 18, 46);
  doc.text(`* Status Butir Valid: ${validCount} dari ${totalItems} Butir (${((validCount / totalItems) * 100).toFixed(1)}%)`, 75, 46);
  doc.text(`* Kesimpulan: ${validCount === totalItems ? 'Seluruh Butir Valid (Fit)' : 'Terdapat Butir Perlu Revisi'}`, 142, 46);

  // Table rows
  const tableRows = items.map((it, idx) => {
    const s1 = it.r1 - 1;
    const s2 = it.r2 - 1;
    const s3 = it.r3 - 1;
    const sumS = s1 + s2 + s3;
    const vScore = (sumS / (3 * 4)).toFixed(3);
    const isValid = Number(vScore) >= 0.667;

    return [
      String(idx + 1).padStart(2, '0'),
      it.id,
      it.aspect || it.indicator,
      it.statement,
      `${it.r1}`,
      `${it.r2}`,
      `${it.r3}`,
      vScore,
      isValid ? 'VALID' : 'REVISI'
    ];
  });

  autoTable(doc, {
    startY: 55,
    margin: { left: 14, right: 14, bottom: 20 },
    head: [[
      'No',
      'Kode',
      'Aspek/Indikator',
      'Butir Pernyataan',
      'R1',
      'R2',
      'R3',
      'V-Index',
      'Status'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [27, 38, 90],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      overflow: 'linebreak',
      valign: 'top',
      textColor: [35, 35, 35],
      lineColor: [220, 225, 235],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 32, fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 7, halign: 'center' },
      5: { cellWidth: 7, halign: 'center' },
      6: { cellWidth: 7, halign: 'center' },
      7: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      8: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 8) {
        if (data.cell.raw === 'VALID') {
          data.cell.styles.textColor = [16, 120, 60];
        } else {
          data.cell.styles.textColor = [180, 40, 40];
        }
      }
    }
  });

  // Footer & Signature
  // @ts-expect-error jspdf-autotable extends doc
  const finalY = doc.lastAutoTable.finalY || 180;
  
  if (finalY < 230) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Cirebon, ${getFormattedDate()}`, pageWidth - 60, finalY + 12);
    doc.text('Peneliti / Pengembang,', pageWidth - 60, finalY + 17);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Muhammad Khoiruzzadittaqwa', pageWidth - 60, finalY + 34);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('NIM. 2220020002', pageWidth - 60, finalY + 38);
  }

  // Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Dokumen Skripsi - Tadris Matematika STAI Al-Bahjah Cirebon | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  doc.save(`hasil-uji-validitas-aiken-${domainName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

/**
 * Export System Usability Scale (SUS) Assessment as a professional PDF
 */
export function exportSUSPdf({
  items,
  calculatedScore,
  grade,
  adjective,
  acceptability
}: {
  items: SUSItem[];
  calculatedScore: string | number;
  grade: string;
  adjective: string;
  acceptability: string;
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const numScore = typeof calculatedScore === 'number' ? calculatedScore : parseFloat(calculatedScore) || 0;

  // Document Metadata
  doc.setProperties({
    title: `Hasil Pengukuran System Usability Scale (SUS) - Skor ${numScore.toFixed(1)}`,
    subject: 'Uji Kepraktisan Media Pembelajaran Dasbor Statistika Interaktif 14 Butir Adaptif',
    author: 'Muhammad Khoiruzzadittaqwa (NIM. 2220020002)',
    keywords: 'System Usability Scale, SUS, Kepraktisan Media, Tadris Matematika, STAI Al-Bahjah Cirebon',
    creator: 'Dasbor Instrumen & Rubrik Skripsi STAI Al-Bahjah'
  });

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(24, 30, 75);
  doc.text('HASIL PENGUKURAN SYSTEM USABILITY SCALE (SUS)', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text(
    'MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF (14 BUTIR ADAPTIF)',
    pageWidth / 2,
    22,
    { align: 'center' }
  );

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text(
    'Standarisasi John Brooke (1996) | Responden Uji Coba: n = 125 Siswa SMP/MTs | Acuan Tabel 3.5',
    pageWidth / 2,
    27,
    { align: 'center' }
  );

  doc.setDrawColor(200, 205, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageWidth - 14, 30);

  // Score Banner Box
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(14, 33, pageWidth - 28, 20, 2, 2, 'F');
  doc.setDrawColor(190, 210, 245);
  doc.roundedRect(14, 33, pageWidth - 28, 20, 2, 2, 'S');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 40, 120);
  doc.text(`${numScore.toFixed(1)} / 100`, 20, 45);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(`Predikat: ${adjective} (${grade})`, 65, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Tingkat Keberterimaan: ${acceptability} | Kriteria Kelayakan Skripsi: >= 70.0 (Acceptable)`, 65, 47);

  // Items Table
  const tableRows = items.map((it) => {
    const raw = it.score;
    const isPos = it.isPositive;
    const contribution = isPos ? raw - 1 : 5 - raw;

    return [
      String(it.id).padStart(2, '0'),
      it.dimension,
      it.text,
      isPos ? 'Positif (+)' : 'Negatif (-)',
      `${raw}`,
      `${contribution}`
    ];
  });

  autoTable(doc, {
    startY: 57,
    margin: { left: 14, right: 14, bottom: 20 },
    head: [[
      'No',
      'Dimensi Usabilitas',
      'Butir Pernyataan Kuesioner SUS',
      'Polaritas',
      'Skor Mentah',
      'Kontribusi (0-4)'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      overflow: 'linebreak',
      textColor: [35, 35, 35],
      lineColor: [220, 225, 235],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
    }
  });

  // @ts-expect-error jspdf-autotable extends doc
  const finalY = doc.lastAutoTable?.finalY || 200;

  if (finalY < 240) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90, 90, 90);
    doc.text(
      'Algoritma Konversi: Skor = [ sum(Skor Positif - 1) + sum(5 - Skor Negatif) ] / 56 * 100',
      14,
      finalY + 8
    );

    doc.setFont('helvetica', 'normal');
    doc.text(`Cirebon, ${getFormattedDate()}`, pageWidth - 60, finalY + 12);
    doc.text('Penguji Kepraktisan,', pageWidth - 60, finalY + 16);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Muhammad Khoiruzzadittaqwa', pageWidth - 60, finalY + 30);
    doc.setFont('helvetica', 'normal');
    doc.text('NIM. 2220020002', pageWidth - 60, finalY + 34);
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Dicetak dari Aplikasi Dokumentasi Instrumen & Rubrik Skripsi (Tadris Matematika STAI Al-Bahjah) | Halaman ${i} dari ${totalPages}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save('hasil-pengujian-sus-14-butir.pdf');
}

/**
 * Export Blank or Filled Official Validation Sheet ready for print / rater signature
 */
export function exportOfficialValidationSheetPdf({
  domainTitle,
  tableCode,
  expertRole,
  items,
  validatorName,
  validatorNip,
  validatorInstansi,
  assessmentDate,
  city
}: {
  domainTitle: string;
  tableCode: string;
  expertRole: string;
  items: ValidationItem[];
  validatorName?: string;
  validatorNip?: string;
  validatorInstansi?: string;
  assessmentDate?: string;
  city?: string;
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Document Metadata
  doc.setProperties({
    title: `${domainTitle} - Lembar Instrumen Validasi`,
    subject: `Format Lembar Penilaian Rater Ahli - Skripsi Tadris Matematika STAI Al-Bahjah (${tableCode})`,
    author: 'Muhammad Khoiruzzadittaqwa (NIM. 2220020002)',
    keywords: `Lembar Validasi, ${expertRole}, Tadris Matematika, STAI Al-Bahjah Cirebon, R&D Statistika`,
    creator: 'Dasbor Instrumen & Rubrik Skripsi STAI Al-Bahjah'
  });

  // Header / Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(domainTitle.toUpperCase(), pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(9);
  doc.text(
    'PENGEMBANGAN MEDIA PEMBELAJARAN DASBOR STATISTIKA INTERAKTIF TERINTEGRASI NILAI KEISLAMAN',
    pageWidth / 2,
    19,
    { align: 'center' }
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Program Studi Tadris Matematika | STAI Al-Bahjah Cirebon | Acuan: ${tableCode}`,
    pageWidth / 2,
    24,
    { align: 'center' }
  );

  doc.setLineWidth(0.6);
  doc.line(14, 26, pageWidth - 14, 26);
  doc.setLineWidth(0.2);
  doc.line(14, 27, pageWidth - 14, 27);

  // Validator Metadata Box
  doc.setFontSize(8);
  doc.text(`Nama Validator   : ${validatorName || '...........................................................................'}`, 14, 33);
  doc.text(`NIP / NIDN       : ${validatorNip || '...........................................................................'}`, 14, 38);
  doc.text(`Instansi / Unit  : ${validatorInstansi || 'STAI Al-Bahjah Cirebon'}`, 14, 43);

  doc.text(`Bidang Kepakaran : [ X ] ${expertRole}`, 115, 33);
  doc.text(`Tanggal Penilaian: ${assessmentDate || '................................................'}`, 115, 38);
  doc.text(`Skala Penilaian  : 1 (Sangat Tidak Sesuai) s.d. 5 (Sangat Sesuai)`, 115, 43);

  // Instructions
  doc.setFillColor(248, 248, 248);
  doc.rect(14, 46, pageWidth - 28, 10, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PETUNJUK PENGISIAN:', 16, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Berikan tanda centang (v) pada salah satu kolom skala penilaian (1 - 5) yang paling sesuai, serta berikan catatan perbaikan pada kolom yang disediakan.',
    16,
    54
  );

  // Checklist Table
  const tableRows = items.map((it, idx) => [
    String(idx + 1).padStart(2, '0'),
    `[${it.id}] ${it.indicator}\n${it.statement}`,
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  autoTable(doc, {
    startY: 58,
    margin: { left: 14, right: 14, bottom: 50 },
    head: [[
      'No',
      'Aspek / Indikator & Butir Pernyataan',
      '1',
      '2',
      '3',
      '4',
      '5',
      'Catatan / Saran Khusus'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      overflow: 'linebreak',
      textColor: [0, 0, 0],
      lineColor: [100, 100, 100],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 7, halign: 'center' },
      3: { cellWidth: 7, halign: 'center' },
      4: { cellWidth: 7, halign: 'center' },
      5: { cellWidth: 7, halign: 'center' },
      6: { cellWidth: 7, halign: 'center' },
      7: { cellWidth: 38, halign: 'center' }
    }
  });

  // @ts-expect-error jspdf-autotable extends doc
  const finalY = doc.lastAutoTable.finalY || 190;

  // If table went too close to bottom, add new page for signature block
  if (finalY > 225) {
    doc.addPage();
    drawSignatureBlock(doc, pageWidth, 20, city, assessmentDate, expertRole, validatorName, validatorNip);
  } else {
    drawSignatureBlock(doc, pageWidth, finalY + 6, city, assessmentDate, expertRole, validatorName, validatorNip);
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Lampiran Instrumen Skripsi - Tadris Matematika STAI Al-Bahjah | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  doc.save(`form-lembar-validasi-${expertRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`);
}

function drawSignatureBlock(
  doc: jsPDF, 
  pageWidth: number, 
  startY: number, 
  city?: string, 
  assessmentDate?: string, 
  expertRole?: string, 
  validatorName?: string, 
  validatorNip?: string
) {
  // Qualitative Comment Box
  doc.setDrawColor(100, 100, 100);
  doc.rect(14, startY, pageWidth - 28, 18);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('KOMENTAR / SARAN PERBAIKAN UMUM:', 17, startY + 5);

  // Conclusion & Signature
  const sigY = startY + 22;
  doc.rect(14, sigY, (pageWidth - 28) / 2 - 2, 28);
  doc.text('KESIMPULAN KELAYAKAN:', 17, sigY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('[  ] Layak digunakan tanpa revisi', 17, sigY + 11);
  doc.text('[  ] Layak digunakan dengan revisi sesuai saran', 17, sigY + 17);
  doc.text('[  ] Tidak layak digunakan / perlu revisi total', 17, sigY + 23);

  const rightX = 14 + (pageWidth - 28) / 2 + 6;
  doc.text(`${city || 'Cirebon'}, ${assessmentDate || '........................ 2026'}`, rightX, sigY + 5);
  doc.text(`Validator ${expertRole || 'Ahli'},`, rightX, sigY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`( ${validatorName || '...................................................'} )`, rightX, sigY + 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`NIP/NIDN: ${validatorNip || '............................................'}`, rightX, sigY + 27);
}
