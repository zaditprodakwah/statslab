"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Users,
  GraduationCap,
  Copy,
  Check,
  Loader2,
  BookOpenCheck,
  LogOut,
} from "lucide-react";

type ClassSummary = {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  _count: { enrollments: number };
};

type StudentDetail = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  sessions: {
    id: string;
    totalScore: number;
    currentLevel: number;
    testPhase: string;
    completedAt: string | null;
  }[];
};

export default function GuruDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ class: ClassSummary; students: StudentDetail[] } | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/guru/classes");
    const json = await res.json();
    if (json.success) {
      setClasses(json.data.classes);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const me = await fetch("/api/auth/me");
        const meJson = await me.json();
        const current = meJson.data?.user;
        if (!current || (current.role !== "GURU" && current.role !== "ADMIN")) {
          router.replace("/login?redirect=/guru");
          return;
        }
        setUser({ name: current.name, role: current.role });
        await fetchClasses();
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    }
    init();
  }, [router, fetchClasses]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    setCreating(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/guru/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: className.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setCreateOpen(false);
        setClassName("");
        await fetchClasses();
      } else {
        setErrorMsg(json.message || "Gagal membuat kelas.");
      }
    } catch {
      setErrorMsg("Koneksi gagal.");
    } finally {
      setCreating(false);
    }
  };

  const openDetail = async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/guru/classes/${id}`);
      const json = await res.json();
      if (json.success) setDetail(json.data);
    } catch {
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // clipboard tidak tersedia
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading || !authChecked) {
    return (
      <div className="landing-container flex-center" style={{ minHeight: "100vh" }}>
        <Loader2 size={32} className="spin" style={{ color: "var(--color-emerald-600)" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-emerald-700)",
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            <ArrowLeft size={18} /> Beranda StatsLab
          </Link>
          <h1
            style={{
              fontSize: "2rem",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <GraduationCap style={{ color: "var(--color-emerald-700)" }} /> Panel Guru
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Kelola kelas dan pantau perkembangan siswa (as {user?.name}).
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button"
            onClick={handleLogout}
            className="btn-premium"
            style={{
              backgroundColor: "#ef4444",
              padding: "8px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
            }}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users size={20} color="var(--color-emerald-700)" /> Kelas Saya
        </h2>
        <button type="button"
          onClick={() => setCreateOpen(!createOpen)}
          className="btn-premium btn-emerald flex-center"
          style={{ padding: "10px 16px" }}
        >
          <Plus size={18} style={{ marginRight: "6px" }} /> Buat Kelas
        </button>
      </div>

      {createOpen && (
        <div className="glass-panel" style={{ padding: "20px", marginBottom: "24px" }}>
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}
          >
            <input
              className="form-input"
              style={{ flex: 1, minWidth: "220px", padding: "10px 12px" }}
              placeholder="Nama kelas, mis. 8A MTs Al-Hidayah"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <button
              type="submit"
              disabled={creating || !className.trim()}
              className="btn-premium btn-emerald flex-center"
              style={{ padding: "10px 18px" }}
            >
              {creating ? <Loader2 size={18} className="spin" /> : "Simpan"}
            </button>
            {errorMsg && (
              <div style={{ color: "var(--color-red-600)", fontSize: "0.85rem", width: "100%" }}>
                {errorMsg}
              </div>
            )}
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: "24px" }}>
        {classes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
            Belum ada kelas. Buat kelas pertama untuk mendapatkan kode undangan siswa.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {classes.map((c) => (
              <div
                key={c.id}
                onClick={() => openDetail(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "14px 16px",
                  border:
                    selectedId === c.id
                      ? "1.5px solid var(--color-emerald-600)"
                      : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: selectedId === c.id ? "var(--color-emerald-50)" : "transparent",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {c._count.enrollments} siswa
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCode(c.code);
                    }}
                    className="btn-premium flex-center"
                    style={{
                      padding: "8px 12px",
                      fontSize: "0.85rem",
                      backgroundColor: "var(--color-emerald-600)",
                    }}
                    title="Salin kode undangan"
                  >
                    {copiedCode === c.code ? <Check size={16} /> : <Copy size={16} />}
                    <span
                      style={{ marginLeft: "6px", fontFamily: "monospace", letterSpacing: "1px" }}
                    >
                      {c.code}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedId && (
        <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
          <h3
            style={{
              fontSize: "1.1rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BookOpenCheck size={20} color="var(--color-emerald-700)" />
            {detail ? detail.class.name : "Detail Kelas"}
            {detail && (
              <span
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 400 }}
              >
                (kode: {detail.class.code})
              </span>
            )}
          </h3>

          {loadingDetail ? (
            <div className="flex-center" style={{ padding: "20px" }}>
              <Loader2 size={24} className="spin" style={{ color: "var(--color-emerald-600)" }} />
            </div>
          ) : detail ? (
            detail.students.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px", color: "var(--text-secondary)" }}>
                Belum ada siswa bergabung. Bagikan kode kelas kepada siswa.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        color: "var(--text-secondary)",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <th style={{ padding: "10px 8px" }}>Nama Siswa</th>
                      <th style={{ padding: "10px 8px" }}>Email</th>
                      <th style={{ padding: "10px 8px" }}>Sesi</th>
                      <th style={{ padding: "10px 8px" }}>Skor</th>
                      <th style={{ padding: "10px 8px" }}>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.students.map((s) => {
                      const latest = s.sessions[0];
                      return (
                        <tr key={s.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          <td style={{ padding: "10px 8px", fontWeight: 600 }}>{s.name}</td>
                          <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                            {s.email}
                          </td>
                          <td style={{ padding: "10px 8px" }}>{s.sessions.length}</td>
                          <td style={{ padding: "10px 8px" }}>
                            {latest ? latest.totalScore : "-"}
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            {latest ? latest.currentLevel : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div style={{ color: "var(--color-red-600)" }}>Gagal memuat detail kelas.</div>
          )}
        </div>
      )}
    </div>
  );
}
