import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

let prisma: PrismaClient;

export async function GET() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  try {
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        studentName: true,
        schoolName: true,
        totalScore: true,
        currentLevel: true,
        createdAt: true
      },
      orderBy: {
        totalScore: "desc"
      },
      take: 10
    });

    return NextResponse.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data leaderboard" },
      { status: 500 }
    );
  }
}
