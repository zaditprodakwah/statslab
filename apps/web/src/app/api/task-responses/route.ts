import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAnswer, clampScore } from "@/lib/scoring";
import { computeWatsonLevel } from "@/lib/watsonLevel";

export const dynamic = "force-dynamic";



export async function POST(req: Request) {


  try {
    const body = await req.json();
    const { sessionId, sessionToken, taskId, answerText, interactionLog } = body;

    if (!sessionId || !taskId) {
      return NextResponse.json(
        { error: "sessionId dan taskId wajib diisi" },
        { status: 400 }
      );
    }

    // F1.3: Verifikasi sessionToken — hanya pemilik sesi yang boleh mencatat jawaban.
    if (!sessionToken) {
      return NextResponse.json(
        { error: "sessionToken wajib diisi" },
        { status: 401 }
      );
    }
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.sessionToken !== sessionToken) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau token tidak cocok" },
        { status: 401 }
      );
    }

    // F1.2: Skoring dilakukan server-side (shared util + rubrik dari DB).
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, modelAnswer: true, watsonLevel: true }
    });
    if (!task) {
      return NextResponse.json(
        { error: "Task tidak ditemukan" },
        { status: 404 }
      );
    }
    const rubric = await prisma.rubric.findUnique({
      where: { watsonLevel: task.watsonLevel },
      select: { keywords: true }
    });
    const score = clampScore(
      scoreAnswer(answerText || "", task.modelAnswer, rubric?.keywords || [])
    );

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
        score,
        interactionLog: interactionLog || null
      },
      create: {
        sessionId,
        taskId,
        answerText: answerText || "",
        score,
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

    // Mastery-based Watson-Callingham level via shared util (F1.1)
    const [allTasks, allResponses] = await Promise.all([
      prisma.task.findMany({ select: { id: true, watsonLevel: true } }),
      prisma.taskResponse.findMany({
        where: { sessionId },
        select: { taskId: true, score: true }
      })
    ]);

    const responsesMap: Record<string, { score: number }> = {};
    for (const r of allResponses) {
      responsesMap[r.taskId] = { score: r.score };
    }
    const newLevel = computeWatsonLevel(responsesMap, allTasks);

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
        score,
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
