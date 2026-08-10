import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {


  try {
    const sessions = await prisma.session.findMany({
      where: { leaderboardVisible: true },
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
