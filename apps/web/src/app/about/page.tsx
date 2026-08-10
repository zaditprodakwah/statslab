import type { Metadata } from "next";
import { ShieldCheck, BookOpen, Scale, BarChart3, FlaskConical, Landmark } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang StatsLab | R&D Literasi Data Islami",
  description:
    "StatsLab adalah media pembelajaran statistika interaktif berbasis web yang mengintegrasikan nilai keislaman untuk mengembangkan literasi data tingkat lanjut (Watson-Callingham) siswa madrasah.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Tentang StatsLab | R&D Literasi Data Islami",
    description:
      "Media pembelajaran statistika interaktif terintegrasi nilai keislaman untuk literasi data siswa.",
    url: "/about",
    type: "website",
  },
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Tabayyun (Kritis)",
    description:
      "Menanamkan kebiasaan memeriksa validitas sumber data, mendeteksi outlier, dan memverifikasi keterwakilan sampel sebelum menarik kesimpulan.",
  },
  {
    icon: BookOpen,
    title: "Amanah (Integritas)",
    description:
      "Melatih penyajian data yang jujur melalui visualisasi ber-skala nol (zero-based axis), menghindari distorsi grafik yang menyesatkan pembaca.",
  },
  {
    icon: Scale,
    title: "Tawazun (Keseimbangan)",
    description:
      "Membangun pemahaman ukuran pemusatan data secara objektif, seperti membandingkan mean dan median dalam membaca distribusi data.",
  },
];

export default function AboutPage() {
  return (
    <div className="landing-container" style={{ paddingBottom: "64px" }}>
      <div className="landing-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <nav aria-label="Breadcrumb" style={{ padding: "24px 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          <Link href="/" style={{ color: "var(--accent-primary)" }}>Beranda</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span aria-current="page">Tentang</span>
        </nav>

        <div className="hero-section text-center" style={{ padding: "32px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-emerald-50)",
              color: "var(--accent-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            <Landmark size={18} /> R&D Ekosistem Literasi Data STAI Al-Bahjah Cirebon
          </div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "16px", color: "var(--color-emerald-700)" }}>
            Tentang StatsLab
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            StatsLab adalah media pembelajaran statistika interaktif berbasis web yang memadukan
            eksplorasi visual data nyata dengan nilai-nilai keislaman. Platform ini dikembangkan
            sebagai bagian dari penelitian pengembangan (R&amp;D) untuk memfasilitasi kemampuan
            literasi data siswa pada jenjang pendidikan menengah.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <BarChart3 size={24} style={{ color: "var(--color-emerald-600)" }} />
            <h2 style={{ fontSize: "1.4rem" }}>Literasi Data Tingkat Lanjut: Kerangka Watson-Callingham</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Instrumen tugas pada StatsLab dikembangkan menggunakan kerangka literasi data
            <em> Watson-Callingham</em> — kemampuan memahami struktur data, membaca data, hingga
            membuat keputusan berdasarkan data. Tingkat kompetensi siswa dipetakan secara dinamis
            melalui kombinasi skor per tugas dan rubrik penilaian berbasis level.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <BookOpen size={24} style={{ color: "var(--color-emerald-600)" }} />
            <h2 style={{ fontSize: "1.4rem" }}>Tiga Pilar Pendidikan Islam</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {pillars.map((p) => (
              <div key={p.title} style={{ padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-slate-200)", backgroundColor: "var(--bg-surface)" }}>
                <div style={{ display: "inline-flex", padding: "10px", background: "var(--color-emerald-50)", color: "var(--color-emerald-600)", borderRadius: "50%", marginBottom: "12px" }}>
                  <p.icon size={22} />
                </div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "6px" }}>{p.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <FlaskConical size={24} style={{ color: "var(--color-emerald-600)" }} />
            <h2 style={{ fontSize: "1.4rem" }}>Metodologi Penelitian</h2>
          </div>
          <ul style={{ color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: "20px" }}>
            <li>Validasi instrumen tugas melalui penilaian pakar (expert validation).</li>
            <li>Uji keterbacaan dan kepraktisan dengan <em>System Usability Scale</em> (SUS).</li>
            <li>Uji coba skala kecil (<em>small-scale</em>) sebelum implementasi skala besar (<em>large-scale</em>).</li>
            <li>Analisis psikometri menggunakan model Rasch (Winsteps) dan analisis SEM (LISREL).</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <Link
            href="/"
            className="btn-premium flex-center"
            style={{ textDecoration: "none", display: "inline-flex", padding: "12px 28px", backgroundColor: "var(--accent-primary)" }}
          >
            Mulai Belajar di Dasbor
          </Link>
        </div>
      </div>
    </div>
  );
}
