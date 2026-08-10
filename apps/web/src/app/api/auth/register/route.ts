import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

const SELF_REGISTERABLE_ROLES: Role[] = ["SISWA", "GURU"];

const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi."),
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
});

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

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Data tidak valid.";
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const role = (body.role as Role) || "SISWA";

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
