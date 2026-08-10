import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const tasks = await prisma.task.findMany({
      orderBy: { taskNumber: "asc" }
    });

    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true
      },
      orderBy: { createdAt: "asc" }
    });

    const taskCount = tasks.length || 8;

    // Build Winsteps Control File Header & Polytomous CSV
    let csv = `; Winsteps Control File - StatsLab Rasch PCM Analysis\n`;
    csv += `; Generated on: ${new Date().toISOString()}\n`;
    csv += `; Total Respondents: ${sessions.length}\n`;
    csv += `; Total Items: ${taskCount}\n`;
    csv += `TITLE = StatsLab Data Literacy Watson-Callingham Evaluation\n`;
    csv += `NI = ${taskCount}\n`;
    csv += `NAME1 = 1\n`;
    csv += `NAMELEN = 30\n`;
    csv += `CODES = 012\n`;
    csv += `DATA =\n`;

    // Add CSV rows
    sessions.forEach((s) => {
      const studentLabel = (s.studentName || "Anonim").padEnd(30, " ");
      const scoresMap: Record<string, number> = {};
      s.taskResponses.forEach((tr) => {
        scoresMap[tr.taskId] = tr.score;
      });

      const scoresList = tasks.map((t) => (scoresMap[t.id] !== undefined ? scoresMap[t.id] : 0));
      csv += `${studentLabel},${scoresList.join(",")}\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="statslab-rasch-winsteps-${Date.now()}.ctl"`
      }
    });
  } catch (err) {
    console.error("Export Rasch error:", err);
    return NextResponse.json({ error: "Gagal membuat berkas ekspor Rasch" }, { status: 500 });
  }
}
