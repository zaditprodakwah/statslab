import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportToRaschPCM() {
  console.log('Starting data export for Rasch PCM...');
  
  // Ambil semua TaskResponse yang valid
  const responses = await prisma.taskResponse.findMany({
    include: {
      task: true,
      session: true
    },
    orderBy: [
      { sessionId: 'asc' },
      { task: { taskNumber: 'asc' } }
    ]
  });

  if (responses.length === 0) {
    console.log('No data found to export.');
    return;
  }

  // Pengelompokan data per sesi (siswa)
  const sessionData: Record<string, Record<number, number>> = {};
  const taskNumbers = new Set<number>();

  responses.forEach(r => {
    if (!sessionData[r.sessionId]) {
      sessionData[r.sessionId] = {};
    }
    // Skor Winsteps/Rasch PCM biasanya berupa integer (0, 1, 2, dll).
    sessionData[r.sessionId][r.task.taskNumber] = r.score;
    taskNumbers.add(r.task.taskNumber);
  });

  const sortedTaskNumbers = Array.from(taskNumbers).sort((a, b) => a - b);
  
  // Buat CSV Matrix
  let csvContent = 'SessionID,' + sortedTaskNumbers.map(t => `Task${t}`).join(',') + '\n';
  
  Object.keys(sessionData).forEach(sessionId => {
    const row = [sessionId];
    sortedTaskNumbers.forEach(t => {
      // Jika siswa tidak menjawab task tertentu, beri NA atau 0
      const score = sessionData[sessionId][t];
      row.push(score !== undefined ? score.toString() : 'NA');
    });
    csvContent += row.join(',') + '\n';
  });

  const outputDir = path.join(__dirname, '../../data-exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvPath = path.join(outputDir, 'rasch_matrix.csv');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`Successfully exported matrix to ${csvPath}`);
  
  // Buat .ctl (Control File untuk Winsteps) - template dasar
  const ctlContent = `&INST
TITLE="StatsLab Rasch PCM Analysis"
PERSON=Student
ITEM=Task
ITEM1=1
NI=${sortedTaskNumbers.length}
NAME1=1
NAMELEN=36
XWIDE=1
CODES="012"
DATA="rasch_matrix.csv"
&END
${sortedTaskNumbers.map(t => `Task${t}`).join('\n')}
END NAMES`;

  const ctlPath = path.join(outputDir, 'analysis.ctl');
  fs.writeFileSync(ctlPath, ctlContent);
  console.log(`Successfully exported Winsteps control file to ${ctlPath}`);
}

exportToRaschPCM()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
