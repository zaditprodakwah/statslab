import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const auth = await authorize(req, ["SISWA"]);
    if (!auth.ok) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Kode kelas wajib diisi." },
        { status: 400 }
      );
    }

    const classRecord = await prisma.class.findUnique({ where: { code } });
    if (!classRecord || !classRecord.active) {
      return NextResponse.json(
        { success: false, message: "Kode kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        classId_studentId: {
          classId: classRecord.id,
          studentId: auth.user.id,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Kamu sudah bergabung di kelas ini." },
        { status: 409 }
      );
    }

    await prisma.enrollment.create({
      data: {
        classId: classRecord.id,
        studentId: auth.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil bergabung ke kelas "${classRecord.name}".`,
      data: { class: { id: classRecord.id, name: classRecord.name, code: classRecord.code } },
    });
  } catch (error) {
    console.error("Join class error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
