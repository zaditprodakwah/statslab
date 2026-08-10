import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { sessionId, taskId, timeSpentMs, attempts, answerHistory, scrollDepth } = data;

    if (!sessionId || !taskId) {
      return NextResponse.json({ error: 'Missing session or task ID' }, { status: 400 });
    }

    const interactionLog = {
      timeSpentMs: timeSpentMs || 0,
      attempts: attempts || 1,
      answerHistory: answerHistory || [],
      scrollDepth: scrollDepth || 0,
      timestamp: new Date().toISOString()
    };

    // Upsert task response with the interaction log
    await prisma.taskResponse.upsert({
      where: {
        sessionId_taskId: {
          sessionId,
          taskId
        }
      },
      update: {
        interactionLog,
        attempts: {
          increment: 1
        }
      },
      create: {
        sessionId,
        taskId,
        score: 0,
        interactionLog,
        attempts: 1
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telemetry error:', error);
    return NextResponse.json({ error: 'Failed to record telemetry' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
