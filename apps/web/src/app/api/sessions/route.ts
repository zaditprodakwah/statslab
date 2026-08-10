import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSessionSchema = z.object({
  studentName: z.string().trim().min(2).max(255),
  studentClass: z.string().trim().max(50).optional().nullable(),
  schoolName: z.string().trim().min(2).max(255),
  testPhase: z.enum(["small_scale", "large_scale", "think_aloud"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data sesi tidak valid", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { studentName, studentClass, schoolName, testPhase } = parsed.data;

    const sessionPhase = testPhase ?? "large_scale";

    const sessionToken = crypto.randomBytes(32).toString("hex");

    // Create session in DB
    const session = await prisma.session.create({
      data: {
        sessionToken,
        studentName,
        studentClass: studentClass || "",
        schoolName,
        testPhase: sessionPhase,
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
        testPhase: session.testPhase,
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

// F1.8: Persist kemajuan akhir sesi (timeSpentMs, completedAt, certificateId)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const patchSchema = z.object({
      sessionId: z.string().min(1),
      sessionToken: z.string().min(1),
      timeSpentMs: z.number().int().min(0).max(86400000).optional(),
      completedAt: z.string().datetime().optional(),
      certificateId: z.string().trim().max(100).optional(),
    });
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data pembaruan sesi tidak valid", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { sessionId, sessionToken, timeSpentMs, completedAt, certificateId } = parsed.data;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.sessionToken !== sessionToken) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau token tidak cocok" },
        { status: 401 }
      );
    }

    const data: {
      timeSpentMs?: number;
      completedAt?: Date;
      certificateId?: string;
    } = {};
    if (typeof timeSpentMs === "number") data.timeSpentMs = timeSpentMs;
    if (completedAt) data.completedAt = new Date(completedAt);
    if (certificateId) data.certificateId = certificateId;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: true, data: session });
    }

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui sesi." },
      { status: 500 }
    );
  }
}
