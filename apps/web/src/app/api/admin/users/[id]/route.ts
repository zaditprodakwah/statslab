import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import type { Role, UserStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const ROLES: Role[] = ["SISWA", "GURU", "PENELITI", "ADMIN"];
const STATUSES: UserStatus[] = ["PENDING", "ACTIVE", "SUSPENDED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize(req, ["ADMIN"]);
  if (!auth.ok) {
    return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!target) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const role = typeof body.role === "string" ? (body.role as Role) : undefined;
    const status = typeof body.status === "string" ? (body.status as UserStatus) : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;

    if (role !== undefined && !ROLES.includes(role)) {
      return NextResponse.json({ success: false, message: "Peran tidak valid." }, { status: 400 });
    }
    if (status !== undefined && !STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: "Status tidak valid." }, { status: 400 });
    }
    if (password !== undefined && password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (id === auth.user.id) {
      if ((role && role !== "ADMIN") || (status && status !== "ACTIVE")) {
        return NextResponse.json(
          { success: false, message: "Tidak dapat mengubah peran/status akun sendiri." },
          { status: 400 }
        );
      }
    }

    const data: {
      role?: Role;
      status?: UserStatus;
      passwordHash?: string;
    } = {};
    if (role !== undefined) data.role = role;
    if (status !== undefined) data.status = status;
    if (password !== undefined) data.passwordHash = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Pengguna ${updated.name} diperbarui.`,
      data: { user: updated },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
