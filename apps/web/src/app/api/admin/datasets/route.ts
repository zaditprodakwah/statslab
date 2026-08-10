import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeOrReject } from "@/lib/auth";
import { DatasetSchema } from "@/lib/datasetSchema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: datasets });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data dataset" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const reject = await authorizeOrReject(req, ["PENELITI", "ADMIN"]);
  if (reject) return reject;

  try {
    const body = await req.json();
    const parsed = DatasetSchema.parse(body);

    const dataset = await prisma.dataset.create({
      data: {
        slug: parsed.slug,
        title: parsed.title,
        category: parsed.category,
        islamicValue: parsed.islamicValue,
        description: parsed.description || "",
        rawData: parsed.rawData as unknown as Prisma.InputJsonValue,
        chartConfig: (parsed.chartConfig as unknown as Prisma.InputJsonValue) ?? Prisma.DbNull,
        tasks:
          parsed.tasks && parsed.tasks.length > 0
            ? {
                create: parsed.tasks.map((t) => ({
                  taskNumber: t.taskNumber,
                  watsonLevel: t.watsonLevel,
                  indicator: t.indicator,
                  prompt: t.prompt,
                  clue: t.clue || null,
                  modelAnswer: t.modelAnswer || null,
                  inputType: t.inputType || "text",
                })),
              }
            : undefined,
      },
      include: { tasks: true },
    });

    return NextResponse.json({ success: true, data: dataset });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const detail = err.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join("; ");
      return NextResponse.json({ error: `Validasi dataset gagal — ${detail}` }, { status: 400 });
    }
    console.error("Dataset creation error:", err);
    return NextResponse.json({ error: "Gagal membuat dataset baru" }, { status: 500 });
  }
}
