import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function POST(req: Request) {


  try {
    const body = await req.json();
    const { sessionId, taskId, answerText, score, interactionLog } = body;

    if (!sessionId || !taskId) {
      return NextResponse.json(
        { error: "sessionId dan taskId wajib diisi" },
        { status: 400 }
      );
    }

    // Upsert task response
    const response = await prisma.taskResponse.upsert({
      where: {
        sessionId_taskId: {
          sessionId,
          taskId
        }
      },
      update: {
        answerText: answerText || "",
        score: score || 0,
        interactionLog: interactionLog || null
      },
      create: {
        sessionId,
        taskId,
        answerText: answerText || "",
        score: score || 0,
        interactionLog: interactionLog || null,
        scoredBy: "system"
      }
    });

    // Calculate sum of scores for this session
    const aggregate = await prisma.taskResponse.aggregate({
      where: { sessionId },
      _sum: { score: true }
    });

    const newTotalScore = aggregate._sum.score || 0;

    // Count completed tasks to calculate level
    const completedCount = await prisma.taskResponse.count({
      where: { sessionId }
    });

    let newLevel = 1;
    if (completedCount >= 8) newLevel = 6;
    else if (completedCount >= 6) newLevel = 5;
    else if (completedCount >= 4) newLevel = 4;
    else if (completedCount >= 2) newLevel = 3;
    else if (completedCount >= 1) newLevel = 2;

    // Update session stats
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        totalScore: newTotalScore,
        currentLevel: newLevel
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        responseId: response.id,
        totalScore: newTotalScore,
        currentLevel: newLevel
      }
    });
  } catch (error) {
    console.error("Error saving task response:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan jawaban tugas ke database." },
      { status: 500 }
    );
  }
}
