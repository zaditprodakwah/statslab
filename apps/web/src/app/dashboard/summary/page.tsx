import type { Metadata } from "next";
import SummaryClient from "@/components/SummaryClient";

export const metadata: Metadata = {
  title: "Ringkasan Capaian & Sertifikat | StatsLab",
  description:
    "Ringkasan capaian literasi data siswa: level Watson-Callingham, total skor, badge, dan sertifikat.",
  alternates: { canonical: "/dashboard/summary" },
  robots: { index: false, follow: true },
};

export default function SummaryPage() {
  return <SummaryClient />;
}
