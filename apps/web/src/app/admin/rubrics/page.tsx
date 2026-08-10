/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpenCheck, Save, Loader2 } from "lucide-react";
import { SCORE_SCALE, WATSON_LEVELS } from "@/lib/standards";

const WATSON_LEVEL_OPTIONS = [...WATSON_LEVELS];
const SCORE_KEYS = Array.from({ length: SCORE_SCALE.max - SCORE_SCALE.min + 1 }, (_, i) =>
  String(SCORE_SCALE.min + i)
);

export default function AdminRubricsPage() {
  const router = useRouter();
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fetchRubrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/rubrics");
      if (res.status === 401 || res.status === 403) {
        router.replace("/login?redirect=/admin/rubrics");
        return;
      }
      const json = await res.json();
      if (json.success) setRubrics(json.data);
    } catch (err) {
      console.error("Error fetching rubrics:", err);
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
          router.replace("/login?redirect=/admin/rubrics");
          return;
        }
      } catch {
        router.replace("/login?redirect=/admin/rubrics");
        return;
      }
      fetchRubrics();
    }
    init();
  }, [router, fetchRubrics]);

  const update = (id: string, field: string, value: any) => {
    setRubrics((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const updateCriteria = (id: string, key: string, value: string) => {
    setRubrics((prev) =>
      prev.map((r) => (r.id === id ? { ...r, criteria: { ...r.criteria, [key]: value } } : r))
    );
  };

  const parseList = (value: string): string[] =>
    value
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

  const save = async (r: any) => {
    setSavingId(r.id);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/rubrics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: r.id,
          indicators: parseList(r.indicatorsInput ?? r.indicators.join("\n")),
          keywords: parseList(r.keywordsInput ?? r.keywords.join("\n")),
          criteria: r.criteria,
          active: r.active,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: "ok", text: `Rubrik Level ${r.watsonLevel} tersimpan.` });
        setRubrics((prev) => prev.map((x) => (x.id === r.id ? { ...json.data } : x)));
      } else {
        setMsg({ type: "err", text: json.error || "Gagal menyimpan rubrik." });
      }
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Gagal menyimpan rubrik." });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/admin/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--color-emerald-700)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={18} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>
          CMS Rubrik Skoring Watson-Callingham
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Kelola kata kunci dan kriteria skor untuk skoring otomatis jawaban siswa. Skala skor{" "}
          <strong>
            {SCORE_SCALE.min}–{SCORE_SCALE.max}
          </strong>{" "}
          ({SCORE_SCALE.label}) dan level W-C {WATSON_LEVEL_OPTIONS.join(", ")} adalah standar
          terkunci.
        </p>
      </div>

      {msg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: "0.9rem",
            backgroundColor: msg.type === "ok" ? "var(--color-emerald-50)" : "#fee2e2",
            color: msg.type === "ok" ? "var(--color-emerald-700)" : "#b91c1c",
          }}
        >
          {msg.text}
        </div>
      )}

      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BookOpenCheck size={18} color="var(--color-emerald-700)" /> Rubrik per Level (
          {rubrics.length})
        </h3>

        {loading ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Memuat rubrik...</p>
        ) : rubrics.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Belum ada rubrik. Jalankan seeder: <code>npx tsx prisma/seed.ts</code>
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {rubrics.map((r) => {
              const indicatorsText = r.indicatorsInput ?? r.indicators.join("\n");
              const keywordsText = r.keywordsInput ?? r.keywords.join("\n");
              return (
                <div
                  key={r.id}
                  style={{
                    padding: "18px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-slate-200)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <h4
                      style={{ margin: 0, color: "var(--color-emerald-700)", fontSize: "1.1rem" }}
                    >
                      Level Watson-Callingham {r.watsonLevel}{" "}
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          fontWeight: 400,
                        }}
                      >
                        (terkunci)
                      </span>
                    </h4>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!r.active}
                        onChange={(e) => update(r.id, "active", e.target.checked)}
                      />
                      Aktif (dipakai skoring)
                    </label>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    <label style={smallLabel}>
                      Indikator (satu per baris)
                      <textarea
                        rows={4}
                        value={indicatorsText}
                        onChange={(e) => update(r.id, "indicatorsInput", e.target.value)}
                        style={textareaStyle}
                      />
                    </label>
                    <label style={smallLabel}>
                      Kata Kunci (dipisah koma/baris)
                      <textarea
                        rows={4}
                        value={keywordsText}
                        onChange={(e) => update(r.id, "keywordsInput", e.target.value)}
                        style={textareaStyle}
                      />
                    </label>
                  </div>

                  <h5
                    style={{ fontSize: "0.85rem", margin: "0 0 8px", color: "var(--text-primary)" }}
                  >
                    Kriteria Skor (skala {SCORE_SCALE.min}–{SCORE_SCALE.max}, terkunci)
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    {SCORE_KEYS.map((key) => (
                      <label key={key} style={smallLabel}>
                        Skor {key}
                        <textarea
                          rows={2}
                          value={r.criteria?.[key] || ""}
                          onChange={(e) => updateCriteria(r.id, key, e.target.value)}
                          style={textareaStyle}
                        />
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => save(r)}
                    disabled={savingId === r.id}
                    className="btn-premium btn-emerald flex-center"
                    style={{ padding: "9px 16px" }}
                  >
                    {savingId === r.id ? (
                      <Loader2 size={16} className="spin" style={{ marginRight: "8px" }} />
                    ) : (
                      <Save size={16} style={{ marginRight: "8px" }} />
                    )}
                    {savingId === r.id ? "Menyimpan..." : "Simpan Rubrik"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-slate-200)",
  fontSize: "0.85rem",
  fontFamily: "inherit",
  backgroundColor: "#fff",
};

const smallLabel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  fontSize: "0.8rem",
  color: "var(--text-secondary)",
};
