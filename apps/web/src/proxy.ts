import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/authToken";

const ADMIN_AND_PENELITI: Role[] = ["PENELITI", "ADMIN"];
const GURU_AND_ADMIN: Role[] = ["GURU", "ADMIN"];

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 10;
const RATE_LIMITED_POST_PATHS = ["/api/sessions", "/api/sus", "/api/task-responses"];

const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(request: NextRequest): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_PER_WINDOW;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    request.method === "POST" &&
    RATE_LIMITED_POST_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) &&
    isRateLimited(request)
  ) {
    return NextResponse.json(
      { success: false, message: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429 }
    );
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifySessionToken(token) : null;
  const role: Role | null = payload?.role ?? null;

  // --- Area admin: /admin, /admin/* dan /api/admin/* ---
  if (pathname === "/admin" || pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!payload || !ADMIN_AND_PENELITI.includes(role as Role)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, message: "Tidak terautentikasi." },
          { status: 401 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Manajemen pengguna khusus ADMIN
    if (role !== "ADMIN") {
      if (pathname.startsWith("/api/admin/users")) {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
      }
      if (pathname === "/admin/users") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  // --- Area guru: /guru, /guru/* dan /api/guru/* ---
  if (pathname === "/guru" || pathname.startsWith("/guru") || pathname.startsWith("/api/guru")) {
    if (!payload || !GURU_AND_ADMIN.includes(role as Role)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, message: "Tidak terautentikasi." },
          { status: 401 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/guru/:path*",
    "/api/guru/:path*",
    "/api/sessions/:path*",
    "/api/sus/:path*",
    "/api/task-responses/:path*",
  ],
};
