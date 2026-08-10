import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const upsertValidationSchema = z.object({
  validatorId: z.string().uuid(),
  itemNumber: z.number().int().min(1).max(100),
  score: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(2000).optional(),
});

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const [validators, validations] = await Promise.all([
      prisma.validator.findMany({ include: { validations: true }, orderBy: { name: "asc" } }),
      prisma.expertValidation.findMany({ orderBy: { itemNumber: "asc" } }),
    ]);
    return NextResponse.json({ success: true, data: { validators, validations } });
  } catch (err) {
    console.error("GET /api/admin/validations error:", err);
    return NextResponse.json({ success: false, error: "Gagal mengambil data validasi pakar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const body = await req.json();
    const parsed = upsertValidationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data validasi tidak valid", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { validatorId, itemNumber, score, feedback } = parsed.data;

    const validator = await prisma.validator.findUnique({ where: { id: validatorId } });
    if (!validator) {
      return NextResponse.json({ success: false, error: "Validator tidak ditemukan" }, { status: 404 });
    }

    const created = await prisma.expertValidation.upsert({
      where: { validatorId_itemNumber: { validatorId, itemNumber } },
      create: { validatorId, itemNumber, score, feedback },
      update: { score, feedback },
      include: { validator: true },
    });
    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    console.error("POST /api/admin/validations error:", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan validasi pakar" }, { status: 500 });
  }
}