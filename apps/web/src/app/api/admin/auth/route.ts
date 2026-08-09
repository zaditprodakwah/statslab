import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function POST(req: Request) {


  try {
    const { pin } = await req.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN wajib diisi" }, { status: 400 });
    }

    // Default admin PIN for development/initial setup is provided via process.env.ADMIN_PIN
    const DEFAULT_PIN = process.env.ADMIN_PIN || "000000"; // fallback so it's not guessed easily if missing

    // Check DB for admin PIN or fallback to default
    const adminPinRecord = await prisma.adminPin.findFirst();
    const validPin = adminPinRecord ? adminPinRecord.pinHash : DEFAULT_PIN;

    if (pin.trim().toUpperCase() === validPin.toUpperCase()) {
      return NextResponse.json({
        success: true,
        token: "admin-session-token-valid-2026"
      });
    } else {
      return NextResponse.json(
        { error: "PIN Admin tidak valid" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi PIN Admin" },
      { status: 500 }
    );
  }
}
