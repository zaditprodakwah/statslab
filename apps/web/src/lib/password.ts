import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await deriveKey(password, salt);
  return `scrypt$${salt.toString("base64")}$${derivedKey.toString("base64")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[1], "base64");
    expected = Buffer.from(parts[2], "base64");
  } catch {
    return false;
  }

  const derivedKey = await deriveKey(password, salt);
  return derivedKey.length === expected.length && timingSafeEqual(derivedKey, expected);
}
