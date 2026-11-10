"use client";
import { useState } from "react";
import Link from "next/link";
import { useCleanConnect } from "@/context/CleanConnectContext";

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

type Step = "type" | "form" | "otp" | "done";

const PERSONAL_DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com","live.com","msn.com","aol.com","protonmail.com","me.com","mac.com","googlemail.com","yahoo.co.uk","hotmail.co.uk","live.co.uk"];

function isBusinessEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain && !PERSONAL_DOMAINS.includes(domain);
}

export default function RegisterCleanerPage() {
  const { addCleaner } = useCleanConnect();
  const [type, setType] = useState<"individual" | "company" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", postcode: "", city: "", bio: "", companyName: "", companyNumber: "", rate: "30" });
  const [autoAccept90, setAutoAccept90] = useState(true);
  const [step, setStep] = useState<Step>("type");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleFormSubmit() {
    const required = type === "individual"
      ? [form.name, form.email, form.phone, form.postcode, form.city]
      : [form.companyName, form.companyNumber, form.email, form.phone, form.postcode, form.city];
    if (required.some((v) => !v)) return;

    if (type === "company" && !isBusinessEmail(form.email)) {
      setOtpError("Companies must register with a business email address (not Gmail, Hotmail, Yahoo, etc.).");
      return;
    }

    setOtpSending(true);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, purpose: "cleaner" }),
    });
    setOtpSending(false);

    if (res.ok) {
      setStep("otp");
      setOtpError("");
    } else {
      setOtpError("Failed to send verification email — please check your email address.");
    }
  }

  async function handleVerifyOTP() {
    if (otpCode.length !== 6) return;
    setOtpVerifying(true);
    setOtpError("");

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, code: otpCode }),
    });

    const data = await res.json();
    setOtpVerifying(false);

    if (!res.ok) {
      setOtpError(data.error || "Incorrect code — please try again.");
      return;
    }

    // OTP verified — complete registration
    await addCleaner({
      name: type === "individual" ? form.name : form.companyName,
      email: form.email,
      phone: form.phone,
      postcode: form.postcode,
      city: form.city,
      bio: form.bio,
      type: type ?? undefined,
      autoAccept90,
    });
    setStep("done");
  }

  async function handleResend() {
    if (resendCooldown) return;
    setResendCooldown(true);
    setOtpError("");
    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, purpose: "cleaner" }),
    });
    setTimeout(() => setResendCooldown(false), 30000);
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
          Service Provider
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "16px" }}>Register as a Service Provider</h1>
        <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "600px" }}>
          Whether you are an individual cleaner or a cleaning company — register below, set your area and rate, and get matched with local jobs.
        </p>

        {/* Step: Choose type */}
        {step === "type" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <button onClick={() => { setType("individual"); setStep("form"); }} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(34,197,94,.3)", borderRadius: "24px", padding: "40px 30px", cursor: "pointer", color: "white", textAlign: "left" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🧑</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Individual Cleaner</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>Students, freelancers, or anyone with time to spare. Register with your name, location, and start accepting jobs near you.</p>
              <div style={{ marginTop: "16px", padding: "10px 16px", borderRadius: "10px", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", fontSize: "13px", color: "#22c55e", fontWeight: 700 }}>
                One-off fee: £99 (non-refundable)
              </div>
              <div style={{ marginTop: "12px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-block", fontWeight: 700, fontSize: "14px" }}>Register as Individual →</div>
            </button>
            <button onClick={() => { setType("company"); setStep("form"); }} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(245,158,11,.3)", borderRadius: "24px", padding: "40px 30px", cursor: "pointer", color: "white", textAlign: "left" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏢</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Cleaning Company</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>A registered cleaning business looking to take on more jobs. Register with your company details and get matched with clients in your area.</p>
              <div style={{ marginTop: "16px", padding: "10px 16px", borderRadius: "10px", background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.3)", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                One-off fee: £179 (non-refundable)
              </div>
              <div style={{ marginTop: "10px", padding: "10px 16px", borderRadius: "10px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", fontSize: "12px", color: "#9fb0c1" }}>
                Business email required (e.g. you@yourcompany.com)
              </div>
              <div style={{ marginTop: "12px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "inline-block", fontWeight: 700, fontSize: "14px" }}>Register as Company →</div>
            </button>
          </div>
        )}

        {/* Step: Fill form */}
        {step === "form" && type && (
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "40px", border: `1px solid rgba(${type === "individual" ? "34,197,94" : "245,158,11"},.2)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 900 }}>{type === "individual" ? "Individual Cleaner" : "Cleaning Company"} Details</h2>
              <button onClick={() => setStep("type")} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", color: "#9fb0c1", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>← Change type</button>
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
              <div>
                <label style={labelStyle}>Email{type === "company" ? " (business email required)" : ""}</label>
                <input type="email" value={form.email} onChange={(e) => { set("email", e.target.value); setOtpError(""); }} placeholder={type === "company" ? "you@yourcompany.com" : "you@email.com"} style={{ ...inputStyle, borderColor: type === "company" && form.email && !isBusinessEmail(form.email) ? "rgba(239,68,68,.6)" : "rgba(255,255,255,.1)" }} />
                {type === "company" && form.email && !isBusinessEmail(form.email) && (
                  <div style={{ marginTop: "6px", fontSize: "12px", color: "#ef4444" }}>Personal email addresses are not accepted for company registration.</div>
                )}
              </div>
              <div><label style={labelStyle}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
              <div><label style={labelStyle}>Postcode</label><input type="text" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
              <div><label style={labelStyle}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Your Rate (£/hr)</label>
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
                  <option defaultValue="Up to 20 miles" style={{ background: "#0d1727" }}>Up to 20 miles</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>{type === "individual" ? "Short Bio (optional)" : "About your company (optional)"}</label>
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder={type === "individual" ? "e.g. Available weekends, experienced with deep cleans..." : "e.g. 5-year trading company, fully insured..."} rows={3} style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>

            {/* Auto-accept 90% toggle */}
            <div style={{ background: "rgba(87,199,255,.06)", border: "1px solid rgba(87,199,255,.2)", borderRadius: "14px", padding: "18px", marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input type="checkbox" id="autoAccept" checked={autoAccept90} onChange={(e) => setAutoAccept90(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer", marginTop: "2px", flexShrink: 0 }} />
                <label htmlFor="autoAccept" style={{ cursor: "pointer", lineHeight: 1.6, fontSize: "14px" }}>
                  <strong style={{ color: "#57c7ff" }}>Pre-agree to auto-accept 90% of AI-determined price</strong>
                  <div style={{ color: "#9fb0c1", marginTop: "4px", fontSize: "13px" }}>
                    When a customer selects you and chooses the 90% price tier, your acceptance is automatic and they proceed straight to payment.
                  </div>
                </label>
              </div>
            </div>

            <div style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "14px", padding: "16px", marginTop: "12px", fontSize: "13px", color: "#9fb0c1", lineHeight: 1.6 }}>
              One-off non-refundable onboarding fee: <strong style={{ color: "white" }}>{type === "individual" ? "£99" : "£179"}</strong>. Covers KYC and platform onboarding. Business email is <strong style={{ color: "white" }}>not required</strong>.
            </div>

            {otpError && step === "form" && (
              <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", fontSize: "13px" }}>
                {otpError}
              </div>
            )}

            <button onClick={handleFormSubmit} disabled={otpSending} style={{ width: "100%", marginTop: "24px", padding: "18px", borderRadius: "14px", border: "none", background: otpSending ? "rgba(255,255,255,.1)" : type === "individual" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", fontSize: "17px", fontWeight: 800, cursor: otpSending ? "not-allowed" : "pointer" }}>
              {otpSending ? "Sending verification code..." : `Verify Email & Continue — ${type === "individual" ? "£99" : "£179"} fee`}
            </button>
          </div>
        )}

        {/* Step: OTP verification */}
        {step === "otp" && (
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "50px 40px", border: "1px solid rgba(87,199,255,.2)", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📧</div>
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "10px" }}>Check your email</h2>
            <p style={{ color: "#9fb0c1", lineHeight: 1.7, marginBottom: "28px", fontSize: "15px" }}>
              We sent a 6-digit code to <strong style={{ color: "white" }}>{form.email}</strong>. Enter it below to verify your email and complete registration.
            </p>

            <input
              type="text"
              value={otpCode}
              onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
              placeholder="000000"
              maxLength={6}
              style={{ ...inputStyle, fontSize: "32px", fontWeight: 900, letterSpacing: "12px", textAlign: "center", marginBottom: "16px" }}
            />

            {otpError && (
              <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", fontSize: "13px" }}>
                {otpError}
              </div>
            )}

            <button onClick={handleVerifyOTP} disabled={otpCode.length !== 6 || otpVerifying} style={{ width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: otpCode.length === 6 && !otpVerifying ? "linear-gradient(135deg,#1ea7ff,#0077ff)" : "rgba(255,255,255,.1)", color: "white", fontSize: "17px", fontWeight: 800, cursor: otpCode.length === 6 && !otpVerifying ? "pointer" : "not-allowed", marginBottom: "16px" }}>
              {otpVerifying ? "Verifying..." : "Confirm Code"}
            </button>

            <button onClick={handleResend} disabled={resendCooldown} style={{ background: "none", border: "none", color: resendCooldown ? "#9fb0c1" : "#57c7ff", cursor: resendCooldown ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 600 }}>
              {resendCooldown ? "Code resent — wait 30s to try again" : "Resend code"}
            </button>

            <button onClick={() => { setStep("form"); setOtpCode(""); setOtpError(""); }} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#9fb0c1", cursor: "pointer", fontSize: "13px" }}>
              ← Change email
            </button>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✓</div>
            <h3 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "10px" }}>Email Verified — You&apos;re Registered!</h3>
            <p style={{ color: "#9fb0c1", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 28px" }}>
              Welcome to CleanConnect. You will receive email notifications for jobs in your area. KYC verification is required every 6 months — we will email you when due. Your details are only released to clients once KYC is complete.
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
