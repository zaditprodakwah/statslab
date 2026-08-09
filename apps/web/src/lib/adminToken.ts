"use client";

export function getAdminAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.sessionStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
