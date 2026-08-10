import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  const bytes = randomBytes(6);
  let code = "";
  for (const byte of bytes) {
    code += CODE_CHARS[byte % CODE_CHARS.length];
  }
  return code;
}

async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode();
    const existing = await prisma.class.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Gagal membuat kode kelas unik.");
}

export async function GET(req: Request) {
  try {
    const auth = await authorize(req, ["GURU", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const classes = await prisma.class.findMany({
      where: { teacherId: auth.user.id, active: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { enrollments: true } } },
    });

    return NextResponse.json({ success: true, data: { classes } });
  } catch (error) {
    console.error("List classes error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authorize(req, ["GURU", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi." },
        { status: 400 }
      );
    }

    const code = await generateUniqueCode();
    const classRecord = await prisma.class.create({
      data: {
        teacherId: auth.user.id,
        name,
        code,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Kelas "${classRecord.name}" berhasil dibuat.`,
      data: { class: classRecord },
    });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
