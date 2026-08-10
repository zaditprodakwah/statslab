import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

const SELF_REGISTERABLE_ROLES: Role[] = ["SISWA", "GURU"];

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  createdAt: true,
} as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = (body.role as Role) || "SISWA";

    if (!name) {
      return NextResponse.json({ success: false, message: "Nama wajib diisi." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Email tidak valid." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }
    if (!SELF_REGISTERABLE_ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Peran tidak dapat didaftarkan sendiri." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        status: role === "GURU" ? "PENDING" : "ACTIVE",
      },
      select: userSelect,
    });

    return NextResponse.json({
      success: true,
      message:
        role === "GURU"
          ? "Pendaftaran berhasil. Akun guru menunggu persetujuan admin."
          : "Pendaftaran berhasil. Silakan masuk.",
      data: { user },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
