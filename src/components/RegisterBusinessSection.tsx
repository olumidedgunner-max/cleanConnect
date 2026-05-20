"use client";
import { useState } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

const SERVICE_TYPES = ["Office Cleaning", "Retail & Commercial", "Airbnb / Short Let", "Property Management", "Hotel & Hospitality", "Construction Aftercare", "Other"];

export default function RegisterBusinessSection() {
  const { addBusiness, businesses } = useCleanConnect();
  const [form, setForm] = useState({ companyName: "", companyNumber: "", vatNumber: "", contactName: "", email: "", phone: "", postcode: "", city: "", serviceType: "" });
  const [submitted, setSubmitted] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function handleSubmit() {
    if (!form.companyName || !form.contactName || !form.email || !form.phone || !form.postcode || !form.city) return;
    addBusiness(form);
    setSubmitted(true);
  }

  return (
    <section style={{ padding: "90px 30px" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.3)", borderRadius: "999px", color: "#f59e0b", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
          For Businesses
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

          {/* Form */}
          <div>
            <h2 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "16px" }}>Business Registration</h2>
            <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "36px" }}>
              Businesses pay a <strong style={{ color: "#f59e0b" }}>15% platform fee</strong> per job (vs 5% for individuals).
              Post unlimited cleaning jobs across multiple locations. Full Stripe registration required upfront.
            </p>

            {!submitted ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Company Name</label><input type="text" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Sparkle Facilities Ltd" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Companies House No.</label><input type="text" value={form.companyNumber} onChange={(e) => set("companyNumber", e.target.value)} placeholder="12345678" style={inputStyle} /></div>
                  <div><label style={labelStyle}>VAT Number (optional)</label><input type="text" value={form.vatNumber} onChange={(e) => set("vatNumber", e.target.value)} placeholder="GB123456789" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Contact Name</label><input type="text" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="John Smith" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@company.com" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 20 0000 0000" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Postcode</label><input type="text" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="EC1A 1BB" style={inputStyle} /></div>
                  <div><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" style={inputStyle} /></div>
                </div>
                <div>
                  <label style={labelStyle}>Type of Cleaning Required</label>
                  <select value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="" style={{ background: "#0d1727" }}>Select service type...</option>
                    {SERVICE_TYPES.map((t) => <option key={t} value={t} style={{ background: "#0d1727" }}>{t}</option>)}
                  </select>
                </div>
                <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#9fb0c1", lineHeight: 1.6 }}>
                  Business fee: <strong style={{ color: "#f59e0b" }}>15% per job</strong> · Cleaner receives payout minus 7.5% matching fee · All payments via Stripe · Full ID required
                </div>
                <button onClick={handleSubmit} style={{ padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", fontSize: "17px", fontWeight: 800, cursor: "pointer" }}>
                  Register Business Account
                </button>
              </div>
            ) : (
              <div style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.3)", borderRadius: "20px", padding: "30px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
                <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "10px" }}>{form.companyName} Registered!</h3>
                <p style={{ color: "#9fb0c1", lineHeight: 1.7 }}>Your business account is live in {form.city} ({form.postcode.toUpperCase()}). A member of the team will complete your Stripe onboarding within 24 hours before your first job goes live.</p>
              </div>
            )}
          </div>

          {/* Registered businesses */}
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px" }}>
              Registered Businesses
              <span style={{ fontSize: "14px", color: "#9fb0c1", fontWeight: 400, marginLeft: "12px" }}>{businesses.length} total</span>
            </h3>
            {businesses.length === 0 ? (
              <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "22px", padding: "30px", border: "1px solid rgba(255,255,255,.06)", textAlign: "center", color: "#9fb0c1" }}>
                No businesses registered yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "520px", overflowY: "auto" }}>
                {businesses.map((b) => (
                  <div key={b.id} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "18px", padding: "22px", border: "1px solid rgba(245,158,11,.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ fontWeight: 800, fontSize: "16px" }}>{b.companyName}</div>
                      <div style={{ background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.3)", borderRadius: "8px", padding: "4px 10px", color: "#f59e0b", fontSize: "12px", fontWeight: 700 }}>Business</div>
                    </div>
                    <div style={{ color: "#57c7ff", fontSize: "13px", marginBottom: "4px" }}>{b.city} · {b.postcode.toUpperCase()}</div>
                    <div style={{ color: "#9fb0c1", fontSize: "13px" }}>{b.contactName} · {b.serviceType || "General Cleaning"}</div>
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
