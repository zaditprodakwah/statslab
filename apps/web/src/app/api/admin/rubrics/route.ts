import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";
import { WATSON_MIN_TASK_LEVEL, WATSON_MAX_TASK_LEVEL, SCORE_SCALE } from "@/lib/standards";

export const dynamic = "force-dynamic";

const CRITERIA_SCHEMA: Record<string, z.ZodString> = {};
for (let s = SCORE_SCALE.min; s <= SCORE_SCALE.max; s++) {
  CRITERIA_SCHEMA[String(s)] = z.string().min(1);
}

const RubricUpdateSchema = z.object({
  indicators: z.array(z.string().min(1)).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  criteria: z.object(CRITERIA_SCHEMA).optional(),
  active: z.boolean().optional(),
});

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const rubrics = await prisma.rubric.findMany({ orderBy: { watsonLevel: "asc" } });
    return NextResponse.json({ success: true, data: rubrics });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data rubrik" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) {
      return NextResponse.json({ error: "id rubrik wajib diisi" }, { status: 400 });
    }

    const parsed = RubricUpdateSchema.parse(body);

    const existing = await prisma.rubric.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rubrik tidak ditemukan" }, { status: 404 });
    }
    if (existing.watsonLevel < WATSON_MIN_TASK_LEVEL || existing.watsonLevel > WATSON_MAX_TASK_LEVEL) {
      return NextResponse.json(
        { error: "Level Watson-Callingham hanya diperbolehkan 4–6 (standar terkunci)." },
        { status: 400 }
      );
    }

    const data: Prisma.RubricUpdateInput = {};
    if (parsed.indicators !== undefined) data.indicators = parsed.indicators;
    if (parsed.keywords !== undefined) data.keywords = parsed.keywords;
    if (parsed.criteria !== undefined) data.criteria = parsed.criteria;
    if (parsed.active !== undefined) data.active = parsed.active;

    const rubric = await prisma.rubric.update({ where: { id }, data });

    return NextResponse.json({ success: true, data: rubric });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const detail = err.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join("; ");
      return NextResponse.json({ error: `Validasi rubrik gagal — ${detail}` }, { status: 400 });
    }
    console.error("Rubric update error:", err);
    return NextResponse.json({ error: "Gagal memperbarui rubrik" }, { status: 500 });
  }
}
