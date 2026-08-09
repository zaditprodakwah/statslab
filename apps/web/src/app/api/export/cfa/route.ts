import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {


  try {
    const tasks = await prisma.task.findMany({
      orderBy: { taskNumber: "asc" }
    });

    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true,
        susResponse: true
      },
      orderBy: { createdAt: "asc" }
    });

    const taskHeaders = tasks.map((t, idx) => `item_${idx + 1}`).join(",");
    let csv = `student_name,school_name,test_phase,${taskHeaders},total_score,sus_score\n`;

    sessions.forEach((s) => {
      const scoresMap: Record<string, number> = {};
      s.taskResponses.forEach((tr) => {
        // Dichotomous conversion: 0 -> 0, 1 or 2 -> 1
        scoresMap[tr.taskId] = tr.score > 0 ? 1 : 0;
      });

      const scoresList = tasks.map((t) => (scoresMap[t.id] !== undefined ? scoresMap[t.id] : 0));
      const susScore = s.susResponse ? s.susResponse.totalScore : "";

      csv += `"${s.studentName || "Anonim"}","${s.schoolName || "Instansi"}","${s.testPhase}",${scoresList.join(",")},${s.totalScore},${susScore}\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="statslab-cfa-lisrel-${Date.now()}.csv"`
      }
    });
  } catch (err) {
    console.error("Export CFA error:", err);
    return NextResponse.json({ error: "Gagal membuat berkas ekspor CFA" }, { status: 500 });
  }
}
