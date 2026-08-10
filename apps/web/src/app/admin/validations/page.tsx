"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2, Plus, Calculator } from "lucide-react";

interface Validator {
  id: string;
  name: string;
  domain: string;
}

interface ValidationEntry {
  id: string;
  validatorId: string;
  itemNumber: number;
  score: number;
  feedback?: string | null;
  validator?: Validator;
}

interface AikenItem {
  itemNumber: number;
  V: number;
  validatorCount: number;
  interpretation: "valid" | "cukup" | "tidak valid";
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid var(--color-slate-300)",
  borderRadius: "var(--radius-md)",
  fontSize: "0.9rem",
  background: "var(--bg-surface)",
  color: "var(--text-primary)",
};

export default function ValidationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [validations, setValidations] = useState<ValidationEntry[]>([]);
  const [aiken, setAiken] = useState<AikenItem[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ validatorId: "", itemNumber: "1", score: "4", feedback: "" });
  const [saving, setSaving] = useState(false);

  async function checkAuth() {
    try {
      const me = await fetch("/api/auth/me");
      const j = await me.json();
      const u = j.data?.user;
      if (!u || (u.role !== "PENELITI" && u.role !== "ADMIN")) {
        router.replace("/login?redirect=/admin/validations");
        return false;
      }
      return true;
    } catch {
      router.replace("/login?redirect=/admin/validations");
      return false;
    }
  }

  async function load() {
    try {
      const [vRes, aRes] = await Promise.all([
        fetch("/api/admin/validations"),
        fetch("/api/admin/aiken-v"),
      ]);
      if (vRes.status === 401) {
        router.replace("/login?redirect=/admin/validations");
        return;
      }
      const vJson = await vRes.json();
      if (vJson.success) {
        setValidators(vJson.data.validators);
        setValidations(vJson.data.validations);
      }
      const aJson = await aRes.json();
      if (aJson.success) setAiken(aJson.data.items);
    } catch (err) {
      console.error("Load validations error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      if (ok) await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/validations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          validatorId: form.validatorId,
          itemNumber: Number(form.itemNumber),
          score: Number(form.score),
          feedback: form.feedback || undefined,
        }),
      });
      const j = await res.json();
      if (!j.success) {
        setError(j.error || "Gagal menyimpan");
        return;
      }
      setForm({ ...form, feedback: "" });
      await load();
    } catch {
      setError("Kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus entri validasi ini?")) return;
    try {
      const res = await fetch(`/api/admin/validations/${id}`, { method: "DELETE" });
      const j = await res.json();
      if (j.success) await load();
    } catch (err) {
      console.error(err);
    }
  }

  const scoreColor = (V: number) =>
    V >= 0.75
      ? "var(--color-emerald-600)"
      : V >= 0.6
        ? "var(--color-amber-600)"
        : "var(--color-red-600)";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Loader2 className="spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <Link
        href="/admin/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--accent-primary)",
          textDecoration: "none",
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        <ArrowLeft size={18} /> Kembali ke Dashboard
      </Link>

      <h1
        style={{
          fontSize: "2rem",
          color: "var(--text-primary)",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Calculator style={{ color: "var(--color-emerald-700)" }} /> Validasi Pakar (Aiken&apos;s V)
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.95rem" }}>
        Rekam skor penilaian pakar per item tugas (taskNumber). Sistem menghitung Aiken&apos;s V
        otomatis: V ≥ 0.75 = valid.
      </p>

      {error && (
        <div style={{ color: "var(--color-red-600)", marginBottom: "16px", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {/* Form Tambah/Edit */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Rekam Skor Validasi</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}
          >
            Pakar Validator
            <select
              required
              value={form.validatorId}
              onChange={(e) => setForm({ ...form, validatorId: e.target.value })}
              style={inputStyle}
            >
              <option value="">— Pilih —</option>
              {validators.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.domain})
                </option>
              ))}
            </select>
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}
          >
            Nomor Item (Task)
            <select
              required
              value={form.itemNumber}
              onChange={(e) => setForm({ ...form, itemNumber: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 16 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Item {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}
          >
            Skor (1–5)
            <select
              required
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              style={inputStyle}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={String(s)}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "0.85rem",
              gridColumn: "1 / -1",
            }}
          >
            Catatan (opsional)
            <input
              type="text"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              style={inputStyle}
              placeholder="Feedback pakar..."
            />
          </label>
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              disabled={saving || !form.validatorId}
              className="btn-premium btn-emerald flex-center"
              style={{ padding: "10px 20px" }}
            >
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Simpan / Update
            </button>
          </div>
        </form>
      </div>

      {/* Aiken's V Results */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Hasil Aiken&apos;s V per Item</h2>
        {aiken.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Belum ada data validasi. Rekam skor pakar untuk menghitung V.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--color-slate-300)" }}>
                <th style={{ padding: "8px" }}>Item</th>
                <th style={{ padding: "8px" }}>Aiken&apos;s V</th>
                <th style={{ padding: "8px" }}>Jml Validator</th>
                <th style={{ padding: "8px" }}>Interpretasi</th>
              </tr>
            </thead>
            <tbody>
              {aiken.map((it) => (
                <tr
                  key={it.itemNumber}
                  style={{ borderBottom: "1px solid var(--color-slate-200)" }}
                >
                  <td style={{ padding: "8px" }}>Item {it.itemNumber}</td>
                  <td style={{ padding: "8px", fontWeight: 600, color: scoreColor(it.V) }}>
                    {it.V.toFixed(3)}
                  </td>
                  <td style={{ padding: "8px" }}>{it.validatorCount}</td>
                  <td style={{ padding: "8px", color: scoreColor(it.V) }}>{it.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Validations Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Daftar Validasi Tercatat</h2>
        {validations.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Belum ada entri.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--color-slate-300)" }}>
                <th style={{ padding: "8px" }}>Pakar</th>
                <th style={{ padding: "8px" }}>Item</th>
                <th style={{ padding: "8px" }}>Skor</th>
                <th style={{ padding: "8px" }}>Catatan</th>
                <th style={{ padding: "8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {validations.map((v) => (
                <tr key={v.id} style={{ borderBottom: "1px solid var(--color-slate-200)" }}>
                  <td style={{ padding: "8px" }}>
                    {v.validator?.name ?? v.validatorId.slice(0, 8)}
                  </td>
                  <td style={{ padding: "8px" }}>Item {v.itemNumber}</td>
                  <td style={{ padding: "8px" }}>{v.score}</td>
                  <td style={{ padding: "8px", color: "var(--text-secondary)", maxWidth: "300px" }}>
                    {v.feedback || "—"}
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="btn-premium"
                      style={{
                        padding: "6px",
                        backgroundColor: "var(--color-red-600)",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title="Hapus"
                    >
                      <Trash2 size={14} color="#fff" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
