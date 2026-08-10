import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  score: z.number().int().min(1).max(5).optional(),
  feedback: z.string().trim().max(2000).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const updated = await prisma.expertValidation.update({
      where: { id },
      data: parsed.data,
      include: { validator: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/validations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui validasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const { id } = await params;
    await prisma.expertValidation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/validations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus validasi" },
      { status: 500 }
    );
  }
}
