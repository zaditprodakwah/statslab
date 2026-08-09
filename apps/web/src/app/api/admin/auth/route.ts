import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token wajib diisi" }, { status: 400 });
    }

    const ADMIN_TOKEN = getAdminToken();
    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "ADMIN_TOKEN belum dikonfigurasi di server" },
        { status: 500 }
      );
    }

    if (token === ADMIN_TOKEN) {
      return NextResponse.json({ success: true, token: ADMIN_TOKEN });
    }

    return NextResponse.json({ error: "Token Admin tidak valid" }, { status: 401 });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi token" },
      { status: 500 }
    );
  }
}
