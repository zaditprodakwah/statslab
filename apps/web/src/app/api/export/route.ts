import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const sessionData: Record<string, Record<number, number>> = {};
    const taskNumbers = new Set<number>();

    responses.forEach(r => {
      if (!sessionData[r.sessionId]) {
        sessionData[r.sessionId] = {};
      }
      sessionData[r.sessionId][r.task.taskNumber] = r.score;
      taskNumbers.add(r.task.taskNumber);
    });

    const sortedTaskNumbers = Array.from(taskNumbers).sort((a, b) => a - b);
    
    let csvContent = 'SessionID,' + sortedTaskNumbers.map(t => `Task${t}`).join(',') + '\n';
    Object.keys(sessionData).forEach(sessionId => {
      const row = [sessionId];
      sortedTaskNumbers.forEach(t => {
        const score = sessionData[sessionId][t];
        row.push(score !== undefined ? score.toString() : 'NA');
      });
      csvContent += row.join(',') + '\n';
    });

    // We can return CSV directly
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="rasch_matrix.csv"',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
