import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protects all /api/admin/* routes except the login entry point (/api/admin/auth).
// Verified again inside each admin route handler (defense in depth).
export function proxy(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  const auth = request.headers.get("authorization");

  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/admin/((?!auth).*)",
};
