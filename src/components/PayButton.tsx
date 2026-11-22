"use client";

import { useEffect, useState } from "react";

/**
 * Starts Stripe Checkout for a job. Until a Stripe key exists the button
 * is replaced by a plain statement that payments are not live yet —
 * better than a button that fails, and honest about where we are.
 */
export default function PayButton({ jobId, amount }: { jobId: string; amount: number }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/status")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Could not start payment.");
    } catch {
      setError("Could not reach the payment service.");
    }
    setBusy(false);
  }

  if (enabled === null) return null;

  if (!enabled) {
    return (
      <div
        style={{
          background: "rgba(245,158,11,.08)",
          border: "1px solid rgba(245,158,11,.25)",
          borderRadius: "16px",
          padding: "18px 22px",
          color: "#f5c87b",
          fontSize: "14px",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: "#f59e0b" }}>Card payments are not live yet.</strong> We are
        completing payment setup. Agree payment directly with the cleaner for now, and we will
        email you as soon as protected card payment is available.
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={pay}
        disabled={busy}
        style={{
          width: "100%",
          padding: "20px",
          borderRadius: "16px",
          border: "none",
          background: busy ? "rgba(255,255,255,.15)" : "linear-gradient(135deg,#1ea7ff,#0077ff)",
          color: "white",
          fontSize: "18px",
          fontWeight: 800,
          cursor: busy ? "default" : "pointer",
        }}
      >
        {busy ? "Opening secure checkout…" : `Pay £${amount.toFixed(2)} securely`}
      </button>
      <p style={{ color: "#9fb0c1", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
        Held until you approve the completed job.
      </p>
      {error && (
        <p style={{ color: "#f87171", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
