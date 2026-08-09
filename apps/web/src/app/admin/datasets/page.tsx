"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Upload, Plus, Edit3, Save, CheckCircle2, FileJson } from "lucide-react";

export default function AdminDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jsonInput, setJsonInput] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => {
    fetchDatasets();
  }, []);

  async function fetchDatasets() {
    try {
      const res = await fetch("/api/admin/datasets");
      const json = await res.json();
      if (json.success) {
        setDatasets(json.data);
      }
    } catch (err) {
      console.error("Error fetching datasets:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUploadJson = async () => {
    if (!jsonInput.trim()) return;
    setUploadMsg("");
    try {
      const parsed = JSON.parse(jsonInput);
      const res = await fetch("/api/admin/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      const json = await res.json();
      if (json.success) {
        setUploadMsg("✅ Dataset baru berhasil ditambahkan!");
        setJsonInput("");
        fetchDatasets();
      } else {
        setUploadMsg(`❌ Gagal: ${json.error}`);
      }
    } catch (err: any) {
      setUploadMsg(`❌ Error JSON Format: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-emerald-700)", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>CMS Dataset & Soal PBL</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Kelola dataset, visualisasi grafik, dan instrumen soal literasi data Watson-Callingham.
        </p>
      </div>

      {/* JSON Import Section */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "var(--color-amber-600)" }}>
          <FileJson size={20} /> Upload / Tambah Dataset Baru (Format JSON)
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
          Tempelkan skema JSON dataset lengkap (beserta array `tasks`) untuk menambah modul baru ke sistem.
        </p>

        <textarea
          rows={6}
          placeholder='{"slug": "zakat-2026", "title": "Data Zakat", "category": "Zakat", "islamicValue": "Amanah", "rawData": [...], "tasks": [...]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-slate-200)",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            marginBottom: "12px"
          }}
        />

        {uploadMsg && <div style={{ fontSize: "0.9rem", marginBottom: "12px", fontWeight: 600 }}>{uploadMsg}</div>}

        <button
          onClick={handleUploadJson}
          className="btn-premium flex-center"
          style={{ backgroundColor: "var(--color-amber-500)", padding: "10px 18px" }}
        >
          <Upload size={18} style={{ marginRight: "8px" }} /> Impor Dataset JSON
        </button>
      </div>

      {/* Existing Datasets List */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={18} color="var(--color-emerald-700)" /> Dataset Terpasang ({datasets.length})
        </h3>

        {loading ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memuat dataset...</p>
        ) : datasets.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Belum ada dataset di database.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {datasets.map((d) => (
              <div
                key={d.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-slate-200)",
                  backgroundColor: "var(--bg-surface)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-emerald-700)" }}>
                    {d.title} ({d.category})
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Pilar Islam: <strong>{d.islamicValue}</strong> • {d.tasks?.length || 0} Soal
                  </span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  {d.description || "Tidak ada deskripsi"}
                </p>

                {/* Task list preview */}
                {d.tasks && d.tasks.length > 0 && (
                  <div style={{ marginTop: "12px", borderTop: "1px solid var(--color-slate-100)", paddingTop: "12px" }}>
                    <h5 style={{ fontSize: "0.85rem", marginBottom: "8px", color: "var(--text-primary)" }}>Daftar Soal PBL:</h5>
                    <ul style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {d.tasks.map((t: any) => (
                        <li key={t.id} style={{ marginBottom: "4px" }}>
                          <strong>Tugas #{t.taskNumber}</strong> (Watson L{t.watsonLevel}): {t.prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
