import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["ADMIN"]);
  if (reject) return reject;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        _count: { select: { sessions: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: { users } });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
