import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";
import { TaskSchema } from "@/lib/datasetSchema";

export const dynamic = "force-dynamic";

const DatasetUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  islamicValue: z.string().min(1).optional(),
  description: z.string().optional(),
  chartConfig: z.record(z.string(), z.unknown()).nullable().optional(),
  tasks: z.array(TaskSchema).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Params) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = DatasetUpdateSchema.parse(body);

    const existing = await prisma.dataset.findUnique({
      where: { id },
      include: { tasks: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Dataset tidak ditemukan" }, { status: 404 });
    }

    // Hapus task yang tidak lagi tercantum HANYA jika belum ada jawaban siswa.
    let protectedTasks: string[] = [];
    if (parsed.tasks) {
      const incomingNumbers = new Set(parsed.tasks.map((t) => t.taskNumber));
      const removedIds = existing.tasks
        .filter((t) => !incomingNumbers.has(t.taskNumber))
        .map((t) => t.id);

      if (removedIds.length > 0) {
        const responses = await prisma.taskResponse.findMany({
          where: { taskId: { in: removedIds } },
          select: { taskId: true },
        });
        const answeredIds = new Set(responses.map((r) => r.taskId));
        protectedTasks = removedIds.filter((id) => answeredIds.has(id));
        const deletable = removedIds.filter((id) => !answeredIds.has(id));
        if (deletable.length > 0) {
          await prisma.task.deleteMany({ where: { id: { in: deletable } } });
        }
      }
    }

    // Upsert task: perbarui berdasarkan (datasetId, taskNumber).
    if (parsed.tasks && parsed.tasks.length > 0) {
      for (const t of parsed.tasks) {
        await prisma.task.upsert({
          where: {
            datasetId_taskNumber: { datasetId: id, taskNumber: t.taskNumber },
          },
          update: {
            watsonLevel: t.watsonLevel,
            indicator: t.indicator,
            prompt: t.prompt,
            clue: t.clue ?? null,
            modelAnswer: t.modelAnswer ?? null,
            inputType: t.inputType || "text",
          },
          create: {
            datasetId: id,
            taskNumber: t.taskNumber,
            watsonLevel: t.watsonLevel,
            indicator: t.indicator,
            prompt: t.prompt,
            clue: t.clue ?? null,
            modelAnswer: t.modelAnswer ?? null,
            inputType: t.inputType || "text",
          },
        });
      }
    }

    const data: Prisma.DatasetUpdateInput = {};
    if (parsed.title !== undefined) data.title = parsed.title;
    if (parsed.category !== undefined) data.category = parsed.category;
    if (parsed.islamicValue !== undefined) data.islamicValue = parsed.islamicValue;
    if (parsed.description !== undefined) data.description = parsed.description;
    if (parsed.chartConfig !== undefined) {
      data.chartConfig =
        parsed.chartConfig === null
          ? Prisma.DbNull
          : (parsed.chartConfig as unknown as Prisma.InputJsonValue);
    }

    if (Object.keys(data).length > 0) {
      await prisma.dataset.update({ where: { id }, data });
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id },
      include: { tasks: { orderBy: { taskNumber: "asc" } } },
    });

    const msg =
      protectedTasks.length > 0
        ? `Dataset diperbarui. ${protectedTasks.length} task dipertahankan karena sudah ada jawaban siswa.`
        : "Dataset diperbarui.";

    return NextResponse.json({ success: true, message: msg, data: dataset });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const detail = err.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join("; ");
      return NextResponse.json({ error: `Validasi gagal — ${detail}` }, { status: 400 });
    }
    console.error("Dataset update error:", err);
    return NextResponse.json({ error: "Gagal memperbarui dataset" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Params) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const { id } = await ctx.params;
    const existing = await prisma.dataset.findUnique({
      where: { id },
      include: { tasks: { select: { id: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Dataset tidak ditemukan" }, { status: 404 });
    }

    const taskIds = existing.tasks.map((t) => t.id);
    const responses = await prisma.taskResponse.findMany({
      where: { taskId: { in: taskIds } },
      select: { id: true },
    });
    if (responses.length > 0) {
      return NextResponse.json(
        {
          error:
            "Dataset tidak dapat dihapus karena sudah ada jawaban siswa pada soal-soalnya. Hapus data sesi terlebih dahulu.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.task.deleteMany({ where: { datasetId: id } }),
      prisma.dataset.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, data: { id } });
  } catch (err) {
    console.error("Dataset delete error:", err);
    return NextResponse.json({ error: "Gagal menghapus dataset" }, { status: 500 });
  }
}
