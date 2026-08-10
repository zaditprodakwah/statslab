import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAnswer, clampScore, scoreChoice } from "@/lib/scoring";
import type { TaskOptions } from "@/lib/scoring";
import { isPrerequisiteLocked } from "@/lib/taskPrereq";
import type { ModuleState } from "@/lib/taskPrereq";
import { computeWatsonLevel } from "@/lib/watsonLevel";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      sessionToken,
      taskId,
      answerText,
      answerIndex,
      interactionLog,
      moduleState,
    } = body;

    if (!sessionId || !taskId) {
      return NextResponse.json({ error: "sessionId dan taskId wajib diisi" }, { status: 400 });
    }

    // F1.3: Verifikasi sessionToken — hanya pemilik sesi yang boleh mencatat jawaban.
    if (!sessionToken) {
      return NextResponse.json({ error: "sessionToken wajib diisi" }, { status: 401 });
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
      select: {
        id: true,
        modelAnswer: true,
        watsonLevel: true,
        options: true,
        inputType: true,
      },
    });
    if (!task) {
      return NextResponse.json({ error: "Task tidak ditemukan" }, { status: 404 });
    }

    const taskOptions = (task.options ?? null) as TaskOptions | null;

    // Gembok prasyarat 🔒: verifikasi kedua di server (defense terhadap panggilan API langsung).
    if (taskOptions?.prerequisite) {
      const locked = isPrerequisiteLocked(
        taskOptions.prerequisite,
        (moduleState ?? {}) as ModuleState
      );
      if (locked) {
        return NextResponse.json(
          {
            error: "Prasyarat modul belum terpenuhi. Operasikan modul di dasbor terlebih dahulu.",
            locked: true,
          },
          { status: 403 }
        );
      }
    }

    // Exact Match untuk pilihan ganda; fallback keyword (rubrik) untuk tugas isian lama.
    let score: number;
    if (taskOptions) {
      score = clampScore(scoreChoice(taskOptions, answerIndex ?? null, answerText ?? null));
    } else {
      const rubric = await prisma.rubric.findUnique({
        where: { watsonLevel: task.watsonLevel },
        select: { keywords: true }
      });
      score = clampScore(scoreAnswer(answerText || "", task.modelAnswer, rubric?.keywords || []));
    }

    // Multiple Attempts: jawaban salah (0) TIDAK disimpan agar tugas tetap bisa dicoba ulang.
    if (taskOptions && score === 0) {
      return NextResponse.json({
        success: true,
        data: { responseId: null, score, totalScore: null, currentLevel: null, retry: true },
      });
    }

    // Upsert task response
    const response = await prisma.taskResponse.upsert({
      where: {
        sessionId_taskId: {
          sessionId,
          taskId,
        },
      },
      update: {
        answerText: answerText || "",
        score,
        interactionLog: interactionLog || null,
      },
      create: {
        sessionId,
        taskId,
        answerText: answerText || "",
        score,
        interactionLog: interactionLog || null,
        scoredBy: "system",
      },
    });

    // Calculate sum of scores for this session
    const aggregate = await prisma.taskResponse.aggregate({
      where: { sessionId },
      _sum: { score: true },
    });

    const newTotalScore = aggregate._sum.score || 0;

    // Mastery-based Watson-Callingham level via shared util (F1.1)
    const [allTasks, allResponses] = await Promise.all([
      prisma.task.findMany({ select: { id: true, watsonLevel: true } }),
      prisma.taskResponse.findMany({
        where: { sessionId },
        select: { taskId: true, score: true },
      }),
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
        currentLevel: newLevel,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        responseId: response.id,
        score,
        totalScore: newTotalScore,
        currentLevel: newLevel,
      },
    });
  } catch (error) {
    console.error("Error saving task response:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan jawaban tugas ke database." },
      { status: 500 }
    );
  }
}
