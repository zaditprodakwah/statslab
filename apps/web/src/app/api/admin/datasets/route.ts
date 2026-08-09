/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, no-use-before-define */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {


  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: datasets });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data dataset" }, { status: 500 });
  }
}

export async function POST(req: Request) {


  try {
    const body = await req.json();
    const { slug, title, category, islamicValue, description, rawData, chartConfig, tasks } = body;

    if (!slug || !title || !category || !islamicValue || !rawData) {
      return NextResponse.json({ error: "Field wajib belum diisi" }, { status: 400 });
    }

    const dataset = await prisma.dataset.create({
      data: {
        slug,
        title,
        category,
        islamicValue,
        description: description || "",
        rawData,
        chartConfig: chartConfig || null,
        tasks: tasks && Array.isArray(tasks)
          ? {
              create: tasks.map((t: any) => ({
                taskNumber: t.taskNumber,
                watsonLevel: t.watsonLevel,
                indicator: t.indicator,
                prompt: t.prompt,
                clue: t.clue || null,
                modelAnswer: t.modelAnswer || null,
                inputType: t.inputType || "text"
              }))
            }
          : undefined
      },
      include: { tasks: true }
    });

    return NextResponse.json({ success: true, data: dataset });
  } catch (err) {
    console.error("Dataset creation error:", err);
    return NextResponse.json({ error: "Gagal membuat dataset baru" }, { status: 500 });
  }
}
