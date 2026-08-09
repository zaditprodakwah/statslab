import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

export const dynamic = "force-dynamic";

let prisma: PrismaClient;

export async function POST(req: Request) {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  try {
    const body = await req.json();
    const { studentName, studentClass, schoolName, pinCode } = body;

    // Validate request
    if (!studentName || !schoolName) {
      return NextResponse.json(
        { error: "Nama dan asal sekolah wajib diisi" },
        { status: 400 }
      );
    }

    // Default test phase or role
    const testPhase = "onboarding";
    const sessionToken = crypto.randomBytes(32).toString("hex");

    // Create session in DB
    const session = await prisma.session.create({
      data: {
        sessionToken,
        studentName,
        studentClass: studentClass || "",
        schoolName,
        testPhase,
        totalScore: 0,
        timeSpentMs: 0,
        currentLevel: 1,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionToken: session.sessionToken,
        studentName: session.studentName,
        studentClass: session.studentClass,
        schoolName: session.schoolName,
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses sesi kelas." },
      { status: 500 }
    );
  }
}
