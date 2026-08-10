import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-static";

interface DatasetDoc {
  slug: string;
  title: string;
  category: string;
  islamicValue: string;
  description?: string;
  chartConfig?: { type?: string; xAxis?: string; dataKeys?: string[] };
  rawData: Record<string, unknown>[];
}

const DATASET_SLUGS = ["zakat-infak", "perpus-madrasah", "tajwid-juz-30", "wakaf-produktif"];

function datasetsDir(): string | null {
  const candidates = [
    path.join(process.cwd(), "packages/datasets"),
    path.join(process.cwd(), "../../packages/datasets"),
    path.join(process.cwd(), "../packages/datasets"),
  ];
  return candidates.find((d) => fs.existsSync(d)) ?? null;
}

function loadDataset(slug: string): DatasetDoc | null {
  const dir = datasetsDir();
  if (!dir) return null;
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as DatasetDoc;
}

export function generateStaticParams() {
  return DATASET_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dataset = loadDataset(slug);
  return {
    title: dataset ? `${dataset.title} — Modul StatsLab` : "Modul StatsLab",
    description: dataset?.description,
    openGraph: {
      title: dataset ? `${dataset.title} — StatsLab` : "StatsLab",
      description: dataset?.description,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dataset = loadDataset(slug);

  if (!dataset) {
    return (
      <main className="page-enter" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 20px" }}>
        <h1>Modul tidak ditemukan</h1>
        <Link href="/" style={{ color: "var(--accent-primary)" }}>← Kembali ke Beranda</Link>
      </main>
    );
  }

  const rows = dataset.rawData || [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <main className="page-enter" style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 20px" }}>
      <p style={{ marginBottom: "16px" }}>
        <Link href="/" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
          ← StatsLab — Beranda
        </Link>
      </p>

      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--text-primary)", marginBottom: "8px" }}>
          {dataset.title}
        </h1>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          <span className="glass-panel" style={{ padding: "4px 12px", fontSize: "0.8rem", borderRadius: "999px" }}>
            📁 {dataset.category}
          </span>
          <span
            className="glass-panel"
            style={{ padding: "4px 12px", fontSize: "0.8rem", borderRadius: "999px", color: "var(--color-emerald-700)" }}
          >
            ⚖️ Nilai Islam: {dataset.islamicValue}
          </span>
        </div>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "720px" }}>
          {dataset.description}
        </p>
        <p style={{ marginTop: "16px" }}>
          <Link
            href="/"
            className="btn-premium btn-emerald flex-center"
            style={{ display: "inline-flex", textDecoration: "none", gap: "8px", padding: "10px 18px" }}
          >
            📊 Buka di Dasbor Interaktif
          </Link>
        </p>
      </header>

      <section className="glass-panel" style={{ padding: "24px", overflowX: "auto" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>
          Data {dataset.chartConfig?.type === "pie" ? "Distribusi" : "Tabel Data"}
        </h2>
        {rows.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>Belum ada data.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid var(--color-slate-300)" }}>
                {columns.map((c) => (
                  <th key={c} style={{ padding: "8px", textTransform: "capitalize" }}>{c.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                  {columns.map((c) => (
                    <td key={c} style={{ padding: "8px" }}>{String(row[c] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
