import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const responses = await prisma.taskResponse.findMany({
      include: {
        task: true,
        session: true
      },
      orderBy: { createdAt: "desc" }
    });

    if (format === "csv") {
      // Generate Winsteps-compatible CSV (Session ID, Task Number, Score 0-2)
      let csvContent = "session_token,student_name,task_number,watson_level,score\n";
      responses.forEach((r) => {
        csvContent += `${r.session.sessionToken},"${r.session.studentName || "Anonim"}",${r.task.taskNumber},${r.task.watsonLevel},${r.score}\n`;
      });

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="statslab_winsteps_export_${Date.now()}.csv"`
        }
      });
    }

    return NextResponse.json({ success: true, count: responses.length, data: responses });
  } catch (error) {
    console.error("GET /api/export/rasch error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengekspor data Rasch" }, { status: 500 });
  }
}
