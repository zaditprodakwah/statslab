"use client";

export async function downloadExport(path: string, fallbackName: string) {
  const res = await fetch(path);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Gagal mengunduh (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
