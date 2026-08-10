import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "lavaan").toLowerCase();

  try {
    const tasks = await prisma.task.findMany({
      orderBy: { taskNumber: "asc" },
    });

    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true,
        susResponse: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const scoresMatrix = sessions.map((s) => {
      const scoresMap: Record<string, number> = {};
      s.taskResponses.forEach((tr) => {
        // Dichotomous conversion: 0 -> 0, 1 or 2 -> 1
        scoresMap[tr.taskId] = tr.score > 0 ? 1 : 0;
      });
      return {
        studentName: s.studentName || "Anonim",
        schoolName: s.schoolName || "Instansi",
        testPhase: s.testPhase,
        totalScore: s.totalScore,
        susScore: s.susResponse ? Number(s.susResponse.totalScore) : null,
        items: tasks.map((t) => (scoresMap[t.id] !== undefined ? scoresMap[t.id] : 0)),
      };
    });

    if (format === "lisrel") {
      // SIMPLIS syntax file (.spl)
      const itemLabels = tasks.map((t, i) => `Item${i + 1}`);
      const header = `StatsLab CFA - SIMPLIS Syntax\nGenerated ${new Date().toISOString()}\n`;
      let lines = `${header}Observed Variables: ${itemLabels.join(" ")}\n`;
      lines += `Sample Size: ${sessions.length}\n`;
      lines += `Correlations from File\nRaw Data from File\n`;
      lines += `Relationships\n  ${itemLabels.join(" + ")} = LiterasiData\n`;
      lines += `LISREL Output: RS SE TV MI EF SS\nEnd of Problem\n`;
      // Embed data matrix inline (rows of 0/1)
      lines += `\n! Data matrix (dichotomous 0/1) — paste into .dsf/.csv bila perlu\n`;
      lines += `${itemLabels.join(" ")}\n`;
      for (const r of scoresMatrix) {
        lines += `${r.items.join(" ")}\n`;
      }
      return new NextResponse(lines, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="statslab-cfa-lisrel-${Date.now()}.spl"`,
        },
      });
    }

    // Default: lavaan CSV
    const taskHeaders = tasks.map((_, idx) => `item_${idx + 1}`).join(",");
    let csv = `student_name,school_name,test_phase,${taskHeaders},total_score,sus_score\n`;
    scoresMatrix.forEach((r) => {
      csv += `"${r.studentName}","${r.schoolName}","${r.testPhase}",${r.items.join(",")},${r.totalScore},${r.susScore ?? ""}\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="statslab-cfa-lavaan-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export CFA error:", err);
    return NextResponse.json({ error: "Gagal membuat berkas ekspor CFA" }, { status: 500 });
  }
}
