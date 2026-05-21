"use client";
import { useState } from "react";
import Link from "next/link";
import { useCleanConnect } from "@/context/CleanConnectContext";

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

export default function RegisterCleanerPage() {
  const { addCleaner } = useCleanConnect();
  const [type, setType] = useState<"individual" | "company" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", postcode: "", city: "", bio: "", companyName: "", companyNumber: "", rate: "30" });
  const [submitted, setSubmitted] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function handleSubmit() {
    const required = type === "individual" ? [form.name, form.email, form.phone, form.postcode, form.city] : [form.companyName, form.companyNumber, form.email, form.phone, form.postcode, form.city];
    if (required.some((v) => !v)) return;
    addCleaner({ name: type === "individual" ? form.name : form.companyName, email: form.email, phone: form.phone, postcode: form.postcode, city: form.city, bio: form.bio });
    setSubmitted(true);
  }

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "900px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "60px 30px" }}>
        <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "999px", color: "#22c55e", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
          Join as a Cleaner
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "16px" }}>Register as a Cleaner</h1>
        <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "600px" }}>
          Great for students, individuals with spare time, and cleaning companies. You set your area, your rate, and we match you with local jobs. You pay only a 7.5% fee when you earn — no upfront cost.
        </p>

        {/* Two-way choice */}
        {!type && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <button onClick={() => setType("individual")} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(34,197,94,.3)", borderRadius: "24px", padding: "40px 30px", cursor: "pointer", color: "white", textAlign: "left" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🧑</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Individual Cleaner</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>Students, freelancers, or anyone with time to spare. Register with your name, location, and start accepting jobs near you.</p>
              <div style={{ marginTop: "24px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-block", fontWeight: 700, fontSize: "14px" }}>Register as Individual →</div>
            </button>
            <button onClick={() => setType("company")} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(245,158,11,.3)", borderRadius: "24px", padding: "40px 30px", cursor: "pointer", color: "white", textAlign: "left" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏢</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Cleaning Company</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>A registered cleaning business looking to take on more jobs. Register with your company details and get matched with clients in your area.</p>
              <div style={{ marginTop: "24px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "inline-block", fontWeight: 700, fontSize: "14px" }}>Register as Company →</div>
            </button>
          </div>
        )}

        {/* Form */}
        {type && !submitted && (
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "40px", border: `1px solid rgba(${type === "individual" ? "34,197,94" : "245,158,11"},.2)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 900 }}>{type === "individual" ? "Individual Cleaner" : "Cleaning Company"} Details</h2>
              <button onClick={() => setType(null)} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", color: "#9fb0c1", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>← Change type</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {type === "individual" ? (
                <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Full Name</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" style={inputStyle} /></div>
              ) : (
                <>
                  <div><label style={labelStyle}>Company Name</label><input type="text" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Sparkle Clean Ltd" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Companies House No.</label><input type="text" value={form.companyNumber} onChange={(e) => set("companyNumber", e.target.value)} placeholder="12345678" style={inputStyle} /></div>
                </>
              )}
              <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
              <div><label style={labelStyle}>Postcode</label><input type="text" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
              <div><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Your Rate (£/hr) — 20% negotiation margin applied</label>
                <select value={form.rate} onChange={(e) => set("rate", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="20" style={{ background: "#0d1727" }}>£20/hr — Moderate clean</option>
                  <option value="25" style={{ background: "#0d1727" }}>£25/hr — Medium clean</option>
                  <option value="30" style={{ background: "#0d1727" }}>£30/hr — Heavy/deep clean</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Coverage Radius</label>
                <select style={{ ...inputStyle, cursor: "pointer" }}>
                  <option style={{ background: "#0d1727" }}>Up to 5 miles</option>
                  <option style={{ background: "#0d1727" }}>Up to 10 miles</option>
                  <option selected style={{ background: "#0d1727" }}>Up to 20 miles</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>{type === "individual" ? "Short Bio (optional)" : "About your company (optional)"}</label>
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder={type === "individual" ? "e.g. Available weekends, experienced with deep cleans..." : "e.g. 5-year trading company, fully insured..."} rows={3} style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>

            <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: "14px", padding: "16px", marginTop: "20px", fontSize: "13px", color: "#9fb0c1", lineHeight: 1.6 }}>
              You set the rate. Clients can negotiate up to <strong style={{ color: "#22c55e" }}>20% discount</strong>. Jobs within your <strong style={{ color: "#22c55e" }}>20-mile radius</strong> will be emailed to you automatically when posted.
            </div>

            <button onClick={handleSubmit} style={{ width: "100%", marginTop: "24px", padding: "18px", borderRadius: "14px", border: "none", background: type === "individual" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", fontSize: "17px", fontWeight: 800, cursor: "pointer" }}>
              Complete Registration
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✓</div>
            <h3 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "10px" }}>You&apos;re Registered!</h3>
            <p style={{ color: "#9fb0c1", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 28px" }}>
              Welcome to CleanConnect. You will now receive email notifications when jobs are posted within your area. Full ID verification via Stripe activates when you accept your first job.
            </p>
            <Link href="/" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "14px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 700 }}>
              Browse Available Jobs
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
