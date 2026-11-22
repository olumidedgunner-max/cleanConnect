"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  background: "linear-gradient(180deg,#0d1727,#101d30)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "24px",
  padding: "36px",
};

const field: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.04)",
  color: "white",
  fontSize: "16px",
  marginBottom: "16px",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "#9fb0c1",
  marginBottom: "8px",
  fontWeight: 600,
};

export default function AdminReset() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reset/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setNotice(data.message ?? "If that address is registered, a reset code is on its way.");
      setStage("confirm");
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    if (!code || !password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reset/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset the password.");
        setBusy(false);
        return;
      }
      router.replace("/dashboard");
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
      <form onSubmit={stage === "request" ? requestCode : confirmReset} style={card}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
          Cleaners<span style={{ color: "#57c7ff" }}>Marketplace</span>
        </h1>
        <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "26px" }}>
          Reset admin password
        </p>

        {stage === "request" ? (
          <>
            <label style={label}>Admin email</label>
            <input
              type="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@cleanersmarketplace.co.uk"
              style={field}
            />
          </>
        ) : (
          <>
            {notice && (
              <p style={{ color: "#9fb0c1", fontSize: "13px", lineHeight: 1.6, marginBottom: "18px" }}>
                {notice}
              </p>
            )}
            <label style={label}>6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              autoFocus
              maxLength={6}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              style={{ ...field, letterSpacing: "6px", fontSize: "20px", fontWeight: 800 }}
            />
            <label style={label}>New password</label>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 10 characters"
              style={field}
            />
          </>
        )}

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
          {busy ? "Working…" : stage === "request" ? "Send reset code" : "Set new password"}
        </button>

        {error && (
          <p style={{ color: "#f87171", fontSize: "14px", marginTop: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <Link href="/admin/login" style={{ color: "#57c7ff", fontSize: "14px", textDecoration: "none" }}>
            Back to sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
