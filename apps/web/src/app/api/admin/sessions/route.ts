import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

let prisma: PrismaClient;

export async function GET() {
  if (!prisma) prisma = new PrismaClient();

  try {
    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true,
        susResponse: true
      },
      orderBy: { createdAt: "desc" }
    });

    const sessionPins = await prisma.sessionPin.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        sessionPins
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data sesi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!prisma) prisma = new PrismaClient();

  try {
    const { testPhase } = await req.json();

    // Generate random 4-digit PIN e.g. AK-8B
    const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const pinCode = `AK-${randomSuffix}`;

    const newPin = await prisma.sessionPin.create({
      data: {
        pinCode,
        testPhase: testPhase || "large_scale"
      }
    });

    return NextResponse.json({ success: true, data: newPin });
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat PIN Sesi Baru" }, { status: 500 });
  }
}
