import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { buildAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
} as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, passwordHash: true },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { success: false, message: "Email atau kata sandi salah." },
        { status: 401 }
      );
    }

    if (user.status === "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: "Akun masih menunggu persetujuan admin.",
        },
        { status: 403 }
      );
    }
    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Akun telah dinonaktifkan." },
        { status: 403 }
      );
    }

    const store = await cookies();
    store.set(buildAuthCookie({ id: user.id, role: user.role }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _hash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: { user: safeUser } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
