import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Aiken's V per item (taskNumber).
 * V = Σs / [n(c−1)]  where s = score − 1, c = 5 (skala Likert 1–5), n = jumlah validator.
 * Interpretasi: V ≥ 0.75 = valid (Aiken, 1985).
 */
export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const validations = await prisma.expertValidation.findMany({
      include: { validator: true },
      orderBy: { itemNumber: "asc" },
    });

    if (validations.length === 0) {
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    const byItem = new Map<number, number[]>();
    for (const v of validations) {
      const arr = byItem.get(v.itemNumber) ?? [];
      arr.push(v.score);
      byItem.set(v.itemNumber, arr);
    }

    const C = 5;
    const items = Array.from(byItem.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([itemNumber, scores]) => {
        const n = scores.length;
        const sumS = scores.reduce((acc, s) => acc + (s - 1), 0);
        const V = Number((sumS / (n * (C - 1))).toFixed(3));
        const interpretation = V >= 0.75 ? "valid" : V >= 0.6 ? "cukup" : "tidak valid";
        return { itemNumber, V, validatorCount: n, interpretation };
      });

    return NextResponse.json({ success: true, data: { items } });
  } catch (err) {
    console.error("GET /api/admin/aiken-v error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghitung Aiken's V" },
      { status: 500 }
    );
  }
}
