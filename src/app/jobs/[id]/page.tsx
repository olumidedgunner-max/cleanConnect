"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

function conditionLabel(c: string) {
  if (c === "none") return { text: "No photo — heavy dirty", color: "#ef4444" };
  if (c === "moderate") return { text: "AI: Moderate dirt", color: "#f59e0b" };
  return { text: "AI: Medium dirt", color: "#3b82f6" };
}

function getRate(c: string) { return c === "none" ? 30 : c === "moderate" ? 20 : 25; }

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useCleanConnect();
  const [form, setForm] = useState({ name: "", email: "", phone: "", postcode: "", city: "" });
  const [step, setStep] = useState<"view" | "accepting" | "confirmed">("view");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  // Find job — check live jobs first, then sample jobs
  const liveJob = jobs.find((j) => j.id === id);
  const sampleJob = SAMPLE_JOBS.find((j) => j.id === id);

  if (!liveJob && !sampleJob) {
    return (
      <main style={{ background: "#07111f", minHeight: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔍</div>
          <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>Job Not Found</h2>
          <p style={{ color: "#9fb0c1", marginBottom: "24px" }}>This job may have already been accepted or removed.</p>
          <Link href="/" style={{ color: "#57c7ff", textDecoration: "none", fontWeight: 700 }}>← Back to all jobs</Link>
        </div>
      </main>
    );
  }

  // Normalise to a common shape
  type RoomRow = { type: string; condition: string; rate: number };
  let title = "", city = "", postcode = "", total = 0, subtotal = 0, roomRows: RoomRow[] = [], postedAt = "";

  if (liveJob) {
    title = liveJob.rooms.map((r) => `${r.count} ${r.type}`).join(", ");
    city = liveJob.city;
    postcode = liveJob.postcode;
    total = liveJob.total;
    subtotal = liveJob.subtotal;
    postedAt = liveJob.postedAt;
    SAMPLE_JOBS[0]; // just to satisfy TS
    let roomIndex = 0;
    liveJob.rooms.forEach((r) => {
      for (let i = 0; i < r.count; i++) {
        const condKey = `${r.type.toLowerCase().replace(/ /g, "")}-${i}`;
        const cond = (liveJob.conditions[condKey] || liveJob.conditions[Object.keys(liveJob.conditions)[roomIndex]] || "none") as string;
        roomRows.push({ type: `${r.type} ${i + 1}`, condition: cond, rate: getRate(cond) });
        roomIndex++;
      }
    });
  } else if (sampleJob) {
    title = sampleJob.title;
    city = sampleJob.city;
    postcode = sampleJob.postcode;
    total = sampleJob.total;
    subtotal = sampleJob.subtotal;
    postedAt = sampleJob.postedAt;
    roomRows = sampleJob.rooms.map((r, i) => ({ type: `${r.type} ${i + 1}`, condition: r.condition, rate: r.rate }));
  }

  const cleanerReceives = Math.round(subtotal * (1 - 0.075) * 100) / 100;
  const platformFee = Math.round((total - subtotal) * 100) / 100;
  const posted = new Date(postedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      {/* Top bar */}
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "900px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>
            Clean<span style={{ color: "#57c7ff" }}>Connect</span>
          </Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to all jobs</Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "50px 30px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.3)", borderRadius: "999px", color: "#f59e0b", fontSize: "13px", fontWeight: 700, marginBottom: "18px" }}>
            Awaiting Cleaner
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "12px", lineHeight: 1.1 }}>{title}</h1>
          <div style={{ display: "flex", gap: "20px", color: "#9fb0c1", fontSize: "15px", flexWrap: "wrap" }}>
            <span>📍 {city}, {postcode}</span>
            <span>📅 Posted {posted}</span>
            <span>🕐 {roomRows.length} hour{roomRows.length > 1 ? "s" : ""} estimated</span>
          </div>
        </div>

        {/* Room breakdown */}
        <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Room Breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Room", "AI Condition", "Rate / hr", "Est. Time"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9fb0c1", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomRows.map((r, i) => {
                const cond = conditionLabel(r.condition);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ padding: "16px", fontWeight: 700 }}>{r.type}</td>
                    <td style={{ padding: "16px", color: cond.color, fontWeight: 700, fontSize: "13px" }}>
                      {r.condition === "none" ? "⚠️ " : "📷 "}{cond.text}
                    </td>
                    <td style={{ padding: "16px", fontWeight: 800, color: "#57c7ff" }}>£{r.rate}</td>
                    <td style={{ padding: "16px", color: "#9fb0c1" }}>1 hour</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Price summary */}
        <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Price Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Client pays */}
            <div style={{ background: "rgba(30,167,255,.06)", border: "1px solid rgba(30,167,255,.15)", borderRadius: "18px", padding: "24px" }}>
              <div style={{ color: "#9fb0c1", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Client Pays</div>
              {[{ l: `Cleaning (${roomRows.length} rooms)`, v: `£${subtotal}` }, { l: "Platform fee (5%)", v: `£${platformFee.toFixed(2)}` }].map((row) => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#c5d0dc", fontSize: "14px" }}>
                  <span>{row.l}</span><span style={{ fontWeight: 700 }}>{row.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: "22px", fontWeight: 900 }}>
                <span>Total</span><span style={{ color: "#57c7ff" }}>£{total.toFixed(2)}</span>
              </div>
            </div>
            {/* Cleaner earns */}
            <div style={{ background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.15)", borderRadius: "18px", padding: "24px" }}>
              <div style={{ color: "#9fb0c1", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>You Earn</div>
              {[{ l: "Job value", v: `£${subtotal}` }, { l: "Matching fee (7.5%)", v: `−£${(subtotal * 0.075).toFixed(2)}` }].map((row) => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#c5d0dc", fontSize: "14px" }}>
                  <span>{row.l}</span><span style={{ fontWeight: 700, color: row.l.includes("fee") ? "#ef4444" : "inherit" }}>{row.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: "22px", fontWeight: 900 }}>
                <span>You Receive</span><span style={{ color: "#22c55e" }}>£{cleanerReceives.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Escrow info */}
        <div style={{ background: "rgba(30,167,255,.06)", border: "1px solid rgba(30,167,255,.15)", borderRadius: "18px", padding: "22px 26px", marginBottom: "28px", display: "flex", gap: "16px" }}>
          <span style={{ fontSize: "28px" }}>🔒</span>
          <div>
            <div style={{ fontWeight: 800, marginBottom: "6px" }}>Escrow Protection</div>
            <p style={{ color: "#9fb0c1", fontSize: "14px", lineHeight: 1.7 }}>
              Once you accept, the client funds escrow via Stripe. The full address is then revealed to you.
              Upload before & after photos to release payment. Funds transfer to you after client approval.
            </p>
          </div>
        </div>

        {/* Accept flow */}
        {step === "view" && (
          <button onClick={() => setStep("accepting")} style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: "18px", fontWeight: 800, cursor: "pointer" }}>
            Accept This Job — Earn £{cleanerReceives.toFixed(2)}
          </button>
        )}

        {step === "accepting" && (
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(34,197,94,.2)" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Your Details</h2>
            <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "24px" }}>
              Your identity is verified via Stripe after acceptance. Full client address revealed once escrow is funded.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div><label style={labelStyle}>Full Name</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" style={inputStyle} /></div>
              <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
              <div><label style={labelStyle}>Postcode</label><input type="text" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" style={inputStyle} /></div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <button onClick={() => setStep("view")} style={{ flex: 1, padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={() => { if (form.name && form.email && form.phone && form.postcode && form.city) setStep("confirmed"); }}
                style={{ flex: 2, padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: "16px", fontWeight: 800, cursor: "pointer" }}
              >
                Confirm & Accept Job
              </button>
            </div>
          </div>
        )}

        {step === "confirmed" && (
          <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "24px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
            <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>Job Accepted!</h2>
            <p style={{ color: "#9fb0c1", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 24px" }}>
              The client has been notified. Once they fund the escrow via Stripe, the full address will be revealed to you.
              Take before photos on arrival and after photos on completion to release your £{cleanerReceives.toFixed(2)} payment.
            </p>
            <Link href="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "14px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "16px" }}>
              Browse More Jobs
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
