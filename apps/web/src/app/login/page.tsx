"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogIn, Loader2, ShieldCheck } from "lucide-react";

type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: "SISWA" | "GURU" | "PENELITI" | "ADMIN";
  status: string;
};

function safeRedirect(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//")) return null;
  return raw;
}

function defaultRedirect(role: SafeUser["role"]): string {
  if (role === "ADMIN" || role === "PENELITI") return "/admin/dashboard";
  if (role === "GURU") return "/guru";
  return "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Gagal masuk.");
        return;
      }

      const user: SafeUser | undefined = json.data?.user;
      const requested = new URLSearchParams(window.location.search).get("redirect");
      const target = safeRedirect(requested) ?? (user ? defaultRedirect(user.role) : "/");
      router.replace(target);
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-container flex-center" style={{ minHeight: "100vh", padding: "20px" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px", padding: "36px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: "var(--accent-primary)",
          }}
        >
          <ShieldCheck size={22} />
          <h1 style={{ fontSize: "1.4rem", margin: 0, color: "var(--text-primary)" }}>
            Masuk ke StatsLab
          </h1>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Untuk Guru, Peneliti, dan Admin panel manajemen.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            Email
            <input
              type="email"
              required
              className="form-input"
              placeholder="nama@sekolah.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            Kata Sandi
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {errorMsg && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "color-mix(in srgb, var(--color-red-600) 12%, transparent)",
                color: "var(--color-red-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-emerald flex-center"
            style={{ padding: "12px" }}
          >
            {loading ? (
              <Loader2 size={18} className="spin" style={{ marginRight: "8px" }} />
            ) : (
              <LogIn size={18} style={{ marginRight: "8px" }} />
            )}
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "0.9rem",
          }}
        >
          <button
            type="button"
            onClick={() =>
              setErrorMsg(
                "Fitur Lupa Password akan segera tersedia (membutuhkan infrastruktur email). Hubungi admin sekolah Anda."
              )
            }
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Lupa Password?
          </button>
          <Link
            href="/register"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Daftar Akun
          </Link>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "20px",
            color: "var(--accent-primary)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
