import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "@prisma/client";

export const AUTH_COOKIE_NAME = "statslab_session";
export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 12;

export interface SessionPayload {
  sub: string;
  role: Role;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is missing in environment variables.");
  }
  return secret;
}

function base64urlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function base64urlDecode(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

export function signSessionToken(payload: SessionPayload): string {
  const data = base64urlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0) return null;

  const data = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expected = createHmac("sha256", getSecret()).update(data).digest();

  let provided: Buffer;
  try {
    provided = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null;
  }

  let payload: SessionPayload;
  try {
    const parsed = JSON.parse(base64urlDecode(data).toString("utf8"));
    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    payload = parsed as SessionPayload;
  } catch {
    return null;
  }

  if (payload.exp < Date.now() / 1000) return null;
  return payload;
}

export function parseCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return part.slice(eq + 1).trim();
    }
  }
  return undefined;
}

export function getSessionPayloadFromRequest(req: Request): SessionPayload | null {
  const token = parseCookie(req.headers.get("cookie") ?? "", AUTH_COOKIE_NAME);
  return token ? verifySessionToken(token) : null;
}
