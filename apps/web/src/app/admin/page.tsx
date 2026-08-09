"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMsg("Masukkan Token Admin");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(data.error || "Token Admin Salah");
      }
    } catch {
      setErrorMsg("Koneksi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-emerald-50)", color: "var(--color-emerald-600)", borderRadius: "50%", marginBottom: "12px" }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "4px" }}>
            Panel Peneliti & Admin
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Masukkan Token Akses Peneliti StatsLab
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="password"
            placeholder="Token Admin"
            className="form-input text-center"
            style={{ fontSize: "1rem" }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="current-password"
          />

          {errorMsg && (
            <div style={{ color: "var(--color-red-600)", fontSize: "0.875rem", textAlign: "center" }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-emerald w-full flex-center"
            style={{ padding: "12px" }}
          >
            {loading ? <Loader2 size={18} className="spin" style={{ marginRight: "8px" }} /> : null}
            {loading ? "Verifikasi Token..." : "Masuk Dashboard Admin"}
            {!loading && <ArrowRight size={18} style={{ marginLeft: "8px" }} />}
          </button>
        </form>
      </div>
    </div>
  );
}
