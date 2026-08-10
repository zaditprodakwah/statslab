import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "./prisma";
import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  signSessionToken,
  verifySessionToken,
  getSessionPayloadFromRequest,
  type SessionPayload,
} from "./authToken";

export const AUTH_COOKIE = AUTH_COOKIE_NAME;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
};

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
} as const;

export function buildAuthCookie(user: { id: string; role: Role }) {
  const token = signSessionToken({
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS,
  });
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_TTL_SECONDS,
  };
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const payload = await getSessionPayload();
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: userSelect,
  });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
}

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; status: number; message: string };

export async function authorize(
  req: Request,
  roles: Role[]
): Promise<AuthResult> {
  const payload = getSessionPayloadFromRequest(req);
  if (!payload) {
    return { ok: false, status: 401, message: "Tidak terautentikasi." };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: userSelect,
  });
  if (!user) {
    return { ok: false, status: 401, message: "Akun tidak ditemukan." };
  }
  if (user.status !== "ACTIVE") {
    return {
      ok: false,
      status: 403,
      message: "Akun belum aktif atau telah dinonaktifkan.",
    };
  }
  if (!roles.includes(user.role)) {
    return { ok: false, status: 403, message: "Akses ditolak." };
  }

  return { ok: true, user };
}

export async function authorizeOrReject(
  req: Request,
  roles: Role[]
): Promise<NextResponse | null> {
  const result = await authorize(req, roles);
  if (result.ok) return null;
  return NextResponse.json(
    { success: false, error: result.message },
    { status: result.status }
  );
}
