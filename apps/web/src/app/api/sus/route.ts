import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, totalScore, adjectiveRating } = body;

    // Create a new session or connect
    const session = await prisma.session.create({
      data: {
        sessionToken: `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        testPhase: "large_scale",
        susResponse: {
          create: {
            q1: answers[1] || 3,
            q2: answers[2] || 3,
            q3: answers[3] || 3,
            q4: answers[4] || 3,
            q5: answers[5] || 3,
            q6: answers[6] || 3,
            q7: answers[7] || 3,
            q8: answers[8] || 3,
            q9: answers[9] || 3,
            q10: answers[10] || 3,
            q11: answers[11] || 3,
            q12: answers[12] || 3,
            q13: answers[13] || 3,
            q14: answers[14] || 3,
            totalScore: totalScore,
            adjectiveRating: adjectiveRating
          }
        }
      }
    });

    return NextResponse.json({ success: true, sessionId: session.id, totalScore, adjectiveRating });
  } catch (error) {
    console.error("POST /api/sus error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan respon SUS" }, { status: 500 });
  }
}
