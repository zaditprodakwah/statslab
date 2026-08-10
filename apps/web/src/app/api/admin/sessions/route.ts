import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true,
        susResponse: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessions,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data sesi" }, { status: 500 });
  }
}
