"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not sign in.");
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        background: "#07111f",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "linear-gradient(180deg,#0d1727,#101d30)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "36px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "6px" }}>
          Cleaners<span style={{ color: "#57c7ff" }}>Marketplace</span>
        </h1>
        <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "28px" }}>
          Admin sign in
        </p>

        <label
          style={{
            display: "block",
            fontSize: "13px",
            color: "#9fb0c1",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,.12)",
            background: "rgba(255,255,255,.04)",
            color: "white",
            fontSize: "16px",
            marginBottom: "18px",
          }}
        />

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: busy ? "rgba(255,255,255,.15)" : "linear-gradient(135deg,#1ea7ff,#0077ff)",
            color: "white",
            fontSize: "16px",
            fontWeight: 800,
            cursor: busy ? "default" : "pointer",
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        {error && (
          <p style={{ color: "#f87171", fontSize: "14px", marginTop: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}

// useSearchParams needs a suspense boundary: without one the whole page
// opts out of static rendering at build time.
export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
