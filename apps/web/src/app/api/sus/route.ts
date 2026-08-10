import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const susBodySchema = z.object({
  sessionId: z.string().min(1),
  sessionToken: z.string().min(1),
  totalScore: z.number().min(0).max(100),
  adjectiveRating: z.string().trim().min(1).max(20),
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = susBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data SUS tidak valid", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { answers, totalScore, adjectiveRating, sessionId, sessionToken } = parsed.data;

    const susData = {
      q1: answers[1] ?? 3,
      q2: answers[2] ?? 3,
      q3: answers[3] ?? 3,
      q4: answers[4] ?? 3,
      q5: answers[5] ?? 3,
      q6: answers[6] ?? 3,
      q7: answers[7] ?? 3,
      q8: answers[8] ?? 3,
      q9: answers[9] ?? 3,
      q10: answers[10] ?? 3,
      q11: answers[11] ?? 3,
      q12: answers[12] ?? 3,
      q13: answers[13] ?? 3,
      q14: answers[14] ?? 3,
      totalScore,
      adjectiveRating
    };

    // F1.3: SUS harus terkait sesi valid — verifikasi sessionToken pemilik.
    const existing = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!existing || existing.sessionToken !== sessionToken) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid atau token tidak cocok" },
        { status: 401 }
      );
    }

    await prisma.susResponse.upsert({
      where: { sessionId },
      create: { ...susData, sessionId },
      update: { ...susData }
    });
    return NextResponse.json({ success: true, sessionId, totalScore, adjectiveRating });
  } catch (error) {
    console.error("POST /api/sus error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan respon SUS" }, { status: 500 });
  }
}
