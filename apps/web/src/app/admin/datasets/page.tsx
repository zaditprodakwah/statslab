/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database, Upload, FileJson, Pencil, Trash2, Plus, Save, X, CheckCircle2 } from "lucide-react";
import { WATSON_LEVELS, INPUT_TYPES } from "@/lib/standards";

const WATSON_LEVEL_OPTIONS = [...WATSON_LEVELS];
const INPUT_TYPE_OPTIONS = [...INPUT_TYPES];

interface TaskDraft {
  taskNumber: number;
  watsonLevel: number;
  indicator: string;
  prompt: string;
  clue: string;
  modelAnswer: string;
  inputType: string;
}

export default function AdminDatasetsPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jsonInput, setJsonInput] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fetchDatasets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/datasets");
      if (res.status === 401 || res.status === 403) {
        router.replace("/login?redirect=/admin/datasets");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setDatasets(json.data);
      }
    } catch (err) {
      console.error("Error fetching datasets:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    async function init() {
      try {
        const me = await fetch("/api/auth/me");
        const meJson = await me.json();
        const current = meJson.data?.user;
        if (!current || (current.role !== "PENELITI" && current.role !== "ADMIN")) {
          router.replace("/login?redirect=/admin/datasets");
          return;
        }
      } catch {
        router.replace("/login?redirect=/admin/datasets");
        return;
      }
      fetchDatasets();
    }
    init();
  }, [router, fetchDatasets]);

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

  function startEdit(d: any) {
    setEditingId(d.id);
    setSaveMsg(null);
  }

  function toDrafts(d: any): TaskDraft[] {
    return (d.tasks || []).map((t: any) => ({
      taskNumber: t.taskNumber,
      watsonLevel: t.watsonLevel,
      indicator: t.indicator,
      prompt: t.prompt,
      clue: t.clue || "",
      modelAnswer: t.modelAnswer || "",
      inputType: t.inputType || "text"
    }));
  }

  const updateMeta = (id: string, field: string, value: string) => {
    setDatasets((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const updateTask = (d: any, index: number, field: keyof TaskDraft, value: string | number) => {
    const drafts = toDrafts(d);
    drafts[index] = { ...drafts[index], [field]: field === "taskNumber" || field === "watsonLevel" ? Number(value) : value };
    setDatasets((prev) => prev.map((x) => (x.id === d.id ? { ...x, tasks: drafts } : x)));
  };

  const addTask = (d: any) => {
    const drafts = toDrafts(d);
    const maxNum = drafts.reduce((m: number, t) => Math.max(m, t.taskNumber), 0);
    drafts.push({
      taskNumber: maxNum + 1,
      watsonLevel: 4,
      indicator: "",
      prompt: "",
      clue: "",
      modelAnswer: "",
      inputType: "text"
    });
    setDatasets((prev) => prev.map((x) => (x.id === d.id ? { ...x, tasks: drafts } : x)));
  };

  const removeTask = (d: any, index: number) => {
    const drafts = toDrafts(d).filter((_, i) => i !== index);
    setDatasets((prev) => prev.map((x) => (x.id === d.id ? { ...x, tasks: drafts } : x)));
  };

  const saveDataset = async (d: any) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        title: d.title,
        category: d.category,
        islamicValue: d.islamicValue,
        description: d.description,
        tasks: toDrafts(d).map((t) => ({
          taskNumber: t.taskNumber,
          watsonLevel: t.watsonLevel,
          indicator: t.indicator,
          prompt: t.prompt,
          clue: t.clue || null,
          modelAnswer: t.modelAnswer || null,
          inputType: t.inputType
        }))
      };
      const res = await fetch(`/api/admin/datasets/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setSaveMsg({ type: "ok", text: json.message || "Dataset diperbarui." });
        setEditingId(null);
        fetchDatasets();
      } else {
        setSaveMsg({ type: "err", text: json.error || "Gagal memperbarui dataset." });
      }
    } catch (err: any) {
      setSaveMsg({ type: "err", text: err.message || "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  const deleteDataset = async (d: any) => {
    if (!window.confirm(`Hapus dataset "${d.title}" beserta semua soalnya? Tindakan ini permanen.`)) return;
    try {
      const res = await fetch(`/api/admin/datasets/${d.id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        setDatasets((prev) => prev.filter((x) => x.id !== d.id));
      } else {
        alert(json.error || "Gagal menghapus dataset.");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus dataset.");
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
          Edit dataset, visualisasi grafik, dan instrumen soal literasi data Watson-Callingham.
          Level W-C (4–6), skala skor (0–2), dan tipe input terkunci agar sesuai standar penelitian.
        </p>
      </div>

      {saveMsg && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "20px", fontWeight: 600, fontSize: "0.9rem", backgroundColor: saveMsg.type === "ok" ? "var(--color-emerald-50)" : "#fee2e2", color: saveMsg.type === "ok" ? "var(--color-emerald-700)" : "#b91c1c" }}>
          {saveMsg.text}
        </div>
      )}

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
            {datasets.map((d) => {
              const isEditing = editingId === d.id;
              const drafts = toDrafts(d);
              return (
                <div key={d.id} style={{ padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-slate-200)", backgroundColor: "var(--bg-surface)" }}>
                  {!isEditing ? (
                    <>
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

                      {d.tasks && d.tasks.length > 0 && (
                        <div style={{ marginTop: "12px", borderTop: "1px solid var(--color-slate-100)", paddingTop: "12px" }}>
                          <h5 style={{ fontSize: "0.85rem", marginBottom: "8px", color: "var(--text-primary)" }}>Daftar Soal PBL:</h5>
                          <ul style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {d.tasks.map((t: any) => (
                              <li key={t.id} style={{ marginBottom: "4px" }}>
                                <strong>Tugas #{t.taskNumber}</strong> (Watson L{t.watsonLevel}, {t.inputType}): {t.prompt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                        <button onClick={() => startEdit(d)} className="btn-premium flex-center" style={{ padding: "8px 14px", backgroundColor: "#2563eb", fontSize: "0.85rem" }}>
                          <Pencil size={15} style={{ marginRight: "6px" }} /> Edit Dataset
                        </button>
                        <button onClick={() => deleteDataset(d)} className="btn-premium flex-center" style={{ padding: "8px 14px", backgroundColor: "#ef4444", fontSize: "0.85rem" }}>
                          <Trash2 size={15} style={{ marginRight: "6px" }} /> Hapus
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h4 style={{ margin: 0, color: "var(--color-emerald-700)", fontSize: "1.05rem" }}>✏️ Edit Dataset</h4>
                        <button onClick={() => setEditingId(null)} className="btn-premium flex-center" style={{ padding: "6px 12px", backgroundColor: "var(--color-slate-400)", fontSize: "0.8rem" }}>
                          <X size={14} style={{ marginRight: "6px" }} /> Batal
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Judul
                          <input value={d.title} onChange={(e) => updateMeta(d.id, "title", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Kategori
                          <input value={d.category} onChange={(e) => updateMeta(d.id, "category", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Pilar Islam
                          <input value={d.islamicValue} onChange={(e) => updateMeta(d.id, "islamicValue", e.target.value)} style={inputStyle} />
                        </label>
                      </div>
                      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                        Deskripsi
                        <textarea rows={2} value={d.description || ""} onChange={(e) => updateMeta(d.id, "description", e.target.value)} style={{ ...inputStyle, fontFamily: "inherit" }} />
                      </label>

                      <h5 style={{ fontSize: "0.9rem", marginBottom: "10px", color: "var(--text-primary)" }}>Soal PBL ({drafts.length})</h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "14px" }}>
                        {drafts.map((t, idx) => (
                          <div key={idx} style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-slate-200)", backgroundColor: "var(--bg-surface)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "90px 110px 160px 1fr", gap: "8px", marginBottom: "8px" }}>
                              <label style={smallLabel}>
                                No.
                                <input type="number" min={1} value={t.taskNumber} onChange={(e) => updateTask(d, idx, "taskNumber", e.target.value)} style={inputStyle} />
                              </label>
                              <label style={smallLabel}>
                                Level W-C
                                <select value={t.watsonLevel} onChange={(e) => updateTask(d, idx, "watsonLevel", e.target.value)} style={inputStyle}>
                                  {WATSON_LEVEL_OPTIONS.map((lv) => (
                                    <option key={lv} value={lv}>Level {lv}</option>
                                  ))}
                                </select>
                              </label>
                              <label style={smallLabel}>
                                Indikator
                                <input value={t.indicator} onChange={(e) => updateTask(d, idx, "indicator", e.target.value)} style={inputStyle} />
                              </label>
                              <label style={smallLabel}>
                                Tipe Input
                                <select value={t.inputType} onChange={(e) => updateTask(d, idx, "inputType", e.target.value)} style={inputStyle}>
                                  {INPUT_TYPE_OPTIONS.map((it) => (
                                    <option key={it} value={it}>{it}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <label style={smallLabel}>
                              Prompt
                              <textarea rows={2} value={t.prompt} onChange={(e) => updateTask(d, idx, "prompt", e.target.value)} style={{ ...inputStyle, fontFamily: "inherit" }} />
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                              <label style={smallLabel}>
                                Clue
                                <textarea rows={1} value={t.clue} onChange={(e) => updateTask(d, idx, "clue", e.target.value)} style={{ ...inputStyle, fontFamily: "inherit" }} />
                              </label>
                              <label style={smallLabel}>
                                Kunci Jawaban (modelAnswer)
                                <textarea rows={1} value={t.modelAnswer} onChange={(e) => updateTask(d, idx, "modelAnswer", e.target.value)} style={{ ...inputStyle, fontFamily: "inherit" }} />
                              </label>
                            </div>
                            <button onClick={() => removeTask(d, idx)} className="btn-premium flex-center" style={{ marginTop: "10px", padding: "6px 12px", backgroundColor: "#ef4444", fontSize: "0.8rem" }}>
                              <Trash2 size={13} style={{ marginRight: "6px" }} /> Hapus Soal
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                        <button onClick={() => addTask(d)} className="btn-premium flex-center" style={{ padding: "8px 14px", backgroundColor: "var(--color-amber-500)", fontSize: "0.85rem" }}>
                          <Plus size={15} style={{ marginRight: "6px" }} /> Tambah Soal
                        </button>
                        <button onClick={() => saveDataset(d)} disabled={saving} className="btn-premium btn-emerald flex-center" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
                          {saving ? "Menyimpan..." : <><Save size={15} style={{ marginRight: "6px" }} /> Simpan Dataset</>}
                        </button>
                        {saveMsg && saveMsg.type === "ok" && <CheckCircle2 size={20} color="var(--color-emerald-600)" style={{ alignSelf: "center" }} />}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-slate-200)",
  fontSize: "0.85rem",
  backgroundColor: "#fff"
};

const smallLabel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.75rem",
  color: "var(--text-secondary)"
};
