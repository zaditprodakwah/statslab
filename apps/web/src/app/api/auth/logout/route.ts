import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  return NextResponse.json({ success: true });
}
