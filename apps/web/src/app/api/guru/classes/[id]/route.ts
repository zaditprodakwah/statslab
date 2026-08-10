import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authorize(req, ["GURU", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const classRecord = await prisma.class.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!classRecord || classRecord.teacherId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const studentIds = classRecord.enrollments.map((e) => e.studentId);
    const sessions = studentIds.length
      ? await prisma.session.findMany({
          where: { userId: { in: studentIds } },
          select: {
            id: true,
            userId: true,
            totalScore: true,
            currentLevel: true,
            testPhase: true,
            completedAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const students = classRecord.enrollments.map((e) => ({
      id: e.student.id,
      name: e.student.name,
      email: e.student.email,
      joinedAt: e.createdAt,
      sessions: sessions
        .filter((s) => s.userId === e.student.id)
        .map(({ userId: _u, ...rest }) => rest),
    }));

    return NextResponse.json({
      success: true,
      data: {
        class: {
          id: classRecord.id,
          name: classRecord.name,
          code: classRecord.code,
          createdAt: classRecord.createdAt,
        },
        students,
      },
    });
  } catch (error) {
    console.error("Class detail error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
