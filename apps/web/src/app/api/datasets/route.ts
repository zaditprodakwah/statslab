import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        tasks: {
          select: {
            id: true,
            taskNumber: true,
            watsonLevel: true,
            indicator: true,
            prompt: true,
            clue: true,
            inputType: true,
            modelAnswer: true,
            options: true,
          },
          orderBy: { taskNumber: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: datasets });
  } catch (error) {
    console.error("GET /api/datasets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data modul dataset" },
      { status: 500 }
    );
  }
}
