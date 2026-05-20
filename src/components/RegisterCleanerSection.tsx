"use client";
import { useState } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

export default function RegisterCleanerSection() {
  const { addCleaner, cleaners } = useCleanConnect();
  const [form, setForm] = useState({ name: "", email: "", phone: "", postcode: "", city: "", bio: "" });
  const [submitted, setSubmitted] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function handleSubmit() {
    if (!form.name || !form.email || !form.phone || !form.postcode || !form.city) return;
    addCleaner(form);
    setSubmitted(true);
  }

  return (
    <section style={{ padding: "90px 30px", background: "#0a1420" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

          {/* Form */}
          <div>
            <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "999px", color: "#22c55e", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
              For Cleaners
            </div>
            <h2 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "16px" }}>Register as a Cleaner</h2>
            <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "36px" }}>
              Great for students and individuals with spare time. Post your city and we match you with local jobs.
              You pay a 7.5% matching fee from each payout — no upfront cost.
            </p>

            {!submitted ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div><label style={labelStyle}>Full Name</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Postcode</label><input type="text" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Short Bio (optional)</label>
                  <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="e.g. Experienced cleaner, available weekends..." rows={3} style={{ ...inputStyle, resize: "none" }} />
                </div>
                <button onClick={handleSubmit} style={{ padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontSize: "17px", fontWeight: 800, cursor: "pointer" }}>
                  Register as a Cleaner
                </button>
              </div>
            ) : (
              <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "20px", padding: "30px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
                <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "10px" }}>Welcome, {form.name}!</h3>
                <p style={{ color: "#9fb0c1", lineHeight: 1.7 }}>You are registered in {form.city} ({form.postcode.toUpperCase()}). You can now browse and accept cleaning jobs in your area. Full ID verification via Stripe happens when you accept your first job.</p>
              </div>
            )}
          </div>

          {/* Registered cleaners panel */}
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px" }}>
              Registered Cleaners
              <span style={{ fontSize: "14px", color: "#9fb0c1", fontWeight: 400, marginLeft: "12px" }}>{cleaners.length} total</span>
            </h3>
            {cleaners.length === 0 ? (
              <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "22px", padding: "30px", border: "1px solid rgba(255,255,255,.06)", textAlign: "center", color: "#9fb0c1" }}>
                No cleaners registered yet. Be the first!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "520px", overflowY: "auto" }}>
                {cleaners.map((c) => (
                  <div key={c.id} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "18px", padding: "22px", border: "1px solid rgba(255,255,255,.06)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", flexShrink: 0 }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>{c.name}</div>
                      <div style={{ color: "#57c7ff", fontSize: "13px", marginBottom: "4px" }}>{c.city} · {c.postcode.toUpperCase()}</div>
                      {c.bio && <div style={{ color: "#9fb0c1", fontSize: "13px", lineHeight: 1.5 }}>{c.bio}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
