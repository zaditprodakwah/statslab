import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const unauthorized = () =>
  NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();

  try {
    const sessions = await prisma.session.findMany({
      include: {
        taskResponses: true,
        susResponse: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      data: {
        sessions
      }
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data sesi" }, { status: 500 });
  }
}
