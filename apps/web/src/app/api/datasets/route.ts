import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" }
        }
      }
    });
    return NextResponse.json({ success: true, data: datasets });
  } catch (error) {
    console.error("GET /api/datasets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data modul dataset" },
      { status: 500 }
    );
  }
}
