import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rubrics = await prisma.rubric.findMany({
      where: { active: true },
      select: {
        watsonLevel: true,
        keywords: true,
        indicators: true,
      },
      orderBy: { watsonLevel: "asc" },
    });

    return NextResponse.json({ success: true, data: rubrics });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data rubrik" }, { status: 500 });
  }
}
