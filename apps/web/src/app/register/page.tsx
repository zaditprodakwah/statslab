"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"SISWA" | "GURU">("SISWA");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validate = (): string => {
    if (!name.trim()) return "Nama lengkap wajib diisi.";
    if (!EMAIL_RE.test(email)) return "Email tidak valid.";
    if (password.length < 8) return "Kata sandi minimal 8 karakter.";
    if (password !== confirmPassword) return "Konfirmasi kata sandi tidak cocok.";
    return "";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const invalid = validate();
    if (invalid) {
      setErrorMsg(invalid);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password, role }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Pendaftaran gagal.");
        return;
      }

      setSuccessMsg(json.message || "Pendaftaran berhasil. Silakan masuk.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-container flex-center" style={{ minHeight: "100vh", padding: "20px" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "440px", padding: "36px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: "var(--accent-primary)",
          }}
        >
          <UserPlus size={22} />
          <h1 style={{ fontSize: "1.4rem", margin: 0, color: "var(--text-primary)" }}>
            Daftar Akun StatsLab
          </h1>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Untuk siswa dan guru. Akun guru membutuhkan persetujuan admin sebelum dapat digunakan.
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
            Nama Lengkap
            <input
              type="text"
              required
              className="form-input"
              placeholder="Nama Lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
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
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
            Konfirmasi Kata Sandi
            <input
              type="password"
              required
              className="form-input"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
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
            Peran
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "SISWA" | "GURU")}
              className="form-input"
              style={{ color: "var(--text-primary)" }}
            >
              <option value="SISWA">Siswa</option>
              <option value="GURU">Guru / Pengajar</option>
            </select>
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

          {successMsg && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "color-mix(in srgb, var(--color-emerald-600) 12%, transparent)",
                color: "var(--color-emerald-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle2 size={16} /> {successMsg}
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
              <ShieldCheck size={18} style={{ marginRight: "8px" }} />
            )}
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Sudah punya akun? Masuk
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <ArrowLeft size={16} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
