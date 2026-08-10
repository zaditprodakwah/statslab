"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Loader2,
  Check,
  Ban,
  KeyRound,
  RefreshCw,
  UserCog,
} from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "SISWA" | "GURU" | "PENELITI" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
  _count: { sessions: number; enrollments: number };
};

const ROLE_LABEL: Record<AdminUser["role"], string> = {
  SISWA: "Siswa",
  GURU: "Guru",
  PENELITI: "Peneliti",
  ADMIN: "Admin",
};

const STATUS_COLOR: Record<AdminUser["status"], string> = {
  PENDING: "var(--color-amber-600)",
  ACTIVE: "var(--color-emerald-600)",
  SUSPENDED: "#ef4444",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.status === 401 || res.status === 403) {
      router.replace("/login?redirect=/admin/users");
      return;
    }
    const json = await res.json();
    if (json.success) setUsers(json.data.users);
  }, [router]);

  useEffect(() => {
    async function init() {
      try {
        const me = await fetch("/api/auth/me");
        const meJson = await me.json();
        if (meJson.data?.user?.role !== "ADMIN") {
          router.replace("/login?redirect=/admin/users");
          return;
        }
        setAuthChecked(true);
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, fetchUsers]);

  const updateUser = async (id: string, payload: Record<string, string>) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Gagal memperbarui pengguna.");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...json.data.user } : u))
      );
    } catch {
      alert("Koneksi gagal.");
    } finally {
      setBusyId(null);
    }
  };

  const approve = (u: AdminUser) => updateUser(u.id, { status: "ACTIVE" });
  const toggleSuspend = (u: AdminUser) =>
    updateUser(u.id, { status: u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" });
  const cycleRole = (u: AdminUser) => {
    const order: AdminUser["role"][] = ["SISWA", "GURU", "PENELITI", "ADMIN"];
    const next = order[(order.indexOf(u.role) + 1) % order.length];
    updateUser(u.id, { role: next });
  };
  const resetPassword = async (u: AdminUser) => {
    const password = window.prompt(`Kata sandi baru untuk ${u.name} (minimal 8 karakter):`);
    if (!password) return;
    if (password.length < 8) {
      alert("Kata sandi minimal 8 karakter.");
      return;
    }
    if (window.confirm(`Ubah kata sandi ${u.email}?`)) {
      await updateUser(u.id, { password });
    }
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
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-emerald-700)", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
            <UserCog style={{ color: "var(--color-emerald-700)" }} /> Kelola Pengguna
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Setujui guru baru, ubah peran, aktifkan/nonaktifkan, atau reset kata sandi.
          </p>
        </div>
        <button onClick={fetchUsers} className="btn-premium flex-center" style={{ padding: "10px 16px", backgroundColor: "var(--color-emerald-600)" }}>
          <RefreshCw size={16} style={{ marginRight: "6px" }} /> Muat Ulang
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
            Belum ada pengguna terdaftar.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--text-secondary)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  <th style={{ padding: "10px 8px" }}>Nama</th>
                  <th style={{ padding: "10px 8px" }}>Email</th>
                  <th style={{ padding: "10px 8px" }}>Peran</th>
                  <th style={{ padding: "10px 8px" }}>Status</th>
                  <th style={{ padding: "10px 8px" }}>Sesi</th>
                  <th style={{ padding: "10px 8px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "10px 8px", fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>{u.email}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <button
                        onClick={() => cycleRole(u)}
                        disabled={busyId === u.id}
                        className="btn-premium flex-center"
                        style={{ padding: "6px 10px", fontSize: "0.8rem", backgroundColor: "var(--color-emerald-600)", border: "none", cursor: "pointer" }}
                        title="Ubah peran"
                      >
                        <Users size={14} style={{ marginRight: "6px" }} /> {ROLE_LABEL[u.role]}
                      </button>
                    </td>
                    <td style={{ padding: "10px 8px", color: STATUS_COLOR[u.status], fontWeight: 600 }}>
                      {u.status}
                    </td>
                    <td style={{ padding: "10px 8px" }}>{u._count.sessions}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {u.status === "PENDING" && (
                          <button
                            onClick={() => approve(u)}
                            disabled={busyId === u.id}
                            className="btn-premium flex-center"
                            style={{ padding: "6px 10px", fontSize: "0.8rem", backgroundColor: "var(--color-emerald-600)", border: "none", cursor: "pointer" }}
                          >
                            {busyId === u.id ? <Loader2 size={14} className="spin" /> : <Check size={14} style={{ marginRight: "4px" }} />}
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => toggleSuspend(u)}
                          disabled={busyId === u.id}
                          className="btn-premium flex-center"
                          style={{ padding: "6px 10px", fontSize: "0.8rem", backgroundColor: "#f59e0b", border: "none", cursor: "pointer" }}
                        >
                          {u.status === "SUSPENDED" ? <Check size={14} style={{ marginRight: "4px" }} /> : <Ban size={14} style={{ marginRight: "4px" }} />}
                          {u.status === "SUSPENDED" ? "Aktifkan" : "Nonaktifkan"}
                        </button>
                        <button
                          onClick={() => resetPassword(u)}
                          disabled={busyId === u.id}
                          className="btn-premium flex-center"
                          style={{ padding: "6px 10px", fontSize: "0.8rem", backgroundColor: "#2563eb", border: "none", cursor: "pointer" }}
                        >
                          <KeyRound size={14} style={{ marginRight: "4px" }} /> Reset PW
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
